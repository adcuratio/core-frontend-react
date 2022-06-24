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

const ManageAudienceLanding = () => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const tableState = 0;

  const manageAudienceLandingList = [
    {
      id: "build-manage-univision-audience",
      buttons: [
        {
          id: "build_audience",
          name: "Build New Audience",
          onClickFunction: () =>
            navigationService.goToUnivisionCreateAudience(),
          icon: FaRegPlusSquare,
        },
        {
          id: "manage_audience",
          name: "View/Manage Addressable Segments",
          onClickFunction: () =>
            navigationService.goToUnivisionViewAudience(tableState),
          icon: FaUsers,
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Manage Audience</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={manageAudienceLandingList} />
      </PageContent>
    </MainContent>
  );
};

ManageAudienceLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default ManageAudienceLanding;
