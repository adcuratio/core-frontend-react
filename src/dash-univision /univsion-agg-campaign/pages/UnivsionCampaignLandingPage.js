import React from 'react';
import PropTypes from 'prop-types';
import { MainContent, PageHeader, PageContent } from '../../../components/PageLayout';
import { PageTitle } from '../../../components/Typography';
import { FaRegPlusSquare, FaUserEdit } from 'react-icons/fa';
import LandingPage from '../../../components/LandingPage';

const UnivisionCampaignLandingPage = (props) => {
  const { navigationService } = props;

  const univisionncmContentList = [
    {
      id: 'ncm_heading_campaign_management',
      buttons: [
        {
          id: 'build_agg_campaign',
          name: 'Build AGG Campaign',
          icon: FaRegPlusSquare,
          onClickFunction: () => {
            navigationService.goToAggCampaign();
          },
          isHidden: false,
          isGreyOut: false,
        },
        {
          id: 'build_maso_campaign',
          name: 'Build MASO Campaign',
          icon: FaRegPlusSquare,
          onClickFunction: () => {},
          isHidden: false,
          isGreyOut: true,
        },
        {
          id: 'build_saso_campaign',
          name: 'Build SASO Campaign',
          icon: FaRegPlusSquare,
          onClickFunction: () => {
            // navigationService.goToNCMCreate2('standard');
          },
          isHidden: false,
          isGreyOut: true,
        },
        {
          id: 'view_drafts',
          name: 'View Drafts',
          icon: FaUserEdit,
          onClickFunction: () => {
            navigationService.goToAggCampaignDrafts();
          },
          isHidden: false,
          isGreyOut: false,
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
UnivisionCampaignLandingPage.propTypes = {
  navigationService: PropTypes.object,
};

export default UnivisionCampaignLandingPage;
