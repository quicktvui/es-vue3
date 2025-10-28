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

import path from 'path';
import cors from '@koa/cors';
import staticCache from 'koa-static-cache';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import {getModuleFolder} from '@debug-server-next/utils/file';
import {Logger} from '@debug-server-next/utils/log';
import {getDebugTargetsRouter} from '@debug-server-next/router/debug-targets';
import {config} from '@debug-server-next/config';
import {info} from "@debug-server-next/logger/log";

const log = new Logger('router');

//
export const routeApp = (app: Koa) => {
  info("Koa routeApp start...")

  const {static: staticPath, entry} = global.debugAppArgv;
  info("Koa routeApp debugAppArgv:", global.debugAppArgv)

  //
  app.use(bodyParser());
  app.use(cors());
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      log.error('koa error: %s', (e as Error)?.stack);
      return (ctx.body = (e as Error)?.stack);
    }
  });

  //添加:调试路由
  const debugTargetsRouter = getDebugTargetsRouter();
  app.use(debugTargetsRouter.routes())
    .use(debugTargetsRouter.allowedMethods());

  const defaultStaticOption = {
    buffer: false,
    dynamic: true,
    preload: false,
  };

  // chrome devtools html files no cache
  const htmlList = [
    'devtools_app.html',
    'hippy_tdf.html',
    'hippy.html',
    'inspector.html',
    'js_app.html',
    'ndb_app.html',
    'node_app.html',
    'tdf_core.html',
  ];
  // 路径：@hippy/chrome-devtools/out/Version/gen/front_end/
  htmlList.forEach((file) => {
    app.use(serve(getModuleFolder('@hippy/chrome-devtools', `out/Version/gen/front_end/${file}`)));
  });

  // chrome devtools resources with versionId(commit id),
  // 缓存
  app.use(
    staticCache(getModuleFolder('@hippy/chrome-devtools', 'out/Version/gen'), {
      ...defaultStaticOption,
      maxAge: 60 * 60 * 24 * 365,
    }),
  );

  // vue devtools
  app.use(
    staticCache(getModuleFolder('@hippy/vue-devtools', 'dist'), {
      ...defaultStaticOption,
      maxAge: 60 * 60,
    }),
  );

  // react devtools
  app.use(
    staticCache(getModuleFolder('@hippy/react-devtools', 'dist'), {
      ...defaultStaticOption,
      maxAge: 60 * 60,
    }),
  );

  // chrome devtools extensions
  app.use(
    staticCache(getModuleFolder('@hippy/chrome-devtools-extensions', 'dist'), {
      ...defaultStaticOption,
      maxAge: 60 * 60,
    }),
  );

  // hmr resources
  app.use(serve(config.hmrStaticPath));
  //
  info('debug-server ' + ` hmrStaticPath: ${config.hmrStaticPath}`);

  // bundle resources
  let servePath;
  if (staticPath) {
    servePath = path.resolve(staticPath);
  } else {
    servePath = path.resolve(path.dirname(entry));
  }

  //[ES Debug Server]: debug-server  hmrStaticPath: /Users/liulipeng/workspace/vue/template/es-vue3/node_modules/@extscreen/es3-debug-server/dist/hmr
  // serve bundle: dist/dev/index.bundle;
  // serve folder: /Users/liulipeng/workspace/vue/template/es-vue3/dist/dev
  info('debug-server ' + `serve bundle: ${entry}; serve folder: ${servePath}`);
  log.info(`serve bundle: ${entry}; serve folder: ${servePath}`);
  //
  app.use(serve(servePath));
};
