import es_nav_style_transform_page from "./transform/es-nav-style-transform-page";
import es_nav_style_flex_page from "./flex/es-nav-style-flex-page";
import es_nav_style_animation_page from "./animation/es-nav-style-animation-page";

const ESStylePageList = {
  es_nav_style_transform_page: {
    name: "transform",
    component: es_nav_style_transform_page,
  },
  es_nav_style_flex_page: {
    name: "flex",
    component: es_nav_style_flex_page,
  },
  es_nav_style_animation_page: {
    name: "animation",
    component: es_nav_style_animation_page,
  },
};
export default ESStylePageList;
