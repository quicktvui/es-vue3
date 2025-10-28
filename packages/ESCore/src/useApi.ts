import { inject, InjectionKey } from "vue";
import { ES } from "./es/ES";
import { ESDevelop } from "./develop/ESDevelop";
import { ESToast } from "./toast/ESToast";
import { ESLocalStorage } from "./local/ESLocalStorage";
import { ESDevice } from "./device/ESDevice";
import { ESDisplay } from "./display/ESDisplay";
import { ESAppList } from "./app/ESAppList";
import { ESNetwork } from "./network/ESNetwork";
import { ESPower } from "./power/ESPower";
import { ESPermission } from "./permission/ESPermission";
import { ESUsbDevice } from "./usb/ESUsbDevice";
import { ESBroadcast } from "./broadcast/ESBroadcast";
import { ESAudio } from "./audio/ESAudio";
import { ESShareData } from "./share/ESShareData";
import { ESRuntime } from "./runtime/ESRuntime";
import { ESPlugin } from "./plugin/ESPlugin";
import { ESDownload } from "./download/ESDownload";
import { ESLog } from "./log/ESLog";
import { ESUpload } from "./upload/ESUpload";
import { ESActionBar } from "./actionbar/ESActionBar";
import { ESIAC } from "./iac/ESIAC";
import { ESLocation } from "./location/ESLocation";
import { ESFocus } from "./focus/ESFocus";
import { ESContentProvider } from "./provider/ESContentProvider";
import { ESXLog } from "./xlog/ESXLog";
import { ESLogUpload } from "./xlog/ESLogUpload";
import { ESEventBus } from "./eventbus/ESEventBus";
import { ESBrightness } from "./brightness/ESBrightness";
import { ESService } from "./service/ESService";
import { ESHLog } from "./hlog/ESHLog";
import { ESRouterManager } from "./router/ESRouterManager";
import { ESError } from "./error/ESError";
import { ESApp } from "@extscreen/es3-vue";
import { ESTheme } from "./theme";

export const ESLogKey = Symbol("ESLogKey") as InjectionKey<ESLog>;
export const ESHLogKey = Symbol("ESHLogKey") as InjectionKey<ESHLog>;
export const ESKey = Symbol("ESKey") as InjectionKey<ES>;
export const ESDevelopKey = Symbol("ESDevelopKey") as InjectionKey<ESDevelop>;
export const ESToastKey = Symbol("ESToastKey") as InjectionKey<ESToast>;
export const ESLocalStorageKey = Symbol("ESLocalStorageKey") as InjectionKey<ESLocalStorage>;
export const ESDeviceKey = Symbol("ESDeviceKey") as InjectionKey<ESDevice>;
export const ESDisplayKey = Symbol("ESDisplayKey") as InjectionKey<ESDisplay>;
export const ESAppListKey = Symbol("ESAppListKey") as InjectionKey<ESAppList>;
export const ESNetworkKey = Symbol("ESNetworkKey") as InjectionKey<ESNetwork>;
export const ESPowerKey = Symbol("ESPowerKey") as InjectionKey<ESPower>;
export const ESPermissionKey = Symbol("ESPermissionKey") as InjectionKey<ESPermission>;
export const ESUsbKey = Symbol("ESUsbKey") as InjectionKey<ESUsbDevice>;
export const ESBroadcastKey = Symbol("ESBroadcastKey") as InjectionKey<ESBroadcast>;
export const ESAudioKey = Symbol("ESAudioKey") as InjectionKey<ESAudio>;
export const ESShareDataKey = Symbol("ESShareDataKey") as InjectionKey<ESShareData>;
export const ESRuntimeKey = Symbol("ESRuntimeKey") as InjectionKey<ESRuntime>;
export const ESPluginKey = Symbol("ESPluginKey") as InjectionKey<ESPlugin>;
export const ESDownloadKey = Symbol("ESDownloadKey") as InjectionKey<ESDownload>;
export const ESUploadKey = Symbol("ESUploadKey") as InjectionKey<ESUpload>;
export const ESActionBarKey = Symbol("ESActionBarKey") as InjectionKey<ESActionBar>;
export const ESInterApplicationCommunicationKey = Symbol(
  "ESInterApplicationCommunicationKey",
) as InjectionKey<ESIAC>;
export const ESLocationKey = Symbol("ESLocationKey") as InjectionKey<ESLocation>;
export const ESFocusKey = Symbol("ESFocusKey") as InjectionKey<ESFocus>;
export const ESContentProviderKey = Symbol(
  "ESContentProviderKey",
) as InjectionKey<ESContentProvider>;
export const ESXLogKey = Symbol("ESXLogKey") as InjectionKey<ESXLog>;
export const ESLogUploadKey = Symbol("ESLogUploadKey") as InjectionKey<ESLogUpload>;

export const ESEventBusKey = Symbol("ESEventBusKey") as InjectionKey<ESEventBus>;
export const ESBrightnessKey = Symbol("ESBrightnessKey") as InjectionKey<ESBrightness>;
export const ESServiceKey = Symbol("ESServiceKey") as InjectionKey<ESService>;
export const ESErrorKey = Symbol("ESErrorKey") as InjectionKey<ESError>;

export const ESRouterManagerKey = Symbol("ESRouterManagerKey") as InjectionKey<ESRouterManager>;

export const ESAppKey = Symbol("ESAppKey") as InjectionKey<ESApp>;
export const ESThemeKey = Symbol("ESThemeKey") as InjectionKey<ESTheme>;

export function useES(): ES {
  return inject(ESKey)!;
}

export function useESDevelop(): ESDevelop {
  return inject(ESDevelopKey)!;
}

export function useESToast(): ESToast {
  return inject(ESToastKey)!;
}

export function useESLocalStorage(): ESLocalStorage {
  return inject(ESLocalStorageKey)!;
}

export function useESDevice(): ESDevice {
  return inject(ESDeviceKey)!;
}

export function useESDisplay(): ESDisplay {
  return inject(ESDisplayKey)!;
}

export function useESAppList(): ESAppList {
  return inject(ESAppListKey)!;
}

export function useESNetwork(): ESNetwork {
  return inject(ESNetworkKey)!;
}

export function useESPower(): ESPower {
  return inject(ESPowerKey)!;
}

export function useESPermission(): ESPermission {
  return inject(ESPermissionKey)!;
}

export function useESUsbDevice(): ESUsbDevice {
  return inject(ESUsbKey)!;
}

export function useESBroadcast(): ESBroadcast {
  return inject(ESBroadcastKey)!;
}

export function useESAudio(): ESAudio {
  return inject(ESAudioKey)!;
}

export function useESShareData(): ESShareData {
  return inject(ESShareDataKey)!;
}

export function useESRuntime(): ESRuntime {
  return inject(ESRuntimeKey)!;
}

export function useESPlugin(): ESPlugin {
  return inject(ESPluginKey)!;
}

export function useESDownload(): ESDownload {
  return inject(ESDownloadKey)!;
}

export function useESUpload(): ESUpload {
  return inject(ESUploadKey)!;
}

export function useESActionBar(): ESActionBar {
  return inject(ESActionBarKey)!;
}

export function useESLog(): ESLog {
  return inject(ESLogKey)!;
}

export function useESHLog(): ESHLog {
  return inject(ESHLogKey)!;
}

export function useESIAC(): ESIAC {
  return inject(ESInterApplicationCommunicationKey)!;
}

export function useESLocation(): ESLocation {
  return inject(ESLocationKey)!;
}

export function useESFocus(): ESFocus {
  return inject(ESFocusKey)!;
}

export function useESContentProvider(): ESContentProvider {
  return inject(ESContentProviderKey)!;
}

export function useESEventBus(): ESEventBus {
  return inject(ESEventBusKey)!;
}

export function useESXLog(): ESXLog {
  return inject(ESXLogKey)!;
}

export function useESLogUpload(): ESLogUpload {
  return inject(ESLogUploadKey)!;
}

export function useESBrightness(): ESBrightness {
  return inject(ESBrightnessKey)!;
}

export function useESService(): ESService {
  return inject(ESServiceKey)!;
}

export function useESRouterManager(): ESRouterManager {
  return inject(ESRouterManagerKey)!;
}

export function useESError(): ESError {
  return inject(ESErrorKey)!;
}

export function useESApp(): ESApp {
  return inject(ESAppKey)!;
}

export function useESTheme(): ESTheme {
  return inject(ESThemeKey)!;
}
