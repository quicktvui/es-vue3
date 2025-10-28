const path = require('path');
const fs = require('fs')
const {chdir} = require('process');
const {execSync} = require('child_process');
const VENDOR_ANDROID_NAME = 'vendor.android.js'
const VENDOR_MANIFEST_NAME = 'vendor-manifest.json'

class ZipPlugin {

  constructor(options) {
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ZipPlugin', (compilation) => {
      compilation.hooks.finishModules.tap('ZipPlugin', () => {
        console.log('ZipPlugin Task Start');
        try {
          fs.rmSync(`./dist/android/${VENDOR_ANDROID_NAME}`)
        } catch (e) {
          console.log('rm /dist/android/vendor.android.js error!');
        }
        try {
          fs.rmSync(`./dist/android/${VENDOR_MANIFEST_NAME}`)
        } catch (e) {
          console.log('rm /dist/android/vendor-manifest.json error!');
        }
        //
        let buildDir = path.resolve(`./dist`)
        chdir(buildDir)
        const outputName = new Date().getTime()
        execSync(`zip -q -r ${outputName}.zip ./android `)
        console.log('zip index.android.js done');
        //
        let outputsDir = path.resolve('./outputs')
        try {
          fs.mkdirSync(outputsDir)
        } catch (e) {
        }
        fs.renameSync(`./${outputName}.zip`, path.resolve(outputsDir, `./${outputName}.zip`))

        console.log('ZipPlugin Task Done');
      });
    });
  }
}

module.exports = ZipPlugin;
