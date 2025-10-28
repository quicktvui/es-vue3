import es_css_viewport_width_page from "./es-css-viewport-width-page";
import es_css_viewport_height_page from "./es-css-viewport-height-page";
import es_css_viewport_width_height_page from "./es-css-viewport-width-height-page";

const ESCSSViewportPageList = {
  es_css_viewport_width_page: {
    name: "vw",
    component: es_css_viewport_width_page,
  },
  es_css_viewport_height_page: {
    name: "vh",
    component: es_css_viewport_height_page,
  },
  es_css_viewport_width_height_page: {
    name: "vw/vh",
    component: es_css_viewport_width_height_page,
  },
};
export default ESCSSViewportPageList;
