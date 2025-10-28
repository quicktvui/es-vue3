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
} from "./injectionSymbols";
import { assign, isArray, isBrowser } from "./utils";
import { warn } from "./warning";
import { isSameRouteRecord } from "./location";
import { ESRouteLaunchMode, ESRouteType, LifecycleState, RouteRecord } from "./matcher/types";
import { HistoryLocation, NavigationType } from "./history/common";
import { info } from "./log/info";
import { triggerESLifecycle } from "@extscreen/es3-vue";

export interface RouterViewProps {
  name?: string;
  // allow looser type for user facing api
  route?: RouteLocationNormalized;
}

export interface RouterViewDevtoolsContext
  extends Pick<RouteLocationMatched, "path" | "name" | "meta"> {
  depth: number;
}

export const RouterViewImpl = /*#__PURE__*/ defineComponent({
  name: "RouterView",
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
          exeRouterInstanceLifecycle(
            router,
            navigationType?.value,
            route,
            instance,
            historyLocation,
          );

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
      },
      { flush: "post" },
    );

    //---------------------------------------------------------------------------------
    watch(
      () => router.active,
      (val) => {
        console.log("router view watch app activate state:", val);
        if (val) {
          console.log("router view should resume on activate state:", val);
          try {
            const historyLocationList: HistoryLocation[] = routerHistory.getHistoryLocations();
            const historyLocation = historyLocationList[historyLocationList.length - 1];
            resumeRoute(historyLocation.instances, historyLocation);
          } catch (e) {
            console.log("router view resume on activate error!", e);
          }
        }
      },
    );

    return () => {
      console.log("router view refresh start...");
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
      //
      const componentList = [];
      const routerViewRefList = [];
      historyLocationList.forEach((historyLocation, index) => {
        if (historyLocation.lifecycle >= LifecycleState.destroy) {
          return;
        }
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
        const key = recordName + "_" + historyLocation.key ?? "";

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
          const component = h(
            currentComponent,
            assign({}, routeProps, attrs, {
              onVnodeUnmounted,
              onVnodeBeforeUnmount,
              ref: routerViewRef,
              key: key,
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

          let pageViewStyle = {
            position: "absolute",
            width: 1920,
            height: 1080,
          };

          try {
            const routeRecordDefaultProps = routeRecord?.props.default;
            if (
              routeRecordDefaultProps &&
              routeRecordDefaultProps.width != undefined &&
              routeRecordDefaultProps.height != undefined
            ) {
              assign(pageViewStyle, {
                width: routeRecordDefaultProps.width,
                height: routeRecordDefaultProps.height,
              });
            }
          } catch (e) {
            console.log("ESPageView " + recordName + " RouteRecordDefaultProps Error:" + e);
          }
          console.log("ESPageView " + recordName + " Style:" + JSON.stringify(pageViewStyle));

          const pageViewKey = "es-page-view-" + recordName + "-" + historyLocation.key ?? "";
          let data = {
            key: pageViewKey,
            style: pageViewStyle,
            name: recordName,
            isDialogMode: routeRecord.type == ESRouteType.ES_ROUTE_TYPE_DIALOG,
          };
          const pageComponent = h(resolvePageViewComponentName(), data, component);
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
        key: "es-router-view",
      };
      const pageRootComponent = h(resolveRootViewComponentName(), rootViewProps, componentList);
      console.log("router view refresh end...");
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: pageRootComponent, route }) || pageRootComponent
      );
    };
  },
});

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

function resolveRootViewComponentName(): string {
  try {
    return (
      (__ES_ROUTER_FEATURE_FLAGS__ && __ES_ROUTER_FEATURE_FLAGS__.ROOT_VIEW_COMPONENT_NAME) ??
      "es-router-view"
    );
  } catch {
    return "es-router-view";
  }
}

function resolvePageViewComponentName(): string {
  try {
    return (
      (__ES_ROUTER_FEATURE_FLAGS__ && __ES_ROUTER_FEATURE_FLAGS__.PAGE_VIEW_COMPONENT_NAME) ??
      "es-page-view"
    );
  } catch {
    return "es-page-view";
  }
}
function isFunction(func) {
  return Object.prototype.toString.call(func) === "[object Function]";
}

function exeRouterInstanceLifecycle(
  router,
  navigationType,
  routeToDisplay,
  instance,
  historyLocation,
) {
  if (!navigationType) {
    return;
  }
  //push
  if (navigationType === NavigationType.push) {
    historyLocation.params = routeToDisplay.params;
    //> resume
    if (
      historyLocation.lifecycle >= LifecycleState.stop ||
      historyLocation.lifecycle === LifecycleState.initialized
    ) {
      const isDestroy =
        historyLocation.lifecycle >= LifecycleState.destroy ||
        historyLocation.lifecycle === LifecycleState.initialized;
      historyLocation.lifecycle = LifecycleState.initialized;
      if (isDestroy) {
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
      } else {
        //onESNewIntent
        if (
          historyLocation.launchMode === ESRouteLaunchMode.ES_ROUTE_LAUNCH_MODE_SINGLE_TASK &&
          instance
        ) {
          try {
            triggerESLifecycle(instance, "newIntent", routeToDisplay.params);
          } catch (e) {}

          if (isFunction(instance.onESNewIntent)) {
            instance.onESNewIntent(routeToDisplay.params);
          }
        }

        //onESRestart
        if (historyLocation.lifecycle < LifecycleState.restart) {
          historyLocation.lifecycle = LifecycleState.restart;
          if (instance) {
            try {
              triggerESLifecycle(instance, "restart");
            } catch (e) {}

            if (isFunction(instance.onESRestart)) {
              instance.onESRestart();
            }
          }
        }
      }

      //onESStart
      if (historyLocation.lifecycle < LifecycleState.start) {
        historyLocation.lifecycle = LifecycleState.start;
        if (instance) {
          try {
            triggerESLifecycle(instance, "start");
          } catch (e) {}

          if (isFunction(instance.onESStart)) {
            instance.onESStart();
          }
        }
      }

      //onESRestoreInstanceState
      if (isDestroy && historyLocation.lifecycle < LifecycleState.restoreInstanceState) {
        historyLocation.lifecycle = LifecycleState.restoreInstanceState;
        if (instance) {
          try {
            triggerESLifecycle(instance, "restoreInstanceState", historyLocation.saveInstanceState);
          } catch (e) {}

          if (isFunction(instance.onESRestoreInstanceState)) {
            instance.onESRestoreInstanceState(historyLocation.saveInstanceState);
          }
        }
      }

      //onESResume
      if (historyLocation.lifecycle < LifecycleState.resume) {
        historyLocation.lifecycle = LifecycleState.resume;
        if (instance) {
          try {
            triggerESLifecycle(instance, "resume");
          } catch (e) {}

          if (isFunction(instance.onESResume)) {
            instance.onESResume();
          }
        }
      }
    }
    //== resume
    else if (historyLocation.lifecycle === LifecycleState.resume) {
      //onESNewIntent
      if (instance) {
        try {
          triggerESLifecycle(instance, "newIntent", routeToDisplay.params);
        } catch (e) {}

        if (isFunction(instance.onESNewIntent)) {
          instance.onESNewIntent(routeToDisplay.params);
        }
      }
    }
    //< resume
    else {
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

      //onESStart
      if (historyLocation.lifecycle < LifecycleState.start) {
        historyLocation.lifecycle = LifecycleState.start;
        if (instance) {
          try {
            triggerESLifecycle(instance, "start");
          } catch (e) {}

          if (isFunction(instance.onESStart)) {
            instance.onESStart();
          }
        }
      }

      //onESResume
      if (historyLocation.lifecycle < LifecycleState.resume) {
        historyLocation.lifecycle = LifecycleState.resume;
        if (instance) {
          try {
            triggerESLifecycle(instance, "resume");
          } catch (e) {}

          if (isFunction(instance.onESResume)) {
            instance.onESResume();
          }
        }
      }
    }
  }
  //pop
  else if (navigationType === NavigationType.pop) {
    if (
      historyLocation.lifecycle >= LifecycleState.pause ||
      historyLocation.lifecycle === LifecycleState.initialized
    ) {
      if (router.active) {
        resumeRoute(instance, historyLocation);
      } else {
        info("router is not active, waiting active app ...");
      }
    }
  }
}

function resumeRoute(instance, historyLocation) {
  //
  const isDestroy =
    historyLocation.lifecycle >= LifecycleState.destroy ||
    historyLocation.lifecycle === LifecycleState.initialized;
  //
  const isStop = historyLocation.lifecycle >= LifecycleState.stop;

  historyLocation.lifecycle = LifecycleState.initialized;
  if (isDestroy) {
    //onESCreate
    if (historyLocation.lifecycle < LifecycleState.create) {
      historyLocation.lifecycle = LifecycleState.create;
      if (instance) {
        try {
          triggerESLifecycle(instance, "create", historyLocation.params);
        } catch (e) {}

        if (isFunction(instance.onESCreate)) {
          instance.onESCreate(historyLocation.params);
        }
      }
    }
  } else {
    //dialog导致的onPause不在逻辑内
    if (isStop) {
      //onESNewIntent
      if (
        historyLocation.launchMode === ESRouteLaunchMode.ES_ROUTE_LAUNCH_MODE_SINGLE_TASK &&
        instance
      ) {
        try {
          triggerESLifecycle(instance, "newIntent", historyLocation.params);
        } catch (e) {}

        if (isFunction(instance.onESNewIntent)) {
          instance.onESNewIntent(historyLocation.params);
        }
      }

      //onESRestart
      if (historyLocation.lifecycle < LifecycleState.restart) {
        historyLocation.lifecycle = LifecycleState.restart;
        if (instance) {
          try {
            triggerESLifecycle(instance, "restart");
          } catch (e) {}

          if (isFunction(instance.onESRestart)) {
            instance.onESRestart();
          }
        }
      }
    }
  }

  //onESStart
  if (isStop && historyLocation.lifecycle < LifecycleState.start) {
    historyLocation.lifecycle = LifecycleState.start;
    if (instance) {
      try {
        triggerESLifecycle(instance, "start");
      } catch (e) {}

      if (isFunction(instance.onESStart)) {
        instance.onESStart();
      }
    }
  }

  //onESRestoreInstanceState
  if (isDestroy && historyLocation.lifecycle < LifecycleState.restoreInstanceState) {
    historyLocation.lifecycle = LifecycleState.restoreInstanceState;
    if (instance) {
      try {
        triggerESLifecycle(instance, "restoreInstanceState", historyLocation.saveInstanceState);
      } catch (e) {}

      if (isFunction(instance.onESRestoreInstanceState)) {
        instance.onESRestoreInstanceState(historyLocation.saveInstanceState);
      }
    }
  }

  //onESResume
  if (historyLocation.lifecycle < LifecycleState.resume) {
    historyLocation.lifecycle = LifecycleState.resume;
    if (instance) {
      try {
        triggerESLifecycle(instance, "resume");
      } catch (e) {}

      if (isFunction(instance.onESResume)) {
        instance.onESResume();
      }
    }
  }
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
export const RouterView = RouterViewImpl as unknown as {
  new (): {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & RouterViewProps;

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
    (parentSubTreeType as Component).name === "RouterView"
  ) {
    const comp = parentName === "KeepAlive" ? "keep-alive" : "transition";
    warn(
      `<es-router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` +
        `Use slot props instead:\n\n` +
        `<es-router-view v-slot="{ Component }">\n` +
        `  <${comp}>\n` +
        `    <component :is="Component" />\n` +
        `  </${comp}>\n` +
        `</es-router-view>`,
    );
  }
}
