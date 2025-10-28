import crypto from "crypto";
import { getOptions } from "loader-utils";
import parseCSS from "./css-parser";
import translateColor, { names as colorNames } from "./color-parser";
import { info, setLoggerDebug } from "../log/log";

let sourceId = 0;

/**
 * hippy-vue-css-loader will translate the CSS texts to be AST
 * and attached at global[GLOBAL_STYLE_NAME].
 * when use HMR, the outdated chunk style will be attached at
 * global[GLOBAL_DISPOSE_STYLE_NAME].
 */
const GLOBAL_STYLE_NAME = "__HIPPY_VUE_STYLES__";
const GLOBAL_DISPOSE_STYLE_NAME = "__HIPPY_VUE_DISPOSE_STYLES__";

/**
 * Convert the CSS text to AST that able to parse by selector parser.
 */
function hippyVueCSSLoader(this: any, source: any) {
  const options = getOptions(this);
  const parsed = parseCSS(source, { source: sourceId });
  //
  setLoggerDebug(options.debug);
  if (options.debug) {
    console.log("\n");
    console.log(
      "-----------------------------------------------------------------------------------------------",
    );
  }
  info("[css-loader] \nsource:\n", source, "\nparsed: \n", JSON.stringify(parsed));

  const majorNodeVersion = parseInt(process.versions.node.split(".")[0], 10);
  const hashType = majorNodeVersion >= 17 ? "md5" : "md4";
  const hash = crypto.createHash(hashType);
  const contentHash = hash.update(source).digest("hex");
  sourceId += 1;
  const rulesAst = parsed.stylesheet.rules
    .filter((n: any) => n.type === "rule")
    .map((n: any) => ({
      hash: contentHash,
      selectors: n.selectors,

      declarations: n.declarations.map((dec: any) => {
        let { value } = dec;
        const isVariableColor =
          dec.property?.startsWith("-") &&
          typeof value === "string" &&
          (value.includes("#") ||
            value.includes("rgb") ||
            value.includes("hls") ||
            value.includes("hue") ||
            value.trim() in colorNames);
        if (dec.property && (dec.property.toLowerCase().indexOf("color") > -1 || isVariableColor)) {
          value = translateColor(value);
        }
        return {
          type: dec.type,
          property: dec.property,
          value,
          ...(dec.important && { important: true }),
        };
      }),
    }));
  const code = `(function() {
    if (!global['${GLOBAL_STYLE_NAME}']) {
      global['${GLOBAL_STYLE_NAME}'] = [];
    }
    global['${GLOBAL_STYLE_NAME}'] = global['${GLOBAL_STYLE_NAME}'].concat(${JSON.stringify(rulesAst)});

    if(module.hot) {
      module.hot.dispose(() => {
        console.log('disposeHandlers');
        if(!global['${GLOBAL_DISPOSE_STYLE_NAME}']) {
          global['${GLOBAL_DISPOSE_STYLE_NAME}'] = [];
        }
        global['${GLOBAL_DISPOSE_STYLE_NAME}'] = global['${GLOBAL_DISPOSE_STYLE_NAME}'].concat('${contentHash}');
      })
    }
  })()`;
  return `module.exports=${code}`;
}

export default hippyVueCSSLoader;
