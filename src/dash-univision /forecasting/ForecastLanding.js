import React from "react";
import PropTypes from "prop-types";
import { FaUsers, FaRegPlusSquare } from "react-icons/fa";
import LandingPage from "../../components/LandingPage";
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../components/PageLayout";
import { PageTitle } from "../../components/Typography";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../routes/NavigationService";

const ForecastLanding = (props) => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const tableState = 0;

  const manageForecastLandingList = [
    {
      id: "build-view-univision-forecast",
      buttons: [
        {
          id: "build_univision_forecast",
          name: "Build New Forecast",
          onClickFunction: () =>
            navigationService.goToUnivsionBuildForecasting(),
          icon: FaRegPlusSquare,
        },
        {
          id: "view_univision_forecast",
          name: "View Forecast",
          onClickFunction: () =>
            navigationService.goToUnivsionManageForecasting(tableState),
          icon: FaUsers,
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Build / View Forecast</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={manageForecastLandingList} />
      </PageContent>
    </MainContent>
  );
};

ForecastLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default ForecastLanding;
