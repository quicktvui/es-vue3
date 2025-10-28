import { defineComponent, h, ref, renderSlot } from "vue";
import { renderSlots } from "./renderSlot";

const slotViewComponent = defineComponent({
  name: "es-slot-view",
  emits: ["msg-event"],
  props: {
    message: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const viewRef = ref();

    context.expose({
      viewRef,
    });

    return () => {
      const slots = context.slots;
      const header1 = renderSlot(slots, "header");

      console.log("======renderSlots======header========>>>>>");
      const children = [
        header1,
        //
        // slots.header ? slots.header() : null,
        // slots.default ? slots.default() : null,
        // slots.footer ? slots.footer({ text: "来自子组件的数据" }) : null,

        // renderSlots(slots, 'header'),
        // renderSlots(slots, 'default'),
        // renderSlots(slots, 'footer', { text: '作用域数据' })
      ];

      for (let i = 0; i < 10000; i++) {
        const header = renderSlot(slots, "header");
        children.push(header);
      }

      return h(
        "div",
        {
          ref: viewRef,
          ...props,
          onNativeEvent: (evt) => {
            context.emit("msg-event", evt);
          },
        },
        children,
      );
    };
  },
});

export default slotViewComponent;
