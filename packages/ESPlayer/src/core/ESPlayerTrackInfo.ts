export interface ESPlayerTrackInfo {
  seekFlag?: boolean;
  trackType: number;
  language: string;
  id?: number;
  index: number;
  title: string;
  subType?: number;
  codec?: string;
  channels?: number;
  channelName?: string;
  videoWidth?: number;
  videoHeight?: number;
  isPlugin?: boolean;
  detectedLanguage?: string;
  resourceID?: string;
}
