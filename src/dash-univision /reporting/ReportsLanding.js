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

const ReportsLanding = (props) => {
  let navigate = useNavigate();
  let navigationService = new NavigationService(navigate);
  const reportsLandingList = [
    {
      id: "heading_reports",
      buttons: [
        {
          id: "pacing_reports",
          name: "View Pacing Reports",
          onClickFunction: () => navigationService.goToUnivisionReportsPacing(),
          icon: FaChartLine,
        },
        {
          id: "post_campaign_network_reports",
          name: "Post Campaign By ISCI and Hour",
          onClickFunction: () =>
            navigationService.goToUnivisionReportsPostCampaign(),
          icon: FaChartLine,
        },
        {
          id: "post_campaign_daypart_reports",
          name: "Post Campaign By DMA",
          onClickFunction: () =>
            navigationService.goToUnivisionPostCampaignDaypartReports(),
          icon: FaChartLine,
        },
        // {
        //   id: 'download_ctv_logs',
        //   name: 'Download CTV Logs',
        //   onClickFunction: () => navigationService.goToUnivisionReportsCtvLogs(),
        //   icon: FaChartLine,
        // },
        // {
        //   id: 'delivery_reports',
        //   name: 'Delivery Reports',
        //   onClickFunction: () => navigationService.goToUnivisionDeliveryReports(),
        //   icon: FaChartLine,
        // },
        // {
        //   id: 'tv_ping_reports',
        //   name: 'TV Ping Reports',
        //   onClickFunction: () => navigationService.goToUnivisionPingReports(),
        //   icon: FaChartLine,
        // },
      ],
    },
  ];

  return (
    <MainContent>
      <PageHeader>
        <PageTitle>Reports Dashboard</PageTitle>
      </PageHeader>
      <PageContent>
        <div className="mt20">
          <LandingPage landingList={reportsLandingList} />
        </div>
      </PageContent>
    </MainContent>
  );
};
ReportsLanding.propTypes = {
  navigationService: PropTypes.object,
};

export default ReportsLanding;
