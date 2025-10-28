import es_css_gradient_background_page from "./es-css-gradient-background-page";
import es_css_gradient_background_hsl_page from "./es-css-gradient-background-hsl-page";
import es_css_gradient_background_rgb_page from "./es-css-gradient-background-rgb-page";
import es_css_gradient_background_named_color_page from "./es-css-gradient-background-named-color-page";

const ESCSSGradientBackgroundPageList = {
  es_css_gradient_background_page: {
    name: "android color",
    component: es_css_gradient_background_page,
  },
  es_css_gradient_background_rgb_page: {
    name: "rgb",
    component: es_css_gradient_background_rgb_page,
  },
  es_css_gradient_background_named_color_page: {
    name: "named color",
    component: es_css_gradient_background_named_color_page,
  },
  es_css_gradient_background_hsl_page: {
    name: "hsl",
    component: es_css_gradient_background_hsl_page,
  },
};
export default ESCSSGradientBackgroundPageList;
