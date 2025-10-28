# webpack-asset-check-plugin

> A Webpack plugin to detect large asset files before compile and optionally fail the build.

## Install

```bash
npm install webpack-asset-check-plugin --save-dev



## Install


```bash
const AssetCheckPlugin = require('webpack-asset-check-plugin');

plugins: [
  new AssetCheckPlugin({
    directory: path.resolve(__dirname, 'src/assets'),
    maxSizeKB: 200,
    whitelistPaths: ['/cdn/'],
    warningOnly: false,
  }),
]