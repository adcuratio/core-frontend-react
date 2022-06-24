import React from "react";
import PropTypes from "prop-types";
import { FaExchangeAlt, FaPlayCircle } from "react-icons/fa";

import { PageTitle } from "../../components/Typography";
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../components/PageLayout";
import LandingPage from "../../components/LandingPage";
import { observer, inject } from "mobx-react";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../routes/NavigationService";

const ManagePool = inject("networkStore")(
  observer((props) => {
    let navigate = useNavigate();
    let navigationService = new NavigationService(navigate);

    const ManageAdLandingList = [
      {
        id: "op_heading_management",
        buttons: [
          {
            id: "op_manage_orders",
            name: "Upload Ad",
            icon: FaExchangeAlt,
            iconClass: "rotate-icon-diag",
            onClickFunction: () => {
              navigationService.goToUploadCreative();
            },
          },
          {
            id: "op_manage_creatives",
            name: "View/Manage Ad Pool",
            icon: FaPlayCircle,
            iconClass: "fa-lg",
            onClickFunction: () => {
              navigationService.goToViewPool();
            },
          },
        ],
      },
    ];

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Manage Ad Pool</PageTitle>
        </PageHeader>
        <PageContent>
          <LandingPage landingList={ManageAdLandingList} />
        </PageContent>
      </MainContent>
    );
  })
);

ManagePool.propTypes = {
  navigationService: PropTypes.object,
};

export default ManagePool;
