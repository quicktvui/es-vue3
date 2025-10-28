import {ESApp, registerElement} from "@extscreen/es3-vue";

function registerPageView(app: ESApp) {
  const PageRootViewElement = {
    component: {
      name: 'ESPageRootView',
    },
  }
  registerElement('es-page-view', PageRootViewElement);
}

export default registerPageView;
