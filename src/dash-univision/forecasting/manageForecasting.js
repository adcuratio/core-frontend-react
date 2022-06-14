import React, { useEffect, useState, useRef } from 'react';
//import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import withStore from '../../hocs/WithStore';
import { MainContent } from '../../components/PageLayout';
import { PageHeader } from 'antd';
import { PageTitle } from '../../components/Typography';
import TabContainer from '../../components/TabContainer';
import ForecastTable from './components/ForecastTable';
import { ForecastTableTitles } from './JsonData';
import ForecastDetail from './components/ForecastDetail';
import ReactLoader from '../../components/ReactLoader';
import { showAckErrorMessage, showAckMessage } from '../../common/utils';
import CustomButton from '../../components/CustomButton';

const ManageForecast = inject(
  'univisionStore',
  'uiStore'
)(
  observer((props) => {
    const { univisionStore, uiStore, $state } = props;
    const tableRef = useRef(null);

    const ForcastTabTitles = [
      {
        id: 'pending-processing',
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

    const [activeTab, setActiveTab] = useState(ForcastTabTitles[$state.params.tableState]);
    const [forecastData, setForecastData] = useState([]);
    const [forecastDetail, setForecastDetail] = useState({});
    const [activeModal, setActiveModal] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState('');

    useEffect(() => {
      getForecastData(null, activeTab.apiStatus);
    }, []);

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    const getForecastData = (url = null, status = activeTab.apiStatus, archive = false) => {
      univisionStore.getForecastData(url, status, archive).then(
        (res) => {
          if (res && res.success) {
            setNextPageUrl(res?.data?.next);
            const result = res?.data?.results;
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
            showAckErrorMessage({ message: 'Something went wrong while fetching forecast data' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getForecastDetail = (id) => {
      univisionStore.getForecastDetail(id).then((res) => {
        if (res && res?.success) {
          setForecastDetail(res?.data);
        }
      });
    };

    const achiveForecastData = (payload) => {
      univisionStore.archiveForecast(payload).then(
        (res) => {
          if (res && res?.data?.success) {
            showAckMessage({ message: res?.data?.message });
            getForecastData(null, activeTab?.apiStatus);
          } else {
            showAckErrorMessage({ message: 'Something went wrong!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const onTabChange = (tab) => {
      setActiveTab(tab);
      if (tab?.apiStatus === 'Archive') {
        getForecastData(null, 'Complete', true);
      } else {
        getForecastData(null, tab?.apiStatus);
      }
    };

    const onRefresh = () => {
      if (activeTab?.apiStatus === 'Archive') {
        getForecastData(null, 'Complete', true);
      } else {
        getForecastData(null, activeTab?.apiStatus);
      }
    };

    const handleTableButtonAction = (buttonType, data) => {
      if (buttonType === 'details') {
        getForecastDetail(data.id);
        setActiveModal(buttonType);
      } else {
        const payload = {
          id: data.id,
        };
        achiveForecastData(payload);
      }
    };

    const handlePagination = () => {
      getForecastData(nextPageUrl);
    };

    const handleModalClose = () => {
      setActiveModal('');
      setForecastDetail({});
    };

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle className="mt10 ml10 mb10">View forecast</PageTitle>
          </div>
        </PageHeader>
        <div className="flex-container2">
          <TabContainer onTabChange={onTabChange} activeTab={activeTab} tabList={ForcastTabTitles} showCount={false} />
          <CustomButton
            type="primary"
            buttonText="Refresh"
            buttonClassName="m10 mr15"
            handleButtonClick={() => onRefresh()}
          />
        </div>
        <ForecastTable
          forecastTableTitles={ForecastTableTitles}
          forecastTableData={forecastData}
          handleTableButtonAction={handleTableButtonAction}
          activeTab={activeTab}
          isLoading={uiStore.isLoading}
          nextPageUrl={nextPageUrl}
          handlePagination={handlePagination}
          tableRef={tableRef}
        />
        <ForecastDetail
          showModal={activeModal === 'details'}
          closeModal={() => handleModalClose()}
          forecastDetailData={forecastDetail}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ManageForecast);
