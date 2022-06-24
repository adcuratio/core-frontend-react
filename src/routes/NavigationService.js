export default class NavigationService {
  constructor(navigate) {
    this.navigate = navigate;
  }

  goToUnivisionLanding() {
    this.navigate("/dash/univision-network-admin/landing");
  }
  goToManageAudienceLanding() {
    this.navigate("/dash/univision-network-admin/manage-audience");
  }
  goToUnivisionCreateAudience() {
    this.navigate(
      "/dash/univision-network-admin/manage-audience/create-audience"
    );
  }
  goToUnivisionSelectAudience(
    companyId,
    selectedNodeData,
    selectedNodeDataType,
    selectedCompany,
    selectedCompanyName
  ) {
    this.navigate(
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
    this.navigate(
      "/dash/univision-network-admin/manage-audience/view-audience",
      {
        tableState,
      }
    );
  }
  goToUnivisionNetworkLogs = function () {
    this.navigate("/dash/univision-network-admin/network-logs");
  };
  goToViewSchedules() {
    this.navigate("/dash/univision/view-schedules");
  }
  goToUnivisionNetworkEdiTable() {
    this.navigate("/dash/univision-network-admin/edi-list");
  }
  goToUnivisionManageChannels() {
    this.navigate("/dash/univision-network-admin/manage-networks");
  }
  goToUnivisionDeliveryReports() {
    this.navigate("/dash/univision-network-admin/delivery-reports");
  }
  goToUnivisionReviewCreatives() {
    this.navigate("/dash/univision-network-admin/review-creatives");
  }
  goToUnivisionManageCreatives() {
    this.navigate("/dash/univision-network-admin/manage-creatives");
  }
  goToUnivisionCreativesWatermarkApproval() {
    this.navigate("/dash/univision-network-admin/creatives-watermark-approval");
  }
  goToUnivisonCampaignLandingPage() {
    this.navigate(
      "/dash/univision-network-admin/univsion-build-campaign-landing"
    );
  }
  goToUnivisionOrderManagement() {
    this.navigate("/dash/univision-network-admin/univsion-order-management");
  }
  goToUnivisionPingReports() {
    this.navigate("/dash/univision-network-admin/tv-ping-reports");
  }
  goToAggCampaign(type, campaignData) {
    if (type === "draft") {
      this.navigate(
        "/dash/univision-network-admin/univsion-campaign-landing-page/agg-campaign",
        { draftData: campaignData }
      );
    } else {
      this.navigate(
        "/dash/univision-network-admin/univsion-campaign-landing-page/agg-campaign"
      );
    }
  }
  goToAggCampaignOrderDetails(tradeId, comingFromUCIPending) {
    this.navigate("/dash/univision-network-admin/order-details", {
      tradeId: tradeId,
      comingFromUCIPending: comingFromUCIPending,
    });
  }
  goToAggCampaignAddTarget(tradeId) {
    this.navigate("/dash/univision-network-admin/add-target-audience", {
      tradeId: tradeId,
    });
  }
  goToAggCampaignDrafts() {
    this.navigate("/dash/univision/agg-campaign-drafts");
  }
  goToUnivisionManageCampaigns(tableState) {
    this.navigate("/dash/univision-network-admin/manage-campaigns", {
      tableState,
    });
  }
  goToUnivisionReportsTiles() {
    this.navigate("/dash/univision/reports-dashboard");
  }
  goToUnivisionReportsLanding() {
    this.navigate("/dash/univision-network-admin/reports-landing");
  }
  goToUnivisionReportsPacing() {
    this.navigate("/dash/univision-network-admin/reports-pacing");
  }
  goToUnivisionReportsPostCampaign() {
    this.navigate("/dash/univision-network-admin/reports-post-campaign-isci");
  }
  goToUnivisionPostCampaignDaypartReports() {
    this.navigate("/dash/univision-network-admin/reports-post-campaign-dma");
  }
  goToUnivisionReportsCtvLogs() {
    this.navigate("/dash/univision-network-admin/reports-ctv-logs");
  }
  goToUnivisionAdministration() {
    this.navigate("/dash/univision-network-admin/administration");
  }
  goToUploadCreative() {
    this.navigate("/dash/univision-network-admin/upload-ad-pool");
  }
  goToViewPool() {
    this.navigate("/dash/univision-network-admin/view-pool");
  }
  goToUnivisionInventorySpots() {
    this.navigate("/dash/univision/view-schedules");
  }

  goToUnivisionInventorySpot() {
    this.navigate("/dash/univision/view-addressable-inventory");
  }
  goToForecastLanding() {
    this.navigate("/dash/univision-forecast/forecast-landing");
  }
  goToManageAdPool() {
    this.navigate("/dash/manage-ad-pool");
  }
  goToUnivsionBuildForecasting() {
    this.navigate("/dash/univision-forecast/build-forecast");
  }
  goToUnivsionManageForecasting(tableState) {
    this.navigate("/dash/univision-forecast/manage-forecast", {
      tableState,
    });
  }
}

//   goToLogin() {
//     this.navigate("/dash//login");
//   }
//   goToUpdatePwd() {
//     this.navigate("/dash//dash.updatepwd");
//   }

//   goToForgotPassword() {
//     this.navigate("/dash//forgotPasswordForm");
//   }
//   goToAggEDICalendar() {
//     this.navigate("/dash//dash.aggEDICalendar");
//   }

//   goToUploadCreatives() {
//     this.navigate("/dash//dash.uploadCreatives");
//   }

//   goToMsgVisualization() {
//     this.navigate("/dash//dash.msgVisualization");
//   }
//   goToViewSegmentsCount() {
//     this.navigate("/dash//dash.viewSegmentsCount");
//   }

//   goToCreateTradeIn(tradeId) {
//     if (!tradeId) {
//       this.navigate("/dash//app.newTradeIn");
//     } else {
//       this.navigate("/dash//app.newTradeIn", {
//         tradeId: tradeId,
//         edit: true,
//       });
//     }
//   }

//   goToCreate() {
//     this.navigate("/dash//dash.ncmStrategySelector");
//   }

//   goToTradeInSummary() {
//     this.navigate("/dash//app.tradeInSummary");
//   }

//   goToTradeInManage() {
//     this.navigate("/dash//app.tradeInManage");
//   }

//   goToSegments() {
//     this.navigate("/dash//dash.segmentLandingPage"); //dash.segments for angular code of segments
//   }

//   goToAdminAdvetiser() {
//     this.navigate("/dash//dash.AdminAdvertiserList");
//   }

//   goToAdminCampaign() {
//     this.navigate("/dash//app.AdminCampaignList");
//   }

//   gotoAgencyAdminManageUsers() {
//     this.navigate("/dash//dash.agencyAdminManageUsers");
//   }

//   goToAgencyAdminManageAdvertisers() {
//     this.navigate("/dash//dash.agencyAdminManageAdvertisers");
//   }

//   goToCreatives() {
//     this.navigate("/dash//dash.creatives");
//   }

//   goToManageAdPool() {
//     this.navigate("/dash//dash.managePool");
//   }

//   goToAgencyAddBrand() {
//     this.navigate("/dash//dash.agencyAdminAddBrand");
//   }

//   goToAgencyAdminManageCampaigns() {
//     this.navigate("/dash//dash.agencyAdminManageCampaigns");
//   }

//   goToAgencyAddCampaign() {
//     this.navigate("/dash//app.agencyAddCampaign");
//   }

//   goToAdvertiserFlow() {
//     this.navigate("/dash//app.AdvertiserFlow");
//   }

//   goToAgencyManageCompany() {
//     this.navigate("/dash//app.agencyManageCompany");
//   }

//   goToAgencyCampaignReports() {
//     this.navigate("/dash//dash.agencyCampaignReports");
//   }

//   goToAdvertiserCampaignReports() {
//     this.navigate("/dash//dash.advertiserCampaignReports");
//   }

//   goToAgencyBrandSubrand() {
//     this.navigate("/dash//dash.agencyBrandSubBrand");
//   }

//   goToAgency() {
//     this.navigate("/dash//dash.superAdminAgency");
//   }

//   goToForm() {
//     this.navigate("/dash//dash.superAdminForm");
//   }

//   goToNetwork() {
//     this.navigate("/dash//dash.superAdminNetwork");
//   }
//   goToNetworkInfo() {
//     this.navigate("/dash//dash.networkInfo");
//   }

//   goToOperator() {
//     this.navigate("/dash//dash.superAdminOperator");
//   }

//   goToFeedbackUpload() {
//     this.navigate("/dash//dash.superAdminFeedback");
//   }

//   goToSuperAdminDealLogs() {
//     this.navigate("/dash//dash.superAdminDealLogs");
//   }
//   goToSuperAdminCampaignLogs() {
//     this.navigate("/dash//dash.superAdminCampaignLogs");
//   }
//   goToSuperAdminNetworkLogs() {
//     this.navigate("/dash//dash.superAdminNetworkLogs");
//   }
//   goToSuperAdminCreativeLogs() {
//     this.navigate("/dash//dash.superAdminCreativeLogs");
//   }
//   goToSuperAdminEngineFeedbackSpot() {
//     this.navigate("/dash//dash.superAdminEngineFeedbackSpot");
//   }
//   gotoICD63() {
//     this.navigate("/dash//dash.superAdminICD63");
//   }
//   goToSuperAdminAttributeIDLogs() {
//     this.navigate("/dash//dash.superAdminAttributeIDLogs");
//   }
//   goToSuperAdminSegmentsLogs() {
//     this.navigate("/dash//dash.superAdminSegmentsLogs");
//   }
//   goToSuperAdminMGLogs() {
//     this.navigate("/dash//dash.superAdminMGLogs");
//   }
//   goToSuperAdminUpgradedAdspots() {
//     this.navigate("/dash//dash.superAdminUpgradedAdspots");
//   }
//   gotoICD10() {
//     this.navigate("/dash//dash.superAdminICD10");
//   }
//   goToSuperAdminXanDeliveryRepView() {
//     this.navigate("/dash//dash.superAdminXanDeliveryRepView");
//   }
//   goToSuperAdminManageCampaigns() {
//     this.navigate("/dash//dash.superAdminManageCampaigns");
//   }
//   goToSuperAdminRecurringSchedule() {
//     this.navigate("/dash//dash.superAdminRecurringSchedule");
//   }
//   goToSuperAdminManageCreatives() {
//     this.navigate("/dash//dash.superAdminManageCreatives");
//   }
//   goToSuperAdminCreativesWatermarkApproval() {
//     this.navigate("/dash//dash.superAdminCreativesWatermarkApproval");
//   }

//   goToSuperAdminPacingReports() {
//     this.navigate("/dash//dash.superAdminPacingReports");
//   }

//   goToTradesAction() {
//     this.navigate("/dash//app.tradesAction");
//   }

//   goToManageAds() {
//     this.navigate("/dash//app.manageAds");
//   }

//   goToAddTraffickingPlan() {
//     this.navigate("/dash//dash.addTraffickingPlan");
//   }

//   // goToPostLogs() {
//   //   this.navigate('dash.postLogs');
//   // }

//   goToOperatorPostLogs() {
//     this.navigate("/dash//dash.operatorPostLogs");
//   }

//   goToNetworkPostLogs() {
//     this.navigate("/dash//dash.networkPostLogs");
//   }

//   goToOpsPostLogs() {
//     this.navigate("/dash//dash.opsPostLogs");
//   }

//   goToNotifications() {
//     this.navigate("/dash//app.notification");
//   }

//   goToNcmCampaignLandingPage() {
//     this.navigate("/dash//dash.ncmCampaign");
//   }

//   goToNcmCampaignOperator() {
//     this.navigate("/dash//dash.ncmCampaignOperator");
//   }

//   goToOperatorCreatives() {
//     this.navigate("/dash//dash.operatorCreatives");
//   }
//   goToTagApproval() {
//     this.navigate("/dash//dash.tagApproval");
//   }
//   goToManageDishAudience() {
//     this.navigate("/dash//dash.manageDishAudience");
//   }
//   goToAggregateInventory() {
//     this.navigate("/dash//dash.aggregateInventory");
//   }

//   goToNcmLogsPage() {
//     this.navigate("/dash//dash.ncmLogsPage");
//   }

//   goToAggNCMOperator() {
//     this.navigate("/dash//app.ncmCampaignOperatorAgg");
//   }
//   goToNCMCampaign() {
//     this.navigate("/dash//app.ncmNewCampaign");
//   }

//   goToSuperAdminNcmCampaign() {
//     this.navigate("/dash//dash.ncmCampaignManage");
//   }
//   goToManageCampaign() {
//     this.navigate("/dash//dash.manageNcm");
//   }
//   goToMsgGrp() {
//     this.navigate("/dash//dash.messagingGroups");
//   }

//   goToCustomSummary() {
//     this.navigate("/dash//app.customSummary");
//   }

//   goToRetargetSegment() {
//     this.navigate("/dash//app.retargetSegment");
//   }

//   goToDataProviderSelection() {
//     this.navigate("/dash//dash.superAdminDataProvider");
//   }

//   goToDefineMessagingGrp(subSegment) {
//     this.navigate("/dash//dash.defineMessagingGroups", subSegment);
//   }

//   goToManageChannels() {
//     this.navigate("/dash//dash.manageChannels");
//   }

//   goToNetworkCreatives() {
//     this.navigate("/dash//dash.networkCreatives");
//   }

//   goToNetworkLanding() {
//     this.navigate("/dash//dash.networkLanding");
//   }
//   goToNetworkUpgradedAdspots() {
//     this.navigate("/dash//dash.networkUpgradedAdspots");
//   }

//   goToSegmentLandingPage(
//     selectedNodeData = null,
//     selectedCompany = null,
//     selectedCompanyName = null
//   ) {
//     this.navigate("/dash//dash.segmentLandingPage", {
//       selectedNodeData,
//       selectedCompany,
//       selectedCompanyName,
//     });
//   }

//   goToCreateNewSegments(
//     companyId,
//     selectedNodeData,
//     selectedNodeDataType,
//     selectedCompany,
//     selectedCompanyName
//   ) {
//     this.navigate("/dash//dash.createNewSegment", {
//       companyId,
//       selectedNodeData,
//       selectedNodeDataType,
//       selectedCompany,
//       selectedCompanyName,
//     });
//   }

//   goToNCMCreate(strategy) {
//     this.navigate("/dash//dash.ncmCampaignCreate", { ncmStrategy: strategy });
//   }

//   goToNCMCreate2(strategy) {
//     this.navigate("/dash//dash.ncmCreate2", { ncmStrategy: strategy });
//   }

//   goToEdiTable(options) {
//     this.navigate("/dash//dash.EdiTable", options);
//   }

//   goToNetworkEdiTable() {
//     this.navigate("/dash//dash.NetworkEdiTable");
//   }

//   // Let's organize the functions into dashboard and modules.
//   // goTo..() and is...() functions should be together

//   // AGENCY/ADVERTISER-ADMIN

//   goToMsgGrps() {
//     this.navigate("/dash//dash.messagingGroup");
//   }

//   // Segments and reset
//   goToSegmentsAndReset() {
//     this.navigate("/dash//dash.segmentLandingPage", {}, { reload: true }); //goToSegmentsAndReset() to reload for angular code of segments
//   }

//   // NETWORK-ADMIN

//   goToFoxImpressionData() {
//     this.navigate("/dash//dash.onFoxImpressionData");
//   }

//   // CBS-ADMIN
//   goToCbsNetworkLanding() {
//     this.navigate("/dash//dash.cbsNetworkLanding");
//   }
//   goToCbsAddTraffickingPlan() {
//     this.navigate("/dash//dash.cbsAddTraffickingPlan");
//   }
//   goToCbsNetworkEdiTable() {
//     this.navigate("/dash//dash.cbsNetworkEdiTable");
//   }
//   goToCbsNetworkUpgradedAdspots() {
//     this.navigate("/dash//dash.cbsNetworkUpgradedAdspots");
//   }
//   goToCbsManageChannels() {
//     this.navigate("/dash//dash.cbsManageChannels");
//   }
//   goToCbsDeliveryReports() {
//     this.navigate("/dash//dash.cbsDeliveryReports");
//   }
//   goToCbsPingReports() {
//     this.navigate("/dash//dash.cbsPingReports");
//   }
//   goToCampaignTVPingReports() {
//     this.navigate("/dash//dash.cbsCampaignTvPingReports");
//   }
//   goToCbsReviewCreatives() {
//     this.navigate("/dash//dash.cbsReviewCreatives");
//   }
//   goToCbsManageCreatives() {
//     this.navigate("/dash//dash.cbsManageCreatives");
//   }
//   goToCbsCreativesWatermarkApproval() {
//     this.navigate("/dash//dash.cbsCreativesWatermarkApproval");
//   }

//   // FOX-ADMIN
//   goToFoxNetworkLanding() {
//     this.navigate("/dash//dash.foxNetworkLanding");
//   }
//   goToFoxAddTraffickingPlan() {
//     this.navigate("/dash//dash.foxAddTraffickingPlan");
//   }
//   goToFoxNetworkEdiTable() {
//     this.navigate("/dash//dash.foxNetworkEdiTable");
//   }
//   goToFoxNetworkUpgradedAdspots() {
//     this.navigate("/dash//dash.foxNetworkUpgradedAdspots");
//   }
//   goToFoxManageChannels() {
//     this.navigate("/dash//dash.foxManageChannels");
//   }
//   goToFoxDeliveryReports() {
//     this.navigate("/dash//dash.foxDeliveryReports");
//   }
//   goToFoxReviewCreatives() {
//     this.navigate("/dash//dash.foxReviewCreatives");
//   }
//   goToFoxManageCreatives() {
//     this.navigate("/dash//dash.foxManageCreatives");
//   }
//   goToFoxCreativesWatermarkApproval() {
//     this.navigate("/dash//dash.foxCreativesWatermarkApproval");
//   }

//   // UNIVISION-ADMIN
//   goToUnivisionLanding() {
//     this.navigate("/dash/univision-network-admin/landing");
//   }
//   goToManageAudienceLanding() {
//     this.navigate("/dash/univision-network-admin/manage-audience");
//   }
//   goToUnivisionCreateAudience() {
//     this.navigate("/dash/univision-network-admin/manage-audience/create-audience");
//   }
//   goToUnivisionSelectAudience(
//     companyId,
//     selectedNodeData,
//     selectedNodeDataType,
//     selectedCompany,
//     selectedCompanyName
//   ) {
//     this.navigate(
//       "univision-network-admin/manage-audience/create-audience/select-audience",
//       {
//         companyId,
//         selectedNodeData,
//         selectedNodeDataType,
//         selectedCompany,
//         selectedCompanyName,
//       }
//     );
//   }
//   goToUnivisionViewAudience(tableState) {
//     this.navigate("/dash/univision-network-admin/manage-audience/view-audience", {
//       tableState,
//     });
//   }
//   goToUnivisionNetworkLogs = function () {
//     this.navigate("/dash/univision-network-admin/network-logs");
//   };
//   goToViewSchedules() {
//     this.navigate("/dash/univision/view-schedules");
//   }
//   goToUnivisionNetworkEdiTable() {
//     this.navigate("/dash/univision-network-admin/edi-list");
//   }
//   goToUnivisionManageChannels() {
//     this.navigate("/dash/univision-network-admin/manage-networks");
//   }
//   goToUnivisionDeliveryReports() {
//     this.navigate("/dash/univision-network-admin/delivery-reports");
//   }
//   goToUnivisionReviewCreatives() {
//     this.navigate("/dash/univision-network-admin/review-creatives");
//   }
//   goToUnivisionManageCreatives() {
//     this.navigate("/dash/univision-network-admin/manage-creatives");
//   }
//   goToUnivisionCreativesWatermarkApproval() {
//     this.navigate("/dash/univision-network-admin/creatives-watermark-approval");
//   }
//   goToUnivisonCampaignLandingPage() {
//     this.navigate("/dash/univision-network-admin/univsion-build-campaign-landing");
//   }
//   goToUnivisionOrderManagement() {
//     this.navigate("/dash/univision-network-admin/univsion-order-management");
//   }
//   goToUnivisionPingReports() {
//     this.navigate("/dash//univision-network-admin/tv-ping-reports");
//   }
//   goToAggCampaign(type, campaignData) {
//     if (type === "draft") {
//       this.navigate(
//         "univision-network-admin/univsion-campaign-landing-page/agg-campaign",
//         { draftData: campaignData }
//       );
//     } else {
//       this.navigate(
//         "univision-network-admin/univsion-campaign-landing-page/agg-campaign"
//       );
//     }
//   }
//   goToAggCampaignOrderDetails(tradeId, comingFromUCIPending) {
//     this.navigate("/dash/univision-network-admin/order-details", {
//       tradeId: tradeId,
//       comingFromUCIPending: comingFromUCIPending,
//     });
//   }
//   goToAggCampaignAddTarget(tradeId) {
//     this.navigate("/dash/univision-network-admin/add-target-audience", {
//       tradeId: tradeId,
//     });
//   }
//   goToAggCampaignDrafts() {
//     this.navigate("/dash/univision/agg-campaign-drafts");
//   }
//   goToUnivisionManageCampaigns(tableState) {
//     this.navigate("/dash/univision-network-admin/manage-campaigns", {
//       tableState,
//     });
//   }
//   goToUnivisionReportsTiles() {
//     this.navigate("/dash/univision/reports-dashboard");
//   }
//   goToUnivisionReportsLanding() {
//     this.navigate("/dash/univision-network-admin/reports-landing");
//   }
//   goToUnivisionReportsPacing() {
//     this.navigate("/dash/univision-network-admin/reports-pacing");
//   }
//   goToUnivisionReportsPostCampaign() {
//     this.navigate("/dash/univision-network-admin/reports-post-campaign-isci");
//   }
//   goToUnivisionPostCampaignDaypartReports() {
//     this.navigate("/dash/univision-network-admin/reports-post-campaign-dma");
//   }
//   goToUnivisionReportsCtvLogs() {
//     this.navigate("/dash/univision-network-admin/reports-ctv-logs");
//   }
//   goToUnivisionAdministration() {
//     this.navigate("/dash/univision-network-admin/administration");
//   }
//   goToUploadCreative() {
//     this.navigate("/dash/univision-network-admin/upload-ad-pool");
//   }
//   goToViewPool() {
//     this.navigate("/dash/univision-network-admin/view-pool");
//   }
//   goToUnivisionInventorySpots() {
//     this.navigate("/dash/univision/view-schedules");
//   }

//   goToUnivisionInventorySpot() {
//     this.navigate("/dash/univision/view-addressable-inventory");
//   }

//   // OPERATOR-ADMIN
//   goToOperatorLanding = function () {
//     this.navigate("/dash//dash.operatorLanding");
//   };

//   // SUPER/OPS-ADMIN

//   //Vizio-ADMIN
//   goToVizioLanding = function () {
//     this.navigate("/dash//dash.vizioLanding");
//   };

//   goToVizioCreatives() {
//     this.navigate("/dash//dash.vizioCreatives");
//   }

//   goToVizioManageOrder() {
//     this.navigate("/dash//dash.vizioManageOrders");
//   }

//   goToVizioTargetSegments() {
//     this.navigate("/dash//dash.vizioTargetSegments");
//   }
//   goToVizioReviewCreatives() {
//     this.navigate("/dash//dash.vizioReviewCreatives");
//   }
//   goToVizioCreativesWatermarkApproval() {
//     this.navigate("/dash//dash.vizioCreativesWatermarkApproval");
//   }

//   // Xandr Admin
//   goToXandrLanding = function () {
//     this.navigate("/dash//dash.xandrLanding");
//   };

//   goToXandrCreatives() {
//     this.navigate("/dash//dash.xandrCreatives");
//   }

//   goToXandrSegmentFiles() {
//     this.navigate("/dash//dash.xandrSegmentFiles");
//   }

//   goToXandrManageOrders() {
//     this.navigate("/dash//dash.xandrManageOrders");
//   }

//   goToXandrPostLogs() {
//     this.navigate("/dash//dash.xandrPostLogs");
//   }

//   goToXandrCampaignReports() {
//     this.navigate("/dash//dash.xandrCampaignReports");
//   }

//   goToXandrBillingTrends() {
//     this.navigate("/dash//dash.xandrBillingTrends");
//   }

//   goToXandrBillingReports() {
//     this.navigate("/dash//dash.xandrBillingReports");
//   }

//   // reports

//   // AGENCY-ADMIN

//   goToAgencyDeliveryReports() {
//     this.navigate("/dash//dash.agencyDeliveryReports");
//   }

//   // ADVERTISER-ADMIN
//   goToAdvertiserDeliveryReports() {
//     this.navigate("/dash//dash.advertiserDeliveryReports");
//   }

//   // network reports
//   goToNetworkCampaignReports() {
//     this.navigate("/dash//dash.networkCampaignReports");
//   }
//   goToNetworkDeliveryReports() {
//     this.navigate("/dash//dash.networkDeliveryReports");
//   }
//   // operator reports
//   goToOperatorReportsLanding() {
//     this.navigate("/dash//dash.operatorReportsLanding");
//   }
//   goToOperatorImpressionReports() {
//     this.navigate("/dash//dash.operatorImpressionReports");
//   }
//   goToOperatorImpressionReportsSaso() {
//     this.navigate("/dash//dash.operatorImpressionReportsSaso");
//   }

//   goToOperatorImpressionReportsMaso() {
//     this.navigate("/dash//dash.operatorImpressionReportsMaso");
//   }

//   goToOperatorImpressionReportsAgg() {
//     this.navigate("/dash//dash.operatorImpressionReportsAgg");
//   }

//   goToOperatorReportsPacing() {
//     this.navigate("/dash//dash.univisionReportsPacing");
//   }
//   goToOperatorReportsPostCampaign() {
//     this.navigate("/dash//dash.univisionReportsPostCampaign");
//   }

//   goToOperatorPostCampaignDaypartReports() {
//     this.navigate("/dash//dash.univisionPostCampaignDaypartReports");
//   }

//   // Return on Investment
//   goToROIReports() {
//     this.navigate("/dash//dash.roiReports");
//   }
