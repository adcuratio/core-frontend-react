import manage_trades_selected from "../../images/manage-trades_selected.png";
import manage_trades from "../../images/manage-trades.png";

export const superAdminMenuList = ({ $state, navigationService }) => {
  // Let's organize the functions into dashboard and modules.
  // goTo..() and is...() functions should be together

  // Super Admin

  const goToForm = () => {
    navigationService.goToForm();
  };
  const onForm = () => $state.current.name === "dash.superAdminForm";

  const goToAgency = () => {
    navigationService.goToAgency();
  };
  const onAgency = () => $state.current.name === "dash.superAdminAgency";

  const goToNetwork = () => {
    navigationService.goToNetwork();
  };
  const goToNetworkInfo = () => {
    navigationService.goToNetworkInfo();
  };
  const onNetwork = () => $state.current.name === "dash.superAdminNetwork";
  const onNetworkInfo = () => $state.current.name === "dash.networkInfo";

  const goToOperator = () => {
    navigationService.goToOperator();
  };
  const onOperator = () => $state.current.name === "dash.superAdminOperator";

  const goToDataProviderSelection = () => {
    navigationService.goToDataProviderSelection();
  };
  const isDataProviderSelection = () =>
    $state.current.name === "dash.superAdminDataProvider";

  const goToMsgVisualization = () => {
    navigationService.goToMsgVisualization();
  };
  const onMsgVisualization = () =>
    $state.current.name === "dash.msgVisualization";

  const goToViewSegmentsCount = () => {
    navigationService.goToViewSegmentsCount();
  };
  const onViewSegmentsCount = () =>
    $state.current.name === "dash.viewSegmentsCount";

  const isLogsPortal = () =>
    isSuperAdminDealLogs() ||
    isSuperAdminNetworkLogs() ||
    isSuperAdminCampaignLogs() ||
    isSuperAdminCreativeLogs() ||
    isSuperAdminAttributeIDLogs() ||
    isSuperAdminMGLogs() ||
    isSuperAdminSegmentsLogs();

  const goToSuperAdminDealLogs = () => {
    navigationService.goToSuperAdminDealLogs();
  };
  const isSuperAdminDealLogs = () =>
    $state.current.name === "dash.superAdminDealLogs";

  const goToSuperAdminNetworkLogs = () => {
    navigationService.goToSuperAdminNetworkLogs();
  };
  const isSuperAdminNetworkLogs = () =>
    $state.current.name === "dash.superAdminNetworkLogs";

  const goToSuperAdminCreativeLogs = () => {
    navigationService.goToSuperAdminCreativeLogs();
  };
  const isSuperAdminCreativeLogs = () =>
    $state.current.name === "dash.superAdminCreativeLogs";

  const goToSuperAdminCampaignLogs = () => {
    navigationService.goToSuperAdminCampaignLogs();
  };
  const isSuperAdminCampaignLogs = () =>
    $state.current.name === "dash.superAdminCampaignLogs";

  const goToSuperAdminSegmentsLogs = () => {
    navigationService.goToSuperAdminSegmentsLogs();
  };
  const isSuperAdminSegmentsLogs = () =>
    $state.current.name === "dash.superAdminSegmentsLogs";

  const goToSuperAdminMGLogs = () => {
    navigationService.goToSuperAdminMGLogs();
  };
  const isSuperAdminMGLogs = () =>
    $state.current.name === "dash.superAdminMGLogs";

  const goToSuperAdminAttributeIDLogs = () => {
    navigationService.goToSuperAdminAttributeIDLogs();
  };
  const isSuperAdminAttributeIDLogs = () =>
    $state.current.name === "dash.superAdminAttributeIDLogs";

  const goToSuperAdminUpgradedAdspots = () => {
    navigationService.goToSuperAdminUpgradedAdspots();
  };
  const onSuperAdminUpgradedAdspots = () =>
    $state.current.name === "dash.superAdminUpgradedAdspots";

  const goToSuperAdminEngineFeedbackSpot = () => {
    navigationService.goToSuperAdminEngineFeedbackSpot();
  };
  const onEngineFeedbackSpot = () =>
    $state.current.name === "dash.superAdminEngineFeedbackSpot";

  const gotoICD63 = () => {
    navigationService.gotoICD63();
  };
  const onICD63 = () => $state.current.name === "dash.superAdminICD63";

  const goToOpsPostLogs = () => {
    navigationService.goToOpsPostLogs();
  };
  const onOpsPostLogs = () => $state.current.name === "dash.opsPostLogs";

  const gotoICD10 = () => {
    navigationService.gotoICD10();
  };
  const onICD10 = () => $state.current.name === "dash.superAdminICD10";

  const goToSuperAdminXanDeliveryRepView = () => {
    navigationService.goToSuperAdminXanDeliveryRepView();
  };
  const onSuperAdminXanDeliveryRepView = () =>
    $state.current.name === "dash.superAdminXanDeliveryRepView";

  const goToSuperAdminManageCampaigns = () => {
    navigationService.goToSuperAdminManageCampaigns();
  };
  const onSuperAdminManageCampaigns = () =>
    $state.current.name === "dash.superAdminManageCampaigns";

  const goToSuperAdminRecurringSchedule = () => {
    navigationService.goToSuperAdminRecurringSchedule();
  };
  const onSuperAdminRecurringSchedule = () =>
    $state.current.name === "dash.superAdminRecurringSchedule";

  const isCreativesModule = () =>
    isSuperAdminManageCreatives() || isSuperAdminCreativesWatermarkApproval();

  const goToSuperAdminManageCreatives = () => {
    navigationService.goToSuperAdminManageCreatives();
  };
  const isSuperAdminManageCreatives = () =>
    $state.current.name === "dash.superAdminManageCreatives";

  const goToSuperAdminCreativesWatermarkApproval = () => {
    navigationService.goToSuperAdminCreativesWatermarkApproval();
  };
  const isSuperAdminCreativesWatermarkApproval = () =>
    $state.current.name === "dash.superAdminCreativesWatermarkApproval";

  const goToSuperAdminPacingReports = () => {
    navigationService.goToSuperAdminPacingReports();
  };

  const onSuperAdminPacingReports = () =>
    $state.current.name === "dash.superAdminPacingReports";

  const SuperAdminMenuList = [
    {
      title: "Agency",
      iconClass: "fas fa-tachometer-alt",
      onClick: () => goToAgency(),
      isActiveRoute: () => onAgency(),
    },
    {
      title: "Form",
      iconClass: "fas fa-file-signature",
      onClick: () => goToForm(),
      isActiveRoute: () => onForm(),
    },
    {
      title: "Network",
      iconClass: "fas fa-cog fa-lg",
      onClick: () => goToNetwork(),
      isActiveRoute: () => onNetwork(),
    },
    {
      title: "NetworkInfo",
      iconClass: "fas fa-cog fa-lg",
      onClick: () => goToNetworkInfo(),
      isActiveRoute: () => onNetworkInfo(),
    },
    {
      title: "Distributor",
      iconClass: "fas fa-cog fa-lg",
      onClick: () => goToOperator(),
      isActiveRoute: () => onOperator(),
    },
    {
      title: "Data Provider",
      iconClass: "fas fa-cog fa-lg",
      onClick: () => goToDataProviderSelection(),
      isActiveRoute: () => isDataProviderSelection(),
    },
    {
      title: "Messaging Groups Visualization",
      iconClass: "fas fa-users fa-lg",
      onClick: () => goToMsgVisualization(),
      isActiveRoute: () => onMsgVisualization(),
    },
    {
      title: "View Detailed Segment Counts",
      iconClass: "fas fa-users fa-lg",
      onClick: () => goToViewSegmentsCount(),
      isActiveRoute: () => onViewSegmentsCount(),
    },
    {
      title: "Logs",
      iconClass: "fas fa-file fa-lg",
      isActiveRoute: () => isLogsPortal(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Deal Logs",
          onClick: () => goToSuperAdminDealLogs(),
          isActiveRoute: () => isSuperAdminDealLogs(),
        },
        {
          title: "Network Logs",
          onClick: () => goToSuperAdminNetworkLogs(),
          isActiveRoute: () => isSuperAdminNetworkLogs(),
        },
        {
          title: "Creative Logs",
          onClick: () => goToSuperAdminCreativeLogs(),
          isActiveRoute: () => isSuperAdminCreativeLogs(),
        },
        {
          title: "Campaign Logs",
          onClick: () => goToSuperAdminCampaignLogs(),
          isActiveRoute: () => isSuperAdminCampaignLogs(),
        },

        {
          title: "Target Segments Logs",
          onClick: () => goToSuperAdminSegmentsLogs(),
          isActiveRoute: () => isSuperAdminSegmentsLogs(),
        },
        {
          title: "Messaging Groups Logs",
          onClick: () => goToSuperAdminMGLogs(),
          isActiveRoute: () => isSuperAdminMGLogs(),
        },
        {
          title: "Attribute ID Logs",
          onClick: () => goToSuperAdminAttributeIDLogs(),
          isActiveRoute: () => isSuperAdminAttributeIDLogs(),
        },
      ],
    },
    {
      title: "Addressable Inventory",
      iconClass: "fa fa-tv",
      onClick: () => goToSuperAdminUpgradedAdspots(),
      isActiveRoute: () => onSuperAdminUpgradedAdspots(),
    },
    {
      title: "Engine Feedback (Spot)",
      iconClass: "fab fa-wpforms fa-lg",
      onClick: () => goToSuperAdminEngineFeedbackSpot(),
      isActiveRoute: () => onEngineFeedbackSpot(),
    },
    {
      title: "ICD-63",
      iconClass: "low-contrast",
      iconImg: {
        active: manage_trades_selected,
        inactive: manage_trades,
      },
      onClick: () => gotoICD63(),
      isActiveRoute: () => onICD63(),
    },
    {
      title: "Post Logs",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToOpsPostLogs(),
      isActiveRoute: () => onOpsPostLogs(),
      titleWrapper: {
        style: { paddingTop: "6px" },
      },
    },
    {
      title: "Xandr ICD-10",
      iconClass: "low-contrast",
      iconImg: {
        active: manage_trades_selected,
        inactive: manage_trades,
      },
      onClick: () => gotoICD10(),
      isActiveRoute: () => onICD10(),
    },
    {
      title: "Xandr Delivery Reports View",
      iconClass: "fa fa-tv",
      onClick: () => goToSuperAdminXanDeliveryRepView(),
      isActiveRoute: () => onSuperAdminXanDeliveryRepView(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      isActiveRoute: () => isCreativesModule(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Manage Creatives",
          onClick: () => goToSuperAdminManageCreatives(),
          isActiveRoute: () => isSuperAdminManageCreatives(),
        },
        {
          title: "Watermark QA Approval",
          onClick: () => goToSuperAdminCreativesWatermarkApproval(),
          isActiveRoute: () => isSuperAdminCreativesWatermarkApproval(),
        },
      ],
    },
    {
      title: "Manage Campaigns",
      iconClass: "fa fa-exchange-alt",
      onClick: () => goToSuperAdminManageCampaigns(),
      isActiveRoute: () => onSuperAdminManageCampaigns(),
    },
    {
      title: "Dummy Schedule Automation",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToSuperAdminRecurringSchedule(),
      isActiveRoute: () => onSuperAdminRecurringSchedule(),
    },
  ];

  if (
    process.env.REACT_APP_BACKEND === "https://production-api.adcuratio.net"
  ) {
    SuperAdminMenuList.push({
      title: "Pacing Reports",
      iconClass: "fa fa-chart-line fa-lg",
      onClick: () => goToSuperAdminPacingReports(),
      isActiveRoute: () => onSuperAdminPacingReports(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    });
  }

  return SuperAdminMenuList;
};

export const advertiserAdminMenuList = ({ $state, navigationService }) => {
  const common = commonHelper({ $state, navigationService });
  const report = reportHelper({ $state, navigationService });

  const isBrandSubBrand = () =>
    $state.current.name === "dash.agencyBrandSubBrand" ||
    $state.current.name === "dash.agencyAdminAddBrand";

  const AdvertiserAdminMenuList = [
    {
      title: "Home",
      iconClass: "ncm-option-symbol fa fa-home fa-lg",
      onClick: () => common.goToNcmCampaignLandingPage(),
      isActiveRoute: () => common.isCustomMessagin() || common.istradeInState(),
      titleWrapper: {
        class: "bolder-title",
        style: { paddingBottom: "0.6px" },
      },
    },
    {
      title: "Audience Segments",
      iconClass: "fas fa-user-friends fa-lg",
      isActiveRoute: () => common.isSegmentState(),

      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Target Segments",
          iconClass: "",
          onClick: () => common.goToSegments(),
          isActiveRoute: () => common.isAudienceGroup(),
        },
        {
          title: "Messaging Groups",
          iconClass: "",
          onClick: () => common.goToMsgGrps(),
          isActiveRoute: () => common.isMsgGrp(),
        },
      ],
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => common.goToEdiTable(),
      isActiveRoute: () => common.isEdiTable(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => common.goToCreatives(),
      isActiveRoute: () => common.isCreatives(),
    },
    {
      title: "Account Management",
      iconClass: "fas fa-user-cog fa-lg",
      isActiveRoute: () => common.isManageState(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Brands and Sub-Brands",
          onClick: () => common.goToAgencyBrandSubrand(),
          isActiveRoute: () => isBrandSubBrand(),
        },
      ],
    },
  ];

  if (process.env.REACT_APP_BACKEND === "https://demo-api.adcuratio.org") {
    AdvertiserAdminMenuList.push({
      title: "ROI Reports",
      iconClass: "fa fa-chart-line fa-lg",
      onClick: () => report.goToROIReports(),
      isActiveRoute: () => report.isROIReports(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    });
  }

  if (
    process.env.REACT_APP_BACKEND === "https://production-api.adcuratio.net"
  ) {
    AdvertiserAdminMenuList.push({
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "CTV Reports",
          onClick: () => report.goToAdvertiserDeliveryReports(),
          isActiveRoute: () => report.isAdvertiserDeliveryReports(),
        },
        {
          title: "Pacing Reports",
          onClick: () => report.goToAdvertiserCampaignReports(),
          isActiveRoute: () => report.isAdvertiserImpressionReports(),
        },
      ],
    });
  }

  return AdvertiserAdminMenuList;
};

export const networkAdminMenuList = ({ $state, navigationService }) => {
  const report = reportHelper({ $state, navigationService });

  // Network-Admin

  const goToNetworkLanding = () => {
    navigationService.goToNetworkLanding();
  };
  const onNetworkHome = () => $state.current.name === "dash.networkLanding";

  const goToAddTraffickingPlan = () => {
    navigationService.goToAddTraffickingPlan();
  };
  const onAddTraffickingPlan = () =>
    $state.current.name === "dash.addTraffickingPlan";

  const goToNetworkEdiTable = () => {
    navigationService.goToNetworkEdiTable();
  };
  const isNetworkEdiTable = () =>
    $state.current.name === "dash.NetworkEdiTable";

  const goToNetworkCreatives = () => {
    navigationService.goToNetworkCreatives();
  };
  const onNetworkCreatives = () =>
    $state.current.name === "dash.networkCreatives";

  const goToNetworkUpgradedAdspots = () => {
    navigationService.goToNetworkUpgradedAdspots();
  };
  const onNetworkUpgradedAdspots = () =>
    $state.current.name === "dash.networkUpgradedAdspots";

  const goToNetworkPostLogs = () => {
    navigationService.goToNetworkPostLogs();
  };
  const onNetworkPostLogs = () =>
    $state.current.name === "dash.networkPostLogs";

  const goToManageChannels = () => {
    navigationService.goToManageChannels();
  };
  const onChannels = () => $state.current.name === "dash.manageChannels";

  const NetworkAdminMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToNetworkLanding(),
      isActiveRoute: () => onNetworkHome(),
      titleWrapper: {
        style: { paddingBottom: "0.5px" },
      },
    },
    {
      title: "Network Logs",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToAddTraffickingPlan(),
      isActiveRoute: () => onAddTraffickingPlan(),
      titleWrapper: {
        style: { paddingBottom: "2px" },
      },
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => goToNetworkEdiTable(),
      isActiveRoute: () => isNetworkEdiTable(),
    },
    {
      title: "Manage Creative",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => goToNetworkCreatives(),
      isActiveRoute: () => onNetworkCreatives(),
    },
    {
      title: "Addressable Inventory",
      iconClass: "fa fa-tv",
      onClick: () => goToNetworkUpgradedAdspots(),
      isActiveRoute: () => onNetworkUpgradedAdspots(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Post Logs",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToNetworkPostLogs(),
      isActiveRoute: () => onNetworkPostLogs(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Manage Networks",
      iconClass: "fa fa-tv",
      onClick: () => goToManageChannels(),
      isActiveRoute: () => onChannels(),
      titleWrapper: {
        style: { paddingTop: "2px" },
      },
    },
    {
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Campaign Reports",
          onClick: () => report.goToNetworkCampaignReports(),
          isActiveRoute: () => report.isCampaignReports(),
        },
        {
          title: "Delivery Reports",
          onClick: () => report.goToNetworkDeliveryReports(),
          isActiveRoute: () => report.isNetworkDeliveryReports(),
        },
      ],
    },
  ];

  return NetworkAdminMenuList;
};

export const vizioFoxAdminMenuList = ({ $state, navigationService }) => {
  // Vizio-Fox Admin

  const goToFoxImpressionData = () => {
    navigationService.goToFoxImpressionData();
  };
  const onFoxImpressionData = () =>
    $state.current.name === "dash.onFoxImpressionData";

  const VizioFoxAdminMenuList = [
    {
      title: "Impression Data",
      iconClass: "fa fa-database fa-lg",
      onClick: () => goToFoxImpressionData(),
      isActiveRoute: () => onFoxImpressionData(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
  ];

  return VizioFoxAdminMenuList;
};

export const agencyAdminMenuList = ({ $state, navigationService }) => {
  const common = commonHelper({ $state, navigationService });
  const report = reportHelper({ $state, navigationService });

  // Agency-Admin
  const AgencyAdminMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => common.goToNcmCampaignLandingPage(),
      isActiveRoute: () => common.isCustomMessagin() || common.istradeInState(),
      titleWrapper: {
        class: "bolder-title",
        style: { paddingBottom: "0.6px" },
      },
    },
    {
      title: "Audience Segments",
      iconClass: "fas fa-user-friends fa-lg",
      isActiveRoute: () => common.isSegmentState(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Target Segments",
          onClick: () => common.goToSegments(),
          isActiveRoute: () => common.isAudienceGroup(),
        },
        {
          title: "Messaging Groups",
          onClick: () => common.goToMsgGrps(),
          isActiveRoute: () => common.isMsgGrp(),
        },
      ],
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => common.goToEdiTable(),
      isActiveRoute: () => common.isEdiTable(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => common.goToCreatives(),
      isActiveRoute: () => common.isCreatives(),
      titleWrapper: {
        style: { paddingBottom: "1.5px" },
      },
    },

    {
      title: "Account Management",
      iconClass: "fas fa-user-cog fa-lg",
      isActiveRoute: () => common.isManageState(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Advertisers",
          onClick: () => common.goToAgencyAdminManageAdvertisers(),
          isActiveRoute: () => common.isAgencyAdminManageAdvertisers(),
        },
        {
          title: "Users",
          onClick: () => common.goToAgencyAdminManageUsers(),
          isActiveRoute: () => common.isAgencyAdminManageUsers(),
        },
      ],
    },
  ];

  if (process.env.REACT_APP_BACKEND === "https://demo-api.adcuratio.org") {
    AgencyAdminMenuList.push({
      title: "ROI Reports",
      iconClass: "fa fa-chart-line fa-lg",
      onClick: () => report.goToROIReports(),
      isActiveRoute: () => report.isROIReports(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    });
  }

  if (
    process.env.REACT_APP_BACKEND === "https://production-api.adcuratio.net"
  ) {
    AgencyAdminMenuList.push({
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "CTV Reports",
          onClick: () => report.goToAgencyDeliveryReports(),
          isActiveRoute: () => report.isAgencyDeliveryReports(),
        },
        {
          title: "Pacing Reports",
          onClick: () => report.goToAgencyCampaignReports(),
          isActiveRoute: () => report.isAgencyImpressionReports(),
        },
      ],
    });
  }

  return AgencyAdminMenuList;
};

export const agencyRepUserMenuList = ({ $state, navigationService }) => {
  const common = commonHelper({ $state, navigationService });
  const AgencyRepUserMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => common.goToNcmCampaignLandingPage(),
      isActiveRoute: () => common.isCustomMessagin() || common.istradeInState(),
      titleWrapper: {
        class: "bolder-title",
        style: { paddingBottom: "0.6px" },
      },
    },
    {
      title: "Audience Segments",
      iconClass: "fas fa-user-friends fa-lg",
      isActiveRoute: () => common.isSegmentState(),

      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Target Segments",
          onClick: () => common.goToSegments(),
          isActiveRoute: () => common.isAudienceGroup(),
        },
        {
          title: "Messaging Groups",
          onClick: () => common.goToMsgGrps(),
          isActiveRoute: () => common.isMsgGrp(),
        },
      ],
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => common.goToEdiTable(),
      isActiveRoute: () => common.isEdiTable(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => common.goToCreatives(),
      isActiveRoute: () => common.isCreatives(),
      titleWrapper: {
        style: { paddingBottom: "1.5px" },
      },
    },
    {
      title: "Account Management",
      iconClass: "fas fa-user-cog fa-lg",
      isActiveRoute: () => common.isManageState(),

      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Advertisers",
          onClick: () => common.goToAgencyAdminManageAdvertisers(),
          isActiveRoute: () => common.isAgencyAdminManageAdvertisers(),
        },
        {
          title: "Users",
          onClick: () => common.goToAgencyAdminManageUsers(),
          isActiveRoute: () => common.isAgencyAdminManageUsers(),
        },
      ],
    },
  ];
  return AgencyRepUserMenuList;
};

export const advertiserUserMenuList = ({ $state, navigationService }) => {
  const common = commonHelper({ $state, navigationService });

  const AdvertiserUserMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => common.goToNcmCampaignLandingPage(),
      isActiveRoute: () => common.isCustomMessagin() || common.istradeInState(),
      titleWrapper: {
        class: "bolder-title",
      },
    },
    {
      title: "Audience Segments",
      iconClass: "fas fa-user-friends fa-lg",
      isActiveRoute: () => common.isSegmentState(),

      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Messaging Groups",
          onClick: () => common.goToMsgGrps(),
          isActiveRoute: () => common.isMsgGrp(),
        },
      ],
    },
  ];
  return AdvertiserUserMenuList;
};

export const operatorAdminUserMenuList = ({ $state, navigationService }) => {
  const report = reportHelper({ $state, navigationService });

  // Operator-Admin User
  const goToOperatorLanding = () => {
    navigationService.goToOperatorLanding();
  };
  const onOperatorHome = () => $state.current.name === "dash.operatorLanding";

  const goToNcmCampaignOperator = () => {
    navigationService.goToNcmCampaignOperator();
  };

  const goToAggregateInventory = () => {
    navigationService.goToAggregateInventory();
  };

  const isNcmCampaignOperator = () =>
    $state.current.name === "dash.ncmCampaignOperator";

  const goToOperatorCreatives = () => {
    navigationService.goToOperatorCreatives();
  };
  const isOperatorCreatives = () =>
    $state.current.name === "dash.operatorCreatives";

  const goToTagApproval = () => {
    navigationService.goToTagApproval();
  };
  const isTagApproval = () => $state.current.name === "dash.tagApproval";

  const goToNcmLogsPage = () => {
    navigationService.goToNcmLogsPage();
  };
  const isNcmLogsPage = () => $state.current.name === "dash.ncmLogsPage";

  const isAggregateInventory = () =>
    $state.current.name === "dash.aggregateInventory";

  const goToOperatorPostLogs = () => {
    navigationService.goToOperatorPostLogs();
  };
  const onOperatorPostLogs = () =>
    $state.current.name === "dash.operatorPostLogs";
  const goToManageDishAudience = () => {
    navigationService.goToManageDishAudience();
  };
  const isManageDishAudience = () =>
    $state.current.name === "dash.manageDishAudience";

  const OperatorAdminUserMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToOperatorLanding(),
      isActiveRoute: () => onOperatorHome(),
    },
    {
      title: "Manage Orders",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToNcmCampaignOperator(),
      isActiveRoute: () => isNcmCampaignOperator(),
    },
    {
      title: "Manage Creative",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => goToOperatorCreatives(),
      isActiveRoute: () => isOperatorCreatives(),
    },
    {
      title: "Manage Audience",
      iconClass: "fas fa-user-friends fa-lg",
      onClick: () => goToManageDishAudience(),
      isActiveRoute: () => isManageDishAudience(),
    },
    {
      title: "Manage Campaign Tags",
      iconClass: "glyphicon glyphicon-tag",
      onClick: () => goToTagApproval(),
      isActiveRoute: () => isTagApproval(),
    },
    {
      title: "Aggregation Order Inventory",
      iconClass: "fa fa-tv",
      onClick: () => goToAggregateInventory(),
      isActiveRoute: () => isAggregateInventory(),
    },
    {
      title: "Logs",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToNcmLogsPage(),
      isActiveRoute: () => isNcmLogsPage(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Post Logs",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToOperatorPostLogs(),
      isActiveRoute: () => onOperatorPostLogs(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Impression Reports",
          onClick: () => report.goToAgencyCampaignReports(),
          isActiveRoute: () => report.isAgencyImpressionReports(),
        },
        {
          title: "View Pacing Reports",
          onClick: () => report.goToOperatorReportsPacing(),
          isActiveRoute: () => report.isOperatorReportsPacing(),
        },
        {
          title: "Post Campaign By ISCI and Daypart",
          onClick: () => report.goToOperatorReportsPostCampaign(),
          isActiveRoute: () => report.isOperatorReportsPostCampaign(),
        },
        {
          title: "Post Campaign By DMA",
          onClick: () => report.goToOperatorPostCampaignDaypartReports(),
          isActiveRoute: () => report.isOperatorPostCampaignDaypartReports(),
        },
      ],
    },
  ];
  return OperatorAdminUserMenuList;
};

export const vizioMenuList = ({ $state, navigationService }) => {
  //Vizio Admin
  const goToVizioLanding = () => {
    navigationService.goToVizioLanding();
  };
  const onVizioHome = () => $state.current.name === "dash.vizioLanding";

  const goToVizioManageOrder = () => {
    navigationService.goToVizioManageOrder();
  };
  const onVizioManageOrders = () =>
    $state.current.name === "dash.vizioManageOrders";

  const goToVizioTargetSegments = () => {
    navigationService.goToVizioTargetSegments();
  };
  const onVizioTargetSegments = () =>
    $state.current.name === "dash.vizioTargetSegments";

  const isCreativesModule = () =>
    isVizioReviewCreatives() || isVizioCreativesWatermarkApproval();

  const goToVizioReviewCreatives = () => {
    navigationService.goToVizioReviewCreatives();
  };
  const isVizioReviewCreatives = () =>
    $state.current.name === "dash.vizioReviewCreatives";

  const goToVizioCreativesWatermarkApproval = () => {
    navigationService.goToVizioCreativesWatermarkApproval();
  };
  const isVizioCreativesWatermarkApproval = () =>
    $state.current.name === "dash.vizioCreativesWatermarkApproval";

  const VizioMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToVizioLanding(),
      isActiveRoute: () => onVizioHome(),
    },
    {
      title: "Manage Orders",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToVizioManageOrder(),
      isActiveRoute: () => onVizioManageOrders(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "View Target Segments",
      iconClass: "fa fa-users fa-lg",
      onClick: () => goToVizioTargetSegments(),
      isActiveRoute: () => onVizioTargetSegments(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      isActiveRoute: () => isCreativesModule(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Review Replacement Creatives",
          onClick: () => goToVizioReviewCreatives(),
          isActiveRoute: () => isVizioReviewCreatives(),
        },
        {
          title: "Watermark QA Approval",
          onClick: () => goToVizioCreativesWatermarkApproval(),
          isActiveRoute: () => isVizioCreativesWatermarkApproval(),
        },
      ],
    },
  ];
  return VizioMenuList;
};

export const xandrMenuList = ({ $state, navigationService }) => {
  const report = reportHelper({ $state, navigationService });

  // Xandr Admin
  const goToXandrLanding = () => {
    navigationService.goToXandrLanding();
  };
  const onXandrHome = () => $state.current.name === "dash.xandrLanding";

  const goToXandrCreatives = () => {
    navigationService.goToXandrCreatives();
  };
  const onXandrCreatives = () => $state.current.name === "dash.xandrCreatives";

  const goToXandrSegmentFiles = () => {
    navigationService.goToXandrSegmentFiles();
  };
  const onXandrSegmentFiles = () =>
    $state.current.name === "dash.xandrSegmentFiles";

  const goToXandrManageOrders = () => {
    navigationService.goToXandrManageOrders();
  };
  const onXandrManageOrders = () =>
    $state.current.name === "dash.xandrManageOrders";

  const goToXandrPostLogs = () => {
    navigationService.goToXandrPostLogs();
  };
  const onXandrPostLogs = () => $state.current.name === "dash.xandrPostLogs";

  const XandrMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToXandrLanding(),
      isActiveRoute: () => onXandrHome(),
    },
    {
      title: "Manage Orders",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToXandrManageOrders(),
      isActiveRoute: () => onXandrManageOrders(),
    },
    {
      title: "Manage Creative",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => goToXandrCreatives(),
      isActiveRoute: () => onXandrCreatives(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Manage Campaign Tags",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToXandrSegmentFiles(),
      isActiveRoute: () => onXandrSegmentFiles(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Post Logs",
      iconClass: "fas fa-file fa-lg",
      onClick: () => goToXandrPostLogs(),
      isActiveRoute: () => onXandrPostLogs(),
      titleWrapper: {
        style: { paddingTop: "4px" },
      },
    },
    {
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Campaign Reports",
          onClick: () => report.goToXandrCampaignReports(),
          isActiveRoute: () => report.isCampaignReports(),
        },
        {
          title: "Billing Trends",
          onClick: () => report.goToXandrBillingTrends(),
          isActiveRoute: () => report.isBillingTrends(),
        },
        {
          title: "Billing Reports",
          onClick: () => report.goToXandrBillingReports(),
          isActiveRoute: () => report.isBillingReports(),
        },
      ],
    },
  ];

  return XandrMenuList;
};

export const cbsNetworkAdminMenuList = ({ $state, navigationService }) => {
  // CBS-ADMIN
  const report = reportHelper({ $state, navigationService });

  const goToCbsNetworkLanding = () => {
    navigationService.goToCbsNetworkLanding();
  };
  const onCbsNetworkLanding = () =>
    $state.current.name === "dash.cbsNetworkLanding";

  const goToCbsAddTraffickingPlan = () => {
    navigationService.goToCbsAddTraffickingPlan();
  };
  const onCbsAddTraffickingPlan = () =>
    $state.current.name === "dash.cbsAddTraffickingPlan";

  const goToCbsNetworkEdiTable = () => {
    navigationService.goToCbsNetworkEdiTable();
  };
  const onCbsNetworkEdiTable = () =>
    $state.current.name === "dash.cbsNetworkEdiTable";

  const goToCbsManageChannels = () => {
    navigationService.goToCbsManageChannels();
  };
  const onCbsManageChannels = () =>
    $state.current.name === "dash.cbsManageChannels";

  const isCreativesModule = () =>
    isCbsManageCreatives() ||
    isCbsReviewCreatives() ||
    isCbsCreativesWatermarkApproval();

  const goToCbsManageCreatives = () => {
    navigationService.goToCbsManageCreatives();
  };
  const isCbsManageCreatives = () =>
    $state.current.name === "dash.cbsManageCreatives";

  const goToCbsReviewCreatives = () => {
    navigationService.goToCbsReviewCreatives();
  };
  const isCbsReviewCreatives = () =>
    $state.current.name === "dash.cbsReviewCreatives";

  const goToCbsCreativesWatermarkApproval = () => {
    navigationService.goToCbsCreativesWatermarkApproval();
  };
  const isCbsCreativesWatermarkApproval = () =>
    $state.current.name === "dash.cbsCreativesWatermarkApproval";

  const CBSNetworkAdminMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToCbsNetworkLanding(),
      isActiveRoute: () => onCbsNetworkLanding(),
      titleWrapper: {
        style: { paddingBottom: "0.5px" },
      },
    },
    {
      title: "Network Logs",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToCbsAddTraffickingPlan(),
      isActiveRoute: () => onCbsAddTraffickingPlan(),
      titleWrapper: {
        style: { paddingBottom: "2px" },
      },
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => goToCbsNetworkEdiTable(),
      isActiveRoute: () => onCbsNetworkEdiTable(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      isActiveRoute: () => isCreativesModule(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Uploaded Creatives",
          onClick: () => goToCbsManageCreatives(),
          isActiveRoute: () => isCbsManageCreatives(),
        },
        {
          title: "Review Replacement Creatives",
          onClick: () => goToCbsReviewCreatives(),
          isActiveRoute: () => isCbsReviewCreatives(),
        },
        {
          title: "Watermark QA Approval",
          onClick: () => goToCbsCreativesWatermarkApproval(),
          isActiveRoute: () => isCbsCreativesWatermarkApproval(),
        },
      ],
    },
    {
      title: "Manage Networks",
      iconClass: "fa fa-tv",
      onClick: () => goToCbsManageChannels(),
      isActiveRoute: () => onCbsManageChannels(),
      titleWrapper: {
        style: { paddingTop: "2px" },
      },
    },
    {
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      iconProps: { "aria-hidden": true },
      isActiveRoute: () => report.isReportsOpen(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Delivery Reports",
          onClick: () => report.goToCbsDeliveryReports(),
          isActiveRoute: () => report.isCbsDeliveryReports(),
        },
        // {
        //   title: 'TV Ping Reports',
        //   onClick: () => report.goToCbsPingReports(),
        //   isActiveRoute: () => report.isCbsPingReports(),
        // },
        {
          title: "Campaign TV Ping Reports",
          onClick: () => report.goToCampaignTVPingReports(),
          isActiveRoute: () => report.isCampaignTvPingReports(),
        },
      ],
    },
  ];

  return CBSNetworkAdminMenuList;
};
export const foxNetworkAdminMenuList = ({ $state, navigationService }) => {
  // FOX-ADMIN
  const goToFoxNetworkLanding = () => {
    navigationService.goToFoxNetworkLanding();
  };
  const onFoxNetworkLanding = () =>
    $state.current.name === "dash.foxNetworkLanding";

  const goToFoxAddTraffickingPlan = () => {
    navigationService.goToFoxAddTraffickingPlan();
  };
  const onFoxAddTraffickingPlan = () =>
    $state.current.name === "dash.foxAddTraffickingPlan";

  const goToFoxNetworkEdiTable = () => {
    navigationService.goToFoxNetworkEdiTable();
  };
  const onFoxNetworkEdiTable = () =>
    $state.current.name === "dash.foxNetworkEdiTable";

  const goToFoxManageChannels = () => {
    navigationService.goToFoxManageChannels();
  };
  const onFoxManageChannels = () =>
    $state.current.name === "dash.foxManageChannels";

  // navigation to fox delivery reports
  const goToFoxDeliveryReports = () => {
    navigationService.goToFoxDeliveryReports();
  };
  const isFoxDeliveryReports = () =>
    $state.current.name === "dash.foxDeliveryReports";

  const isCreativesModule = () =>
    isFoxManageCreatives() ||
    isFoxReviewCreatives() ||
    isFoxCreativesWatermarkApproval();

  const goToFoxManageCreatives = () => {
    navigationService.goToFoxManageCreatives();
  };
  const isFoxManageCreatives = () =>
    $state.current.name === "dash.foxManageCreatives";

  const goToFoxReviewCreatives = () => {
    navigationService.goToFoxReviewCreatives();
  };
  const isFoxReviewCreatives = () =>
    $state.current.name === "dash.foxReviewCreatives";

  const goToFoxCreativesWatermarkApproval = () => {
    navigationService.goToFoxCreativesWatermarkApproval();
  };
  const isFoxCreativesWatermarkApproval = () =>
    $state.current.name === "dash.foxCreativesWatermarkApproval";

  const FOXNetworkAdminMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToFoxNetworkLanding(),
      isActiveRoute: () => onFoxNetworkLanding(),
      titleWrapper: {
        style: { paddingBottom: "0.5px" },
      },
    },
    {
      title: "Network Logs",
      iconClass: "fa fa-exchange-alt fa-lg",
      iconStyle: { transform: "rotate(135deg)" },
      onClick: () => goToFoxAddTraffickingPlan(),
      isActiveRoute: () => onFoxAddTraffickingPlan(),
      titleWrapper: {
        style: { paddingBottom: "2px" },
      },
    },
    {
      title: "Advertiser Schedule",
      iconClass: "fas fa-calendar-alt fa-lg",
      onClick: () => goToFoxNetworkEdiTable(),
      isActiveRoute: () => onFoxNetworkEdiTable(),
    },
    {
      title: "Creatives",
      iconClass: "fa fa-play-circle fa-lg",
      isActiveRoute: () => isCreativesModule(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Uploaded Creatives",
          onClick: () => goToFoxManageCreatives(),
          isActiveRoute: () => isFoxManageCreatives(),
        },
        {
          title: "Review Replacement Creatives",
          onClick: () => goToFoxReviewCreatives(),
          isActiveRoute: () => isFoxReviewCreatives(),
        },
        {
          title: "Watermark QA Approval",
          onClick: () => goToFoxCreativesWatermarkApproval(),
          isActiveRoute: () => isFoxCreativesWatermarkApproval(),
        },
      ],
    },
    {
      title: "Manage Networks",
      iconClass: "fa fa-tv",
      onClick: () => goToFoxManageChannels(),
      isActiveRoute: () => onFoxManageChannels(),
      titleWrapper: {
        style: { paddingTop: "2px" },
      },
    },
    {
      title: "Delivery Reports",
      iconClass: "fa fa-chart-line fa-lg",
      onClick: () => goToFoxDeliveryReports(),
      isActiveRoute: () => isFoxDeliveryReports(),
      titleWrapper: {
        style: { paddingTop: "2px" },
      },
    },
  ];

  return FOXNetworkAdminMenuList;
};

export const univisionNetworkAdminMenuList = ({
  $state,
  navigationService,
}) => {
  // Univison Network Admin

  // const isUnivisionPingReports = () => $state.current.name === 'dash.univisionPingReports';

  // const goToUnivisionPingReports = () => {
  //   navigationService.goToUnivisionPingReports();
  // };

  const goToUnivisionLanding = () => {
    return "/dash.univisionLanding";
  };
  const onUnivisionHome = () => $state.current.name === "dash.univisionLanding";

  const goToManageAudienceLanding = () => {
    return "/dash.manageAudienceLanding";
  };
  const onManageAudienceLanding = () =>
    $state.current.name === "/dash.manageAudienceLanding";

  const isUnivisionManageAudience = () =>
    onManageAudienceLanding() ||
    isCreateAudience() ||
    onUnivisionViewAudience();

  const goToUnivisionCreateAudience = () => {
    return "/dash.univisionCreateAudience";
  };
  const onUnivisionCreateAudience = () =>
    $state.current.name === "dash.univisionCreateAudience";

  const onUnivisionSelectFilters = () =>
    $state.current.name === "dash.univisionSelectAudience";

  const isCreateAudience = () =>
    onUnivisionCreateAudience() || onUnivisionSelectFilters();

  const goToUnivisionViewAudience = () => {
    return "/dash.univisionViewAudience";
  };
  const onUnivisionViewAudience = () =>
    $state.current.name === "dash.univisionViewAudience";

  const goToUnivisionNetworkLogs = () => {
    return "/dash.univisionNetworkLogs";
  };
  const goToUploadCreative = () => {
    return "/dash.uploadAdPool";
  };
  const goToViewPool = () => {
    return "/dash.viewPool";
  };
  const onViewPool = () => $state.current.name === "dash.viewPool";

  const onUploadCreative = () => $state.current.name === "dash.uploadAdPool";
  const onUnivisionNetworkLogs = () =>
    $state.current.name === "dash.univisionNetworkLogs";

  // const goToUnivisionNetworkEdiTable = () => {
  //   navigationService.goToUnivisionNetworkEdiTable();
  // };

  // const onUnivisionNetworkEdiTable = () => $state.current.name === 'dash.univisionEdiTable';

  const goToUnivisionAdministration = () => {
    return "/dash.univisionAdministration";
  };

  const onUnivisionAdministration = () =>
    $state.current.name === "dash.univisionAdministration";

  // const onUnivisionManageChannels = () => $state.current.name === 'dash.univisionManageChannels';

  const goToUnivisonCampaignLandingPage = () => {
    return "/dash.univisionCampaignLandingPage";
  };

  const onUnivisionCampaignLandingPage = () =>
    $state.current.name === "dash.univisionCampaignLandingPage" ||
    $state.current.name === "dash.univisionOrderManagement" ||
    $state.current.name === "dash.aggCampaign";

  // navigation to fox delivery reports
  // const goToUnivisionDeliveryReports = () => {
  //   navigationService.goToUnivisionDeliveryReports();
  // };

  const isUnivisionDeliveryReports = () =>
    $state.current.name === "dash.univisionDeliveryReports";

  // const isCreativesModule = () =>
  //   isUnivisionManageCreatives() || isUnivisionReviewCreatives() || isUnivisionCreativesWatermarkApproval();
  // isManageAdPool();

  // const goToUnivisionManageCreatives = () => {
  //   navigationService.goToUnivisionManageCreatives();
  // };
  // const isUnivisionManageCreatives = () => $state.current.name === 'dash.univisionManageCreatives';

  // const goToUnivisionReviewCreatives = () => {
  //   navigationService.goToUnivisionReviewCreatives();
  // };
  // const isUnivisionReviewCreatives = () => $state.current.name === 'dash.univisionReviewCreatives';

  // const goToUnivisionCreativesWatermarkApproval = () => {
  //   navigationService.goToUnivisionCreativesWatermarkApproval();
  // };
  // const isUnivisionCreativesWatermarkApproval = () =>
  //   $state.current.name === 'dash.univisionCreativesWatermarkApproval';

  const goToUnivisionReportsPacing = () => {
    return "dash.univisionReportsPacing";
  };

  const goToUnivisionReportsPostCampaign = () => {
    return "dash.univisionReportsPostCampaign";
  };

  const goToUnivisionPostCampaignDaypartReports = () => {
    return "dash.univisionPostCampaignDaypartReports";
  };

  // const goToUnivisionReportsCtvLogs = () => {
  //   navigationService.goToUnivisionReportsCtvLogs();
  // };

  const isUnivisionReportsPacing = () =>
    $state.current.name === "dash.univisionReportsPacing";

  const isUnivisionReportsPostCampaign = () =>
    $state.current.name === "dash.univisionReportsPostCampaign";

  const isUnivisionPostCampaignDaypartReports = () =>
    $state.current.name === "dash.univisionPostCampaignDaypartReports";

  const isUnivisionReportsCtvLogs = () =>
    $state.current.name === "dash.univisionReportsCtvLogs";

  const goToManageAdPool = () => {
    return "dash.managePool";
  };
  const isManageAdPool = () => $state.current.name === "dash.managePool";
  // const goToUnivisionInventorySpots = () => {
  //   navigationService.goToUnivisionInventorySpots();
  // };

  const goToUnivisionInventorySpot = () => {
    return "dash.univisionInventorySpot";
  };
  // const onUnivisionInventorySpots = () => $state.current.name === 'dash.univisionInventorySpots';

  const onUnivisionInventorySpot = () =>
    $state.current.name === "dash.univisionInventorySpot";

  const isViewSchedules = () =>
    onUnivisionNetworkLogs() || onUnivisionInventorySpot();

  const goToUnivisionManageCampaigns = () => {
    return "dash.univisionManageCampaigns";
  };
  const onUnivisionManageCampaigns = () =>
    $state.current.name === "dash.univisionManageCampaigns";

  const isManageCampaign = () =>
    onUnivisionCampaignLandingPage() ||
    onUnivisionManageCampaigns() ||
    $state.current.name === "dash.univisionOrderManagement";

  const isReportingModule = () =>
    isUnivisionReportsPacing() ||
    isUnivisionReportsPostCampaign() ||
    isUnivisionPostCampaignDaypartReports() ||
    isUnivisionReportsCtvLogs() ||
    // isCampaignTvPingReports() ||
    isUnivisionDeliveryReports();

  // const goToCampaignTVPingReports = () => {
  //   navigationService.goToCampaignTVPingReports();
  // };

  // const isCampaignTvPingReports = () => $state.current.name === 'dash.cbsCampaignTvPingReports';

  const UnivisionNetworkAdminMenuList = [
    {
      title: "Home",
      iconClass: "fa fa-home fa-lg",
      onClick: () => goToUnivisionLanding(),
      isActiveRoute: () => onUnivisionHome(),
    },
    // {
    //   title: 'Network Logs',
    //   iconClass: 'fa fa-exchange-alt fa-lg',
    //   iconStyle: { transform: 'rotate(135deg)' },
    //   onClick: () => goToUnivisionNetworkLogs(),
    //   isActiveRoute: () => onUnivisionNetworkLogs(),
    //   titleWrapper: {
    //     style: { paddingBottom: '2px' },
    //   },
    // },
    {
      title: "View Schedules",
      iconClass: "fas fa-calendar-alt fa-lg",
      isActiveRoute: () => isViewSchedules(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "View Schedules",
          onClick: () => goToUnivisionNetworkLogs(),
          isActiveRoute: () => onUnivisionNetworkLogs(),
        },
        {
          title: "View Addressable Inventory",
          onClick: () => goToUnivisionInventorySpot(),
          isActiveRoute: () => onUnivisionInventorySpot(),
        },
      ],
    },
    {
      title: "Manage Audience",
      iconClass: "fas fa-user-friends fa-lg",
      onClick: () => goToManageAudienceLanding(),
      isActiveRoute: () => isUnivisionManageAudience(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Build New Audience",
          onClick: () => goToUnivisionCreateAudience(),
          isActiveRoute: () => isCreateAudience(),
        },
        {
          title: "View/Manage Addressable Segments",
          onClick: () => goToUnivisionViewAudience(),
          isActiveRoute: () => onUnivisionViewAudience(),
        },
      ],
    },
    {
      title: "Order Management",
      iconClass: "fas fa-user-friends",
      isActiveRoute: () => isManageCampaign(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Build Campaign",
          onClick: () => goToUnivisonCampaignLandingPage(),
          isActiveRoute: () => onUnivisionCampaignLandingPage(),
        },
        {
          title: "Manage Campaigns",
          onClick: () => goToUnivisionManageCampaigns(),
          isActiveRoute: () => onUnivisionManageCampaigns(),
        },
      ],
    },
    // {
    //   title: 'Creatives',
    //   iconClass: 'fa fa-play-circle fa-lg',
    //   isActiveRoute: () => isCreativesModule(),
    //   isChildren: true,
    //   showChildren: false,
    //   children: [
    //     {
    //       title: 'Uploaded Creatives',
    //       onClick: () => goToUnivisionManageCreatives(),
    //       isActiveRoute: () => isUnivisionManageCreatives(),
    //     },
    //     {
    //       title: 'Review Replacement Creatives',
    //       onClick: () => goToUnivisionReviewCreatives(),
    //       isActiveRoute: () => isUnivisionReviewCreatives(),
    //     },
    //     {
    //       title: 'Watermark QA Approval',
    //       onClick: () => goToUnivisionCreativesWatermarkApproval(),
    //       isActiveRoute: () => isUnivisionCreativesWatermarkApproval(),
    //     },
    //   ],
    // },
    {
      title: "Manage Ad Pool",
      iconClass: "fa fa-play-circle fa-lg",
      onClick: () => goToManageAdPool(),
      isActiveRoute: () => isManageAdPool(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "Upload Ad Pool",
          onClick: () => goToUploadCreative(),
          isActiveRoute: () => onUploadCreative(),
        },
        {
          title: "View Pool",
          onClick: () => goToViewPool(),
          isActiveRoute: () => onViewPool(),
        },
      ],
      // titleWrapper: {
      //   style: { paddingBottom: '1.5px' },
      // },
    },
    {
      title: "Reports",
      iconClass: "fa fa-chart-line fa-lg",
      isActiveRoute: () => isReportingModule(),
      isChildren: true,
      showChildren: false,
      children: [
        {
          title: "View Pacing Reports",
          onClick: () => goToUnivisionReportsPacing(),
          isActiveRoute: () => isUnivisionReportsPacing(),
        },
        {
          title: "Post Campaign By ISCI and Daypart",
          onClick: () => goToUnivisionReportsPostCampaign(),
          isActiveRoute: () => isUnivisionReportsPostCampaign(),
        },
        {
          title: "Post Campaign By DMA",
          onClick: () => goToUnivisionPostCampaignDaypartReports(),
          isActiveRoute: () => isUnivisionPostCampaignDaypartReports(),
        },
        // {
        //   title: 'Download CTV Logs',
        //   onClick: () => goToUnivisionReportsCtvLogs(),
        //   isActiveRoute: () => isUnivisionReportsCtvLogs(),
        // },
        // {
        //   title: 'Delivery Reports',
        //   onClick: () => goToUnivisionDeliveryReports(),
        //   isActiveRoute: () => isUnivisionDeliveryReports(),
        // },
        // {
        //   title: 'TV Ping Reports',
        //   onClick: () => goToUnivisionPingReports(),
        //   isActiveRoute: () => isUnivisionPingReports(),
        // },
      ],
    },
    // {
    //   title: 'Manage Networks',
    //   iconClass: 'fa fa-tv',
    //   onClick: () => goToUnivisionManageChannels(),
    //   isActiveRoute: () => onUnivisionManageChannels(),
    //   titleWrapper: {
    //     style: { paddingTop: '2px' },
    //   },
    // },
    {
      title: "Administration",
      iconClass: "fa fa-tv",
      onClick: () => goToUnivisionAdministration(),
      isActiveRoute: () => onUnivisionAdministration(),
      titleWrapper: {
        style: { paddingTop: "2px", paddingLeft: "15px" },
      },
    },
  ];

  return UnivisionNetworkAdminMenuList;
};

const reportHelper = ({ $state, navigationService }) => {
  // Reports
  const isReportsOpen = () =>
    $state.current.name === "dash.networkCampaignReports" ||
    $state.current.name === "dash.agencyCampaignReports" ||
    $state.current.name === "dash.advertiserCampaignReports" ||
    $state.current.name === "dash.networkDeliveryReports" ||
    $state.current.name === "dash.xandrCampaignReports" ||
    $state.current.name === "dash.xandrBillingTrends" ||
    $state.current.name === "dash.xandrBillingReports" ||
    $state.current.name === "dash.cbsDeliveryReports" ||
    $state.current.name === "dash.agencyDeliveryReports" ||
    $state.current.name === "dash.advertiserDeliveryReports" ||
    $state.current.name === "dash.cbsPingReports" ||
    $state.current.name === "dash.operatorImpressionReportsSaso" ||
    $state.current.name === "dash.operatorImpressionReportsMaso" ||
    $state.current.name === "dash.operatorImpressionReportsAgg" ||
    $state.current.name === "dash.univisionReportsPostCampaign" ||
    $state.current.name === "dash.univisionPostCampaignDaypartReports" ||
    $state.current.name === "dash.univisionReportsPacing";
  const isCampaignReports = () =>
    $state.current.name === "dash.xandrCampaignReports" ||
    $state.current.name === "dash.networkCampaignReports";
  const isBillingReports = () =>
    $state.current.name === "dash.xandrBillingReports";

  const isBillingTrends = () =>
    $state.current.name === "dash.xandrBillingTrends";
  const isNetworkDeliveryReports = () =>
    $state.current.name === "dash.networkDeliveryReports";

  const goToAgencyCampaignReports = () => {
    navigationService.goToAgencyCampaignReports();
  };
  const isAgencyImpressionReports = () =>
    $state.current.name === "dash.agencyCampaignReports";

  const goToAdvertiserCampaignReports = () => {
    navigationService.goToAdvertiserCampaignReports();
  };
  const isAdvertiserImpressionReports = () =>
    $state.current.name === "dash.advertiserCampaignReports";

  const goToAgencyDeliveryReports = () => {
    navigationService.goToAgencyDeliveryReports();
  };
  const isAgencyDeliveryReports = () =>
    $state.current.name === "dash.agencyDeliveryReports";

  const goToAdvertiserDeliveryReports = () => {
    navigationService.goToAdvertiserDeliveryReports();
  };
  const isAdvertiserDeliveryReports = () =>
    $state.current.name === "dash.advertiserDeliveryReports";
  // navigation to network reports
  const goToNetworkCampaignReports = () => {
    navigationService.goToNetworkCampaignReports();
  };
  const goToNetworkDeliveryReports = () => {
    navigationService.goToNetworkDeliveryReports();
  };

  // navigation to operator reports
  const goToOperatorImpressionReports = () => {
    navigationService.goToOperatorImpressionReports();
  };
  const isOprImpressionReports = () =>
    $state.current.name === "dash.operatorImpressionReports";

  const goToOperatorImpressionReportsSaso = () => {
    navigationService.goToOperatorImpressionReportsSaso();
  };
  const isOprImpressionReportsSaso = () =>
    $state.current.name === "dash.operatorImpressionReportsSaso";

  const goToOperatorImpressionReportsMaso = () => {
    navigationService.goToOperatorImpressionReportsMaso();
  };
  const isOprImpressionReportsMaso = () =>
    $state.current.name === "dash.operatorImpressionReportsMaso";

  const goToOperatorImpressionReportsAgg = () => {
    navigationService.goToOperatorImpressionReportsAgg();
  };
  const isOprImpressionReportsAgg = () =>
    $state.current.name === "dash.operatorImpressionReportsAgg";

  const goToOperatorReportsPacing = () => {
    navigationService.goToOperatorReportsPacing();
  };

  const goToOperatorReportsPostCampaign = () => {
    navigationService.goToOperatorReportsPostCampaign();
  };

  const goToOperatorPostCampaignDaypartReports = () => {
    navigationService.goToOperatorPostCampaignDaypartReports();
  };

  const isOperatorReportsPacing = () =>
    $state.current.name === "dash.univisionReportsPacing";

  const isOperatorPostCampaignDaypartReports = () =>
    $state.current.name === "dash.univisionPostCampaignDaypartReports";

  const isOperatorReportsPostCampaign = () =>
    $state.current.name === "dash.univisionReportsPostCampaign";

  // navigation to xandr operator reports
  const goToXandrCampaignReports = () => {
    navigationService.goToXandrCampaignReports();
  };
  const goToXandrBillingTrends = () => {
    navigationService.goToXandrBillingTrends();
  };
  const goToXandrBillingReports = () => {
    navigationService.goToXandrBillingReports();
  };

  const goToROIReports = () => {
    navigationService.goToROIReports();
  };

  const isROIReports = () => $state.current.name === "dash.roiReports";

  // Naviagtion to CBS reports
  const isCbsDeliveryReports = () =>
    $state.current.name === "dash.cbsDeliveryReports";
  const isCbsPingReports = () => $state.current.name === "dash.cbsPingReports";
  const isCampaignTvPingReports = () =>
    $state.current.name === "dash.cbsCampaignTvPingReports";

  const goToCbsDeliveryReports = () => {
    navigationService.goToCbsDeliveryReports();
  };
  const goToCbsPingReports = () => {
    navigationService.goToCbsPingReports();
  };

  const goToCampaignTVPingReports = () => {
    navigationService.goToCampaignTVPingReports();
  };

  return {
    isReportsOpen,
    isCampaignReports,
    isBillingReports,
    isBillingTrends,
    isNetworkDeliveryReports,
    goToNetworkCampaignReports,
    goToAgencyCampaignReports,
    goToAdvertiserCampaignReports,
    goToAgencyDeliveryReports,
    goToAdvertiserDeliveryReports,
    goToNetworkDeliveryReports,
    goToOperatorImpressionReports,
    isOprImpressionReports,
    goToXandrCampaignReports,
    goToXandrBillingTrends,
    goToXandrBillingReports,
    goToROIReports,
    isROIReports,
    isAgencyImpressionReports,
    isAdvertiserImpressionReports,
    isAgencyDeliveryReports,
    isAdvertiserDeliveryReports,
    isCbsDeliveryReports,
    isCbsPingReports,
    goToCbsDeliveryReports,
    goToCbsPingReports,
    goToCampaignTVPingReports,
    isCampaignTvPingReports,
    goToOperatorImpressionReportsSaso,
    isOprImpressionReportsSaso,
    goToOperatorImpressionReportsMaso,
    isOprImpressionReportsMaso,
    goToOperatorImpressionReportsAgg,
    isOprImpressionReportsAgg,
    goToOperatorPostCampaignDaypartReports,
    goToOperatorReportsPostCampaign,
    isOperatorReportsPostCampaign,
    isOperatorPostCampaignDaypartReports,
    goToOperatorReportsPacing,
    isOperatorReportsPacing,
  };
};

const commonHelper = ({ $state, navigationService }) => {
  // Common START
  const goToNcmCampaignLandingPage = () => {
    navigationService.goToNcmCampaignLandingPage();
  };
  const isCustomMessagin = () =>
    $state.current.name === "dash.ncmCampaign" ||
    $state.current.name === "dash.ncmStrategySelector" ||
    $state.current.name === "dash.ncmCreate2" ||
    $state.current.name === "dash.ncmCampaignManage";
  const istradeInState = () =>
    $state.current.name === "dash.newTradeIn" ||
    $state.current.name === "dash.tradeInSummary" ||
    $state.current.name === "dash.tradeInManage";

  const goToSegments = () => {
    navigationService.goToSegments();
  };
  const isAudienceGroup = () =>
    $state.current.name === "dash.segmentLandingPage" ||
    $state.current.name === "dash.createNewSegment";

  const goToMsgGrps = () => {
    navigationService.goToMsgGrps();
  };
  const isMsgGrp = () =>
    $state.current.name === "dash.messagingGroup" ||
    $state.current.name === "dash.defineMessagingGroups";

  const goToCreatives = () => {
    navigationService.goToCreatives();
  };

  // console.log(navigationService.goToManageAdPool,"kk")

  const isCreatives = () => $state.current.name === "dash.creatives";

  const goToAgencyBrandSubrand = () => {
    navigationService.goToAgencyBrandSubrand();
  };

  const goToEdiTable = () => {
    navigationService.goToEdiTable();
  };
  const isEdiTable = () => $state.current.name === "dash.EdiTable";

  const goToAgencyAdminManageUsers = () => {
    navigationService.gotoAgencyAdminManageUsers();
  };
  const isAgencyAdminManageUsers = () =>
    $state.current.name === "dash.agencyAdminManageUsers";

  const isSegmentState = () =>
    $state.current.name === "dash.messagingGroup" ||
    $state.current.name === "dash.retargetSegment" ||
    $state.current.name === "dash.segmentLandingPage" ||
    $state.current.name === "dash.createNewSegment" ||
    $state.current.name === "dash.defineMessagingGroups";

  const isAgencyRepBrandSubBrand = () =>
    $state.current.name === "dash.agencyBrandSubBrand" ||
    $state.current.name === "app.agencyAdminAddCompany";

  const goToAgencyAdminManageAdvertisers = () => {
    navigationService.goToAgencyAdminManageAdvertisers();
  };
  const isAgencyAdminManageAdvertisers = () =>
    $state.current.name === "dash.agencyAdminManageAdvertisers" ||
    $state.current.name === "dash.agencyAdminAddCompany" ||
    $state.current.name === "dash.agencyAdminAddBrand";
  const isManageState = () =>
    $state.current.name === "dash.agencyAdminManageUsers" ||
    isAgencyRepBrandSubBrand() ||
    $state.current.name === "dash.AdminAdvertiserList" ||
    isAgencyAdminManageAdvertisers() ||
    $state.current.name === "dash.agencyAdminManageUsers" ||
    $state.current.name === "dash.agencyAdminAddBrand";

  return {
    goToNcmCampaignLandingPage,
    isCustomMessagin,
    istradeInState,
    goToSegments,
    isAudienceGroup,
    goToMsgGrps,
    isMsgGrp,
    goToCreatives,
    isCreatives,
    goToAgencyBrandSubrand,
    goToEdiTable,
    isEdiTable,
    goToAgencyAdminManageUsers,
    isAgencyAdminManageUsers,
    isSegmentState,
    isManageState,
    goToAgencyAdminManageAdvertisers,
    isAgencyAdminManageAdvertisers,
    isAgencyRepBrandSubBrand,
    // goToManageAdPool,
    // isManageAdPool,
  };
};

export const isAuthorized = function ({
  $state,
  navigationService,
  authStore,
}) {
  const isAgencyRepUser = authStore.isAgencyRepUser();
  const isAgencyAdminUser = authStore.isAgencyAdminUser();
  const isAdvertiserAdminUser = authStore.isAdvertiserAdminUser();
  const isAdvertiserUserUser = authStore.isAdvertiserUserUser();
  const isSuperAdminUser = authStore.isSuperAdminUser();
  const isNetworkAdminUser = authStore.isNetworkAdminUser();
  const isOperatorAdminUser = authStore.isOperatorAdminUser();
  const isCbsNetworkAdminUser = authStore.isCbsNetworkAdminUser();
  const isFoxNetworkAdminUser = authStore.isFoxNetworkAdminUser();
  const isUnivisionNetworkAdminUser = authStore.isUnivisionNetworkAdminUser();
  if (isAdvertiserAdminUser) {
    return advertiserAdminMenuList({ $state, navigationService });
  } else if (isSuperAdminUser) {
    return superAdminMenuList({ $state, navigationService });
  } else if (
    isNetworkAdminUser &&
    authStore.userObj.related_data.network.name !== "vizio_fox" &&
    !isCbsNetworkAdminUser &&
    !isFoxNetworkAdminUser &&
    !isUnivisionNetworkAdminUser
  ) {
    return networkAdminMenuList({ $state, navigationService });
  } else if (
    isNetworkAdminUser &&
    authStore.userObj.related_data.network.name === "vizio_fox"
  ) {
    return vizioFoxAdminMenuList({ $state, navigationService });
  } else if (isAgencyAdminUser) {
    return agencyAdminMenuList({ $state, navigationService });
  } else if (isAgencyRepUser) {
    return agencyRepUserMenuList({ $state, navigationService });
  } else if (isAdvertiserUserUser) {
    return advertiserUserMenuList({ $state, navigationService });
  } else if (
    isOperatorAdminUser &&
    authStore.userObj.related_data.operator.name === "dish"
  ) {
    return operatorAdminUserMenuList({ $state, navigationService });
  } else if (
    isOperatorAdminUser &&
    authStore.userObj.related_data.operator.name === "vizio"
  ) {
    return vizioMenuList({ $state, navigationService });
  } else if (
    isOperatorAdminUser &&
    authStore.userObj.related_data.operator.name === "xandr"
  ) {
    return xandrMenuList({ $state, navigationService });
  } else if (isCbsNetworkAdminUser) {
    return cbsNetworkAdminMenuList({ $state, navigationService });
  } else if (isFoxNetworkAdminUser) {
    return foxNetworkAdminMenuList({ $state, navigationService });
  } else if (isUnivisionNetworkAdminUser) {
    return univisionNetworkAdminMenuList({ $state, navigationService });
  }
  return null;
};
