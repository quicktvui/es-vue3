/*
 * Tencent is pleased to support the open source community by making
 * Hippy available.
 *
 * Copyright (C) 2017-2019 THL A29 Limited, a Tencent company.
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from 'fs';
import {Server as HTTPServer} from 'http';
import kill from 'kill-port';
import Koa from 'koa';
import colors from 'colors/safe';
import {initAppClient} from '@debug-server-next/client';
import {SocketServer} from '@debug-server-next/socket-server';
import {Logger} from '@debug-server-next/utils/log';
import {initDbModel} from '@debug-server-next/db';
import {routeApp} from '@debug-server-next/router';
import {config} from '@debug-server-next/config';
import {WinstonColor, DevtoolsEnv, DebugTunnel, ReportEvent} from '@debug-server-next/@types/enum';
import {getHomeUrl} from '@debug-server-next/utils/url';
import {checkPort} from '@debug-server-next/utils/port';
import {rmFolder} from '@debug-server-next/utils/file';
import {report} from '@debug-server-next/utils/report';
import {info} from "@debug-server-next/logger/log";

const log = new Logger('debug-server', WinstonColor.Yellow);
let server: HTTPServer;
let socketServer: SocketServer;

/**
 * 启动 debug server
 */
export const startDebugServer = async () => {

  //debug-server info start server argv:
  // {"_":[],
  // "port":38989,
  // "entry":"dist/dev/index.bundle",
  // "host":"0.0.0.0","open":true,"enableIOS":true,"enable-i-o-s":true,"log":"info","iWDPPort":9000,"i-w-d-p-port":9000,"iWDPStartPort":9200,"i-w-d-p-start-port":9200,"iWDPEndPort":9300,"i-w-d-p-end-port":9300,
  // "env":"hippy","$0":"node_modules/@extscreen/es3-debug-server/dist/index-debug.js"}

  info('start debug server argv: %j', global.debugAppArgv)
  log.info('start server argv: %j', global.debugAppArgv);

  await init();

  const {host, port, env} = global.debugAppArgv;
  if (env === DevtoolsEnv.Hippy) showHippyGuide();

  //-------------- http服务 -------------------
  // Koa 是一个新的 web 框架，由 Express 原班人马打造，旨在成为一个更小、更富有表现力、更健壮的 Node.js web 框架。
  // Koa 框架使用了一些 ES6 的新特性，比如 async 函数，来使得异步操作更加简洁和直观。
  const app = new Koa();
  routeApp(app);

  //
  server = app.listen(port, host, async () => {
    info('Koa listen start...')
    // 不是集群
    if (!config.isCluster) {
      const {startTunnel, startChrome} = await import('./child-process/index');
      //tunnel
      await startTunnel();
      //chrome
      startChrome();

      //adb
      const {startAdbProxy} = await import('./child-process/adb');
      startAdbProxy();
    }

    // 封装一个socket
    socketServer = new SocketServer(server);
    socketServer.start();

    info('Koa listen end...')
  });

  server.on('close', () => {
    log.warn('debug server is closed.');
  });

  server.on('error', (e) => {
    log.error('launch debug server failed: %j', e);
  });
  report.addCommonParams();
  report.event({
    name: ReportEvent.StartDev,
    ext1: env,
  });

  info('start server end...')
};

/**
 *
 * 停止服务
 */
export const stopServer = async (exitProcess = false, ...arg) => {
  const {iWDPPort} = global.debugAppArgv || {};
  if (iWDPPort) {
    try {
      await kill(iWDPPort, 'tcp');
    } catch (e) {
      log.error('kill port %d failed, %s', iWDPPort, (e as Error).stack || e);
    }
  }

  try {
    log.info('stopServer %j', arg);
    if (socketServer) {
      await socketServer.close();
      socketServer = null;
    }
    if (server) {
      server.close();
      server = null;
    }
    if (exitProcess) process.exit(0);
  } catch (e) {
    log.error('stopServer error, %s', (e as Error)?.stack);
  }
};

/**
 * init DB, directory, Tunnel.node, AppClient
 */
const init = async () => {
  //标准化参数
  normalizeArgv();
  //检查端口是否被占
  await checkPort();
  const {cachePath, hmrStaticPath} = config;

  // /Users/liulipeng/workspace/vue/template/es-vue3/node_modules/@extscreen/es3-debug-server/dist/cache
  info('debug-server: init cachePath:', cachePath)
  // /Users/liulipeng/workspace/vue/template/es-vue3/node_modules/@extscreen/es3-debug-server/dist/hmr
  info('debug-server: init hmrStaticPath:', hmrStaticPath)

  // clean all unused file
  rmFolder(cachePath);
  rmFolder(hmrStaticPath);

  //集群
  if (!config.isCluster) {
    const {importTunnel} = await import('@debug-server-next/child-process/import-addon');
    await importTunnel();
    info('debug-server: init importTunnel')
  }
  await fs.promises.mkdir(cachePath, {recursive: true});
  await fs.promises.mkdir(hmrStaticPath, {recursive: true});

  //集群模式下开启
  initDbModel();
  info('debug-server: init initDbModel')

  initAppClient();

  info('debug-server: init initAppClient')
};

const showHippyGuide = () => {
  log.info(
    colors.bold[WinstonColor.Green](`es debug steps:
1. start debug server by run 'npm run es:debug'
2. start dev server by run 'npm run es:dev'
3. open es pages with debugMode on mobile/emulator
4. find connected debug targets on devtools home page: ${colors.underline[WinstonColor.Blue](getHomeUrl())}

find full guide on ${colors.underline[WinstonColor.Blue]('https://hippyjs.org/#/guide/debug')}`),
  );
};

/**
 * set default tunnel in different framework
 */
const normalizeArgv = () => {
  const {env, tunnel} = global.debugAppArgv;
  if (tunnel) return;
  if ([DevtoolsEnv.Hippy, DevtoolsEnv.HippyTDF].includes(env)) {
    global.debugAppArgv.tunnel = DebugTunnel.WS;
  } else if (env === DevtoolsEnv.TDFCore) {
    global.debugAppArgv.tunnel = DebugTunnel.TCP;
  }
  info('debug-server: global.debugAppArgv.tunnel:', global.debugAppArgv.tunnel)
};
