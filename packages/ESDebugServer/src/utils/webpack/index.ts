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
import path from 'path';
import os from 'os';
import HippyHMRPlugin from '@hippy/hippy-hmr-plugin';
import QRCode from 'qrcode';
import {green, yellow, bold} from 'colors/safe';
import {Logger} from '@debug-server-next/utils/log';
import {makeUrl, getWSProtocolByHttpProtocol} from '@debug-server-next/utils/url';
import {config} from '@debug-server-next/config';
import {getAllLocalHostname} from '@debug-server-next/utils/ip';
import {isPortInUse} from '@debug-server-next/utils/port';
import {exec} from '@debug-server-next/utils/process';
import {OSType} from '@debug-server-next/@types/enum';
import {info} from "@debug-server-next/logger/log";

export * from './inject-entry';

const log = new Logger('webpack-util');

export async function getWebpackConfig(configPath) {
  let webpackConfig;
  const webpackConfigPath = path.resolve(process.cwd(), configPath);
  log.info('webpackConfigPath: %s', webpackConfigPath);

  if (configPath && fs.existsSync(webpackConfigPath)) {
    webpackConfig = await import(webpackConfigPath);
  }
  return webpackConfig?.default || webpackConfig;
}

/**
 * 标准化配置信息
 * @param versionId
 * @param config
 */
export function normalizeWebpackConfig(versionId, config) {
  const enableRemoteDebug = isRemoteDebugEnabled(config);
  if (!enableRemoteDebug) return log.warn('remote debug is disabled!');

  normalizeRemoteDebug(versionId, config);
  appendHMRPlugin(versionId, config);
}

function normalizeRemoteDebug(versionId, config) {

  info('Webpack normalizeRemoteDebug ', versionId);

  //热重载live reload
  // 热重载live reload： 就是当修改文件之后，webpack自动编译，然后浏览器自动刷新->等价于页面window.location.reload()
  //
  //热更新HMR
  // 热更新HMR： 热重载live reload并不能够保存应用的状态（states），当刷新页面后，应用之前状态丢失。
  // 而Webpack热更新HMR则不会刷新浏览器，而是运行时对模块进行热替换，保证了应用状态不会丢失。

  config.devServer = {
    // 默认为 false，设为 true 调试服务支持多个工程同时调试，彼此之间不会干扰
    multiple: false,
    // 默认为 false，hippy vue 项目可以手动开启
    vueDevtools: false,
    // 默认 hot, liveReload 都为 true，如果只想使用 live-reload 功能，请将 hot 设为 false，liveReload 设为 true
    hot: true,
    liveReload: true,
    client: {
      overlay: false,//覆在
    },
    autoLaunchHippyDebug: true,//默认打开debug
    injectJSDevtools: {
      domains: []
    },
    ...(config.devServer || {}),
  }
  config.devServer.remote = {
    protocol: 'http',
    host: '127.0.0.1',
    port: 38989,
    qrcode: false,
    proxy: '',
    ...(config.devServer.remote || {}),
  };
  //端口号 38989
  config.devServer.remote.port = Number(config.devServer.remote.port);

  //默认打开debug
  if (config.devServer.autoLaunchHippyDebug) {
    autoLaunchHippyDebug(config.devServer.remote);
  }

  const {protocol, host, port, qrcode: qrcodeFn} = config.devServer.remote;
  // http://127.0.0.1:38989/
  const publicPath = getPublicPath(versionId, config.devServer);
  config.output.publicPath = publicPath;
  log.info(bold(yellow(`webpack publicPath is set as: ${config.output.publicPath}`)));

  const ignorePort = couldIgnorePort(protocol, port);

  // http://127.0.0.1:38989/index.bundle?debugUrl=ws%3A%2F%2F127.0.0.1%3A38989%2Fdebugger-proxy
  const bundleUrl = makeUrl(`${config.output.publicPath}index.bundle`, {
    debugUrl: makeUrl(// getWSProtocolByHttpProtocol = ws
      `${getWSProtocolByHttpProtocol(protocol)}://${host}${ignorePort ? '' : `:${port}`}/debugger-proxy`,
    ),
  });
  //find debug page on: http://127.0.0.1:38989/extensions/home.html?hash=8a41d9dff0d5575f06c92d06e1f586ac
  const homeUrl = `${protocol}://${host}${ignorePort ? '' : `:${port}`}/extensions/home.html?hash=${versionId}`;

  //启动后的回调
  config.devServer.cb = () => {
    process.nextTick(() => {
      // only print qrcode when use remote debug server
      const needVersionId = needPublicPathWithVersionId(host, config.multiple);
      if (needVersionId) log.info('paste the following bundleUrl in app to open hippy page');
      log.info('bundleUrl: %s', bold(green(bundleUrl)));
      log.info('find debug page on: %s', bold(green(homeUrl)));

      //---------------------------------------------------------------------------
      //不需要 needVersionId = false
      if (needVersionId && qrcodeFn && typeof qrcodeFn === 'function') {
        const qrcodeStr = qrcodeFn(bundleUrl);
        log.info('bundleUrl QRCode scheme: %s', bold(green(qrcodeStr)));
        QRCode.toString(
          qrcodeStr,
          {
            small: true,
            type: 'terminal',
          },
          (e, qrcodeStr) => {
            if (e) log.error('draw QRCode of bundleUrl failed: %j', e?.stack || e);
            log.info('scheme qrcode:\n%s', qrcodeStr);
          },
        );
      }
    });
  };
}

function appendHMRPlugin(versionId: string, config) {
  ////http://127.0.0.1:38989/
  const hotManifestPublicPath = getPublicPath(versionId, config.devServer);
  const i = config.plugins.findIndex((plugin) => plugin.constructor.name === HippyHMRPlugin.name);
  if (i !== -1) {
    config.plugins.splice(i, 1);
  }
  if (!config.devServer.hot && !config.devServer.liveReload) {
    return;
  }
  //添加HMR插件
  config.plugins.push(new HippyHMRPlugin({hotManifestPublicPath}));
}

/**
 * remote debug is enabled by default if enable webpack-dev-server
 */
function isRemoteDebugEnabled(webpackConfig) {
  return webpackConfig.mode === 'development' || webpackConfig.devServer;
}

/**
 * when use debug-server-next in local, publicPath will append versionId if set devServer.multiple === true
 * and will always append versionId for remote
 */
function needPublicPathWithVersionId(host, multiple: boolean) {
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (isLocal) return Boolean(multiple);
  return true;
}

//http://127.0.0.1:38989/
function getPublicPath(versionId, {remote: {host, port, protocol}, multiple}) {
  //multiple = false 忽略多个调试
  const ignorePort = couldIgnorePort(protocol, port);
  if (!needPublicPathWithVersionId(host, multiple)) {
    return `${protocol}://${host}${ignorePort ? '' : `:${port}`}/`;
  }
  //多个调试需要添加 versionId(唯一的id)
  return `${protocol}://${host}${ignorePort ? '' : `:${port}`}/${versionId}/`;
}

function couldIgnorePort(protocol, port) {
  const couldIgnore = (protocol === 'https' && Number(port) === 443) || (protocol === 'http' && Number(port) === 80);
  log.silly(couldIgnore);
  // TODO iOS doesn't support ignore port
  return false;
}

/**
 * hippy-dev process will save hmrPort to file,
 * hippy-debug process will auto reverse hmrPort when device reconnect.
 */
export async function saveDevPort(hmrPort) {
  const {cachePath} = config;
  fs.mkdirSync(cachePath, {recursive: true});
  return fs.writeFileSync(config.hmrPortPath, String(hmrPort));
}

/**
 * 同时自动启动debug
 * auto launch hippy:debug if remote.host is local hostname
 */
async function autoLaunchHippyDebug({protocol, host, port}) {
  if (protocol !== 'http') return;

  info("start debug server start...")
  const hostList = await getAllLocalHostname();
  info("AllLocalHostname:", hostList)

  if (!hostList.includes(host)) return;
  const inUse = await isPortInUse(port);

  info(host + " isPortInUse:", inUse)

  //端口被占
  if (inUse) {
    const osType = os.type();
    let checkPortCMD;
    if (osType === OSType.Darwin) {
      checkPortCMD = `lsof -i :${port}`;
    } else if (osType === OSType.Windows) {
      checkPortCMD = `netstat -aon|findstr "${port}"`;
    }
    return log.warn(bold(yellow(`es-debug port ${port} is in use, please check by run "${checkPortCMD}"`)));
  }

  info("exec es debug.js...")
  const cp = await exec('node', [path.join(__dirname, '../../../dist/index-debug.js'), '--port', port]);

  if (!global.__CHILD_PROCESS__) {
    global.__CHILD_PROCESS__ = [];
  }
  global.__CHILD_PROCESS__.push(cp);

  //
  info("child process list size:", global.__CHILD_PROCESS__.length)
  info("start debug server end...")
}
