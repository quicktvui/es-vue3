//
import "./views/css/es-sdk-css.css";
import BuildConfig from "./build/BuildConfig";
//--------------------router-----------------------
import routes from "./routes.ts";
//--------------------ESApp-----------------------
import {ESApp} from "@extscreen/es3-vue";
import application from "./App.vue";
//---------------------------------------------------------------------------
import {createESApp, ESAppContext} from "@extscreen/es3-core";
import {install} from "./components";
//---------------------------------------------------------------------------
import {createESSlot, createESRouter, Router} from "@extscreen/es3-router";

//
let router: Router;
if (BuildConfig.enableSlotView) {
  const routerOptions = {
    routes: routes,
  };
  router = createESSlot(routerOptions);
} else {
  const routerOptions = {
    main: "splash",
    error: "error",
    limit: 3,
    routes: routes,
  };
  router = createESRouter(routerOptions);
}
//---------------------------------------------------------------------------
const app: ESAppContext = createESApp(application, router, {
  debug: false,
  styleOptions: {
    ratioBaseWidth: 1920,
  },
});

app.use(install);
console.log("createESApp:", app);

//---------------------------------主题相关-----------------------------------------
const themeManager = app.theme;
themeManager.registerTheme("light", {
  "--primary-color": "#9890ff",
  "--text-color": "#000000",
  "--bg-color": "#ffffff",
  "--divider-color": "#40b883",
});

themeManager.registerTheme("dark", {
  "--primary-color": "#ff4d4f",
  "--text-color": "red",
  "--bg-color": "#1f1f1f",
  "--divider-color": "#91b200",
});
themeManager.setTheme("light");
//---------------------------------------------------------------------------
//
import {ESComponent} from "@extscreen/es3-component";

app.use(ESComponent);
//---------------------------------------------------------------------------
import slotViewComponent from "./components/es-slot/ESSlotViewComponent";

app.component("es-slot-view", slotViewComponent);
//
import {createESPlayer} from "@extscreen/es3-player";

const player = createESPlayer();
app.use(player);

//---------------------------------------------------------------------------
import {createESPlayerManager} from "@extscreen/es3-player-manager";

const playerManager = createESPlayerManager();
app.use(playerManager);
//---------------------------------------------------------------------------
import {createESVideoPlayer} from "@extscreen/es3-video-player";

const videoPlayer = createESVideoPlayer();
app.use(videoPlayer);
//---------------------------------------------------------------------------
import {createESAudioPlayer} from "@extscreen/es3-audio-player";

const audioPlayer = createESAudioPlayer();
app.use(audioPlayer);

//---------------------------------------------------------------------------
import {createESAudioServicePlayer} from "@extscreen/es3-audio-service-player";

const audioServicePlayer = createESAudioServicePlayer();
app.use(audioServicePlayer);
//---------------------------------------------------------------------------
import {createESSoundPoolPlayer} from "@extscreen/es3-soundpool-player";

const soundPlayer = createESSoundPoolPlayer();
app.use(soundPlayer);
//---------------------------------------------------------------------------
import {createESADPlayer} from "@extscreen/es3-ad-player";

const ADPlayer = createESADPlayer();
app.use(ADPlayer);
//---------------------------------------------------------------------------

import "@quicktvui/quicktvui3/dist/index.css";
import {QuickTVUI} from "@quicktvui/quicktvui3";

app.use(QuickTVUI);
