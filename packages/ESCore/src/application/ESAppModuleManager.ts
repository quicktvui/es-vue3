import { ESApp } from "@extscreen/es3-vue";
import { createES, ES } from "../es/ES";
import { createESDevelop, ESDevelop } from "../develop/ESDevelop";
import { createESToast, ESToast } from "../toast/ESToast";
import { createESLocalStorage, ESLocalStorage } from "../local/ESLocalStorage";
import { createESDisplay, ESDisplay } from "../display/ESDisplay";
import { createESDevice, ESDevice } from "../device/ESDevice";
import { createESNetwork, ESNetwork } from "../network/ESNetwork";
import { createESAppList, ESAppList } from "../app/ESAppList";
import { createESPower, ESPower } from "../power/ESPower";
import { createESPermission, ESPermission } from "../permission/ESPermission";
import { createESUsbDevice, ESUsbDevice } from "../usb/ESUsbDevice";
import { createESBroadcast, ESBroadcast } from "../broadcast/ESBroadcast";
import { createESAudio, ESAudio } from "../audio/ESAudio";
import { createESShareData, ESShareData } from "../share/ESShareData";
import { createESRuntimeDevice, ESRuntime } from "../runtime/ESRuntime";
import { createESPlugin, ESPlugin } from "../plugin/ESPlugin";
import { createESDownload, ESDownload } from "../download/ESDownload";
import { createESLog, ESLog } from "../log/ESLog";
import { createESHLog, ESHLog } from "../hlog/ESHLog";
import { createESUpload, ESUpload } from "../upload/ESUpload";
import { createESActionBar, ESActionBar } from "../actionbar/ESActionBar";
import { createESIAC, ESIAC } from "../iac/ESIAC";
import { createESLocation, ESLocation } from "../location/ESLocation";
import { createESFocus, ESFocus } from "../focus/ESFocus";
import { createESContentProvider, ESContentProvider } from "../provider/ESContentProvider";
import { createESEventBus, ESEventBus } from "../eventbus/ESEventBus";
import { createESXLog, ESXLog } from "../xlog/ESXLog";
import { createESLogUpload, ESLogUpload } from "../xlog/ESLogUpload";
import { createESBrightness, ESBrightness } from "../brightness/ESBrightness";
import { createESService, ESService } from "../service/ESService";
import { createESError, ESError } from "../error/ESError";
import { createESTheme, ESTheme } from "../theme/ESTheme";

import { App } from "vue";

export interface ESAppModuleManager {
  install(app: App): void;

  init(app: ESApp): Promise<any>;
}

//ESLog
export const log: ESLog = createESLog();
//ESHLog
export const hLog: ESHLog = createESHLog();
//ESManager
export const es: ES = createES();
//ESDevelop
export const develop: ESDevelop = createESDevelop();
//ESToast
export const toast: ESToast = createESToast();
//ESLocalStorage
export const storage: ESLocalStorage = createESLocalStorage();
//ESDevice
export const device: ESDevice = createESDevice();
//ESDisplay
export const display: ESDisplay = createESDisplay();
//ESNetwork
export const network: ESNetwork = createESNetwork();
//ESAppList
export const appList: ESAppList = createESAppList();
//ESPower
export const power: ESPower = createESPower();
//ESPermission
export const permission: ESPermission = createESPermission();
//ESUsbDevice
export const usbDevice: ESUsbDevice = createESUsbDevice();
//ESBroadcast
export const broadcast: ESBroadcast = createESBroadcast();
//ESAudio
export const audio: ESAudio = createESAudio();
//ESShareData
export const shareData: ESShareData = createESShareData();
//ESRuntimeDevice
export const runtime: ESRuntime = createESRuntimeDevice();
//ESPlugin
export const plugin: ESPlugin = createESPlugin();
//ESDownload
export const download: ESDownload = createESDownload();
//ESUpload
export const upload: ESUpload = createESUpload();
//ESActionBar
export const actionBar: ESActionBar = createESActionBar();
//ESIAC
export const iac: ESIAC = createESIAC();
//ESLocation
export const location: ESLocation = createESLocation();
//ESFocus
export const focus: ESFocus = createESFocus();
//ESContentProvider
export const provider: ESContentProvider = createESContentProvider();
//ESEventBus
export const eventBus: ESEventBus = createESEventBus();
//ESXLog
export const xlog: ESXLog = createESXLog();
//ESXLogUpload
export const logUpload: ESLogUpload = createESLogUpload();
//ESBrightness
export const brightness: ESBrightness = createESBrightness();
//ESService
export const service: ESService = createESService();
//ESError
export const error: ESError = createESError();
//ESTheme
export const theme: ESTheme = createESTheme();

export function createESAppModuleManager(): ESAppModuleManager {
  function install(app: App) {
    app.use(log);
    app.use(hLog);
    app.use(es);
    app.use(develop);
    app.use(toast);
    app.use(storage);
    app.use(device);
    app.use(display);
    app.use(network);
    app.use(appList);
    app.use(power);
    app.use(permission);
    app.use(usbDevice);
    app.use(broadcast);
    app.use(audio);
    app.use(shareData);
    app.use(runtime);
    app.use(plugin);
    app.use(download);
    app.use(upload);
    app.use(actionBar);
    app.use(iac);
    app.use(location);
    app.use(focus);
    app.use(provider);
    app.use(eventBus);
    app.use(xlog);
    app.use(logUpload);
    app.use(brightness);
    app.use(service);
    app.use(error);
    app.use(theme);

    Object.assign(app, {
      log: log,
      hLog: hLog,
      es: es,
      develop: develop,
      toast: toast,
      storage: storage,
      device: device,
      display: display,
      network: network,
      appList: appList,
      power: power,
      permission: permission,
      usbDevice: usbDevice,
      broadcast: broadcast,
      audio: audio,
      shareData: shareData,
      runtime: runtime,
      plugin: plugin,
      download: download,
      upload: upload,
      actionBar: actionBar,
      iac: iac,
      location: location,
      focus: focus,
      provider: provider,
      eventBus: eventBus,
      xlog: xlog,
      logUpload: logUpload,
      brightness: brightness,
      service: service,
      error: error,
      theme: theme,
    });
  }

  function init(app: ESApp): Promise<any> {
    return Promise.resolve()
      .then(() => es.init())
      .then(() => device.init())
      .then(() => develop.init())
      .then(() =>
        Promise.all([
          usbDevice.init(),
          permission.init(),
          power.init(),
          appList.init(),
          network.init(),
          toast.init(),
          display.init(device),
          storage.init(es),
          audio.init(),
          shareData.init(es),
          runtime.init(es, plugin),
          plugin.init(),
          download.init(),
          upload.init(),
          log.init(),
          hLog.init(),
          actionBar.init(),
          iac.init(es, log),
          location.init(shareData),
          focus.init(),
          provider.init(),
          eventBus.init(),
          service.init(),
          error.__init(toast),
          theme.init(),
        ]),
      );
  }

  const manager: ESAppModuleManager = {
    install,
    init,
  };
  return manager;
}
