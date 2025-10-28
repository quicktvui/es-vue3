export interface ESPlayerVideoStream {
  type: string;
  codec_name: string;
  width: string;
  height: string;
  fps_den: string;
  fps_num: string;
  codec_level: string;
  codec_profile_id: string;
  codec_pixel_format: string;
  tbr_den: string;
  tbr_num: string;
  bitrate?: string;
  language?: string;
}

export interface ESPlayerAudioStream {
  type: string;
  codec_name: string;
  channel_layout: string;
  sample_rate: string;
  channels: string;
  language?: string;
  bitrate?: string;
  codec_level?: string;
  codec_pixel_format?: string;
  codec_profile_id?: string;
}

export interface ESPlayerTimedTextStream {
  type: string;
  codec_name: string;
  subType: string;
  language: string;
}

export interface ESPlayerMediaMeta {
  streams: Array<ESPlayerVideoStream | ESPlayerAudioStream | ESPlayerTimedTextStream>;
  format: string;
  duration_us: string;
  bitrate: string;
  timedtext: string;
  audio: string;
  video: string;
  start_us: string;
}
