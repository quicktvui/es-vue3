const os = require("os");
const path = require("path");
const webpack = require("webpack");
const ESDynamicImportPlugin = require("@extscreen/es3-dynamic-import-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const watchPlugin = require("./webpack-watch.ts");
const AssetCheckPlugin = require("webpack-asset-check-plugin");

const pkg = require("../package.json");
let cssLoader = "@extscreen/es3-vue-css-loader";

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  watch: true,
  watchOptions: {
    aggregateTimeout: 1500,
  },
  devServer: {
    // remote debug server address
    remote: {
      protocol: "http",
      host: getLocalIp(),
      port: 38989,
    },
    // support inspect vue components, store and router, by default is disabled
    vueDevtools: false,
    // support debug multiple project with only one debug server, by default is set false.
    multiple: false,
    // by default hot and liveReload option are true, you could set only liveReload to true
    // to use live reload
    hot: false,
    liveReload: false,
    client: {
      overlay: false,
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  entry: {
    index: ["@hippy/rejection-tracking-polyfill", path.resolve(pkg.main)],
  },
  output: {
    filename: "index.bundle",
    // chunkFilename: '[name].[chunkhash].js',
    strictModuleExceptionHandling: true,
    path: path.resolve("./dist/dev/"),
    globalObject: '(0, eval)("this")',
    assetModuleFilename: "[hash][ext][query]",
  },
  plugins: [
    new VueLoaderPlugin(),
    new watchPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
        HOST: JSON.stringify(process.env.DEV_HOST || "127.0.0.1"),
        PORT: JSON.stringify(process.env.DEV_PORT || 38989),
      },
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __PLATFORM__: null,
      __DEV__: true,

      // ESVue 配置
      __ES_VUE_FEATURE_FLAGS__: {
        ENABLE_KEY_EVENT_DISPATCH: true,
        ENABLE_EVENT_BUBBLE: false,
        ENABLE_MODULES: true,
      },
      // ESRouter配置
      __ES_ROUTER_FEATURE_FLAGS__: JSON.stringify({
        // ROOT_VIEW_COMPONENT_NAME: "div",
        // PAGE_VIEW_COMPONENT_NAME: "div",
      }),
    }),
    new AssetCheckPlugin({
      directory: path.resolve(__dirname, "../src/assets"),
      maxSizeKB: 200,
      whitelistPaths: ["/cdn/"],
      warningOnly: true,
    }),
    new ESDynamicImportPlugin(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                // disable vue3 dom patch flag，because hippy do not support innerHTML
                hoistStatic: false,
                // whitespace handler, default is 'condense', it can be set 'preserve'
                whitespace: "condense",
              },
            },
          },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: cssLoader,
          },
          // {
          //   loader: path.resolve(__dirname, "../packages/ESVueCssLoader/dist/css-loader.js"),
          //   options: {
          //     debug: true,
          //   },
          // },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.t|js$/,
        use: [
          {
            loader: "esbuild-loader",
            options: {
              target: "es2018",
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
        generator: {
          outputPath: "assets/",
          publicPath: "assets/",
        },
      },
      {
        test: /\.(ts)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".ts"],
    alias: (() => {
      const aliases = {
        src: path.resolve("./src"),
        // "@extscreen/es3-component": path.resolve("./packages/ESComponent"),
        // '@extscreen/es3-axios': path.resolve('./packages/ESAxios'),
        // "@extscreen/es3-router": path.resolve("./packages/ESRouter"),
        // "@extscreen/es3-vue": path.resolve("./packages/ESVue"),
        // "@extscreen/es3-vue": path.resolve("./packages/hippy-vue-next"),
        // "@extscreen/es3-core": path.resolve("./packages/ESCore"),
        // '@extscreen/es3-player': path.resolve('./packages/ESPlayer'),
        // "@extscreen/es3-video-player": path.resolve("./packages/ESVideoPlayer/"),
        // "@extscreen/es3-soundpool-player": path.resolve("./packages/ESSoundPoolPlayer/"),
        // "@extscreen/es3-player-manager": path.resolve("./packages/ESPlayerManager"),
        // "@extscreen/es3-error-handler": path.resolve("./packages/ESErrorHandler/"),
        // "@extscreen/es3-vue-style-parser": path.resolve("./packages/ESVueStyleParser"),
      };
      return aliases;
    })(),
  },
};
