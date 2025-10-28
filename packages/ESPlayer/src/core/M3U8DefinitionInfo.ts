export const HLS_ADAPTIVE_NUMBER = -2;
export enum TrackType {
  // 视频
  VIDEO = 1,
  // 音频
  AUDIO = 2,
  // 字幕
  SUBTITLE = 3,
}

export enum SubType {
  // 图形
  GRAPH = 0,
  // 文本
  TEXT = 1,
}

export interface M3U8DefinitionInfo {
  id: number;
  streams: Array<StreamInfo>;
}

export interface StreamInfo {
  id?: number;
  index: number;
  trackType: TrackType;
  language: string;
  title: string;
  codec: string;
  // 视频
  videoWidth?: number;
  videoHeight?: number;
  // 音频
  channels?: number;
  channelName?: string;
  // 字幕
  subType?: SubType;
}
