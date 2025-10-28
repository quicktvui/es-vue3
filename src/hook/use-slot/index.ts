import {inject} from "vue";
import {routeViewInstancesKey} from "@extscreen/es3-router";
import {Native} from "@extscreen/es3-vue";

/**
 *
 */
export function useSlot() {
  const routeViewList = inject(routeViewInstancesKey) ?? []

  const suspend = (context) => {
    const sid = context.attrs?.sid ?? null
    if (!sid) {
      return
    }
    const routeViewRefList = routeViewList.value
    if (!routeViewRefList || routeViewRefList.length <= 0) {
      return;
    }
    for (let i = 0; i < routeViewRefList.length; i++) {
      try {
        const viewRef = routeViewRefList[i];
        if (viewRef.value && viewRef.value.attributes && viewRef.value.attributes.sid
          && viewRef.value.attributes.sid == sid) {
          console.log("----yellow---callUIFunction---suspend->>>>>", viewRef.value)
          Native.callUIFunction(viewRef.value, 'suspend', [], (res) => {
          });
        }
      } catch (e) {
      }
    }

    console.log("----yellow---suspend---1->>>>>", context.attrs.sid)
    console.log("----yellow---suspend---2->>>>>", routeViewList.value[0]?.value.attributes.sid)
  }
  const unsuspend = (context) => {
    const sid = context.attrs?.sid ?? null
    if (!sid) {
      return
    }
    const routeViewRefList = routeViewList.value
    if (!routeViewRefList || routeViewRefList.length <= 0) {
      return;
    }
    for (let i = 0; i < routeViewRefList.length; i++) {
      try {
        const viewRef = routeViewRefList[i];
        if (viewRef.value && viewRef.value.attributes && viewRef.value.attributes.sid
          && viewRef.value.attributes.sid == sid) {
          console.log("----yellow---callUIFunction---unsuspend->>>>>", viewRef.value)
          Native.callUIFunction(viewRef.value, 'unsuspend', [], (res) => {
          });
        }
      } catch (e) {
      }
    }
    console.log("----yellow---unsuspend---->>>>>", routeViewList.value[0]?.value.attributes.sid)
  }
  return {
    suspend,
    unsuspend,
  }
}
