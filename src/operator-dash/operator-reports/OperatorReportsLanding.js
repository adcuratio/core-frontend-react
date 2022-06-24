import React from "react";
import PropTypes from "prop-types";
import {
  MainContent,
  PageHeader,
  PageContent,
} from "../../components/PageLayout";
import { PageTitle } from "../../components/Typography";
import { FaChartLine } from "react-icons/fa";
import LandingPage from "../../components/LandingPage";
import { useNavigate } from "react-router-dom";
import NavigationService from "../../routes/NavigationService";

const OperatorReportsLanding = (props) => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);

  const reportsLandingList = [
    {
      id: "heading_reports",
      buttons: [
        {
          id: "impression_reports_saso",
          name: "Impression Reports",
          onClickFunction: () => navigationService.goToAgencyCampaignReports(),
          icon: FaChartLine,
        },
        {
          id: "pacing_reports",
          name: "View Pacing Reports",
          onClickFunction: () => navigationService.goToOperatorReportsPacing(),
          icon: FaChartLine,
        },
        {
          id: "post_campaign_network_reports",
          name: "View Post Campaign Network Reports",
          onClickFunction: () =>
            navigationService.goToOperatorReportsPostCampaign(),
          icon: FaChartLine,
        },
        {
          id: "post_campaign_daypart_reports",
          name: "View Post Campaign Daypart Reports",
          onClickFunction: () =>
            navigationService.goToOperatorPostCampaignDaypartReports(),
          icon: FaChartLine,
        },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Dish Reports Dashboard</PageTitle>
      </PageHeader>
      <PageContent>
        <div className="mt20">
          <LandingPage landingList={reportsLandingList} />
        </div>
      </PageContent>
    </MainContent>
  );
};
OperatorReportsLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default OperatorReportsLanding;
