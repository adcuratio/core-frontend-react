import React from "react";
import PropTypes from "prop-types";
import {
  FaChartLine,
  FaExchangeAlt,
  FaFile,
  FaPlayCircle,
  FaTag,
  FaUserFriends,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../routes/NavigationService";
import { PageTitle } from "../components/Typography";
import { MainContent, PageHeader, PageContent } from "../components/PageLayout";
import LandingPage from "../components/LandingPage";

const OperatorLanding = (props) => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const operatorLandingList = [
    {
      id: "op_heading_management",
      heading: "Operator Management",
      buttons: [
        {
          id: "op_manage_orders",
          name: "Manage Orders",
          icon: FaExchangeAlt,
          iconClass: "rotate-icon-diag",
          onClickFunction: () => {
            navigationService.goToNcmCampaignOperator();
          },
        },
        {
          id: "op_manage_creatives",
          name: "Manage Creative",
          icon: FaPlayCircle,
          iconClass: "fa-lg",
          onClickFunction: () => {
            navigationService.goToOperatorCreatives();
          },
        },
        {
          id: "op_manage_audience",
          name: "Manage Audience",
          icon: FaUserFriends,
          iconClass: "fa-lg",
          onClickFunction: () => {
            navigationService.goToManageDishAudience();
          },
        },
        {
          id: "op_manage_forecast",
          name: "Forecast",
          icon: FaUserFriends,
          iconClass: "fa-lg",
          onClickFunction: () => {
            navigationService.goToDishForeCast();
          },
        },
        {
          id: "op_manage_campaign_tags",
          name: "Manage Campaign Tags",
          icon: FaTag,
          onClickFunction: () => {
            navigationService.goToTagApproval();
          },
        },
      ],
    },
    {
      id: "op_heading_logs",
      heading: "Operator Logs",
      buttons: [
        {
          id: "op_logs",
          name: "Logs",
          icon: FaFile,
          onClickFunction: () => {
            navigationService.goToNcmLogsPage();
          },
        },
        {
          id: "op_post_logs",
          name: "Post Logs",
          icon: FaFile,
          onClickFunction: () => {
            navigationService.goToOperatorPostLogs();
          },
        },
      ],
    },
    {
      id: "op_heading_reports",
      heading: "Reports",
      buttons: [
        {
          id: "op_report",
          name: "Reports",
          icon: FaChartLine,
          onClickFunction: () => {
            navigationService.goToOperatorReportsLanding();
          },
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Distributor Admin Dashboard</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={operatorLandingList} />
      </PageContent>
    </MainContent>
  );
};

OperatorLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default OperatorLanding;
