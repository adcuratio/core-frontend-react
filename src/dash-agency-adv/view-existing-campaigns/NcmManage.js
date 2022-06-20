import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import withStore from '../../hocs/WithStore';

import { PageTitle } from '../../components/Typography';
import { MainContent, PageHeader } from '../../components/PageLayout';
import CustomButton from '../../components/CustomButton';
import ReactLoader from '../../components/ReactLoader';
import ReactPickyFilter from '../../components/ReactPickyFilter';
import SearchBox from '../../components/SearchBox';
import CreativeAdPreviewModal from '../../components/CreativesAdPreviewModal';

import { applySearch, formatText, showAckErrorMessage, showAckMessage } from '../../common/utils';

import NcmManageTabs from './components/NcmManageTabs';
import NcmManageTable from './components/NcmManageTable';
import {
  NcmManageTradeTabs,
  activeTradesTableTitle,
  pausedTradesTableTitle,
  declineTradesTableTitle,
  accordionHeader,
  pendingDistributorTradesTableTitle,
} from './components/JsonData';
import ViewTradesModal from './components/ViewTradesModal';
import ApprovalStatusModal from './components/ApprovalStatusModal';
import NcmManageSummary from './components/NcmSummaryPieChart';

const StyledHeader = styled.div`
  width: 54%;
`;

const ManageNcm = inject(
  'authStore',
  'manageCampaignStore',
  'uiStore'
)(
  observer((props) => {
    const { manageCampaignStore, uiStore, authStore } = props;

    const isAgencyAdminUser = authStore.isAgencyAdminUser();

    const [trades, setTrades] = useState([]);
    const [viewTrades, setViewTrades] = useState({});
    const [mgData, setMgData] = useState([]);
    const [segmentData, setSegmentData] = useState([]);
    const [creativeModalData, setCreativeModalData] = useState();
    const [upgradedAdspot, setUpgradedAdspot] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState();
    const [searchValue, setSearchValue] = useState();
    const [tradeData, setTradeData] = useState({
      tableProgressTradesData: [],
      tablePausedTradesData: [],
      tableCompletedTradesData: [],
      tablePendingTradesData: [],
      tableAgencyApprovalTradesData: [],
      tableAdvertiserApprovalTradesData: [],
      tablePendingProcessingTradesData: [],
      tableDeclinedTradesData: [],
    });
    const [activeTab, setActiveTab] = useState(NcmManageTradeTabs[0]);
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState(null);
    const [orderDetailData, serOrderDetailData] = useState([]);
    const [orderReplacementInfo, setOrderReplacementInfo] = useState([]);
    const [summaryData, setSummaryData] = useState([]);
    const [activeTrade, setActiveTrade] = useState('');
    const [advertiserFilterSelectedData, setAdvertiserFilterSelectedData] = useState([]);
    const [advertiserFilterAllData, setAdvertiserFilterAllData] = useState([]);
    const [searchDataList, setSearchDataList] = useState([]);
    const [filteredTradeData, setFilteredTradeData] = useState({});
    const [isLoadingAccordion, setIsLoadingAccordion] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState('');

    useEffect(() => {
      getCustomTrades();
    }, []);

    const getCustomTrades = () => {
      manageCampaignStore.getCustomTrades().then(
        (trade) => {
          if (trade && trade.success) {
            const orders = trade?.data.orders;
            buildTradeData(orders);
            setSummaryData(trade?.data.summary);
            setActiveTrade(orders?.reason);
            //SearchFilter
            let results = [];
            if (trade) {
              results = orders?.map((data) => {
                const dCpy = JSON.parse(JSON.stringify(data));
                dCpy.order_identifier = data.order_identifier;
                dCpy.name = data.name;
                dCpy.default_ad = data?.ad_id?.identifier;
                dCpy.last_modified_by = `${data.updated_by.first_name} ${data.updated_by.last_name}`;
                dCpy.comment = data.comment;
                dCpy.default_messaging_group = data?.messaging_group;
                return dCpy;
              });
              setTrades(JSON.parse(JSON.stringify(results)));
            }
            //AdvFilter
            const advertiserData = orders.map((a) => a.adv_company_name || 'With no advertisers');
            const advFilteredDataCopy = [...new Set(advertiserData)];
            setAdvertiserFilterAllData(advFilteredDataCopy);
            setAdvertiserFilterSelectedData(advFilteredDataCopy);
          } else {
            showAckErrorMessage({ message: trade?.data?.message || 'Unable to fetch orders' });
          }
        },
        () => showAckErrorMessage()
      );
    };

    // To open/close Accordion on clicking a table row
    const toggle = (id) => {
      if (id && (id !== activeAccordion || !activeAccordion)) {
        serOrderDetailData([]);
        setOrderReplacementInfo([]);
        setActiveAccordion(id);
        setIsLoadingAccordion(true);
        manageCampaignStore.getOrderDetail(id).then(
          (response) => {
            if (response && response.data && response.success) {
              setIsLoadingAccordion(false);
              serOrderDetailData(response?.data.campaign_info);
              setOrderReplacementInfo(response?.data.replacement_info);
              return response.data;
            } else {
              setIsLoadingAccordion(false);
              showAckErrorMessage({
                message: 'No orders found',
              });
            }
          },
          () => {
            setIsLoadingAccordion(false);
            showAckErrorMessage();
          }
        );
      } else {
        setActiveAccordion(false);
      }
    };

    const onTabChange = (tab) => {
      setActiveTab(tab);
      switchToTab(filteredTradeData, tab);
      setSearchValue('');
      setActiveAccordion('');
    };

    const handleTableButtonAction = (buttonType, mData, e) => {
      e.stopPropagation();
      onSetActiveModal(buttonType);
      setModalData(mData);
    };

    const addAdvertiserName = (trade, index, res) => {
      const { adv_company_name } = trade[index];
      return { ...res, adv_company_name };
    };

    // Function to approve/decline a trade with API call
    // And shifting/placement of the trade to relevant tabs based on Approval/declination status.
    const confirmTradeApproval = () => {
      const tradeActionComment = formatText(activeTrade);
      if (activeModal === 'decline') {
        if (tradeActionComment?.length < 11 || tradeActionComment === undefined || tradeActionComment === null) {
          showAckErrorMessage({
            message: 'Decline reason should be longer than 10 characters. Please try again.',
          });
          return;
        }
        manageCampaignStore.changeOrderStatus(modalData.id, 'decline', tradeActionComment).then(
          (response) => {
            if (response && response.status === 5) {
              const tradesCpy = JSON.parse(JSON.stringify(filteredTradeData));
              if (isAgencyAdminUser) {
                const index = tradesCpy['tableAgencyApprovalTradesData'].findIndex(
                  (trade) => trade.id === modalData.id
                );
                response = addAdvertiserName(tradesCpy['tableAgencyApprovalTradesData'], index, response);
                tradesCpy['tableAgencyApprovalTradesData'].splice(index, 1);
                if (index >= 0) {
                  tradesCpy['tableDeclinedTradesData'].unshift(response); //To move declined trade to Declined tab via splice in Agency portal
                  setTradeData(tradesCpy);
                  setFilteredTradeData(tradesCpy);
                  setActiveTab(NcmManageTradeTabs[7]);
                  switchToTab(tradesCpy, { id: 'declined' });
                }
              } else {
                const index = tradesCpy['tableAdvertiserApprovalTradesData'].findIndex(
                  (trade) => trade.id === modalData.id
                );
                response = addAdvertiserName(tradesCpy['tableAdvertiserApprovalTradesData'], index, response);
                tradesCpy['tableAdvertiserApprovalTradesData'].splice(index, 1);
                if (index >= 0) {
                  tradesCpy['tableDeclinedTradesData'].unshift(response); //To move declined trade to Declined tab via splice in Advertiser portal
                  setTradeData(tradesCpy);
                  setFilteredTradeData(tradesCpy);
                  setActiveTab(NcmManageTradeTabs[7]);
                  switchToTab(tradesCpy, { id: 'declined' });
                }
              }
              showAckMessage({
                message: 'Campaign declined successfully.',
              });
              setActiveModal('');
            } else if (response && response.status && response.message) {
              showAckErrorMessage({ message: JSON.stringify(response.message) });
            }
          },
          () => showAckErrorMessage()
        );
      } else {
        if (activeModal === 'approve') {
          manageCampaignStore.changeOrderStatus(modalData.id, 'agencyApproval', tradeActionComment).then(
            (response) => {
              if (response && response.status === 8) {
                const tradesCpy = JSON.parse(JSON.stringify(filteredTradeData));
                if (isAgencyAdminUser) {
                  const index = tradesCpy['tableAgencyApprovalTradesData'].findIndex(
                    (trade) => trade.id === modalData.id
                  );
                  response = addAdvertiserName(tradesCpy['tableAgencyApprovalTradesData'], index, response);

                  tradesCpy['tableAgencyApprovalTradesData'].splice(index, 1);
                  if (index >= 0) {
                    tradesCpy['tablePendingProcessingTradesData'].unshift(response); //To move approved trades to Pending Processing tab via splice in Agency portal
                    setTradeData(tradesCpy);
                    setFilteredTradeData(tradesCpy);
                    setActiveTab(NcmManageTradeTabs[6]);
                    switchToTab(tradesCpy, { id: 'pendingProcessing' });
                  }
                } else {
                  const index = tradesCpy['tableAdvertiserApprovalTradesData'].findIndex(
                    (trade) => trade.id === modalData.id
                  );
                  response = addAdvertiserName(tradesCpy['tableAdvertiserApprovalTradesData'], index, response);

                  tradesCpy['tableAdvertiserApprovalTradesData'].splice(index, 1);
                  if (index >= 0) {
                    tradesCpy['tablePendingProcessingTradesData'].unshift(response); //To move approved trades to Pending Processing tab via splice in Advertiser portal
                    setTradeData(tradesCpy);
                    setFilteredTradeData(tradesCpy);
                    setActiveTab(NcmManageTradeTabs[6]);
                    switchToTab(tradesCpy, { id: 'pendingProcessing' });
                  }
                }
                showAckMessage({
                  message: 'Approved successfully.',
                });
                setActiveModal('');
              } else if (response && response.status && response.message) {
                showAckErrorMessage({ message: JSON.stringify(response.message) });
              }
            },
            () => showAckErrorMessage()
          );
        }
      }
    };

    // Search filter function
    const handleSearchTextChange = (value) => {
      const tradeData = filteredTradeData;
      setSearchValue(value);
      if (activeTab.id === 'active') {
        const activeTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableProgressTradesData));
        const list = applySearch(value, activeTradesDataCopy, activeTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'paused') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tablePausedTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pausedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'completed') {
        const completeTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableCompletedTradesData));
        const list = applySearch(value, completeTradesDataCopy, activeTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'pendingDistributorApproval') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tablePendingTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pendingDistributorTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'pendingAgencyApproval') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableAgencyApprovalTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pausedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'pendingAdvApproval') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableAdvertiserApprovalTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pausedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'pendingProcessing') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tablePendingProcessingTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pausedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'declined') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableDeclinedTradesData));
        const list = applySearch(value, pausedTradesDataCopy, declineTradesTableTitle);
        setSearchDataList(list);
      }
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const closeCreativeVideoModal = () => {
      if (creativeModalData) {
        setCreativeModalData('');
      }
      onSetActiveModal('');
    };

    // To get URL through API based on creative id to play creative video for table.
    const getVideoUrl = (adid, e) => {
      e.stopPropagation();

      if (adid.ad_id?.adid_id) {
        manageCampaignStore.getVideoUrl(adid.ad_id.adid_id).then(
          (res) => {
            if (res && res.success && res.data !== null) {
              setActiveModal('preview');
              setCreativeModalData(res.data);
            } else {
              showAckErrorMessage({ message: 'Creative data not found' });
            }
          },
          () => showAckErrorMessage({ message: 'Cannot get video file data for the creative.' })
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
      setCreativeModalData('');
    };

    // To get URL through API based on creative id to play creative video for Accordion.
    const getVideoUrlForAccordion = (adid, e) => {
      e.stopPropagation();
      if (adid && adid.default_adid?.adid_meta_file_upload[0]) {
        manageCampaignStore.getVideoUrl(adid.default_adid.adid_meta_file_upload[0].id).then(
          (res) => {
            if (res && res.success && res.data !== null) {
              setActiveModal('accVideo');
              setCreativeModalData(res.data);
            } else {
              showAckErrorMessage({ message: 'Creative data not found' });
            }
          },
          () => showAckErrorMessage({ message: 'Cannot get video file data for the creative.' })
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
      setCreativeModalData('');
    };

    // To get data from API for view modal.
    const getViewTrades = (tradeId, e) => {
      e.stopPropagation();
      const index = trades.findIndex((a) => a.id === tradeId.id);
      if (index !== -1) {
        manageCampaignStore.getOrderSummary(tradeId.id).then(
          (res) => {
            if (res && res.success && res.data) {
              setModalData('view');
              setViewTrades(res.data);
              setMgData(res?.data?.options || []);
              setSegmentData(res?.data.messaging_group?.groups_meta);
              onSetActiveModal('view');
              setSearchValue('');
              getAdspotView(tradeId);
            } else {
              showAckErrorMessage();
            }
          },
          () => showAckErrorMessage()
        );
      }
    };
    const getAdspotView = (tradeId, nextPageUrl) => {
      manageCampaignStore.getAdspotsView(tradeId?.id, nextPageUrl).then((res) => {
        if (res) {
          setUpgradedAdspot([...upgradedAdspot, ...res?.results]);
          setNextPageUrl(res?.next);
        } else {
          showAckErrorMessage();
        }
      });
    };

    // Based on status, building trade data for respective tabs.
    const buildTradeData = (tradeList = trades) => {
      if (tradeList && tradeList.length) {
        const tableProgressTradesData = [],
          tablePausedTradesData = [],
          tableCompletedTradesData = [],
          tablePendingTradesData = [],
          tableAgencyApprovalTradesData = [],
          tableAdvertiserApprovalTradesData = [],
          tablePendingProcessingTradesData = [],
          tableDeclinedTradesData = [];
        tradeList.forEach((trade) => {
          if (trade) {
            if (trade.status === 0 || trade.status === 1) {
              tableProgressTradesData.push(trade);
            } else if (trade.status === 3) {
              tablePausedTradesData.push(trade);
            } else if (trade.status === 2) {
              tableCompletedTradesData.push(trade);
            } else if (trade.status === 4) {
              tablePendingTradesData.push(trade);
            } else if (trade.status === 6) {
              tableAgencyApprovalTradesData.push(trade);
            } else if (trade.status === 7) {
              tableAdvertiserApprovalTradesData.push(trade);
            } else if (trade.status === 8) {
              tablePendingProcessingTradesData.push(trade);
            } else if (trade.status === 5) {
              tableDeclinedTradesData.push(trade);
            }
          }
        });
        const tradeDataCopy = {
          tableProgressTradesData,
          tablePausedTradesData,
          tableCompletedTradesData,
          tablePendingTradesData,
          tableAgencyApprovalTradesData,
          tableAdvertiserApprovalTradesData,
          tablePendingProcessingTradesData,
          tableDeclinedTradesData,
        };
        setTradeData(tradeDataCopy);
        setFilteredTradeData(tradeDataCopy);
        switchToTab(tradeDataCopy, activeTab);
      } else {
        const tradeDataCopy = {
          tableProgressTradesData: [],
          tablePausedTradesData: [],
          tableCompletedTradesData: [],
          tablePendingTradesData: [],
          tableAgencyApprovalTradesData: [],
          tableAdvertiserApprovalTradesData: [],
          tablePendingProcessingTradesData: [],
          tableDeclinedTradesData: [],
        };
        setTradeData(tradeDataCopy);
        switchToTab(tradeDataCopy, activeTab);
      }
    };

    // To filter trade data based on advertiser name
    const onFilterAdvertiserData = (filteredData) => {
      const filteredTrade = {};
      Object.entries(tradeData).forEach(([key, value]) => {
        filteredTrade[key] = value?.filter((a) => {
          if (filteredData) {
            if (a.adv_company_name && filteredData.includes(a.adv_company_name)) {
              return true;
            } else if (filteredData.includes('with no advertisers')) {
              return true;
            }
          }
          return false;
        });
      });
      return filteredTrade;
    };

    // To dispaly table data when a particular advertiser is selected from the Advertised dropdown.
    const applyFilter = (filteredData, id) => {
      if (id === 'adv_filter') {
        setAdvertiserFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvertiserData(filteredData);
        setFilteredTradeData(modifiedData);
        switchToTab(modifiedData);
        setSearchValue('');
      }
    };

    // To close view modal of view button with data reset.
    const closeViewModal = () => {
      if (trades) {
        setUpgradedAdspot([]);
        setMgData([]);
        setSegmentData([]);
      }
      onSetActiveModal('');
    };

    // To show data according to their tabs on tab change.
    const switchToTab = (tradeDataCopy = filteredTradeData, tabData = activeTab) => {
      if (tabData && tradeDataCopy) {
        let NcmTradeTableDataCopy;
        if (tabData.id === 'active') {
          NcmTradeTableDataCopy = tradeDataCopy.tableProgressTradesData;
        } else if (tabData.id === 'paused') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePausedTradesData;
        } else if (tabData.id === 'completed') {
          NcmTradeTableDataCopy = tradeDataCopy.tableCompletedTradesData;
        } else if (tabData.id === 'pendingDistributorApproval') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePendingTradesData;
        } else if (tabData.id === 'pendingAgencyApproval') {
          NcmTradeTableDataCopy = tradeDataCopy.tableAgencyApprovalTradesData;
        } else if (tabData.id === 'pendingAdvApproval') {
          NcmTradeTableDataCopy = tradeDataCopy.tableAdvertiserApprovalTradesData;
        } else if (tabData.id === 'pendingProcessing') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePendingProcessingTradesData;
        } else if (tabData.id === 'declined') {
          NcmTradeTableDataCopy = tradeDataCopy.tableDeclinedTradesData;
        }
        setSearchDataList(NcmTradeTableDataCopy);
      }
    };

    // Condition the response of pause api.
    const conditionApiResponse = (res) => {
      if (typeof res.messaging_group !== 'string') {
        res.messaging_group = res.messaging_group.name;
      }
      if (!res.ad_id.adid_id) {
        res.ad_id.adid_id = res.ad_id.adid_meta_file_upload.id;
      }
      if (!res.ad_id.s3_thumbnail_url) {
        res.ad_id.s3_thumbnail_url = res.ad_id.adid_meta_file_upload.s3_thumbnail_url;
      }
      return res;
    };

    // To to call API when user wants to Pause a trade from 'Active tab' or Activate a trade from 'Paused tab'
    // And to move the trade to their relevant tabs after activation/pausing.
    const pauseCustomTrade = () => {
      const tradeObj = {
        trade_id: modalData.id,
      };
      manageCampaignStore.pauseCustomTrade(tradeObj).then(
        (response) => {
          if (response.status === 3) {
            response = conditionApiResponse(response);
            const tradesCpy = JSON.parse(JSON.stringify(filteredTradeData));
            const index = tradesCpy['tableProgressTradesData'].findIndex((trade) => trade.id === modalData.id);
            response = addAdvertiserName(tradesCpy['tableProgressTradesData'], index, response);
            tradesCpy['tableProgressTradesData'].splice(index, 1);
            if (index >= 0) {
              tradesCpy['tablePausedTradesData'].unshift(response); //To move paused trade to the Pause tab via splice
              setTradeData(tradesCpy);
              setFilteredTradeData(tradesCpy);
              setActiveTab(NcmManageTradeTabs[1]);
              switchToTab(tradesCpy, { id: 'paused' });
            }
            showAckMessage({
              message: 'Campaign paused successfully.',
            });
          } else if (response.status === 0) {
            response = conditionApiResponse(response);
            const tradesCpy = JSON.parse(JSON.stringify(filteredTradeData));
            const index = tradesCpy['tablePausedTradesData'].findIndex((trade) => trade.id === modalData.id);
            response = addAdvertiserName(tradesCpy['tablePausedTradesData'], index, response);
            tradesCpy['tablePausedTradesData'].splice(index, 1);
            if (index >= 0) {
              tradesCpy['tableProgressTradesData'].unshift(response); //To move activated trade to the Active tab via splice
              setTradeData(tradesCpy);
              setFilteredTradeData(tradesCpy);
              setActiveTab(NcmManageTradeTabs[0]);
              switchToTab(tradesCpy, { id: 'active' });
            }
            showAckMessage({
              message: 'Campaign activated successfully.',
            });
          } else if (response && response.status && response.message) {
            showAckErrorMessage({ message: JSON.stringify(response.message) });
          } else {
            showAckErrorMessage();
          }
          setActiveModal('');
          setSearchValue('');
        },
        () => showAckErrorMessage()
      );
    };

    // On click function for Refresh button to load API like it loads when we open this page for the first time.
    const onPageRefresh = () => {
      setSearchValue('');
      setActiveAccordion('');
      getCustomTrades();
    };

    return (
      <MainContent>
        <PageHeader className="flex-container2">
          <PageTitle>Manage NCM Campaigns</PageTitle>
          <StyledHeader>
            <div className="flex-container1 float-right-imp">
              {isAgencyAdminUser ? (
                <div className="mn-adv-trade-filter">
                  <ReactPickyFilter
                    onFilterChange={applyFilter}
                    allOptions={advertiserFilterAllData}
                    selectedData={advertiserFilterSelectedData}
                    id="adv_filter"
                    selectAllText="Select All Advertisers"
                    allSelectedPlaceholder="All Advertisers"
                  />
                </div>
              ) : null}
              <div className="mn-trade-search-bar ml10">
                <SearchBox searchValue={searchValue} handleSearchTextChange={handleSearchTextChange} />
              </div>

              <CustomButton
                type="primary"
                buttonText="Refresh"
                buttonClassName="mn-trade-refresh-btn ml10"
                handleButtonClick={() => onPageRefresh()}
              />
            </div>
          </StyledHeader>
        </PageHeader>
        <NcmManageSummary isAgencyAdminUser={isAgencyAdminUser} tradeData={tradeData} summaryData={summaryData} />
        <div className="nav nav-tabs">
          <NcmManageTabs
            onTabChange={onTabChange}
            activeTab={activeTab}
            tradeData={filteredTradeData}
            ncmManageTradeTabs={NcmManageTradeTabs}
            isAgencyAdminUser={isAgencyAdminUser}
          />
        </div>
        <NcmManageTable
          searchDataList={searchDataList}
          activeTab={activeTab}
          activeTradesTableTitle={activeTradesTableTitle}
          pausedTradesTableTitle={pausedTradesTableTitle}
          pendingDistributorTradesTableTitle={pendingDistributorTradesTableTitle}
          declineTradesTableTitle={declineTradesTableTitle}
          handleTableButtonAction={handleTableButtonAction}
          toggle={toggle}
          activeAccordion={activeAccordion}
          orderDetailData={orderDetailData}
          orderReplacementInfo={orderReplacementInfo}
          isAgencyAdminUser={isAgencyAdminUser}
          handleSearchTextChange={handleSearchTextChange}
          isLoading={uiStore.isLoading}
          accordionHeader={accordionHeader}
          getVideoUrl={getVideoUrl}
          getVideoUrlForAccordion={getVideoUrlForAccordion}
          getViewTrades={getViewTrades}
          isLoadingAccordion={isLoadingAccordion}
        />
        <ApprovalStatusModal
          showModal={
            activeModal === 'approve' ||
            activeModal === 'decline' ||
            activeModal === 'paused' ||
            activeModal === 'active'
          }
          closeModal={() => onSetActiveModal('')}
          activeModal={activeModal}
          confirmTradeApproval={confirmTradeApproval}
          pauseCustomTrade={pauseCustomTrade}
          setActiveTrade={setActiveTrade}
          activeTrade={activeTrade}
        />
        <ViewTradesModal
          showModal={activeModal === 'view'}
          closeModal={closeViewModal}
          activeModal={activeModal}
          viewTrades={viewTrades}
          upgradedAdspot={upgradedAdspot}
          mgData={mgData}
          segmentData={segmentData}
          getAdspotView={getAdspotView}
          nextPageUrl={nextPageUrl}
        />
        <CreativeAdPreviewModal
          showModal={activeModal === 'preview' || activeModal === 'accVideo'}
          closeModal={closeCreativeVideoModal}
          creativeModalData={creativeModalData}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

ManageNcm.propTypes = {
  authStore: PropTypes.object,
  manageCampaignStore: PropTypes.object,
  uiStore: PropTypes.object,
};
export default withStore(ManageNcm);
