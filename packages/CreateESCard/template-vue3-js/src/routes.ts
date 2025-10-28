import index from "./views/index.vue";
import error from "./views/error";

const routes = [
  {
    path: '/index',
    name: 'index',
    component: index,
    launchMode: 'clearTask',
  },
  {
    path: '/error',
    name: 'error',
    component: error,
    launchMode: 'standard',
  }
]

export default routes

