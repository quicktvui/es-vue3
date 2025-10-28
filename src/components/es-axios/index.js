import es_axios_start_page from "./es-axios-start-page";
import es_axios_get_page from "./es-axios-get-page";
import es_axios_post_page from "./es-axios-post-page";
import es_axios_interceptors_page from "./es-axios-interceptors-page";

const ESAxiosPageList = {
  es_axios_start_page: {
    name: "使用初探",
    component: es_axios_start_page,
  },
  es_axios_get_page: {
    name: "Get",
    component: es_axios_get_page,
  },
  es_axios_post_page: {
    name: "Post",
    component: es_axios_post_page,
  },
  es_axios_interceptors_page: {
    name: "Interceptors",
    component: es_axios_interceptors_page,
  },
};
export default ESAxiosPageList;
