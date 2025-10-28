import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: {
    index: "./src/index.ts",
    "css-loader": "./src/style-parser/css-loader.ts",
  },
  output: {
    dir: "dist",
    format: "cjs",
    entryFileNames: "[name].js",
    exports: "auto",
  },
  plugins: [typescript(), terser(), commonjs(), resolve()],
  external: ["vue"],
};
