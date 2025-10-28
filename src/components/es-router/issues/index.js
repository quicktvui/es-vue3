import es_router_issue_one_page from "./es-router-issue-one-page";
import es_router_issue_one_dialog_page from "./es-router-issue-one-dialog-page";
import { ESRouteLaunchMode, ESRouteType } from "@extscreen/es3-router";

const ESRouterIssuesPageList = {
  es_router_issue_one_page: {
    name: "场景一：页面",
    component: es_router_issue_one_page,
    type: ESRouteType.ES_ROUTE_TYPE_PAGE,
    launchMode: ESRouteLaunchMode.ES_ROUTE_LAUNCH_MODE_STANDARD,
  },
  es_router_issue_one_dialog_page: {
    name: "场景一：弹窗",
    component: es_router_issue_one_dialog_page,
    type: ESRouteType.ES_ROUTE_TYPE_DIALOG,
    launchMode: ESRouteLaunchMode.ES_ROUTE_LAUNCH_MODE_STANDARD,
  },
};
export default ESRouterIssuesPageList;
