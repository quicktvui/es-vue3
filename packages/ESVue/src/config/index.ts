/**
 * project Configuration and constants
 */

// default debug port
const DEBUG_PORT = 38989;

// hippy debug address
const HIPPY_DEBUG_ADDRESS = `http://127.0.0.1:${
  typeof process !== "undefined" ? process.env.PORT : DEBUG_PORT
}/`;

// whether the current environment is a production environment
const IS_PROD = process.env.NODE_ENV === "production";

//
const IS_HIPPY_3 = global.Hippy.SceneBuilder != undefined;

// component Map supported by the most basic version of native
const NATIVE_COMPONENT_MAP = {
  View: "View",
  Image: "Image",
  ListView: "ListView",
  ListViewItem: "ListViewItem",
  Text: "Text",
  TextInput: "TextInput",
  WebView: "WebView",
  VideoPlayer: "VideoPlayer",
  ScrollView: "ScrollView",
};

// Hippy static file protocol address
const HIPPY_STATIC_PROTOCOL = "hpfile://";

/**
 * Global style store identifier name
 *
 * @public
 */
const HIPPY_GLOBAL_STYLE_NAME = "__HIPPY_VUE_STYLES__";

/**
 * 预编译规则样式
 */
// const HIPPY_GLOBAL_PRECOMPILED_CSS_RULES_NAME = "__HIPPY_PRECOMPILED_CSS_RULES__";

/**
 * Global css variables identifier name
 *
 * @public
 */
const HIPPY_GLOBAL_CSS_VARIABLES_NAME = "__HIPPY_CSS_VARIABLES__";

/**
 * The name of the global to-be-removed style store identifier
 * When using hot update, expired styles will be added to the global dispose style
 *
 * @public
 */
const HIPPY_GLOBAL_DISPOSE_STYLE_NAME = "__HIPPY_VUE_DISPOSE_STYLES__";

// hippy vue next package version
// eslint-disable-next-line
const HIPPY_VUE_VERSION = "1";

/**
 * the key of generate hippy unique id
 */
const HIPPY_UNIQUE_ID_KEY = "hippyUniqueId";

export {
  HIPPY_DEBUG_ADDRESS,
  HIPPY_STATIC_PROTOCOL,
  NATIVE_COMPONENT_MAP,
  IS_PROD,
  IS_HIPPY_3,
  HIPPY_GLOBAL_STYLE_NAME,
  HIPPY_GLOBAL_CSS_VARIABLES_NAME,
  HIPPY_GLOBAL_DISPOSE_STYLE_NAME,
  // HIPPY_GLOBAL_PRECOMPILED_CSS_RULES_NAME,
  HIPPY_VUE_VERSION,
  HIPPY_UNIQUE_ID_KEY,
};
