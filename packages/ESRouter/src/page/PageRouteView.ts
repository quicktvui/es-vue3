import {ESApp, registerElement} from '@extscreen/es3-vue';

function registerPageRouteView(app: ESApp) {
  registerElement('es-router-view', {
    component: {
      name: 'ESPageRouterView',
    },
  });
}

export default registerPageRouteView;
