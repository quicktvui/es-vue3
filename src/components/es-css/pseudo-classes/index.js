import es_css_pseudo_classes_focus_page from "./es-css-pseudo-classes-focus-page";
import es_css_dynamic_classes_focus_page from "./es-css-dynamic-classes-focus-page";
import es_css_dynamic_style_focus_page from "./es-css-dynamic-style-focus-page";
import es_css_dynamic_style_v_pseudo_page from "./es-css-pseudo-v-pseudo-page";
import es_css_dynamic_style_first_child_page from "./es-css-pseudo-first-child-page";

const ESCSSPseudoClassesPageList = {
  es_css_pseudo_classes_focus_page: {
    name: ":focus",
    component: es_css_pseudo_classes_focus_page,
  },
  es_css_dynamic_classes_focus_page: {
    name: "动态class",
    component: es_css_dynamic_classes_focus_page,
  },
  es_css_dynamic_style_focus_page: {
    name: "动态style",
    component: es_css_dynamic_style_focus_page,
  },
  es_css_dynamic_style_v_pseudo_page: {
    name: "directive:v-pseudo",
    component: es_css_dynamic_style_v_pseudo_page,
  },
  es_css_dynamic_style_first_child_page: {
    name: ":first-child",
    component: es_css_dynamic_style_first_child_page,
  },
};
export default ESCSSPseudoClassesPageList;
