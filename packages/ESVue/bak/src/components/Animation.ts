import { h, toRefs, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from "vue";
import { ESApp, EventBus, Native } from "../index";

const MODULE_NAME = "AnimationModule";

let ANIMATION_ID = 1;

export function nextAnimationId(): number {
  return ANIMATION_ID++;
}

interface Animation {
  animationId: number;
  follow?: boolean;
}

function createAnimation(option): Animation {
  const DEFAULT_OPTION = {
    valueType: undefined,
    delay: 0,
    startValue: 0,
    toValue: 0,
    duration: 0,
    direction: "center",
    timingFunction: "linear",
    repeatCount: 0,
    inputRange: [],
    outputRange: [],
  };

  const { mode = "timing", valueType, startValue, toValue, ...others } = option;
  const fullOption = {
    ...DEFAULT_OPTION,
    ...others,
  };
  if (valueType !== undefined) {
    fullOption.valueType = option.valueType;
  }
  fullOption.startValue = parseValue(fullOption.valueType, startValue);
  fullOption.toValue = parseValue(fullOption.valueType, toValue);
  const animationId = nextAnimationId();
  Native.callNative(MODULE_NAME, "createAnimation", animationId, mode, fullOption);

  console.log("=========createAnimation====1==>>>>", animationId);

  return {
    animationId,
  };
}

const parseValue = (valueType, originalValue) => {
  if (valueType === "color" && ["number", "string"].indexOf(typeof originalValue) >= 0) {
    return Native.parseColor(originalValue);
  }
  return originalValue;
};

const createAnimationSet = (children, repeatCount = 0) => {
  const animationId = nextAnimationId();
  Native.callNative(MODULE_NAME, "createAnimationSet", animationId, {
    children,
    repeatCount,
  });
  return animationId;
};

function registerAnimationComponent(app: ESApp) {
  app.component("Animation", {
    emits: ["start", "end", "repeat", "cancel", "actionsDidUpdate"],
    props: {
      tag: {
        type: String,
        default: "div",
      },
      playing: {
        type: Boolean,
        default: false,
      },
      actions: {
        type: Object,
        required: true,
      },
    },
    setup(props, context) {
      const viewRef = ref();

      // const playing = ref(false);
      // const actions = ref({});

      let alreadyStarted: boolean = false;
      let animationIds: Array<number> = [];
      let childAnimationIdList: Array<number> = [];

      let style = {};

      //----------------------------------------------------------------------------
      // watch playing
      // 保持响应性，使用 toRef 包装 props.playing
      const { playing, actions } = toRefs(props);
      watch(playing, (newVal, oldVal) => {
        console.log("=========watch===playing======>>>>", oldVal, newVal);
        if (!oldVal && newVal) {
          console.log("=========watch===playing===start===>>>>");
          start();
        } else if (oldVal && !newVal) {
          console.log("=========watch===playing===pause===>>>>");
          pause();
        }
      });

      // watch actions
      watch(actions, () => {
        destroy();
        create();
      });
      //------------------------------事件------------------------------------
      const onAnimationStart = (animationId: number) => {
        EventBus.$off("onHippyAnimationStart", onAnimationStart);
        context.emit("start", animationId);
      };
      const onAnimationEnd = (animationId: number) => {
        EventBus.$off("onHippyAnimationEnd", onAnimationEnd);
        context.emit("end", animationId);
      };
      const onAnimationRepeat = (animationId: number) => {
        context.emit("repeat", animationId);
      };
      const onAnimationCancel = (animationId: number) => {
        EventBus.$off("onHippyAnimationCancel", onAnimationCancel);
        context.emit("cancel", animationId);
      };
      const addAnimationEvent = (): void => {
        EventBus.$on("onHippyAnimationStart", onAnimationStart);
        EventBus.$on("onHippyAnimationEnd", onAnimationEnd);
        EventBus.$on("onHippyAnimationRepeat", onAnimationRepeat);
        EventBus.$on("onHippyAnimationCancel", onAnimationCancel);
      };
      const removeAnimationEvent = (): void => {
        EventBus.$off("onHippyAnimationStart", onAnimationStart);
        EventBus.$off("onHippyAnimationEnd", onAnimationEnd);
        EventBus.$off("onHippyAnimationRepeat", onAnimationRepeat);
        EventBus.$off("onHippyAnimationCancel", onAnimationCancel);
      };
      //----------------------------------OP------------------------------------------

      onBeforeMount(() => {});

      onMounted(() => {
        create();
        if (props.playing) {
          start();
        }
      });

      onUnmounted(() => {});

      onBeforeUnmount(() => {
        destroy();
      });

      const create = (): void => {
        if (!props.actions || typeof props.actions !== "object") {
          console.warn("[Animation] props.actions is invalid:", props.actions);
          return;
        }
        console.log("=========create=====0======>>>>", props.actions);
        const {
          actionsConfig: { transform, ...actions },
        } = props.actions;
        console.log("=========create=====1======>>>>", transform.value);
        const s: Record<string, any> = getStyle(actions, childAnimationIdList);
        if (transform) {
          console.log("=========create=====2======>>>>", transform);
          const transformAnimations = getStyle(transform, childAnimationIdList);
          s.transform = Object.keys(transformAnimations).map((key) => ({
            [key]: transformAnimations[key],
          }));
        }
        // Turn to be true at first startAnimation, and be false again when destroy.
        alreadyStarted = false;
        // Generated style
        console.log("=========create======2=====>>>>", JSON.stringify(s));
        style = s;
      };

      const getStyle = (actions, childAnimationIdList: Array<number> = []) => {
        const style = {};
        Object.keys(actions).forEach((key) => {
          console.log("=========getStyle====1====start==>>>>", actions);
          if (Array.isArray(actions[key])) {
            // Process AnimationSet from Array.
            const actionSet = actions[key];
            const { repeatCount } = actionSet[actionSet.length - 1];
            console.log("=========getStyle====1===1===>>>>", actionSet);
            const animationSetActions = actionSet.map((a) => {
              const action = createAnimation(Object.assign({}, a, { repeatCount: 0 }));
              childAnimationIdList.push(action.animationId);
              action.follow = true;
              return action;
            });

            const animationSetId = createAnimationSet(animationSetActions, repeatCount);
            console.log("=========getStyle====1===2==createAnimationSet=>>>>", animationSetId);
            style[key] = {
              animationId: animationSetId,
            };
            console.log("=========getStyle====1===end===>>>>", actions);
          } else {
            console.log("=========getStyle===2===start==>>>>", actions);
            // Process standalone Animation.
            const action = actions[key];
            const animation = createAnimation(action);
            const { animationId } = animation;
            style[key] = {
              animationId,
            };
            console.log("=========getStyle===2===end==>>>>", actions);
          }
        });
        return style;
      };

      const getAnimationIds = (style: any): Array<number> => {
        const { transform, ...otherStyles } = style;
        let animationIds = Object.keys(otherStyles).map((key) => style[key].animationId);
        if (Array.isArray(transform) && transform.length > 0) {
          const transformIds: Array<number> = [];
          transform.forEach((entity) =>
            Object.keys(entity).forEach((key) => {
              if (entity[key]) {
                const { animationId } = entity[key];
                if (typeof animationId === "number" && animationId % 1 === 0) {
                  transformIds.push(animationId);
                }
              }
            }),
          );
          animationIds = [...animationIds, ...transformIds];
        }
        return animationIds;
      };
      //
      const start = (): void => {
        if (!alreadyStarted) {
          console.log("=========start====1======>>>>", actions);
          const ids = getAnimationIds(style);
          console.log("=========start====2===>>>>", ids);
          animationIds = ids;
          alreadyStarted = true;
          removeAnimationEvent();
          addAnimationEvent();
          animationIds.forEach((animationId) => {
            console.log("=========start====3=callNative==>>>>", ids);
            Native.callNative(MODULE_NAME, "startAnimation", animationId);
          });
        } else {
          resume();
        }
      };

      const pause = (): void => {
        if (!alreadyStarted) {
          return;
        }
        console.log("=========pause====1===>>>>");
        const animationIds = getAnimationIds(style);
        console.log("=========pause====2===>>>>", animationIds);
        animationIds.forEach((animationId) => {
          console.log("=========pause====3===>>>>", animationId);
          Native.callNative(MODULE_NAME, "pauseAnimation", animationId);
        });
      };

      const resume = (): void => {
        const animationIds = getAnimationIds(style);
        animationIds.forEach((animationId) =>
          Native.callNative(MODULE_NAME, "resumeAnimation", animationId),
        );
      };

      const reset = (): void => {
        alreadyStarted = false;
      };

      const destroy = (): void => {
        removeAnimationEvent();

        const animationIds = getAnimationIds(style);
        childAnimationIdList.forEach(
          (animationId) =>
            Number.isInteger(animationId) &&
            Native.callNative(MODULE_NAME, "destroyAnimation", animationId),
        );
        animationIds.forEach((animationId) =>
          Native.callNative(MODULE_NAME, "destroyAnimation", animationId),
        );
        childAnimationIdList = [];

        alreadyStarted = false;
      };

      context.expose({
        viewRef,
        start,
        pause,
        resume,
        create,
        reset,
        destroy,
      });
      return () => {
        const children = context.slots.default && context.slots.default();
        return h(
          props.tag,
          {
            ref: viewRef,
          },
          children,
        );
      };
    },
  });
}

export default registerAnimationComponent;
