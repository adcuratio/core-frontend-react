import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';

import withStore from '../../hocs/WithStore';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import TabContainer from '../../components/TabContainer';
import CustomButton from '../../components/CustomButton';
import ReactLoader from '../../components/ReactLoader';
import ReactPickyFilter from '../../components/ReactPickyFilter';

import ViewForecastDetails from '../../components/manage-forcast/ViewForecastDetails';
import AddImpressions from '../../components/manage-forcast/AddImpressions';
import ApproveDeclineModal from '../../components/manage-forcast/ApproveDeclineModal';

import { manageForecastHeader } from './components/ManageForecastJson';
import ManageForecastTable from './components/ManageForeCastTable';

import { showAckErrorMessage } from '../../common/utils';

const ManageDishForeCast = inject(
  'operatorStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { operatorStore, uiStore, authStore } = props;
    const tableRef = useRef(null);
    const ForeCastTitles = [
      {
        id: 'pending processing',
        apiStatus: 'Pending',
        name: 'Pending Processing',
        status: 0,
      },
      {
        id: 'complete',
        apiStatus: 'Complete',
        name: 'Complete',
        status: 1,
      },
      {
        id: 'archive',
        apiStatus: 'Archive',
        name: 'Archive',
        status: 2,
      },
    ];
    const [activeTab, setActiveTab] = useState(ForeCastTitles[1]);
    const [forecastData, setForecastData] = useState([]);
    const [activeModal, setActiveModal] = useState('');
    const [forecastDetails, setForecastDetails] = useState({});
    const [modalData, setModalData] = useState('');
    const [impression, setImpression] = useState('');
    const [advFilterAllData, setAdvFilterAllData] = useState([]);
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]);
    const [dataProviderData, setDataProviderData] = useState([]);
    const [dpFilterSelectedData, setDpFilterSelectedData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    //const [filteredEntityList, SetFilteredEntityList] = useState([]);
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
      getForecastData(null, activeTab.apiStatus);
      getForecastFilterList();
    }, []);

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    const getForecastFilterList = () => {
      operatorStore.getForecastFilterList().then((res) => {
        if (res) {
          const entityList = JSON.parse(JSON.stringify(res.data));
          setCompanyList(res?.data);
          const advData = [];
          entityList?.advertisers?.forEach((a) => {
            if (a.adv_name) {
              advData.push(a.adv_name);
            } else {
              advData.push('with no advertiser');
            }
          });
          const advFilteredDataCpy = [...new Set(advData)];
          setAdvFilterAllData(advFilteredDataCpy);
          setAdvFilterSelectedData(advFilteredDataCpy);
          const dpData = [];
          entityList?.data_providers?.forEach((d) => {
            if (d.data_provider_name) {
              dpData.push(d.data_provider_name);
            } else {
              dpData.push('with no data provider');
            }
          });
          const dpFilterDataCpy = [...new Set(dpData)];
          setDataProviderData(dpFilterDataCpy);
          setDpFilterSelectedData(dpFilterDataCpy);
        } else {
          showAckErrorMessage({ message: res?.data?.message ?? 'Unable to fetch Data!' });
        }
      });
    };

    const getAllForecastData = (
      advData = [],
      dpData = [],
      url = null,
      status = activeTab.apiStatus,
      archive = false
    ) => {
      const selectedFilterData = () => {
        const advId = [];
        const dp = [];
        companyList?.advertisers?.forEach((a) => {
          advData?.forEach((b) => {
            if (a.adv_name === b.adv_name) {
              advId.push(a.adv_id);
            }
          });
        });
        companyList?.data_providers?.forEach((a) => {
          dpData?.forEach((d) => {
            if (a.data_provider_name === d.data_provider_name) {
              dp.push(a.data_provider);
            }
          });
        });
        return { advId, dp };
      };

      const { advId, dp } = selectedFilterData();
      operatorStore.forecastFilter(advId, dp, url, status, archive).then(
        (res) => {
          if (res) {
            setNextPageUrl(res?.data?.data?.next);
            const result = res?.data?.data?.results;
            let concatenatedArray;
            if (url) {
              const forecastDataCpy = JSON.parse(JSON.stringify(forecastData));
              const resultsCpy = JSON.parse(JSON.stringify(result));
              concatenatedArray = [...forecastDataCpy, ...resultsCpy];
            } else {
              concatenatedArray = JSON.parse(JSON.stringify(result));
              scrollToTop();
            }
            setForecastData(concatenatedArray);
          } else {
            showAckErrorMessage({ message: 'Unable to fetch data' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getForecastData = (url = null, status = activeTab.apiStatus, archive = false) => {
      operatorStore.manageForecastList(url, status, archive).then((res) => {
        if (res) {
          setNextPageUrl(res?.data?.data?.next);
          const result = res?.data?.data?.results;
          let concatenatedArray;
          if (url) {
            const forecastDataCpy = JSON.parse(JSON.stringify(forecastData));
            const resultsCpy = JSON.parse(JSON.stringify(result));
            concatenatedArray = [...forecastDataCpy, ...resultsCpy];
          } else {
            concatenatedArray = JSON.parse(JSON.stringify(result));
            scrollToTop();
          }
          setForecastData(concatenatedArray);
        } else {
          showAckErrorMessage({ message: 'Unable to fetch the forecast data.' });
        }
        () => {
          showAckErrorMessage({ message: 'error' });
        };
      });
    };

    const onFilterAdvData = (filteredData) => {
      // Filtering advertiser data
      const modifiedData = companyList.advertisers.filter((a) => {
        if (a.adv_name && filteredData.includes(a.adv_name)) {
          return true;
        } else if (!a.adv_name && filteredData.includes('with no advertiser')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onFilterDpData = (filteredData) => {
      const modifiedData = companyList.data_providers.filter((a) => {
        if (a.data_provider_name && filteredData.includes(a.data_provider_name)) {
          return true;
        } else if (!a.data_provider_name && filteredData.includes('with no data provider')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const applyFilter = (filteredData, id) => {
      if (id === 'adv_filter') {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        const modifiedDPData = onFilterDpData(dpFilterSelectedData);
        getAllForecastData(modifiedData, modifiedDPData);
      } else if (id === 'dp_filter') {
        setDpFilterSelectedData(filteredData);
        const modifiedData = onFilterDpData(filteredData);
        const modifiedAdvData = onFilterAdvData(advFilterSelectedData);
        getAllForecastData(modifiedAdvData, modifiedData);
      }
    };

    const onRefresh = () => {
      if (activeTab?.apiStatus === 'Archive') {
        getForecastData(null, 'Complete', true);
      } else {
        getForecastData(null, activeTab?.apiStatus);
      }
      getForecastFilterList();
    };
    const onTabChange = (selectedTab) => {
      setActiveTab(selectedTab);
      if (selectedTab?.apiStatus === 'Archive') {
        getForecastData(null, 'Complete', true);
      } else {
        getForecastData(null, selectedTab?.apiStatus);
      }
      getForecastFilterList();
    };

    const getForecastDetails = (id) => {
      operatorStore.getForecastDetails(id).then((res) => {
        if (res && res.success) {
          setForecastDetails(res?.data);
        } else {
          showAckErrorMessage({ message: 'Unable to fetch the forecast details.' });
        }
        () => {
          showAckErrorMessage({ message: 'error' });
        };
      });
    };

    const handleTableButtonAction = (buttonType, data) => {
      if (buttonType === 'forecast_details') {
        getForecastDetails(data.id);
        setActiveModal(buttonType);
      } else if (buttonType === 'add_impressions') {
        setActiveModal(buttonType);
        setModalData(data);
      } else if (buttonType === 'approve') {
        setActiveModal(buttonType);
        setModalData(data);
      } else if (buttonType === 'decline') {
        setActiveModal(buttonType);
        setModalData(data);
      }
    };

    const handleInputChange = (e) => {
      setImpression(e.target.value);
    };

    const handleModalClose = () => {
      setActiveModal('');
      setForecastDetails({});
      setModalData('');
      setImpression('');
    };

    const handlePagination = () => {
      getForecastData(nextPageUrl);
    };

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle>Manage Forecast</PageTitle>
            <div className="flex-container1">
              <ReactPickyFilter
                allOptions={advFilterAllData}
                selectedData={advFilterSelectedData}
                onFilterChange={applyFilter}
                id="adv_filter"
                selectAllText="Select All Advertisers"
                allSelectedPlaceholder="All Advertisers"
                placeholderText="Select Advertiser"
              />
              <ReactPickyFilter
                allOptions={dataProviderData}
                selectedData={dpFilterSelectedData}
                onFilterChange={applyFilter}
                id="dp_filter"
                selectAllText="Select All Data Providers"
                allSelectedPlaceholder="All Data Providers"
                placeholderText="Select Data Provider"
              />
            </div>
          </div>
        </PageHeader>
        <div className="flex-container2">
          <TabContainer tabList={ForeCastTitles} activeTab={activeTab} onTabChange={onTabChange} />
          <CustomButton
            type="primary"
            buttonText="Refresh"
            buttonClassName="m10 mr15"
            handleButtonClick={() => onRefresh()}
          />
        </div>
        <ManageForecastTable
          manageForecastHeader={manageForecastHeader}
          forecastData={forecastData}
          activeTab={activeTab}
          handleTableButtonAction={handleTableButtonAction}
          authStore={authStore}
          isLoading={uiStore.isLoading}
          nextPageUrl={nextPageUrl}
          handlePagination={handlePagination}
          tableRef={tableRef}
        />
        <AddImpressions
          showModal={activeModal === 'add_impressions'}
          closeModal={() => handleModalClose()}
          operatorStore={operatorStore}
          modalData={modalData}
          getForecastData={getForecastData}
          handleInputChange={handleInputChange}
          impression={impression}
        />
        <ApproveDeclineModal
          showModal={activeModal === 'approve' || activeModal === 'decline'}
          closeModal={() => handleModalClose()}
          operatorStore={operatorStore}
          modalData={modalData}
          actionType={activeModal}
          getForecastData={getForecastData}
        />
        <ViewForecastDetails
          forecastData={forecastDetails}
          showModal={activeModal === 'forecast_details'}
          closeModal={() => handleModalClose()}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ManageDishForeCast);
