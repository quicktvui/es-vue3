import es_css_percentage_width_page from "./es-css-percentage-width-page";
import es_css_percentage_height_page from "./es-css-percentage-height-page";
import es_css_percentage_position_page from "./es-css-percentage-position-page";
import es_css_percentage_margin_page from "./es-css-percentage-margin-page";
import es_css_percentage_padding_page from "./es-css-percentage-padding-page";
import es_css_percentage_style_page from "./es-css-percentage-style-page";
import es_css_percentage_nested_css_page from "./es-css-percentage-nested-css-page";
import es_css_percentage_nested_style_page from "./es-css-percentage-nested-style-page";
import es_css_percentage_nested_nested_page from "./es-css-percentage-nested-nested-page";

const ESCSSPercentagePageList = {
  es_css_percentage_width_page: {
    name: "width",
    component: es_css_percentage_width_page,
  },
  es_css_percentage_height_page: {
    name: "height",
    component: es_css_percentage_height_page,
  },
  es_css_percentage_position_page: {
    name: "position",
    component: es_css_percentage_position_page,
  },
  es_css_percentage_margin_page: {
    name: "margin",
    component: es_css_percentage_margin_page,
  },
  es_css_percentage_padding_page: {
    name: "padding",
    component: es_css_percentage_padding_page,
  },
  es_css_percentage_style_page: {
    name: "style",
    component: es_css_percentage_style_page,
  },
  es_css_percentage_nested_css_page: {
    name: "nested（css）",
    component: es_css_percentage_nested_css_page,
  },
  es_css_percentage_nested_style_page: {
    name: "nested（style）",
    component: es_css_percentage_nested_style_page,
  },
  es_css_percentage_nested_nested_page: {
    name: "nested & nested",
    component: es_css_percentage_nested_nested_page,
  },
};
export default ESCSSPercentagePageList;
