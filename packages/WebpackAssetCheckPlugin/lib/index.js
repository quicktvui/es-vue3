const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class AssetCheckPlugin {
  constructor(options = {}) {
    this.options = {
      directory: options.directory || path.resolve(process.cwd(), "src"),
      maxSizeKB: options.maxSizeKB || 200,
      extensions: options.extensions || [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".bmp",
        ".svg",
        ".mp4",
        ".zip",
      ],
      ignoreDirs: options.ignoreDirs || ["node_modules"],
      whitelistPaths: options.whitelistPaths || [],
      warningOnly: options.warningOnly || false,
      logFile: options.logFile || null,
      maxWidth: options.maxWidth || 1920,
      maxHeight: options.maxHeight || 1080,
    };

    // 内部使用的图片类型扩展
    this.imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp", ".svg"];
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync("AssetCheckPlugin", async (_, callback) => {
      const largeFiles = [];

      const checkDir = async (dir) => {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);

          if (this.options.ignoreDirs.some((ignored) => fullPath.includes(ignored))) continue;
          if (this.options.whitelistPaths.some((whitelisted) => fullPath.includes(whitelisted)))
            continue;

          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            await checkDir(fullPath);
            continue;
          }

          const ext = path.extname(fullPath).toLowerCase();
          if (!this.options.extensions.includes(ext)) continue;

          const sizeKB = stat.size / 1024;
          let dimensions = "";
          let resolutionExceeded = false;

          if (this.imageExtensions.includes(ext)) {
            try {
              const metadata = await sharp(fullPath).metadata();
              const { width, height } = metadata;
              dimensions = `${width}x${height}`;
              if (
                (this.options.maxWidth && width > this.options.maxWidth) ||
                (this.options.maxHeight && height > this.options.maxHeight)
              ) {
                resolutionExceeded = true;
              }
            } catch (e) {
              console.warn(`[AssetCheckPlugin] 读取图片尺寸失败: ${fullPath}`);
            }
          }

          if (sizeKB > this.options.maxSizeKB || resolutionExceeded) {
            largeFiles.push({
              file: fullPath,
              sizeKB: sizeKB.toFixed(2),
              dimensions,
            });
          }
        }
      };

      try {
        await checkDir(this.options.directory);
      } catch (err) {
        console.warn(`[AssetCheckPlugin] 扫描目录失败: ${err.message}`);
        return callback();
      }

      if (largeFiles.length > 0) {
        const messages = largeFiles.map(
          (f) => `  - ${f.file} (${f.sizeKB} KB${f.dimensions ? `, ${f.dimensions}` : ""})`,
        );
        const output = `\n[AssetCheckPlugin] 以下资源文件超过 ${this.options.maxSizeKB}KB 或尺寸限制：\n${messages.join("\n")}\n`;

        console[this.options.warningOnly ? "warn" : "error"](output);

        if (this.options.logFile) {
          try {
            fs.writeFileSync(this.options.logFile, output, "utf-8");
            console.log(`📄 日志已写入: ${this.options.logFile}`);
          } catch (e) {
            console.warn(`日志写入失败: ${e.message}`);
          }
        }

        if (!this.options.warningOnly) {
          return callback(new Error("构建终止：存在大文件或超尺寸图片"));
        }
      }

      callback();
    });
  }
}

module.exports = AssetCheckPlugin;
