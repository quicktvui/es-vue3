import {
  h,
  inject,
  provide,
  defineComponent,
  PropType,
  ref,
  unref,
  ComponentPublicInstance,
  VNodeProps,
  getCurrentInstance,
  computed,
  AllowedComponentProps,
  ComponentCustomProps,
  watch,
  Slot,
  VNode,
  Component,
} from "vue";
import {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  RouteLocationMatched,
  RouteRecordName,
  RouteRecordRaw,
} from "./types";
import {
  matchedRouteKey,
  viewDepthKey,
  routerViewLocationKey,
  routerHistoryKey,
  routerKey,
  routerRecordRawKey,
  navigationTypeKey,
  routerComponentInstanceKey,
  routerViewNameKey,
  routerViewInstanceKey,
  routeViewInstancesKey,
} from "./injectionSymbols";
import { assign, isArray, isBrowser } from "./utils";
import { warn } from "./warning";
import { isSameRouteRecord } from "./location";
import { ESRouteLaunchMode, ESRouteType, LifecycleState, RouteRecord } from "./matcher/types";
import { HistoryLocation, NavigationType } from "./history/common";
import { triggerESLifecycle } from "@extscreen/es3-vue";

export interface SlotViewProps {
  name?: string;
  // allow looser type for user facing api
  route?: RouteLocationNormalized;
}

export interface RouterViewDevtoolsContext
  extends Pick<RouteLocationMatched, "path" | "name" | "meta"> {
  depth: number;
}

export const SlotViewImpl = /*#__PURE__*/ defineComponent({
  name: "SlotView",
  // #674 we manually inherit them
  inheritAttrs: false,
  emits: [],
  props: {
    name: {
      type: String as PropType<string>,
      default: "default",
    },
    route: Object as PropType<RouteLocationNormalizedLoaded>,
  },

  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },

  setup(props, { attrs, slots }) {
    __DEV__ && warnDeprecatedUsage();
    //
    const routerComponentInstance = inject(routerComponentInstanceKey);
    const routerViewInstance = inject(routerViewInstanceKey);
    const routeViewInstanceList = inject(routeViewInstancesKey);

    const navigationType = inject(navigationTypeKey);
    const routerHistory = inject(routerHistoryKey);
    const router = inject(routerKey)!;
    const routerViewName = inject(routerViewNameKey)!;
    //
    const routeRecordRawList: RouteRecordRaw[] = inject(routerRecordRawKey)!;
    const injectedRoute = inject(routerViewLocationKey)!;
    const routeToDisplay = computed<RouteLocationNormalizedLoaded>(
      () => props.route || injectedRoute.value,
    );
    const injectedDepth = inject(viewDepthKey, 0);
    // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
    // that are used to reuse the `path` property
    const depth = computed<number>(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute: RouteLocationMatched | undefined;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed<RouteLocationMatched | undefined>(
      () => routeToDisplay.value.matched[depth.value],
    );

    provide(
      viewDepthKey,
      computed(() => depth.value + 1),
    );
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);

    let viewRef = ref<ComponentPublicInstance>();
    let routerViewRef = ref<ComponentPublicInstance>();

    // watch at the same time the component instance, the route record we are
    // rendering, and the name
    watch(
      () =>
        [
          routerViewRef.value,
          routeToDisplay.value,
          viewRef.value,
          matchedRouteRef.value,
          props.name,
        ] as const,
      (
        [routeView, route, instance, to, name],
        [oldRouteView, oldRoute, oldInstance, from, oldName],
      ) => {
        console.log("slot view watch start...");
        // copy reused instances
        if (to) {
          // this will update the instance for new instances as well as reused
          // instances when navigating to a new route
          to.instances[name] = instance;
          //
          routerComponentInstance.value = instance;
          routerViewInstance.value = routeView;

          //
          const historyLocationList: HistoryLocation[] = routerHistory.getHistoryLocations();
          const historyLocation = historyLocationList[historyLocationList.length - 1];
          historyLocation.instances = instance;

          //
          exeRouterInstanceLifecycle(navigationType?.value, route, instance, historyLocation);

          // the component instance is reused for a different route or name, so
          // we copy any saved update or leave guards. With async setup, the
          // mounting component will mount before the matchedRoute changes,
          // making instance === oldInstance, so we check if guards have been
          // added before. This works because we remove guards when
          // unmounting/deactivating components
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }

        // trigger beforeRouteEnter next callbacks
        if (
          instance &&
          to &&
          // if there is no instance but to and from are the same this might be
          // the first visit
          (!from || !isSameRouteRecord(to, from) || !oldInstance)
        ) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
        console.log("slot view watch end...");
      },
      { flush: "post" },
    );

    return () => {
      console.log("slot view refresh start...");
      //
      const route = routeToDisplay.value;
      // we need the value at the time we render because when we unmount, we
      // navigated to a different location so the value is different
      const currentName = props.name;

      //
      routerViewName.value = currentName;

      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components![currentName];

      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      //
      attrs = { ...attrs, position: "absolute" };
      const historyLocationList: HistoryLocation[] = routerHistory.getHistoryLocations();
      const componentList = [];
      const routerViewRefList = [];

      //
      const routeViewRefList = [];
      routeViewInstanceList.value = routeViewRefList;

      //
      historyLocationList.forEach((historyLocation, index) => {
        const routeRecordName = historyLocation.location;
        // props from route configuration
        const routePropsOption = matchedRoute.props[currentName];
        const routeProps = routePropsOption
          ? routePropsOption === true
            ? route.params
            : typeof routePropsOption === "function"
              ? routePropsOption(route)
              : routePropsOption
          : null;

        const recordName = resolveRouteRecordName(routeRecordName, routeRecordRawList);
        const routeRecord: RouteRecord | undefined = router.getRoute(recordName!);

        if (routeRecord && routeRecord.components) {
          const onVnodeBeforeUnmount: VNodeProps["onVnodeBeforeUnmount"] = (vnode) => {};
          const onVnodeUnmounted: VNodeProps["onVnodeUnmounted"] = (vnode) => {
            // remove the instance reference to prevent leak
            if (vnode.component!.isUnmounted) {
              matchedRoute.instances[currentName] = null;
            }
          };
          //
          const routerViewRef = ref<ComponentPublicInstance>();
          routerViewRefList.push(routerViewRef);

          const currentName = props.name;
          const currentComponent = routeRecord.components![currentName];
          const componentKey = recordName + "_" + historyLocation.key ?? "";
          const component = h(
            currentComponent,
            assign({}, routeProps, attrs, {
              onVnodeUnmounted,
              onVnodeBeforeUnmount,
              ref: routerViewRef,
              key: componentKey,
              sid: historyLocation.key,
            }),
          );
          console.log(
            "router view component instance key: " + recordName + "_" + historyLocation.key ?? "",
          );
          if ((__DEV__ || __FEATURE_PROD_DEVTOOLS__) && isBrowser && component.ref) {
            // TODO: can display if it's an alias, its props
            const info: RouterViewDevtoolsContext = {
              depth: depth.value,
              name: matchedRoute.name,
              path: matchedRoute.path,
              meta: matchedRoute.meta,
            };

            const internalInstances = isArray(component.ref)
              ? component.ref.map((r) => r.i)
              : [component.ref.i];

            internalInstances.forEach((instance) => {
              // @ts-expect-error
              instance.__vrv_devtools = info;
            });
          }

          let routeViewRef = ref<ComponentPublicInstance>();
          routeViewRefList.push(routeViewRef);
          let data = {
            style: {
              position: "absolute",
            },
            sid: historyLocation.key,
            key: componentKey,
            isDialogMode: routeRecord.type == ESRouteType.ES_ROUTE_TYPE_DIALOG,
            ref: routeViewRef,
          };
          const pageComponent = h("es-slot-view-component", assign(data, routeProps), component);
          componentList.push(pageComponent);
        }
      });

      //
      viewRef = routerViewRefList[routerViewRefList.length - 1];

      let rootViewProps = {
        style: {
          position: "absolute",
          width: 1920,
          height: 1080,
        },
        ref: routerViewRef,
      };
      // const pageRootComponent = h('es-router-view', rootViewProps, componentList);
      const pageRootComponent = h("es-slot-root-view-component", rootViewProps, componentList);
      console.log("slot view refresh end...");
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: pageRootComponent, route }) || pageRootComponent
      );
    };
  },
});

function isFunction(func) {
  return Object.prototype.toString.call(func) === "[object Function]";
}

function exeRouterInstanceLifecycle(navigationType, routeToDisplay, instance, historyLocation) {
  if (!navigationType) {
    return;
  }
  //push
  if (navigationType === NavigationType.push) {
    historyLocation.params = routeToDisplay.params;
    //onESCreate
    if (historyLocation.lifecycle < LifecycleState.create) {
      historyLocation.lifecycle = LifecycleState.create;
      if (instance) {
        try {
          triggerESLifecycle(instance, "create", routeToDisplay.params);
        } catch (e) {}

        if (isFunction(instance.onESCreate)) {
          instance.onESCreate(routeToDisplay.params);
        }
      }
    }

    // 20241211 由于商店二楼会预加载JSView，但是View没有add到页面上。
    // 但是这个时候JSView的声明周期已经执行了onESStart 和 onESResume，是有问题的
    // 所以 onESStart 和 onESResume声明周期修改为由Android层发送Natvie事件
    // //onESStart
    // if (historyLocation.lifecycle < LifecycleState.start) {
    //   historyLocation.lifecycle = LifecycleState.start
    //   if (instance && isFunction(instance.onESStart)) {
    //     instance.onESStart();
    //   }
    // }
    //
    // //onESResume
    // if (historyLocation.lifecycle < LifecycleState.resume) {
    //   historyLocation.lifecycle = LifecycleState.resume
    //   if (instance && isFunction(instance.onESResume)) {
    //     instance.onESResume();
    //   }
    // }
  }
}

function resolveRouteRecordName(
  routeRecordName: RouteRecordName,
  routeRecordRawList: RouteRecordRaw[],
) {
  if (routeRecordRawList && routeRecordRawList.length > 0) {
    for (let routeRecordRaw of routeRecordRawList) {
      if (routeRecordRaw.path === routeRecordName) {
        return routeRecordRaw.name;
      }
    }
  }
  return null;
}

function normalizeSlot(slot: Slot | undefined, data: any) {
  if (!slot) return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}

// export the public type for h/tsx inference
// also to avoid inline import() in generated d.ts files
/**
 * Component to display the current route the user is at.
 */
export const SlotView = SlotViewImpl as unknown as {
  new (): {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & SlotViewProps;

    $slots: {
      default?: ({
        Component,
        route,
      }: {
        Component: VNode;
        route: RouteLocationNormalizedLoaded;
      }) => VNode[];
    };
  };
};

// warn against deprecated usage with <transition> & <keep-alive>
// due to functional component being no longer eager in Vue 3
function warnDeprecatedUsage() {
  const instance = getCurrentInstance()!;
  const parentName = instance.parent && instance.parent.type.name;
  const parentSubTreeType =
    instance.parent && instance.parent.subTree && instance.parent.subTree.type;
  if (
    parentName &&
    (parentName === "KeepAlive" || parentName.includes("Transition")) &&
    typeof parentSubTreeType === "object" &&
    (parentSubTreeType as Component).name === "SlotView"
  ) {
    const comp = parentName === "KeepAlive" ? "keep-alive" : "transition";
    warn(
      `<es-slot-view> can no longer be used directly inside <transition> or <keep-alive>.\n` +
        `Use slot props instead:\n\n` +
        `<es-slot-view v-slot="{ Component }">\n` +
        `  <${comp}>\n` +
        `    <component :is="Component" />\n` +
        `  </${comp}>\n` +
        `</es-slot-view>`,
    );
  }
}
