import {registerElement} from '@extscreen/es3-vue';

function registerSlotView(Vue) {
  registerElement('es-slot-view-component', {
    component: {
      name: 'SlotView',
    },
  });
}

export default registerSlotView;
