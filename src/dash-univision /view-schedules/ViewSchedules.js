import React from "react";
import PropTypes from "prop-types";
import { FaCalendarAlt } from "react-icons/fa";

import {
  MainContent,
  PageContent,
  PageHeader,
} from "../../components/PageLayout";
import { PageTitle } from "../../components/Typography";
import LandingPage from "../../components/LandingPage";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../routes/NavigationService";

const ViewSchedulesLanding = (props) => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);

  const univisionViewSchedules = [
    {
      id: "view_schedules",
      buttons: [
        {
          id: "view_Schedule",
          name: "View Schedule",
          onClickFunction: () => navigationService.goToUnivisionNetworkLogs(),
          icon: FaCalendarAlt,
        },
        {
          id: "view_addressable_inventory",
          name: "View Addressable Inventory",
          onClickFunction: () => navigationService.goToUnivisionInventorySpot(),
          icon: FaCalendarAlt,
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>View Schedules Dashboard</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={univisionViewSchedules} />
      </PageContent>
    </MainContent>
  );
};

ViewSchedulesLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default ViewSchedulesLanding;
