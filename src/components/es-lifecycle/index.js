import es_lifecycle_start_page from "./es-lifecycle-start-page";
import es_lifecycle_setup_page from "./es-lifecycle-setup-page";
import es_lifecycle_hooks_page from "./es-lifecycle-hooks-page";
import es_lifecycle_hooks_async_page from "./es-lifecycle-hooks-async-page";

const ESPageLifecycleList = {
  es_lifecycle_start_page: {
    name: "使用初探",
    component: es_lifecycle_start_page,
  },
  es_lifecycle_setup_page: {
    name: "setup语法糖",
    component: es_lifecycle_setup_page,
  },
  es_lifecycle_hooks_page: {
    name: "hooks",
    component: es_lifecycle_hooks_page,
  },
  es_lifecycle_hooks_async_page: {
    name: "hooks + async",
    component: es_lifecycle_hooks_async_page,
  },
};
export default ESPageLifecycleList;
