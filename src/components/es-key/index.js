import es_back_pressed_page from "./es-backpressed-page";
import es_back_pressed_hooks_page from "./es-backpressed-hooks-page";
import es_key_event_page from "./es-keyevent-page";
import es_key_event_hooks_page from "./es-keyevent-hooks-page";
import es_key_event_view_page from "./es-keyevent-view-page";
import es_dispatch_key_event_page from "./es-dispatch-keyevent-page";
import es_dispatch_key_event_hooks_page from "./es-dispatch-keyevent-hooks-page";

const ESKeyPageList = {
  es_back_pressed_page: {
    name: "返回键",
    component: es_back_pressed_page,
  },
  es_back_pressed_hooks_page: {
    name: "返回键（hooks）",
    component: es_back_pressed_hooks_page,
  },
  es_key_event_page: {
    name: "按键（页面中监听）",
    component: es_key_event_page,
  },
  es_key_event_hooks_page: {
    name: "按键（页面hooks）",
    component: es_key_event_hooks_page,
  },
  es_key_event_view_page: {
    name: "按键（组件中监听）",
    component: es_key_event_view_page,
  },
  es_dispatch_key_event_page: {
    name: "监听按键分发",
    component: es_dispatch_key_event_page,
  },
  es_dispatch_key_event_hooks_page: {
    name: "监听按键分发（hooks）",
    component: es_dispatch_key_event_hooks_page,
  },
};
export default ESKeyPageList;
