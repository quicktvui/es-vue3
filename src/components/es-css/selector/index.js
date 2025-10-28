//基础
import es_css_basic_selector_universal_page from "./es-css-basic-selector-universal-page";
import es_css_basic_selector_type_page from "./es-css-basic-selector-type-page";
import es_css_basic_selector_class_page from "./es-css-basic-selector-class-page";
import es_css_basic_selector_id_page from "./es-css-basic-selector-id-page";
import es_css_basic_selector_group_page from "./es-css-basic-selector-group-page";

//组合选择器
import es_css_combinators_selector_descendant_page from "./es-css-combinators-selector-descendant-page";
import es_css_combinators_selector_adjacent_sibling_page from "./es-css-combinators-selector-adjacent-sibling-page";
import es_css_combinators_selector_child_page from "./es-css-combinators-selector-child-page";
import es_css_combinators_selector_general_sibling_page from "./es-css-combinators-selector-general-sibling-page";

//属性选择器（Attribute Selectors）
import es_css_attribute_selector_presence_page from "./es-css-attribute-selector-presence-page";
import es_css_attribute_selector_value_equals_page from "./es-css-attribute-selector-value-equals-page";
import es_css_attribute_selector_starts_with_page from "./es-css-attribute-selector-starts-with-page";
import es_css_attribute_selector_ends_with_page from "./es-css-attribute-selector-ends-with-page";
import es_css_attribute_selector_contains_substring_page from "./es-css-attribute-selector-contains-substring-page";
import es_css_attribute_selector_multiple_page from "./es-css-attribute-selector-multiple-page";

//伪类选择器（Attribute Selectors）
import es_css_pseudo_classes_selector_first_child_page from "./es-css-pseudo-classes-selector-first-child-page";
import es_css_pseudo_classes_selector_last_child_page from "./es-css-pseudo-classes-selector-last-child-page";
import es_css_pseudo_classes_selector_only_child_page from "./es-css-pseudo-classes-selector-only-child-page";
import es_css_pseudo_classes_selector_nth_child_page from "./es-css-pseudo-classes-selector-nth-child-page";
import es_css_pseudo_classes_selector_empty_page from "./es-css-pseudo-classes-selector-empty-page";
import es_css_pseudo_classes_selector_not_page from "./es-css-pseudo-classes-selector-not-page";

export const ESCSSBasicSelectorPageList = {
  es_css_basic_selector_universal_page: {
    name: "基础:通用选择器",
    component: es_css_basic_selector_universal_page,
  },
  es_css_basic_selector_type_page: {
    name: "基础:元素选择器",
    component: es_css_basic_selector_type_page,
  },
  es_css_basic_selector_class_page: {
    name: "基础:类名选择器",
    component: es_css_basic_selector_class_page,
  },
  es_css_basic_selector_id_page: {
    name: "基础:ID选择器",
    component: es_css_basic_selector_id_page,
  },
  es_css_basic_selector_group_page: {
    name: "基础:分组选择器",
    component: es_css_basic_selector_group_page,
  },
};

export const ESCSSCombinatorsSelectorPageList = {
  es_css_combinators_selector_descendant_page: {
    name: "组合:后代选择器",
    component: es_css_combinators_selector_descendant_page,
  },
  es_css_combinators_selector_child_page: {
    name: "组合:子选择器",
    component: es_css_combinators_selector_child_page,
  },
  es_css_combinators_selector_adjacent_sibling_page: {
    name: "组合:相邻兄弟选择器",
    component: es_css_combinators_selector_adjacent_sibling_page,
  },
  es_css_combinators_selector_general_sibling_page: {
    name: "组合:通用兄弟选择器",
    component: es_css_combinators_selector_general_sibling_page,
  },
};

export const ESCSSAttributeSelectorPageList = {
  es_css_attribute_selector_presence_page: {
    name: "属性:存在选择器",
    component: es_css_attribute_selector_presence_page,
  },
  es_css_attribute_selector_value_equals_page: {
    name: "属性:值等于选择器",
    component: es_css_attribute_selector_value_equals_page,
  },
  es_css_attribute_selector_starts_with_page: {
    name: "属性:值开头选择器",
    component: es_css_attribute_selector_starts_with_page,
  },
  es_css_attribute_selector_ends_with_page: {
    name: "属性:值结尾选择器",
    component: es_css_attribute_selector_ends_with_page,
  },
  es_css_attribute_selector_contains_substring_page: {
    name: "属性:值包含选择器",
    component: es_css_attribute_selector_contains_substring_page,
  },
  es_css_attribute_selector_multiple_page: {
    name: "属性:多条件属性选择器",
    component: es_css_attribute_selector_multiple_page,
  },
};

export const ESCSSPseudoClassesSelectorPageList = {
  es_css_pseudo_classes_selector_first_child_page: {
    name: "伪类：结构性:first-child",
    component: es_css_pseudo_classes_selector_first_child_page,
  },
  es_css_pseudo_classes_selector_last_child_page: {
    name: "伪类：结构性:last-child",
    component: es_css_pseudo_classes_selector_last_child_page,
  },
  es_css_pseudo_classes_selector_only_child_page: {
    name: "伪类：结构性:only-child",
    component: es_css_pseudo_classes_selector_only_child_page,
  },
  es_css_pseudo_classes_selector_nth_child_page: {
    name: "伪类：结构性:nth-child(n)",
    component: es_css_pseudo_classes_selector_nth_child_page,
  },
  es_css_pseudo_classes_selector_empty_page: {
    name: "伪类：结构性:empty",
    component: es_css_pseudo_classes_selector_empty_page,
  },
  es_css_pseudo_classes_selector_not_page: {
    name: "伪类：结构性:not()",
    component: es_css_pseudo_classes_selector_not_page,
  },
};

export default {
  ...ESCSSBasicSelectorPageList,
  ...ESCSSCombinatorsSelectorPageList,
  ...ESCSSAttributeSelectorPageList,
  ...ESCSSPseudoClassesSelectorPageList,
};
