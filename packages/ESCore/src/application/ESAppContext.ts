import { ESApp } from "@extscreen/es3-vue";
import { ESTheme } from "../theme";
import { ESLog } from "../log";
import { ESHLog } from "../hlog";
import { ES } from "../es";
import { ESDevelop } from "../develop";
import { ESToast } from "../toast";
import { ESLocalStorage } from "../local";
import { ESDevice } from "../device";
import { ESDisplay } from "../display";
import { ESNetwork } from "../network";
import { ESAppList } from "../app";
import { ESPower } from "../power";
import { ESPermission } from "../permission";
import { ESUsbDevice } from "../usb";
import { ESBroadcast } from "../broadcast";
import { ESAudio } from "../audio";
import { ESShareData } from "../share";
import { ESRuntime } from "../runtime";
import { ESPlugin } from "../plugin";
import { ESDownload } from "../download";
import { ESUpload } from "../upload";
import { ESActionBar } from "../actionbar";
import { ESIAC } from "../iac";
import { ESLocation } from "../location";
import { ESFocus } from "../focus";
import { ESContentProvider } from "../provider";
import { ESEventBus } from "../eventbus";
import { ESLogUpload, ESXLog } from "../xlog";
import { ESBrightness } from "../brightness";
import { ESService } from "../service";
import { ESError } from "../error";

export interface ESAppContext extends ESApp {
  //ESLog
  log: ESLog;
  //ESHLog
  hLog: ESHLog;
  //ESManager
  es: ES;
  //ESDevelop
  develop: ESDevelop;
  //ESToast
  toast: ESToast;
  //ESLocalStorage
  storage: ESLocalStorage;
  //ESDevice
  device: ESDevice;
  //ESDisplay
  display: ESDisplay;
  //ESNetwork
  network: ESNetwork;
  //ESAppList
  appList: ESAppList;
  //ESPower
  power: ESPower;
  //ESPermission
  permission: ESPermission;
  //ESUsbDevice
  usbDevice: ESUsbDevice;
  //ESBroadcast
  broadcast: ESBroadcast;
  //ESAudio
  audio: ESAudio;
  //ESShareData
  shareData: ESShareData;
  //ESRuntimeDevice
  runtime: ESRuntime;
  //ESPlugin
  plugin: ESPlugin;
  //ESDownload
  download: ESDownload;
  //ESUpload
  upload: ESUpload;
  //ESActionBar
  actionBar: ESActionBar;
  //ESIAC
  iac: ESIAC;
  //ESLocation
  location: ESLocation;
  //ESFocus
  focus: ESFocus;
  //ESContentProvider
  provider: ESContentProvider;
  //ESEventBus
  eventBus: ESEventBus;
  //ESXLog
  xlog: ESXLog;
  //ESXLogUpload
  logUpload: ESLogUpload;
  //ESBrightness
  brightness: ESBrightness;
  //ESService
  service: ESService;
  //ESError
  error: ESError;
  //ESTheme
  theme: ESTheme;
}
