import es_nav_start_page from "./es-nav-start-page";
import es_nav_js_view_page from "./es-nav-js-view-page";
import es_nav_slot_page from "./es-nav-slot-page";
import es_nav_router_page from "./es-nav-router-page";
import es_nav_flex_page from "./es-nav-flex-page";
import es_nav_dialog_page from "./es-nav-dialog-page";
import es_nav_lifecycle_page from "./es-nav-lifecycle-page";
import es_nav_module_page from "./es-nav-module-page";
import es_nav_log_page from "./es-nav-log-page";
import es_nav_key_page from "./es-nav-key-page";
import es_nav_network_page from "./es-nav-network-page";
import es_nav_video_player_page from "./es-nav-video-player-page";
import es_nav_ad_player_page from "./es-nav-ad-player-page";
import es_nav_player_manager_page from "./es-nav-player-manager-page";
import es_nav_audio_player_page from "./es-nav-audio-player-page";
import es_nav_audio_service_player_page from "./es-nav-audio-service-player-page";
import es_nav_sound_pool_player_page from "./es-nav-sound-pool-player-page";
import es_nav_xlog_page from "./es-nav-xlog-page";
import es_nav_eventbus_page from "./es-nav-eventbus-page";
import es_nav_ul_page from "./es-nav-ul-page";
import es_nav_component_page from "./es-nav-component-page";
import es_nav_utils_page from "./es-nav-utils-page";
import es_nav_dynamic_import_page from "./es-nav-dynamic-import-page";
import es_nav_animation_page from "./es-nav-animation-page";

//
import qt_nav_module_page from "./qt-nav-module-page";
import qt_nav_component_page from "./qt-nav-component-page";

import es_nav_hlog_page from "./es-nav-hlog-page";
import es_nav_worker_page from "./es-nav-worker-page";

import es_nav_axios_page from "./es-nav-axios-page";

import es_nav_local_server_page from "./es-nav-local-server-page";
import es_nav_style_page from "./es-nav-style-page";
import es_nav_theme_page from "./es-nav-theme-page";
import es_nav_css_page from "./es-nav-css-page";

const ESAPINavPageList = {
  es_nav_start_page: {
    name: "起步",
    component: es_nav_start_page,
  },
  es_nav_style_page: {
    name: "style",
    component: es_nav_style_page,
  },
  es_nav_css_page: {
    name: "Css",
    component: es_nav_css_page,
  },
  es_nav_theme_page: {
    name: "theme",
    component: es_nav_theme_page,
  },
  es_nav_module_page: {
    name: "扩展模块",
    component: es_nav_module_page,
  },
  qt_nav_module_page: {
    name: "扩展模块（qt 调用）",
    component: qt_nav_module_page,
  },
  es_nav_component_page: {
    name: "组件",
    component: es_nav_component_page,
  },
  qt_nav_component_page: {
    name: "组件（qt 调用）",
    component: qt_nav_component_page,
  },
  es_nav_flex_page: {
    name: "布局",
    component: es_nav_flex_page,
  },
  es_nav_lifecycle_page: {
    name: "页面生命周期",
    component: es_nav_lifecycle_page,
  },
  es_nav_dialog_page: {
    name: "弹窗",
    component: es_nav_dialog_page,
  },
  es_nav_router_page: {
    name: "页面路由",
    component: es_nav_router_page,
  },
  es_nav_log_page: {
    name: "日志",
    component: es_nav_log_page,
  },
  es_nav_key_page: {
    name: "按键",
    component: es_nav_key_page,
  },
  es_nav_network_page: {
    name: "网络",
    component: es_nav_network_page,
  },
  es_nav_sound_pool_player_page: {
    name: "SoundPool播放器",
    component: es_nav_sound_pool_player_page,
  },
  es_nav_audio_player_page: {
    name: "音频播放器",
    component: es_nav_audio_player_page,
  },
  es_nav_audio_service_player_page: {
    name: "音频播放服务",
    component: es_nav_audio_service_player_page,
  },
  es_nav_video_player_page: {
    name: "视频播放器",
    component: es_nav_video_player_page,
  },
  es_nav_ad_player_page: {
    name: "广告播放器",
    component: es_nav_ad_player_page,
  },
  es_nav_player_manager_page: {
    name: "播放管理器",
    component: es_nav_player_manager_page,
  },
  es_nav_eventbus_page: {
    name: "EventBus",
    component: es_nav_eventbus_page,
  },
  es_nav_xlog_page: {
    name: "xlog日志",
    component: es_nav_xlog_page,
  },
  es_nav_ul_page: {
    name: "ul-列表模块",
    component: es_nav_ul_page,
  },
  es_nav_utils_page: {
    name: "工具",
    component: es_nav_utils_page,
  },
  es_nav_js_view_page: {
    name: "JSView",
    component: es_nav_js_view_page,
  },
  es_nav_hlog_page: {
    name: "hlog日志",
    component: es_nav_hlog_page,
  },
  es_nav_worker_page: {
    name: "Worker",
    component: es_nav_worker_page,
  },
  es_nav_dynamic_import_page: {
    name: "DynamicImport",
    component: es_nav_dynamic_import_page,
  },
  es_nav_axios_page: {
    name: "Axios",
    component: es_nav_axios_page,
  },
  es_nav_local_server_page: {
    name: "安卓本地服务",
    component: es_nav_local_server_page,
  },
  es_nav_animation_page: {
    name: "Animation",
    component: es_nav_animation_page,
  },
  es_nav_slot_page: {
    name: "Slot",
    component: es_nav_slot_page,
  },
};

export default ESAPINavPageList;
