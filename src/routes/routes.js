// Univision-Network-portal
import UnivisionLanding from "../dash-univision/UnivisionLanding";
import UnivisionOrderManagement from "../dash-univision/univsion-agg-campaign/pages/OrderManagementLanding";
import UnivisionNetworkLogs from "../dash-univision/univision-network-logs/UnivisionNetworkLogs";
import ManageAudienceLanding from "../dash-univision/manage-audience/ManageAudienceLanding";
import CreateNewAudience from "../dash-univision/manage-audience/components/CreateNewAudience";
import SelectFilters from "../dash-univision/manage-audience/components/SelectFilters";
import ViewAudience from "../dash-univision/manage-audience/components/ViewAudience";
import ForecastLanding from "../dash-univision/forecasting/ForecastLanding";
import ViewSchedulesLanding from "../dash-univision/view-schedules/ViewSchedules";
import UnivisionEdiTable from "../dash-univision/advertiser-schedule/";
import UnivisionManageNetwork from "../dash-univision/network-manage-channels/NetworkManageChannels";
import UnivisionReviewCreatives from "../dash-univision/creatives/creatives-review/ReviewCreatives";
import UnivisionManageCreatives from "../dash-univision/creatives/creatives-manage/ManageCreatives";
import UnivisionCreativesWatermarkApproval from "../dash-univision/creatives/creatives-watermark-approval/CreativesWatermarkApproval";
import UnivisionCampaignLandingPage from "../dash-univision/univsion-agg-campaign/pages/UnivsionCampaignLandingPage";
import AggCampaign from "../dash-univision/univsion-agg-campaign/agg-build-campaign/AggCampaign";
import UnivisionManageCampaigns from "../dash-univision/manage-campaigns/UnivisionManageCampaigns";
import UnivisionReportsLanding from "../dash-univision/reporting/ReportsLanding";
import UnivisionReportsPacing from "../dash-univision/reporting/reports-pacing/ReportsPacing";
import ReportsPostCampaign from "../dash-univision/reporting/reports-post-campaign/ReportsPostCampaigns";
import ReportsPostCampaignDaypart from "../dash-univision/reporting/reports-post-campaign-daypart-reports/ReportsPostCampaignDaypart";
import UnivisionReportsCtvLogs from "../dash-univision/reporting/reports-ctv-logs/ReportsCtvLogs";
import ReportsLanding from "../dash-univision/reporting/ReportsLanding";
import UnivisionAdministration from "../dash-univision/administration/Administartion";
import UnivisionPingReports from "../dash-univision/tv-ping-reports/PingReports";
import AggVeiwDetailsPage from "../dash-univision/univsion-agg-campaign/agg-view-details/AggViewDetails";
import AggAddTargetPage from "../dash-univision/univsion-agg-campaign/agg-add-new-orderline/AggAddNewOrderline";
import Forecast from "../dash-univision/forecasting/buildForecast";
import manageForecast from "../dash-univision/forecasting/manageForecasting";
import ManagePool from "../dash-univision/manage-ad-pool/ManagePool";
import UploadAdPool from "../dash-univision/manage-ad-pool/upload-ad-pool/UploadAdPool";
import ViewPool from "../dash-univision/manage-ad-pool/view-manage-ad-pool/ViewPool";
import UnivisionAddressableInventory from "../dash-univision/view-schedules/view-addressable-inventory/AddressableInventory";
import UnivisionAddressableLogs from "../dash-univision/view-schedules/view-schedule/ViewSchedulesLogs";
import CampaignDrafts from "../dash-univision/univsion-agg-campaign/agg-campaign-drafts/CampaignDrafts";

const UnivsionAdminRoutes = [
  {
    path: "dash.univisionLanding",
    url: "/univision-network-admin/landing",
    name: "Univsion Landing page",
    roles: "Network Admin",
    component: UnivisionLanding,
  },
];

const routes = [...UnivsionAdminRoutes];

export default routes;
