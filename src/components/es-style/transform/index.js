import es_style_transform_page from "./es-style-transform-page";
import es_style_transform_scale_page from "./es-style-transform-scale-page";
import es_style_transform_translate_page from "./es-style-transform-translate-page";
import es_style_transform_rotate_page from "./es-style-transform-rotate-page";
import es_style_transform_perspective_page from "./es-style-transform-perspective-page";
import es_style_transform_style_page from "./es-style-transform-style-page";

const ESStyleTransformPageList = {
  es_style_transform_page: {
    name: "transform",
    component: es_style_transform_page,
  },
  es_style_transform_scale_page: {
    name: "transform:scale",
    component: es_style_transform_scale_page,
  },
  es_style_transform_translate_page: {
    name: "transform:translate",
    component: es_style_transform_translate_page,
  },
  es_style_transform_rotate_page: {
    name: "transform:rotate",
    component: es_style_transform_rotate_page,
  },
  es_style_transform_perspective_page: {
    name: "transform:perspective",
    component: es_style_transform_perspective_page,
  },
  es_style_transform_style_page: {
    name: "transform:style",
    component: es_style_transform_style_page,
  },
};
export default ESStyleTransformPageList;
