import { useNavigate } from "react-router-dom";
import { action, makeObservable } from "mobx";
import React, { Component } from "react";

export const Any = () => {
  const navigation = useNavigate();
  return <NavigationService navigation={navigation} />;
};

class NavigationService extends Component {
  constructor({ navigation }) {
    super({ navigation });
    makeObservable(this, {
      goToUnivisionLanding: action,
      goToManageAudienceLanding: action,
      goToUnivisionCreateAudience: action,
      goToUnivisionSelectAudience: action,
      goToUnivisionViewAudience: action,
      goToUnivisionNetworkLogs: action,
      goToUnivisionDeliveryReports: action,
      goToUnivisionManageCreatives: action,
      goToUnivisonCampaignLandingPage: action,
      goToUnivisionPingReports: action,
      goToUnivisionReportsLanding: action,
      goToUnivisionReportsPacing: action,
      goToUnivisionPostCampaignDaypartReports: action,
    });
  }

  goToUnivisionLanding() {
    this.navigation.navigate("univision-network-admin/landing");
  }
  goToManageAudienceLanding() {
    return "univision-network-admin/manage-audience";
  }
  goToUnivisionCreateAudience() {
    this.navigation.navigate(
      "univision-network-admin/manage-audience/create-audience"
    );
  }
  goToUnivisionSelectAudience(
    companyId,
    selectedNodeData,
    selectedNodeDataType,
    selectedCompany,
    selectedCompanyName
  ) {
    this.navigation.navigate(
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
  goToUnivisionViewAudience = (tableState) => {
    this.navigation.navigate(
      "univision-network-admin/manage-audience/view-audience",
      {
        tableState,
      }
    );
  };
  goToUnivisionNetworkLogs = () => {
    this.navigation.navigate("univision-network-admin/network-logs");
  };
  goToViewSchedules = () => {
    this.navigation.navigate("univision/view-schedules");
  };
  goToUnivisionNetworkEdiTable = () => {
    this.navigation.navigate("univision-network-admin/edi-list");
  };
  goToUnivisionManageChannels = () => {
    this.navigation.navigate("univision-network-admin/manage-networks");
  };
  goToUnivisionDeliveryReports = () => {
    this.navigation.navigate("univision-network-admin/delivery-reports");
  };
  goToUnivisionReviewCreatives = () => {
    this.navigation.navigate("univision-network-admin/review-creatives");
  };
  goToUnivisionManageCreatives = () => {
    this.navigation.navigate("univision-network-admin/manage-creatives");
  };
  goToUnivisionCreativesWatermarkApproval = () => {
    this.navigation.navigate(
      "univision-network-admin/creatives-watermark-approval"
    );
  };
  goToUnivisonCampaignLandingPage = () => {
    this.navigation.navigate(
      "univision-network-admin/univsion-build-campaign-landing"
    );
  };
  goToUnivisionOrderManagement = () => {
    this.navigation.navigate(
      "univision-network-admin/univsion-order-management"
    );
  };
  goToUnivisionPingReports = () => {
    this.navigation.navigate("/univision-network-admin/tv-ping-reports");
  };
  goToAggCampaign = (type, campaignData) => {
    if (type === "draft") {
      this.navigation.navigate(
        "univision-network-admin/univsion-campaign-landing-page/agg-campaign",
        { draftData: campaignData }
      );
    } else {
      this.navigation.navigate(
        "univision-network-admin/univsion-campaign-landing-page/agg-campaign"
      );
    }
  };
  goToAggCampaignOrderDetails = (tradeId, comingFromUCIPending) => {
    this.navigation.navigate("univision-network-admin/order-details", {
      tradeId: tradeId,
      comingFromUCIPending: comingFromUCIPending,
    });
  };
  goToAggCampaignAddTarget = (tradeId) => {
    this.navigation.navigate("univision-network-admin/add-target-audience", {
      tradeId: tradeId,
    });
  };
  goToAggCampaignDrafts = () => {
    this.navigation.navigate("univision/agg-campaign-drafts");
  };
  goToUnivisionManageCampaigns = (tableState) => {
    this.navigation.navigate("univision-network-admin/manage-campaigns", {
      tableState,
    });
  };
  goToUnivisionReportsTiles = () => {
    this.navigation.navigate("univision/reports-dashboard");
  };
  goToUnivisionReportsLanding = () => {
    this.navigation.navigate("univision-network-admin/reports-landing");
  };
  goToUnivisionReportsPacing = () => {
    this.navigation.navigate("univision-network-admin/reports-pacing");
  };
  goToUnivisionReportsPostCampaign = () => {
    this.navigation.navigate(
      "univision-network-admin/reports-post-campaign-isci"
    );
  };
  goToUnivisionPostCampaignDaypartReports = () => {
    this.navigation.navigate(
      "univision-network-admin/reports-post-campaign-dma"
    );
  };
  goToUnivisionReportsCtvLogs = () => {
    this.navigation.navigate("univision-network-admin/reports-ctv-logs");
  };
  goToUnivisionAdministration = () => {
    this.navigation.navigate("univision-network-admin/administration");
  };
  goToUploadCreative = () => {
    this.navigation.navigate("univision-network-admin/upload-ad-pool");
  };
  goToViewPool = () => {
    this.navigation.navigate("univision-network-admin/view-pool");
  };
  goToUnivisionInventorySpots = () => {
    this.navigation.navigate("univision/view-schedules");
  };

  goToUnivisionInventorySpot = () => {
    this.navigation.navigate("univision/view-addressable-inventory");
  };
}

export default NavigationService;
