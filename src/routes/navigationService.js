import React from "react";
import { useNavigate } from "react-router-dom";

export default class NavigationService {
  constructor(navigate) {
    navigate = useNavigate();
  }

  goToLogin() {
    navigate("/login");
  }
  goToUpdatePwd() {
    navigate("/dash.updatepwd");
  }

  goToForgotPassword() {
    navigate("/forgotPasswordForm");
  }
  goToAggEDICalendar() {
    navigate("/dash.aggEDICalendar");
  }

  goToUploadCreatives() {
    navigate("/dash.uploadCreatives");
  }

  goToMsgVisualization() {
    navigate("/dash.msgVisualization");
  }
  goToViewSegmentsCount() {
    navigate("/dash.viewSegmentsCount");
  }

  goToCreateTradeIn(tradeId) {
    if (!tradeId) {
      navigate("/app.newTradeIn");
    } else {
      navigate("/app.newTradeIn", {
        tradeId: tradeId,
        edit: true,
      });
    }
  }

  goToCreate() {
    navigate("/dash.ncmStrategySelector");
  }

  goToTradeInSummary() {
    navigate("/app.tradeInSummary");
  }

  goToTradeInManage() {
    navigate("/app.tradeInManage");
  }

  goToSegments() {
    navigate("/dash.segmentLandingPage"); //dash.segments for angular code of segments
  }

  goToAdminAdvetiser() {
    navigate("/dash.AdminAdvertiserList");
  }

  goToAdminCampaign() {
    navigate("/app.AdminCampaignList");
  }

  gotoAgencyAdminManageUsers() {
    navigate("/dash.agencyAdminManageUsers");
  }

  goToAgencyAdminManageAdvertisers() {
    navigate("/dash.agencyAdminManageAdvertisers");
  }

  goToCreatives() {
    navigate("/dash.creatives");
  }

  goToManageAdPool() {
    navigate("/dash.managePool");
  }

  goToAgencyAddBrand() {
    navigate("/dash.agencyAdminAddBrand");
  }

  goToAgencyAdminManageCampaigns() {
    navigate("/dash.agencyAdminManageCampaigns");
  }

  goToAgencyAddCampaign() {
    navigate("/app.agencyAddCampaign");
  }

  goToAdvertiserFlow() {
    navigate("/app.AdvertiserFlow");
  }

  goToAgencyManageCompany() {
    navigate("/app.agencyManageCompany");
  }

  goToAgencyCampaignReports() {
    navigate("/dash.agencyCampaignReports");
  }

  goToAdvertiserCampaignReports() {
    navigate("/dash.advertiserCampaignReports");
  }

  goToAgencyBrandSubrand() {
    navigate("/dash.agencyBrandSubBrand");
  }

  goToAgency() {
    navigate("/dash.superAdminAgency");
  }

  goToForm() {
    navigate("/dash.superAdminForm");
  }

  goToNetwork() {
    navigate("/dash.superAdminNetwork");
  }
  goToNetworkInfo() {
    navigate("/dash.networkInfo");
  }

  goToOperator() {
    navigate("/dash.superAdminOperator");
  }

  goToFeedbackUpload() {
    navigate("/dash.superAdminFeedback");
  }

  goToSuperAdminDealLogs() {
    navigate("/dash.superAdminDealLogs");
  }
  goToSuperAdminCampaignLogs() {
    navigate("/dash.superAdminCampaignLogs");
  }
  goToSuperAdminNetworkLogs() {
    navigate("/dash.superAdminNetworkLogs");
  }
  goToSuperAdminCreativeLogs() {
    navigate("/dash.superAdminCreativeLogs");
  }
  goToSuperAdminEngineFeedbackSpot() {
    navigate("/dash.superAdminEngineFeedbackSpot");
  }
  gotoICD63() {
    navigate("/dash.superAdminICD63");
  }
  goToSuperAdminAttributeIDLogs() {
    navigate("/dash.superAdminAttributeIDLogs");
  }
  goToSuperAdminSegmentsLogs() {
    navigate("/dash.superAdminSegmentsLogs");
  }
  goToSuperAdminMGLogs() {
    navigate("/dash.superAdminMGLogs");
  }
  goToSuperAdminUpgradedAdspots() {
    navigate("/dash.superAdminUpgradedAdspots");
  }
  gotoICD10() {
    navigate("/dash.superAdminICD10");
  }
  goToSuperAdminXanDeliveryRepView() {
    navigate("/dash.superAdminXanDeliveryRepView");
  }
  goToSuperAdminManageCampaigns() {
    navigate("/dash.superAdminManageCampaigns");
  }
  goToSuperAdminRecurringSchedule() {
    navigate("/dash.superAdminRecurringSchedule");
  }
  goToSuperAdminManageCreatives() {
    navigate("/dash.superAdminManageCreatives");
  }
  goToSuperAdminCreativesWatermarkApproval() {
    navigate("/dash.superAdminCreativesWatermarkApproval");
  }

  goToSuperAdminPacingReports() {
    navigate("/dash.superAdminPacingReports");
  }

  goToTradesAction() {
    navigate("/app.tradesAction");
  }

  goToManageAds() {
    navigate("/app.manageAds");
  }

  goToAddTraffickingPlan() {
    navigate("/dash.addTraffickingPlan");
  }

  // goToPostLogs() {
  //   navigate('dash.postLogs');
  // }

  goToOperatorPostLogs() {
    navigate("/dash.operatorPostLogs");
  }

  goToNetworkPostLogs() {
    navigate("/dash.networkPostLogs");
  }

  goToOpsPostLogs() {
    navigate("/dash.opsPostLogs");
  }

  goToNotifications() {
    navigate("/app.notification");
  }

  goToNcmCampaignLandingPage() {
    navigate("/dash.ncmCampaign");
  }

  goToNcmCampaignOperator() {
    navigate("/dash.ncmCampaignOperator");
  }

  goToOperatorCreatives() {
    navigate("/dash.operatorCreatives");
  }
  goToTagApproval() {
    navigate("/dash.tagApproval");
  }
  goToManageDishAudience() {
    navigate("/dash.manageDishAudience");
  }
  goToAggregateInventory() {
    navigate("/dash.aggregateInventory");
  }

  goToNcmLogsPage() {
    navigate("/dash.ncmLogsPage");
  }

  goToAggNCMOperator() {
    navigate("/app.ncmCampaignOperatorAgg");
  }
  goToNCMCampaign() {
    navigate("/app.ncmNewCampaign");
  }

  goToSuperAdminNcmCampaign() {
    navigate("/dash.ncmCampaignManage");
  }
  goToManageCampaign() {
    navigate("/dash.manageNcm");
  }
  goToMsgGrp() {
    navigate("/dash.messagingGroups");
  }

  goToCustomSummary() {
    navigate("/app.customSummary");
  }

  goToRetargetSegment() {
    navigate("/app.retargetSegment");
  }

  goToDataProviderSelection() {
    navigate("/dash.superAdminDataProvider");
  }

  goToDefineMessagingGrp(subSegment) {
    navigate("/dash.defineMessagingGroups", subSegment);
  }

  goToManageChannels() {
    navigate("/dash.manageChannels");
  }

  goToNetworkCreatives() {
    navigate("/dash.networkCreatives");
  }

  goToNetworkLanding() {
    navigate("/dash.networkLanding");
  }
  goToNetworkUpgradedAdspots() {
    navigate("/dash.networkUpgradedAdspots");
  }

  goToSegmentLandingPage(
    selectedNodeData = null,
    selectedCompany = null,
    selectedCompanyName = null
  ) {
    navigate("/dash.segmentLandingPage", {
      selectedNodeData,
      selectedCompany,
      selectedCompanyName,
    });
  }

  goToCreateNewSegments(
    companyId,
    selectedNodeData,
    selectedNodeDataType,
    selectedCompany,
    selectedCompanyName
  ) {
    navigate("/dash.createNewSegment", {
      companyId,
      selectedNodeData,
      selectedNodeDataType,
      selectedCompany,
      selectedCompanyName,
    });
  }

  goToNCMCreate(strategy) {
    navigate("/dash.ncmCampaignCreate", { ncmStrategy: strategy });
  }

  goToNCMCreate2(strategy) {
    navigate("/dash.ncmCreate2", { ncmStrategy: strategy });
  }

  goToEdiTable(options) {
    navigate("/dash.EdiTable", options);
  }

  goToNetworkEdiTable() {
    navigate("/dash.NetworkEdiTable");
  }

  // Let's organize the functions into dashboard and modules.
  // goTo..() and is...() functions should be together

  // AGENCY/ADVERTISER-ADMIN

  goToMsgGrps() {
    navigate("/dash.messagingGroup");
  }

  // Segments and reset
  goToSegmentsAndReset() {
    navigate("/dash.segmentLandingPage", {}, { reload: true }); //goToSegmentsAndReset() to reload for angular code of segments
  }

  // NETWORK-ADMIN

  goToFoxImpressionData() {
    navigate("/dash.onFoxImpressionData");
  }

  // CBS-ADMIN
  goToCbsNetworkLanding() {
    navigate("/dash.cbsNetworkLanding");
  }
  goToCbsAddTraffickingPlan() {
    navigate("/dash.cbsAddTraffickingPlan");
  }
  goToCbsNetworkEdiTable() {
    navigate("/dash.cbsNetworkEdiTable");
  }
  goToCbsNetworkUpgradedAdspots() {
    navigate("/dash.cbsNetworkUpgradedAdspots");
  }
  goToCbsManageChannels() {
    navigate("/dash.cbsManageChannels");
  }
  goToCbsDeliveryReports() {
    navigate("/dash.cbsDeliveryReports");
  }
  goToCbsPingReports() {
    navigate("/dash.cbsPingReports");
  }
  goToCampaignTVPingReports() {
    navigate("/dash.cbsCampaignTvPingReports");
  }
  goToCbsReviewCreatives() {
    navigate("/dash.cbsReviewCreatives");
  }
  goToCbsManageCreatives() {
    navigate("/dash.cbsManageCreatives");
  }
  goToCbsCreativesWatermarkApproval() {
    navigate("/dash.cbsCreativesWatermarkApproval");
  }

  // FOX-ADMIN
  goToFoxNetworkLanding() {
    navigate("/dash.foxNetworkLanding");
  }
  goToFoxAddTraffickingPlan() {
    navigate("/dash.foxAddTraffickingPlan");
  }
  goToFoxNetworkEdiTable() {
    navigate("/dash.foxNetworkEdiTable");
  }
  goToFoxNetworkUpgradedAdspots() {
    navigate("/dash.foxNetworkUpgradedAdspots");
  }
  goToFoxManageChannels() {
    navigate("/dash.foxManageChannels");
  }
  goToFoxDeliveryReports() {
    navigate("/dash.foxDeliveryReports");
  }
  goToFoxReviewCreatives() {
    navigate("/dash.foxReviewCreatives");
  }
  goToFoxManageCreatives() {
    navigate("/dash.foxManageCreatives");
  }
  goToFoxCreativesWatermarkApproval() {
    navigate("/dash.foxCreativesWatermarkApproval");
  }

  // UNIVISION-ADMIN
  goToUnivisionLanding() {
    navigate("univision-network-admin/landing");
  }
  goToManageAudienceLanding() {
    navigate("univision-network-admin/manage-audience");
  }
  goToUnivisionCreateAudience() {
    navigate("univision-network-admin/manage-audience/create-audience");
  }
  goToUnivisionSelectAudience(
    companyId,
    selectedNodeData,
    selectedNodeDataType,
    selectedCompany,
    selectedCompanyName
  ) {
    navigate(
      "univision-network-admin/manage-audience/create-audience/select-audience",
      {
        companyId,
        selectedNodeData,
        selectedNodeDataType,
        selectedCompany,
        selectedCompanyName,
      }
    );
  }
  goToUnivisionViewAudience(tableState) {
    navigate("univision-network-admin/manage-audience/view-audience", {
      tableState,
    });
  }
  goToUnivisionNetworkLogs = function () {
    navigate("univision-network-admin/network-logs");
  };
  goToViewSchedules() {
    navigate("univision/view-schedules");
  }
  goToUnivisionNetworkEdiTable() {
    navigate("univision-network-admin/edi-list");
  }
  goToUnivisionManageChannels() {
    navigate("univision-network-admin/manage-networks");
  }
  goToUnivisionDeliveryReports() {
    navigate("univision-network-admin/delivery-reports");
  }
  goToUnivisionReviewCreatives() {
    navigate("univision-network-admin/review-creatives");
  }
  goToUnivisionManageCreatives() {
    navigate("univision-network-admin/manage-creatives");
  }
  goToUnivisionCreativesWatermarkApproval() {
    navigate("univision-network-admin/creatives-watermark-approval");
  }
  goToUnivisonCampaignLandingPage() {
    navigate("univision-network-admin/univsion-build-campaign-landing");
  }
  goToUnivisionOrderManagement() {
    navigate("univision-network-admin/univsion-order-management");
  }
  goToUnivisionPingReports() {
    navigate("/univision-network-admin/tv-ping-reports");
  }
  goToAggCampaign(type, campaignData) {
    if (type === "draft") {
      navigate(
        "univision-network-admin/univsion-campaign-landing-page/agg-campaign",
        { draftData: campaignData }
      );
    } else {
      navigate(
        "univision-network-admin/univsion-campaign-landing-page/agg-campaign"
      );
    }
  }
  goToAggCampaignOrderDetails(tradeId, comingFromUCIPending) {
    navigate("univision-network-admin/order-details", {
      tradeId: tradeId,
      comingFromUCIPending: comingFromUCIPending,
    });
  }
  goToAggCampaignAddTarget(tradeId) {
    navigate("univision-network-admin/add-target-audience", {
      tradeId: tradeId,
    });
  }
  goToAggCampaignDrafts() {
    navigate("univision/agg-campaign-drafts");
  }
  goToUnivisionManageCampaigns(tableState) {
    navigate("univision-network-admin/manage-campaigns", {
      tableState,
    });
  }
  goToUnivisionReportsTiles() {
    navigate("univision/reports-dashboard");
  }
  goToUnivisionReportsLanding() {
    navigate("univision-network-admin/reports-landing");
  }
  goToUnivisionReportsPacing() {
    navigate("univision-network-admin/reports-pacing");
  }
  goToUnivisionReportsPostCampaign() {
    navigate("univision-network-admin/reports-post-campaign-isci");
  }
  goToUnivisionPostCampaignDaypartReports() {
    navigate("univision-network-admin/reports-post-campaign-dma");
  }
  goToUnivisionReportsCtvLogs() {
    navigate("univision-network-admin/reports-ctv-logs");
  }
  goToUnivisionAdministration() {
    navigate("univision-network-admin/administration");
  }
  goToUploadCreative() {
    navigate("univision-network-admin/upload-ad-pool");
  }
  goToViewPool() {
    navigate("univision-network-admin/view-pool");
  }
  goToUnivisionInventorySpots() {
    navigate("univision/view-schedules");
  }

  goToUnivisionInventorySpot() {
    navigate("univision/view-addressable-inventory");
  }

  // OPERATOR-ADMIN
  goToOperatorLanding = function () {
    navigate("/dash.operatorLanding");
  };

  // SUPER/OPS-ADMIN

  //Vizio-ADMIN
  goToVizioLanding = function () {
    navigate("/dash.vizioLanding");
  };

  goToVizioCreatives() {
    navigate("/dash.vizioCreatives");
  }

  goToVizioManageOrder() {
    navigate("/dash.vizioManageOrders");
  }

  goToVizioTargetSegments() {
    navigate("/dash.vizioTargetSegments");
  }
  goToVizioReviewCreatives() {
    navigate("/dash.vizioReviewCreatives");
  }
  goToVizioCreativesWatermarkApproval() {
    navigate("/dash.vizioCreativesWatermarkApproval");
  }

  // Xandr Admin
  goToXandrLanding = function () {
    navigate("/dash.xandrLanding");
  };

  goToXandrCreatives() {
    navigate("/dash.xandrCreatives");
  }

  goToXandrSegmentFiles() {
    navigate("/dash.xandrSegmentFiles");
  }

  goToXandrManageOrders() {
    navigate("/dash.xandrManageOrders");
  }

  goToXandrPostLogs() {
    navigate("/dash.xandrPostLogs");
  }

  goToXandrCampaignReports() {
    navigate("/dash.xandrCampaignReports");
  }

  goToXandrBillingTrends() {
    navigate("/dash.xandrBillingTrends");
  }

  goToXandrBillingReports() {
    navigate("/dash.xandrBillingReports");
  }

  // reports

  // AGENCY-ADMIN

  goToAgencyDeliveryReports() {
    navigate("/dash.agencyDeliveryReports");
  }

  // ADVERTISER-ADMIN
  goToAdvertiserDeliveryReports() {
    navigate("/dash.advertiserDeliveryReports");
  }

  // network reports
  goToNetworkCampaignReports() {
    navigate("/dash.networkCampaignReports");
  }
  goToNetworkDeliveryReports() {
    navigate("/dash.networkDeliveryReports");
  }
  // operator reports
  goToOperatorReportsLanding() {
    navigate("/dash.operatorReportsLanding");
  }
  goToOperatorImpressionReports() {
    navigate("/dash.operatorImpressionReports");
  }
  goToOperatorImpressionReportsSaso() {
    navigate("/dash.operatorImpressionReportsSaso");
  }

  goToOperatorImpressionReportsMaso() {
    navigate("/dash.operatorImpressionReportsMaso");
  }

  goToOperatorImpressionReportsAgg() {
    navigate("/dash.operatorImpressionReportsAgg");
  }

  goToOperatorReportsPacing() {
    navigate("/dash.univisionReportsPacing");
  }
  goToOperatorReportsPostCampaign() {
    navigate("/dash.univisionReportsPostCampaign");
  }

  goToOperatorPostCampaignDaypartReports() {
    navigate("/dash.univisionPostCampaignDaypartReports");
  }

  // Return on Investment
  goToROIReports() {
    navigate("/dash.roiReports");
  }
}
