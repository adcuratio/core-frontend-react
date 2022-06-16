//import Reports from "../reports/Reports";
import UnivisionLanding from "../dash-univision /UnivisionLanding";
// Univision-Network-portal
// import UnivisionOrderManagement from "../dash-univision/univsion-agg-campaign/pages/OrderManagementLanding";
// import UnivisionNetworkLogs from "../dash-univision/univision-network-logs/UnivisionNetworkLogs";
// import ManageAudienceLanding from "../dash-univision/manage-audience/ManageAudienceLanding";
// import CreateNewAudience from "../dash-univision/manage-audience/components/CreateNewAudience";
// import SelectFilters from "../dash-univision/manage-audience/components/SelectFilters";
// import ViewAudience from "../dash-univision/manage-audience/components/ViewAudience";
// import ForecastLanding from "../dash-univision/forecasting/ForecastLanding";
import ViewSchedulesLanding from "../dash-univision /view-schedules/ViewSchedules";
// import UnivisionEdiTable from "../dash-univision/advertiser-schedule/";
// import UnivisionManageNetwork from "../dash-univision/network-manage-channels/NetworkManageChannels";
// import UnivisionReviewCreatives from "../dash-univision/creatives/creatives-review/ReviewCreatives";
// import UnivisionManageCreatives from "../dash-univision/creatives/creatives-manage/ManageCreatives";
// import UnivisionCreativesWatermarkApproval from "../dash-univision/creatives/creatives-watermark-approval/CreativesWatermarkApproval";
// import UnivisionCampaignLandingPage from "../dash-univision/univsion-agg-campaign/pages/UnivsionCampaignLandingPage";
// import AggCampaign from "../dash-univision/univsion-agg-campaign/agg-build-campaign/AggCampaign";
// import UnivisionManageCampaigns from "../dash-univision/manage-campaigns/UnivisionManageCampaigns";
// import UnivisionReportsLanding from "../dash-univision/reporting/ReportsLanding";
// import UnivisionReportsPacing from "../dash-univision/reporting/reports-pacing/ReportsPacing";
// import ReportsPostCampaign from "../dash-univision/reporting/reports-post-campaign/ReportsPostCampaigns";
// import ReportsPostCampaignDaypart from "../dash-univision/reporting/reports-post-campaign-daypart-reports/ReportsPostCampaignDaypart";
// import UnivisionReportsCtvLogs from "../dash-univision/reporting/reports-ctv-logs/ReportsCtvLogs";
// import ReportsLanding from "../dash-univision/reporting/ReportsLanding";
// import UnivisionAdministration from "../dash-univision/administration/Administartion";
// import UnivisionPingReports from "../dash-univision/tv-ping-reports/PingReports";
// import AggVeiwDetailsPage from "../dash-univision/univsion-agg-campaign/agg-view-details/AggViewDetails";
// import AggAddTargetPage from "../dash-univision/univsion-agg-campaign/agg-add-new-orderline/AggAddNewOrderline";
// import Forecast from "../dash-univision/forecasting/buildForecast";
// import manageForecast from "../dash-univision/forecasting/manageForecasting";
// import ManagePool from "../dash-univision/manage-ad-pool/ManagePool";
// import UploadAdPool from "../dash-univision/manage-ad-pool/upload-ad-pool/UploadAdPool";
// import ViewPool from "../dash-univision/manage-ad-pool/view-manage-ad-pool/ViewPool";
// import UnivisionAddressableInventory from "../dash-univision/view-schedules/view-addressable-inventory/AddressableInventory";
// import UnivisionAddressableLogs from "../dash-univision/view-schedules/view-schedule/ViewSchedulesLogs";
// import CampaignDrafts from "../dash-univision/univsion-agg-campaign/agg-campaign-drafts/CampaignDrafts";

import About from "../temp-data/tempAbout";
import Delay from "../temp-data/tempDelay";
import Homes from "../temp-data/temPHome";
import Loader from "../temp-data/tempLoader";
import Order from "../temp-data/tempOrder";

// Xandr
// import XandrLanding from "../dash-xandr/XandrLanding";
// import XandrCreatives from "../dash-xandr/manage-creatives/ManageCreatives";
// import XandrSegmentFiles from "../dash-xandr/segment-files/SegmentFiles";
// import XandrManageOrders from "../dash-xandr/manage-orders/ManageOrders";
// import XandrPostLogs from "../dash-xandr/post-logs/XandrPostLogs";

// Vizio-Portal
// import VizioLanding from "../dash-vizio/VizioLanding";
// import VizioManageOrders from "../dash-vizio/manage-orders/ManageOrders";
// import VizioTargetSegments from "../dash-vizio/target-files/TargetSegments";
// import VizioReviewCreatives from "../dash-vizio/creatives/creatives-review/ReviewCreatives";
// import VizioCreativesWatermarkApproval from "../dash-vizio/creatives/creatives-watermark-approval/CreativesWatermarkApproval";

// CBS-Network-portal
// import CbsLanding from "../dash-cbs/CBSLanding";
// import CBSNetworkLogs from "../dash-cbs/cbs-network-logs/CBSNetworkLogs";
// import CbsNetworkAdvertiserSchedule from "../dash-cbs/advertiser-schedule";
// import CbsManageChannels from "./dash-cbs/network-manage-channels/NetworkManageChannels";
// import CbsReviewCreatives from "../dash-cbs/creatives/creatives-review/ReviewCreatives";
// import CbsManageCreatives from "../dash-cbs/creatives/creatives-manage/ManageCreatives";
// import CbsCreativesWatermarkApproval from "../dash-cbs/creatives/creatives-watermark-approval/CreativesWatermarkApproval";
// import CbsPingReports from "../dash-cbs/tv-ping-reports/PingReports";

const UnivsionAdminRoutes = [
  {
    path: "univision-network-admin/landing",
    name: "Univsion Landing page",
    roles: "Network Admin",
    component: UnivisionLanding,
  },
  {
    path: "univision/view-schedules",
    name: "Univsion View Schedules",
    roles: "Network Admin",
    component: ViewSchedulesLanding,
  },
];

// const XandrAdminRoutes = [
//   {
//     path: "dash.xandrLanding",
//     url: "/xandr-distributor-admin/landing",
//     name: "Xandr Landing page",
//     roles: "",
//     component: XandrLanding,
//   },
//   {
//     path: "dash.xandrCreatives",
//     url: "/xandr-distributor-admin/manage-creatives",
//     name: "",
//     roles: "",
//     component: XandrCreatives,
//   },
//   {
//     path: "dash.xandrSegmentFiles",
//     url: "/xandr-distributor-admin/segment-files",
//     name: "",
//     roles: "",
//     component: XandrSegmentFiles,
//   },
//   {
//     path: "dash.xandrManageOrders",
//     url: "/xandr-distributor-admin/manage-orders",
//     name: "",
//     roles: "",
//     component: XandrManageOrders,
//   },
//   {
//     path: "dash.xandrPostLogs",
//     url: "/xandr-distributor-admin/post-logs",
//     name: "",
//     roles: "",
//     component: XandrPostLogs,
//   },
//   {
//     path: "dash.xandrBillingReports",
//     url: "/xandr-distributor-admin/billing-reports",
//     name: "",
//     roles: "",
//     component: Reports,
//   },
//   {
//     path: "dash.xandrBillingTrends",
//     url: "/xandr-distributor-admin/billing-trends",
//     name: "",
//     roles: "",
//     component: Reports,
//   },
//   {
//     path: "dash.xandrCampaignReports",
//     url: "/xandr-distributor-admin/campaign-reports",
//     name: "",
//     roles: "",
//     component: Reports,
//   },
// ];

// const VizioAdminRoutes = [
//   {
//     path: "dash.vizioLanding",
//     url: "/vizio-distributor-admin/landing",
//     name: "Vizio Landing page",
//     roles: "",
//     component: VizioLanding,
//   },
//   {
//     path: "dash.vizioManageOrders",
//     url: "/vizio-distributor-admin/manage-orders",
//     name: "",
//     roles: "",
//     component: VizioManageOrders,
//   },
//   {
//     path: "dash.vizioTargetSegments",
//     url: "/vizio-distributor-admin/target-segments",
//     name: "",
//     roles: "",
//     component: VizioTargetSegments,
//   },
//   {
//     path: "dash.vizioReviewCreatives",
//     url: "/vizio-admin/review-creatives",
//     name: "",
//     roles: "",
//     component: VizioReviewCreatives,
//   },
//   {
//     path: "dash.vizioCreativesWatermarkApproval",
//     url: "/vizio-admin/creatives-watermark-approval",
//     name: "",
//     roles: "",
//     component: VizioCreativesWatermarkApproval,
//   },
// ];

// const CbsAdminRoutes = [
//   {
//     path: "dash.cbsNetworkLanding",
//     url: "/cbs-admin/ncm-landing",
//     name: "CBS Landing page",
//     roles: "",
//     component: CbsLanding,
//   },
//   {
//     path: "dash.cbsAddTraffickingPlan",
//     url: "/cbs-admin/network-logs",
//     name: "",
//     roles: "",
//     component: CBSNetworkLogs,
//   },
//   {
//     path: "dash.cbsNetworkEdiTable",
//     url: "/cbs-admin/edi-list",
//     name: "",
//     roles: "",
//     component: CbsNetworkAdvertiserSchedule,
//   },
//   {
//     path: "dash.cbsManageChannels",
//     url: "/cbs-admin/networks",
//     name: "",
//     roles: "",
//     component: CbsManageChannels,
//   },
//   {
//     path: "dash.cbsReviewCreatives",
//     url: "/cbs-admin/review-creatives",
//     name: "",
//     roles: "",
//     component: CbsReviewCreatives,
//   },
//   {
//     path: "dash.cbsManageCreatives",
//     url: "/cbs-admin/manage-creatives",
//     name: "",
//     roles: "",
//     component: CbsManageCreatives,
//   },
//   {
//     path: "dash.cbsCreativesWatermarkApproval",
//     url: "/cbs-admin/creatives-watermark-approval",
//     name: "",
//     roles: "",
//     component: CbsCreativesWatermarkApproval,
//   },
//   {
//     path: "dash.cbsPingReports",
//     url: "/cbs-admin/tv-ping-reports",
//     name: "",
//     roles: "",
//     component: CbsPingReports,
//   },
//   {
//     path: "dash.cbsDeliveryReports",
//     url: "/cbs-admin/delivery-reports",
//     name: "",
//     roles: "",
//     component: Reports,
//   },
//   {
//     path: "dash.cbsCampaignTvPingReports",
//     url: "/cbs-admin/campaign-tv-ping",
//     name: "",
//     roles: "",
//     component: Reports,
//   },
// ];

//const routes = [...UnivsionAdminRoutes];

export const routes = [...UnivsionAdminRoutes];
