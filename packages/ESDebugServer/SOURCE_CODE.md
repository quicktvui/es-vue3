# DebugServer 源码解析

## 一、

```text
    "hippy-debug": "dist/index-debug.js",
    "debug-server": "dist/index-debug.js",
    "hippy-dev": "dist/index-dev.js",
```

## `hippy-dev`

### 命令：

`hippy-dev -c ./scripts/hippy-webpack.dev.js`

解析参数：

```text
{"_":[],"c":"./scripts/hippy-webpack.dev.js","config":"./scripts/hippy-webpack.dev.js","$0":"/Users/liulipeng/workspace/vue/template/es-vue3/node_modules/.bin/hippy-dev"}
```

立即执行
`fullArgv.config` == `"./scripts/hippy-webpack.dev.js"`

加载配置文件，配置`webpack`

```js
(async () => {
    const webpackConfig = await getWebpackConfig(fullArgv.config);
    webpack(webpackConfig);
})();
```

`webpack`在`app-dev.ts`中

```text
  //获取唯一id
  const id = getBundleVersionId();
```

publicPath
http://127.0.0.1:38989/

bundleUrl
http://127.0.0.1:38989/index.bundle?debugUrl=ws%3A%2F%2F127.0.0.1%3A38989%2Fdebugger-proxy

homeUrl
http://127.0.0.1:38989/extensions/home.html?hash=8a41d9dff0d5575f06c92d06e1f586ac

WebpackDevServer
`./webpack-dev-server/lib/Server`

#### start

normalizeOptions

initialize

express adb

---------------------------------------------------
setupHooks hooks WebSocketClient WebSocket webSocketURL: ws://127.0.0.1:
38989/debugger-proxy?role=hmr_server&hash=8a41d9dff0d5575f06c92d06e1f586ac setupEmitHooks

```text
[ES Debug Server]: webpack-dev-server initialize addHMREntries end... [
'/Users/liulipeng/workspace/vue/template/es-vue3/node_modules/@extscreen/es3-debug-server/dist/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=127.0.0.1&port=38989&pathname=%2Fdebugger-proxy&role=hmr_client&hash=8a41d9dff0d5575f06c92d06e1f586ac&logging=info&hot=true&liveReload=true&progress=false&overlay=false&reconnect=10',
'/Users/liulipeng/workspace/vue/template/es-vue3/node_modules/@extscreen/es3-debug-server/dist/webpack-dev-server/client/hot/dev-server.js'
]
```

HttpServer
`this.server = require(this.options.server.type).createServer(this.options.server.options, this.app);`

getDefaultStaticOptions

directory: path.join(process.cwd(), 'public'), staticOptions: {}, publicPath: ['/'],//http://localhost:38989/dist/dev
serveIndex: {icons: true}, watch: getWatchOptions(),

## hippy-debug

/src/utils/webpack/index.ts autoLaunchHippyDebug

入口 index-debug.ts

//debug-server info start server argv:
// {"_":[], // "port":38989, // "entry":"dist/dev/index.bundle", // "host":"0.0.0.0","open":true,"enableIOS":true,"
enable-i-o-s":true,"log":"info","iWDPPort":9000,"i-w-d-p-port":9000,"iWDPStartPort":9200,"i-w-d-p-start-port":9200,"
iWDPEndPort":9300,"i-w-d-p-end-port":9300, // "env":"hippy","$0":"
node_modules/@extscreen/es3-debug-server/dist/index-debug.js"}

Koa startTunnel startChrome startAdbProxy SocketServer
