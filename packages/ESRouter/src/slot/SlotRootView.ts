import {registerElement} from '@extscreen/es3-vue';

function registerSlotRootView(Vue) {
  registerElement('es-slot-root-view-component', {
    component: {
      name: 'SlotRootView',
    },
  });
}

export default registerSlotRootView;
