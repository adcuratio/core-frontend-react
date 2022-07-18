import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { MainContent, PageHeader, PageContent } from "../components/PageLayout";
import { PageTitle } from "../components/Typography";
import { useNavigate } from "react-router-dom";
import NavigationService from "../routes/NavigationService";
import {
  FaUserFriends,
  FaPlayCircle,
  FaCalendarAlt,
  FaChartLine,
  // FaExchangeAlt,
  FaUserEdit,
} from "react-icons/fa";
import LandingPage from "../components/LandingPage";

const UnivisionLanding = () => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const univisionLandingList = [
    {
      id: "ncm_heading_campaign_management",
      buttons: [
        {
          id: "manage_Audience",
          name: "Manage Audience",
          onClickFunction: () => navigationService.goToManageAudienceLanding(),
          icon: FaUserFriends,
        },
        {
          id: "manage_Forecast",
          name: "Build / View Forecast",
          onClickFunction: () => navigationService.goToForecastLanding(),
          icon: FaUserFriends,
        },
        {
          id: "manage_ad_pool",
          name: "Manage Ad Pool",
          onClickFunction: () => navigationService.goToManageAdPool(),
          icon: FaPlayCircle,
        },
        {
          id: "view_Schedule",
          name: "View Schedule",
          onClickFunction: () => navigationService.goToViewSchedules(),
          icon: FaCalendarAlt,
        },
        {
          id: "manage_campaign",
          name: "Order Management",
          onClickFunction: () =>
            navigationService.goToUnivisionOrderManagement(),

          icon: FaUserFriends,
        },
        {
          id: "Reporting",
          name: "Reports",
          onClickFunction: () => navigationService.goToUnivisionReportsTiles(),
          icon: FaChartLine,
        },
        // {
        //   id: 'Forcasting',
        //   name: 'Forecasting',
        //   onClickFunction: () => null,
        //   icon: FaExchangeAlt,
        //   iconClass: 'rotate-icon-diag',
        // },
        {
          id: "Administration",
          name: "Administration",
          onClickFunction: () =>
            navigationService.goToUnivisionAdministration(),
          icon: FaUserEdit,
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Univision Network Admin Dashboard</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={univisionLandingList} />
      </PageContent>
    </MainContent>
  );
};
UnivisionLanding.propTypes = {
  navigationService: PropTypes.object,
};

console.log(<UnivisionLanding />);

export default UnivisionLanding;
