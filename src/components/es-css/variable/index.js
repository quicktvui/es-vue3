import es_css_variable_page from "./es-css-variable-page";
import es_css_variable_calc_page from "./es-css-variable-calc-page";
import es_css_variable_max_page from "./es-css-variable-max-page";
import es_css_variable_min_page from "./es-css-variable-min-page";
import es_css_variable_clamp_page from "./es-css-variable-clamp-page";
import es_css_variable_color_page from "./es-css-variable-color-page";

const ESCSSVariablePageList = {
  es_css_variable_page: {
    name: "var",
    component: es_css_variable_page,
  },
  es_css_variable_calc_page: {
    name: "calc",
    component: es_css_variable_calc_page,
  },
  es_css_variable_max_page: {
    name: "max",
    component: es_css_variable_max_page,
  },
  es_css_variable_min_page: {
    name: "min",
    component: es_css_variable_min_page,
  },
  es_css_variable_clamp_page: {
    name: "clamp",
    component: es_css_variable_clamp_page,
  },
  es_css_variable_color_page: {
    name: "color",
    component: es_css_variable_color_page,
  },
};
export default ESCSSVariablePageList;
