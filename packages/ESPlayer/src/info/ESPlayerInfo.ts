export interface ESPlayerInfo {
  id?: string;
  infoCode?: number;
  infoMessage?: string;
  infoType?: number;

  [prop: string]: any;
}

export enum ESPlayerInfoCode {
  MEDIA_INFO_AUDIO_DATA_SWITCH_COMPLETE = 10101,
  MEDIA_INFO_VIDEO_DATA_SWITCH_COMPLETE = 10102,
  MEDIA_INFO_AUDIO_RENDER_SWITCH_COMPLETE = 10103,
  MEDIA_INFO_VIDEO_RENDER_SWITCH_COMPLETE = 10104,
  MEDIA_INFO_MULTIPLE_HLS_FIRST_CHOOSE = 10105,
}
