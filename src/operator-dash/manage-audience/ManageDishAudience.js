import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
// import { toJS } from 'mobx';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import TabContainer from '../../components/TabContainer';
import ReactPickyFilter from '../../components/ReactPickyFilter';
// import SearchBox from '../../components/SearchBox';
import ReactLoader from '../../components/ReactLoader';
import CustomButton from '../../components/CustomButton';

import { manageAudienceHeaderList } from './components/jsonData';

import ManageDishAudienceTable from './components/ManageDishAudienceTable';

import AddAttribute from './components/AddAttribute';
import ConfirmAudience from './components/ConfirmAudience';
import AddDishCount from './components/AddDishCount';
import EditCountModal from './components/EditCountModal';
import EditLiveRampCount from './components/EditLiveRampCount';
import AddLiveRampCount from './components/AddLiveRampCount';
import DeclineAudience from './components/DeclineAudience';
import ApproveDeclineAction from './components/ApproveAudience';
import DeclineActionModal from './components/DeclineActionModal';

import withStore from '../../hocs/WithStore';
import { showAckErrorMessage } from '../../common/utils';

const ManageDishAudience = inject(
  'uiStore',
  'univisionStore',
  'operatorStore',
  'authStore'
)(
  observer((props) => {
    const { univisionStore, operatorStore, authStore, uiStore } = props;
    const [headerList, setHeaderList] = useState([]);
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState('');
    const [tabCount, setTabCount] = useState({
      activeCount: 0,
      processedCount: 0,
      pendingUnivsionCount: 0,
      declineCount: 0,
      archiveCount: 0,
    });
    const [segmentData, setSegmentData] = useState([]);
    const [advFilterAllData, setAdvFilterAllData] = useState([]);
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]);
    const [audienceData, setAudienceData] = useState([]);
    const [companyList, setCompanyList] = useState([]);

    const [dataProviderData, setDataProviderData] = useState(['custom audience', 'liveRamp', 'first Party']);
    const [dpFilterSelectedData, setDpFilterSelectedData] = useState(['custom audience', 'live_ramp', 'first Party']);
    const AudTabTitles = [
      {
        id: 'active',
        name: 'Active',
        status: 1,
        count: tabCount.activeCount,
      },
      {
        id: 'pending approval',
        name: 'Pending Approval',
        status: 2,
        count: tabCount.pendingUnivsionCount,
      },
      {
        id: 'pending processing',
        name: 'Pending Processing',
        status: 3,
        count: tabCount.processedCount,
      },
      {
        id: 'declined',
        name: 'Declined',
        status: 4,
        count: tabCount.declineCount,
      },
      {
        id: 'archive',
        name: 'Archive',
        status: 6,
        count: tabCount.archiveCount,
      },
    ];
    const [activeTab, setActiveTab] = useState(AudTabTitles[0]);

    useEffect(() => {
      getSegments();
    }, []);

    useEffect(() => {
      setHeaderList(manageAudienceHeaderList(activeTab));
      getAudienceTableList(audienceData);
    }, [activeTab]);

    const onRefresh = () => {
      setAudienceData([]);
      setSegmentData([]);
      setAdvFilterSelectedData([]);
      getSegments();
    };

    const getCompanyList = () => {
      univisionStore.getAdvertiserList().then(
        (res) => {
          if (res && res.status === 200) {
            const entityList = JSON.parse(JSON.stringify(res.data));
            setCompanyList(res?.data);
            const advData = [];
            entityList?.forEach((a) => {
              if (a.name) {
                advData.push(a.name);
              } else {
                advData.push('with no advertiser');
              }
            });
            const advFilterdDataCpy = [...new Set(advData)];
            setAdvFilterAllData(advFilterdDataCpy);
            setAdvFilterSelectedData(advFilterdDataCpy);
            const dpData = [];
            dataProviderData?.forEach((d) => {
              if (d) {
                dpData.push(d);
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
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getSegments = () => {
      univisionStore.getAudience().then(
        (res) => {
          if (res && res?.data) {
            setAudienceData(res?.data?.data);
            getAudienceTableList(res.data.data);
            getCompanyList();
          } else {
            showAckErrorMessage({ message: 'Unable to fetch data' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAllAudience = (advData = [], dpData = dataProviderData) => {
      const advId = advData.filter((a) => a.id).map((c) => c.id);
      const dp = onFilterDpData(dpData);
      univisionStore.getAudienceList(advId, dp).then((res) => {
        if (res.status === 200 && res?.data.success) {
          setAudienceData(res?.data?.data);
          getAudienceTableList(res?.data?.data);
        } else {
          showAckErrorMessage({ message: 'Unable to fetch data' });
        }
      });
    };

    const getAllAudienceSegment = (tab, advData = [], dpData = dataProviderData) => {
      const advId = advData.filter((a) => a.id).map((c) => c.id);
      const dp = onFilterDpData(dpData);
      univisionStore.getAudienceList(advId, dp).then((res) => {
        if (res.status === 200 && res?.data.success) {
          setAudienceData(res?.data?.data);
          setActiveTab(tab);
        } else {
          showAckErrorMessage({ message: 'Unable to fetch data' });
        }
      });
    };

    const getAudience = (tab = []) => {
      const modifiedData = onFilterAdvData(advFilterSelectedData);
      if (tab.length === 0) {
        getAllAudience(modifiedData);
      } else {
        getAllAudienceSegment(tab, modifiedData);
      }
    };

    const onTabChange = (selectedTab) => {
      setActiveTab(selectedTab);
      setHeaderList(manageAudienceHeaderList(selectedTab));
    };

    const handleAddAttributeIdAction = (mdata) => {
      setActiveModal('add_attribute_id_modal');
      setModalData(mdata);
    };
    const handleConfirmationAction = (res) => {
      setActiveModal('confirmation_modal');
      setModalData(res);
    };
    const handleDeclineAction = (res) => {
      setActiveModal('decline_modal');
      setModalData(res);
    };
    const handleDishCountAction = (res) => {
      setActiveModal('add_dish_modal');
      setModalData(res);
    };
    const handleLiveRampCountAction = (res) => {
      setActiveModal('add_liveramp_modal');
      setModalData(res);
    };
    const showEditCountModal = (res) => {
      setActiveModal('edit_count');
      setModalData(res);
    };
    const showEditLiveRampCountModal = (res) => {
      setActiveModal('edit_liveramp_count');
      setModalData(res);
    };
    const showApproveDeclineModal = (res) => {
      setActiveModal('approve');
      setModalData(res);
    };
    const showDeclineModal = (res) => {
      setActiveModal('decline');
      setModalData(res);
    };

    const onResponseChange = (data) => {
      const audienceListCpy = JSON.parse(JSON.stringify(segmentData)); // Deep copy of the object.
      const activeIndex1 = audienceListCpy.findIndex((d) => d.id === data.id);
      if (activeIndex1 !== -1) {
        audienceListCpy[activeIndex1] = data;
        setSegmentData(audienceListCpy);
      }
    };

    const onFilterAdvData = (filteredData) => {
      // Filtering advertiser data
      const modifiedData = companyList.filter((a) => {
        if (a.name && filteredData.includes(a.name)) {
          return true;
        } else if (!a.name && filteredData.includes('with no advertiser')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onFilterDpData = (dataProviderData) => {
      const modifiedData = dataProviderData.filter((a) => {
        if (a && dataProviderData.includes(a)) {
          return true;
        } else if (!a && dataProviderData.includes('with no data provider')) {
          return true;
        }
        return false;
      });
      const mData = [];
      modifiedData.forEach((dataProvider) => {
        if (dataProvider === 'liveRamp') {
          mData.push(dataProvider.replace('eR', 'e_r'));
        } else if (dataProvider === 'custom audience') {
          mData.push(dataProvider.replace('custom audience', 'audience_request_form'));
        } else {
          mData.push(dataProvider.replace('first Party', 'first_party'));
        }
      });
      return mData;
    };

    const applyFilter = (filteredData, id) => {
      if (id === 'adv_filter' && filteredData.length > 0) {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        const modifiedDPData = onFilterDpData(dpFilterSelectedData);
        getAllAudience(modifiedData, modifiedDPData);
      } else if (id === 'dp_filter' && dataProviderData.length > 0) {
        setDpFilterSelectedData(filteredData);
        const modifiedData = onFilterDpData(filteredData);
        const modifiedAdvData = onFilterAdvData(advFilterSelectedData);
        getAllAudience(modifiedAdvData, modifiedData);
      } else if (filteredData.length === 0) {
        setAdvFilterSelectedData(filteredData);
        setSegmentData([]);
        setAudienceData([]);
        switch (activeTab.status) {
          case 0:
            setTabCount({ ...tabCount, activeCount: 0 });
            break;
          case 1:
            setTabCount({ ...tabCount, processedCount: 0 });
            break;
          case 2:
            setTabCount({ ...tabCount, pendingUnivsionCount: 0 });
            break;
          case 3:
            setTabCount({ ...tabCount, declineCount: 0 });
            break;
          case 4:
            setTabCount({ ...tabCount, archiveCount: 0 });
            break;
        }
      }
    };

    const getAudienceTableList = (audience) => {
      const segData = [];

      if (activeTab.status === 0 || activeTab.status === 1) {
        audience.forEach((seg) => {
          if (seg.audience_state === 0 || seg.audience_state === 1) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, activeCount: segData.length });
      } else if (activeTab.status === 3) {
        audience.forEach((seg) => {
          if (seg.audience_state === 5) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, processedCount: segData.length });
      } else if (activeTab.status === 2) {
        audience.forEach((seg) => {
          if (seg.audience_state === 2 || seg.audience_state === 6 || seg.audience_state === 3) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, pendingUnivsionCount: segData.length });
      } else if (activeTab.status === 4) {
        audience.forEach((seg) => {
          if (seg.audience_state === 4) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, declineCount: segData.length });
      } else if (activeTab.status === 6) {
        audience.forEach((seg) => {
          if (seg.is_archived === true) {
            segData.push(seg);
          }
        });
        setTabCount({ ...tabCount, archiveCount: segData.length });
      }

      setSegmentData(segData);
    };

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle>Manage Audience</PageTitle>

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
          <TabContainer tabList={AudTabTitles} activeTab={activeTab} onTabChange={onTabChange} />
          <CustomButton
            type="primary"
            buttonText="Refresh"
            buttonClassName="m10 mr15"
            handleButtonClick={() => onRefresh()}
          />
        </div>
        <ManageDishAudienceTable
          activeTab={activeTab}
          tableHeaderList={headerList}
          manageAudiences={segmentData}
          handleAddAttributeIdAction={handleAddAttributeIdAction}
          handleConfirmationAction={handleConfirmationAction}
          handleDishCountAction={handleDishCountAction}
          authStore={authStore}
          isLoading={uiStore.isLoading}
          showEditCountModal={showEditCountModal}
          showEditLiveRampCountModal={showEditLiveRampCountModal}
          handleLiveRampCountAction={handleLiveRampCountAction}
          handleDeclineAction={handleDeclineAction}
          showApproveDeclineModal={showApproveDeclineModal}
          showDeclineModal={showDeclineModal}
        />
        {activeModal === 'add_attribute_id_modal' ? (
          <AddAttribute
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getAudience}
            operatorStore={operatorStore}
          />
        ) : null}
        {activeModal === 'confirmation_modal' ? (
          <ConfirmAudience
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getAudience}
            operatorStore={operatorStore}
            tabList={AudTabTitles}
          />
        ) : null}
        {activeModal === 'decline_modal' ? (
          <DeclineAudience
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getSegments}
            operatorStore={operatorStore}
          />
        ) : null}
        {activeModal === 'add_dish_modal' ? (
          <AddDishCount
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getSegments}
            univisionStore={univisionStore}
            tabList={AudTabTitles}
          />
        ) : null}
        {activeModal === 'add_liveramp_modal' ? (
          <AddLiveRampCount
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            getAllCampaignTags={getSegments}
            univisionStore={univisionStore}
            tabList={AudTabTitles}
          />
        ) : null}
        {activeModal === 'edit_count' ? (
          <EditCountModal
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            getAllCampaignTags={getSegments}
            univisionStore={univisionStore}
          />
        ) : null}
        {activeModal === 'edit_liveramp_count' ? (
          <EditLiveRampCount
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            getAllCampaignTags={getSegments}
            univisionStore={univisionStore}
          />
        ) : null}
        {activeModal === 'approve' ? (
          <ApproveDeclineAction
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            getAllCampaignTags={getAudience}
            univisionStore={univisionStore}
            operatorStore={operatorStore}
            tabList={AudTabTitles}
          />
        ) : null}
        {activeModal === 'decline' ? (
          <DeclineActionModal
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            getAllCampaignTags={getAudience}
            univisionStore={univisionStore}
            operatorStore={operatorStore}
            tabList={AudTabTitles}
          />
        ) : null}

        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ManageDishAudience);
