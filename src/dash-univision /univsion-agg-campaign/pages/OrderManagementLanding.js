import React from "react";
import PropTypes from "prop-types";
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../../components/PageLayout";
import { PageTitle } from "../../../components/Typography";
import { FaRegPlusSquare, FaUserEdit } from "react-icons/fa";
import LandingPage from "../../../components/LandingPage";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../../routes/NavigationService";

const UnivisionOrderManagement = () => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const univisionncmContentList = [
    {
      id: "ncm_heading_campaign_management",
      buttons: [
        {
          id: "build_new_campaign",
          name: "Build New Campaign",
          icon: FaRegPlusSquare,
          onClickFunction: () => {
            navigationService.goToUnivisonCampaignLandingPage();
          },
        },
        {
          id: "build_maso_campaign",
          name: "View/Manage Campaigns",
          icon: FaRegPlusSquare,
          onClickFunction: () => {
            navigationService.goToUnivisionManageCampaigns();
          },
        },
        {
          id: "build_saso_campaign",
          name: "Manage Advertisers",
          icon: FaUserEdit,
          onClickFunction: () => {
            navigationService.goToUnivisionAdministration();
          },
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Build New Campaign</PageTitle>
      </PageHeader>
      <PageContent>
        <LandingPage landingList={univisionncmContentList} />
      </PageContent>
    </MainContent>
  );
};
UnivisionOrderManagement.propTypes = {};

export default UnivisionOrderManagement;
