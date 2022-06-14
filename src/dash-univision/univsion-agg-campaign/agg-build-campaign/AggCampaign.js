import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import StepProgress from 'react-stepper-horizontal';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import withStore from '../../../hocs/WithStore';

import { MainContent, PageHeader, PageContent } from '../../../components/PageLayout';
import { PageTitle } from '../../../components/Typography';
import { showAckMessage, showAckErrorMessage } from '../../../common/utils';
import ReactLoader from '../../../components/ReactLoader';

import CompanySelection from './components/CompanySelection';
import CampaignDetails from './components/CampaignDetails';
import ReviewCampaignDetails from './components/ReviewCampaignDetails';

const AggCampaign = inject(
  'uiStore',
  'companyStore',
  'aggCampaignStore',
  '$state'
)(
  observer((props) => {
    const { uiStore, companyStore, aggCampaignStore, $state, navigationService } = props;
    const steps = [
      { title: 'Select Advertiser' },
      { title: 'Enter Campaign Details' },
      { title: 'Review Campaign Details' },
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCompanyData, setSelectedCompanyData] = useState({
      companyId: 0,
      companyName: '',
      addadvertiserFreeText: '',
    });
    const [levelData, setLevelData] = useState({});

    useEffect(() => {
      companyStore.getAllCompanies().then(() => {
        if ($state?.params?.draftData !== null) {
          const copyData = _.cloneDeep($state?.params?.draftData?.campaign_data);
          copyData.campaign_name = $state?.params?.draftData?.campaign_data?.name;
          delete copyData?.name;
          setLevelData(copyData);
          const companyData = toJS(
            companyStore.companies.find(
              (company) => company.company.id === parseInt($state?.params?.draftData?.adv_company?.id)
            )
          );
          const advertiserData = { ...selectedCompanyData };
          advertiserData.companyId = $state?.params?.draftData?.adv_company?.id;
          advertiserData.companyName = companyData;
          setSelectedCompanyData(advertiserData);
          setCurrentStep(1);
        }
      });
      aggCampaignStore.getNetworksData();
      aggCampaignStore?.getShowsData();
    }, []);

    useEffect(() => {
      if (selectedCompanyData.companyId) {
        aggCampaignStore.getCreativesData(selectedCompanyData.companyId, 'Aggregation');
      }
    }, [selectedCompanyData]);

    const stepProgress = (value) => {
      if (value === 'nextStep') {
        setCurrentStep(currentStep + 1);
      } else if (value === 'previousStep') {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleCompanySelection = (e, id) => {
      const companyData = toJS(
        companyStore.companies.find((company) => company.company.id === parseInt(e.target.value))
      );
      const advertiserData = { ...selectedCompanyData };
      if (id === 'select_company') {
        advertiserData.companyId = e.target.value;
        advertiserData.companyName = companyData;
      } else if (id === 'free_form_text') {
        advertiserData.addadvertiserFreeText = e.target.value;
      }
      setSelectedCompanyData(advertiserData);
    };

    const getCorrectDate = (dateData) => {
      if (dateData.includes('-')) return dateData;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months.indexOf(dateData.split(' ')[1]) + 1;
      const date = dateData.split(' ')[2];
      const year = dateData.split(' ')[3];
      return `${year}-${month}-${date}`;
    };

    const onSubmit = async () => {
      const tableState = 1;
      const obj = _.cloneDeep(levelData);
      if (obj) {
        delete obj?.name;
        const name = obj?.campaign_name;
        obj['name'] = name;
        delete obj?.campaign_name;
        const StartDate = getCorrectDate(obj?.start_date);
        const EndDate = getCorrectDate(obj?.end_date);

        delete obj?.start_date;
        delete obj?.end_date;
        obj['start_date'] = StartDate;
        obj['end_date'] = EndDate;
        const response = await aggCampaignStore.getAggInventory(obj);
        if (response?.success === true || response?.data?.success) {
          showAckMessage({ message: 'Order submitted Successfully' });
          navigationService.goToUnivisionManageCampaigns(tableState);
        } else {
          uiStore.isLoading = false;
          showAckErrorMessage({ message: response?.data?.message || 'Something Went Wrong' });
        }
      }
    };

    const onSaveTodrafts = async () => {
      if ($state?.params?.draftData !== null) {
        showAckErrorMessage({
          message: `${$state?.params?.draftData?.campaign_data?.name} already saved in draft. Please submit`,
        });
        return;
      }
      const obj = { ...levelData };
      const name = levelData?.campaign_name;
      delete obj?.campaign_name;
      obj['name'] = name;

      if (obj) {
        const response = await aggCampaignStore.createSavetoDrafts({ ...obj });
        if (response?.status === 200) {
          showAckMessage({ message: 'Order saved as draft Successfully' });
          navigationService.goToAggCampaignDrafts();
        } else {
          showAckErrorMessage({ message: 'Something Went wrong' });
        }
      }
    };

    const renderCurrentStep = () => {
      switch (currentStep) {
        case 0:
          return (
            <CompanySelection
              afterValidation={() => stepProgress('nextStep')}
              handleChange={handleCompanySelection}
              selectedCompanyData={selectedCompanyData}
            />
          );
        case 1:
          return (
            <CampaignDetails
              afterValidation={() => stepProgress('nextStep')}
              selectedCompanyData={selectedCompanyData}
              levelData={levelData}
              setLevelData={setLevelData}
            />
          );
        case 2:
          return (
            <ReviewCampaignDetails
              levelData={levelData}
              selectedCompanyData={selectedCompanyData}
              onSubmit={onSubmit}
              onSaveTodrafts={onSaveTodrafts}
              backHandler={() => stepProgress('previousStep')}
            />
          );
      }
    };

    return (
      <MainContent>
        <StepProgress
          steps={steps}
          activeStep={currentStep}
          defaultBorderWidth={15}
          titleFontSize={11}
          size={20}
          circleFontSize={10}
          defaultColor="#98c22a"
          activeColor="#eea32c"
          completeColor="#98c22a"
          titleTop={2}
          circleTop={10}
          defaultBarColor="#cccccc"
          completeBarColor="#98c22a"
        ></StepProgress>
        <PageHeader>
          <PageTitle>Build Agg Campaign</PageTitle>
        </PageHeader>
        <PageContent>{renderCurrentStep()}</PageContent>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

AggCampaign.propTypes = {
  uiStore: PropTypes.object,
  companyStore: PropTypes.object,
  aggCampaignStore: PropTypes.object,
  navigationService: PropTypes.object,
};

export default withStore(AggCampaign);
