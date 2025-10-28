import {inject} from "vue";
import {Native} from "@extscreen/es3-vue";
import {routeViewInstancesKey} from "@extscreen/es3-router";

export function useESSlot() {

  const routeViewList = inject(routeViewInstancesKey) ?? []

  function suspend(context) {
    // @ts-ignore
    const sid = context.attrs?.sid ?? null
    console.log('slot: current slot sid:' + sid)
    if (!sid) {
      return
    }
    // @ts-ignore
    const routeViewRefList = routeViewList.value
    if (!routeViewRefList || routeViewRefList.length <= 0) {
      console.log('slot: slot list is null!')
      return;
    }
    for (let i = 0; i < routeViewRefList.length; i++) {
      try {
        const viewRef = routeViewRefList[i];
        console.log('slot: slot view ref ', viewRef)
        // @ts-ignore
        if (viewRef && viewRef.value && viewRef.value.attributes && viewRef.value.attributes.sid
          // @ts-ignore
          && viewRef.value.attributes.sid == sid) {
          Native.callUIFunction(viewRef.value, 'suspend', [], (res) => {
          });
        }
      } catch (e) {
      }
    }
  }

  function unsuspend(context) {
    // @ts-ignore
    const sid = context.attrs?.sid ?? null
    console.log('slot: current slot sid:' + sid)
    if (!sid) {
      return
    }
    // @ts-ignore
    const routeViewRefList = routeViewList.value
    if (!routeViewRefList || routeViewRefList.length <= 0) {
      console.log('slot: slot list is null!')
      return;
    }
    for (let i = 0; i < routeViewRefList.length; i++) {
      try {
        const viewRef = routeViewRefList[i];
        console.log('slot: slot view ref ', viewRef)
        // @ts-ignore
        if (viewRef.value && viewRef.value.attributes && viewRef.value.attributes.sid
          // @ts-ignore
          && viewRef.value.attributes.sid == sid) {
          Native.callUIFunction(viewRef.value, 'unsuspend', [], (res) => {
          });
        }
      } catch (e) {
      }
    }
  }

  return {
    suspend,
    unsuspend,
  }
}
