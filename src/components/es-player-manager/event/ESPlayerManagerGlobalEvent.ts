/**
 * 全局播放事件监听
 */
import { ESPlayerManagerEventDefaultListener } from "@extscreen/es3-player-manager";

class ESPlayerManagerGlobalEvent extends ESPlayerManagerEventDefaultListener {
  onPlayerCompleted() {}
}

export default new ESPlayerManagerGlobalEvent();
