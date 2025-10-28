export interface ESPlayerCache {

  useCache?: boolean,
  clearByTime?: boolean,
  clearBySize?: boolean,
  clearByNumber?: boolean,
  expireTime?: number,
  maxCacheSize?: number,
  maxComNum?: number,
  maxInComNum?: number,
  connTimeOut?: number,
  readTimeOut?: number

  [prop: string]: any
}
