import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';
import axios from 'axios';

import withStore from '../../hocs/WithStore';

import { PageTitle } from '../../components/Typography';
import { MainContent, PageHeader } from '../../components/PageLayout';
import CustomButton from '../../components/CustomButton';
import ReactLoader from '../../components/ReactLoader';
import ReactPickyFilter from '../../components/ReactPickyFilter';
import SearchBox from '../../components/SearchBox';
import CreativeAdPreviewModal from '../../components/CreativesAdPreviewModal';
import OrderOrderLineCancelModal from '../univsion-agg-campaign/components/OrderOrderlineCancelModal';

import { applySearch, formatText, showAckErrorMessage, showAckMessage } from '../../common/utils';

import NcmManageTabs from './components/ManageTabs';
import NcmManageTable from './components/ManageTable';
import {
  NcmManageTradeTabs,
  activeTradesTableTitle,
  pausedTradesTableTitle,
  accordionHeader,
  pendingDistributorTradesTableTitle,
  pendingUCITradesTableTitle,
  activeAccordionHeader,
  viewAccordionDetailsTitles,
  completedTradesTableTitle,
} from './components/JsonData';
import ViewTradesModal from './components/VIewCampaignDetail';
import ApprovalStatusModal from '../../dash-agency-adv/view-existing-campaigns/components/ApprovalStatusModal';
import NcmManageSummary from './components/SummaryPieChart';
import ViewDetails from './components/ViewReportDetails';
import ViewGraph from './components/ViewGraph';
import TableContainer from '../reporting/reports-post-campaign/components/TableContainer';
import { postCampaignNetworkTitles } from '../reporting/reports-post-campaign/components/JsonData';
import DayPartTableContainer from '../reporting/reports-post-campaign-daypart-reports/components/TableContainer';
import { postCampaignDayPartTitles } from '../reporting/reports-post-campaign-daypart-reports/components/JsonData';
import PacingReportsTableContainer from '../reporting/reports-pacing/components/TableContainer';
import { pacingReportsTitles } from '../reporting/reports-pacing/components/JsonData';

const StyledHeader = styled.div`
  width: 54%;
`;

const UnivisionManageCampaigns = inject(
  'authStore',
  'manageCampaignStore',
  'uiStore',
  'tradeStore',
  'univisionStore',
  'navigationService',
  'aggCampaignStore'
)(
  observer((props) => {
    const {
      manageCampaignStore,
      uiStore,
      authStore,
      navigationService,
      tradeStore,
      univisionStore,
      aggCampaignStore,
      $state,
    } = props;
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
    });
    const [activeTab, setActiveTab] = useState(NcmManageTradeTabs[$state.params.tableState]);
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
    const [activeReportData, setActiveReportData] = useState([]);
    const [viewReportsDetailsList, setViewReportDetailsList] = useState([]);
    const [toggleGraph, setToggleGraph] = useState(false);
    const [orderLineDetails, setOrderLineDetails] = useState([]);
    const [toggleEditModal, setToggleEditModal] = useState(false);
    const [editCampaignData, setEditCampaignData] = useState({});
    const [editType, setEditType] = useState('');
    const [showOrderCancelModal, setShowOrderCancelModal] = useState(false);
    const [cancelOrderData, setCancelOrderData] = useState({});
    const [impressionsCount, setImpressionsCount] = useState({});
    const [approveOrderData, setOrderApproveData] = useState({});
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [id, setId] = useState('');
    const [networkReportData, setNetworkReportData] = useState([]);
    const [dayPartReportsData, setDayPartReportsData] = useState([]);
    const [pacingReportData, setPacingReoprtData] = useState([]);

    useEffect(() => {
      getCustomTrades();
    }, []);

    const toggleOrderCancelModal = (trade) => {
      setCancelOrderData(trade);
      setShowOrderCancelModal(!showOrderCancelModal);
    };

    const onCancelOrder = (trade, cancelReason) => {
      if (!cancelReason.length) {
        showAckErrorMessage({ message: ' Please describe the reason to cancel' });
        return;
      }
      aggCampaignStore.cancelOrder(trade.id, cancelReason).then(
        (res) => {
          if (res.data.success) {
            showAckMessage({ message: 'Order cancelled successfully' });
            setShowOrderCancelModal(!showOrderCancelModal);
            getCustomTrades('cancel');
          } else {
            showAckErrorMessage({ message: res.data.message });
            setShowOrderCancelModal(!showOrderCancelModal);
          }
        },
        (error) => showAckErrorMessage({ message: error.message })
      );
    };

    const onApproveUCIPending = (trade) => {
      aggCampaignStore.onApproveUCIPending(trade.id).then(
        (res) => {
          if (res.data.success) {
            showAckMessage({ message: 'Order Approved successfully' });
            setShowApproveModal(!showApproveModal);
            getCustomTrades('approve');
          } else {
            showAckErrorMessage({ message: res.data.message });
            setShowApproveModal(!showApproveModal);
          }
        },
        (error) => showAckErrorMessage({ message: error.message })
      );
    };

    const toggleApproveModal = (trade) => {
      setOrderApproveData(trade);
      setShowApproveModal(!showApproveModal);
    };

    const getCustomTrades = (goToCanelTab) => {
      manageCampaignStore.getCustomTrades().then(
        (trade) => {
          if (trade && trade.success) {
            const orders = trade?.data.orders;
            const tradeDataCopy = buildTradeData(orders);
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
            if (goToCanelTab === 'cancel') {
              onTabChange(NcmManageTradeTabs[3], tradeDataCopy);
            } else if (goToCanelTab === 'approve') {
              onTabChange(NcmManageTradeTabs[2], tradeDataCopy);
            }
            getCampaignImpressionsCount();
          } else {
            showAckErrorMessage({ message: trade?.data?.message || 'Unable to fetch orders' });
          }
        },
        () => showAckErrorMessage()
      );
    };

    const getCampaignImpressionsCount = () => {
      univisionStore.getCampaignImpressionsCount().then((res) => {
        if (res?.data?.data) {
          setImpressionsCount(res?.data?.data);
        }
        aggCampaignStore.getNetworksData();
        aggCampaignStore?.getShowsData();
      });
    };

    const handleModalAction = (id, data) => {
      setId(id);
      if (id === 'details') {
        univisionStore.viewReportsDetails(data.id).then(
          (res) => {
            if (res?.data?.results && res?.data?.results?.length) {
              setViewReportDetailsList(res?.data?.results);
              setActiveModal('details');
            } else {
              showAckErrorMessage({ message: 'No Data Found.' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (id === 'pacing_details') {
        univisionStore.viewReportsDetails(data.id).then(
          (res) => {
            if (res?.data?.results && res?.data?.results?.length) {
              setViewReportDetailsList(res?.data?.results);
              setActiveModal('pacing_details');
            } else {
              showAckErrorMessage({ message: 'No Data Found.' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (id === 'graph') {
        setModalData(data);
      } else if (id === 'report') {
        univisionStore.getPacingReports(data?.adv_id, data?.id, data.status).then(
          (res) => {
            if (res && res.data) {
              setPacingReoprtData(res?.data);
            } else {
              showAckErrorMessage({ message: 'No Data Available' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        setToggleGraph(!toggleGraph);
        setModalData(data);
      } else if (id === 'network_report') {
        univisionStore.getCampaignNetworkReports(data?.adv_id, data?.id).then(
          (res) => {
            if (res && res.results) {
              setNetworkReportData(res?.results);
            } else {
              showAckErrorMessage({ message: 'No Data Available' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        setToggleGraph(!toggleGraph);
        setModalData(data);
      } else if (id === 'daypart_report') {
        univisionStore.getCampaignDaypartReports(data?.adv_id, data?.id).then(
          (res) => {
            if (res && res.results) {
              setDayPartReportsData(res?.results);
            } else {
              showAckErrorMessage({ message: 'No Data Available' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        setToggleGraph(!toggleGraph);
        setModalData(data);
      }
    };

    // To open/close Accordion on clicking a table row
    const toggle = (id) => {
      if (id && (id !== activeAccordion || !activeAccordion)) {
        setActiveReportData([]);
        serOrderDetailData([]);
        setOrderReplacementInfo([]);
        setActiveAccordion(id.id);
        setIsLoadingAccordion(true);
        if (activeTab.id === 'active') {
          univisionStore.getCampaignAccordionList(id.adv_id, id.id).then(
            (res) => {
              if (res && res?.data) {
                setIsLoadingAccordion(false);
                setActiveReportData(res?.data);
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
        } else if (activeTab.id !== 'active') {
          tradeStore.getDishOrderDetails(id.id).then(
            (response) => {
              if (response && response.data?.data) {
                setIsLoadingAccordion(false);
                serOrderDetailData(response?.data.campaign_info);
                setOrderReplacementInfo(response?.data?.data?.creative_details);
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
        }
      } else {
        setActiveAccordion(false);
      }
    };

    const getVideoUrlForAccordion = (adid, e) => {
      e.stopPropagation();
      if (adid && adid?.adid_meta_file_upload[0]) {
        manageCampaignStore.getVideoUrl(adid?.adid_meta_file_upload[0].id).then(
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

    const onTabChange = (tab, filteredTradeData) => {
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
      } else if (activeTab.id === 'cancelled') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tablePausedTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pausedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'completed') {
        const completeTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tableCompletedTradesData));
        const list = applySearch(value, completeTradesDataCopy, completedTradesTableTitle);
        setSearchDataList(list);
      } else if (activeTab.id === 'pendingDistributorApproval') {
        const pausedTradesDataCopy = JSON.parse(JSON.stringify(tradeData?.tablePendingTradesData));
        const list = applySearch(value, pausedTradesDataCopy, pendingDistributorTradesTableTitle);
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

    const goToAggOrderDetails = (tradeId, e, comingFromUCIPending) => {
      e.stopPropagation();
      const index = trades.findIndex((a) => a.id === tradeId.id);
      if (index !== -1) {
        navigationService.goToAggCampaignOrderDetails(tradeId.id, comingFromUCIPending);
      }
    };

    const goToAggAddTarget = (tradeId, e) => {
      e.stopPropagation();
      const index = trades.findIndex((a) => a.id === tradeId.id);
      if (index !== -1) {
        navigationService.goToAggCampaignAddTarget(tradeId.id);
      }
    };

    // To get data from API for view modal.
    const getViewTrades = (tradeId, e) => {
      e.stopPropagation();
      const index = trades.findIndex((a) => a.id === tradeId.id);
      if (index !== -1) {
        tradeStore.getDishOrderDetails(tradeId.id).then(
          (res) => {
            if (res && res.data.data) {
              setModalData('view');
              setViewTrades(res.data.data);
              setUpgradedAdspot(res?.data?.data?.creative_details);
              setOrderLineDetails(res?.data?.data?.orderline_details?.orderline_data);
              setMgData(res?.data?.data?.options || []);
              setSegmentData(res?.data.data?.orderline_details?.orderline_data);
              onSetActiveModal('view');
              setSearchValue('');
            } else {
              showAckErrorMessage();
            }
          },
          () => showAckErrorMessage()
        );
      }
    };

    // Based on status, building trade data for respective tabs.
    const buildTradeData = (tradeList = trades) => {
      if (tradeList && tradeList.length) {
        const tableProgressTradesData = [],
          tablePausedTradesData = [],
          tableCompletedTradesData = [],
          tablePendingTradesData = [],
          tablePendingUCIApprovalTardesData = [];
        tradeList.forEach((trade) => {
          if (trade) {
            if (trade.status === 0 || trade.status === 1) {
              tableProgressTradesData.push(trade);
            } else if (trade.status === 9) {
              tablePausedTradesData.push(trade);
            } else if (trade.status === 2) {
              tableCompletedTradesData.push(trade);
            } else if (trade.status === 4) {
              tablePendingTradesData.push(trade);
            } else if (trade.status === 8) {
              tablePendingUCIApprovalTardesData.push(trade);
            }
          }
        });
        const tradeDataCopy = {
          tableProgressTradesData,
          tablePausedTradesData,
          tableCompletedTradesData,
          tablePendingTradesData,
          tablePendingUCIApprovalTardesData,
        };
        setTradeData(tradeDataCopy);
        setFilteredTradeData(tradeDataCopy);
        switchToTab(tradeDataCopy, activeTab);
        return tradeDataCopy;
      } else {
        const tradeDataCopy = {
          tableProgressTradesData: [],
          tablePausedTradesData: [],
          tableCompletedTradesData: [],
          tablePendingTradesData: [],
          tablePendingUCIApprovalTardesData: [],
        };
        setTradeData(tradeDataCopy);
        switchToTab(tradeDataCopy, activeTab);
        return tradeDataCopy;
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
        } else if (tabData.id === 'cancelled') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePausedTradesData;
        } else if (tabData.id === 'completed') {
          NcmTradeTableDataCopy = tradeDataCopy.tableCompletedTradesData;
        } else if (tabData.id === 'pendingDistributorApproval') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePendingTradesData;
        } else if (tabData.id === 'pendingUCIApproval') {
          NcmTradeTableDataCopy = tradeDataCopy.tablePendingUCIApprovalTardesData;
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

    const downloadCampaignReport = (data) => {
      univisionStore.downloadCampaignReport(data.id).then((res) => {
        if (res && res.data) {
          axios.get(res.data.s3_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/json' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `${data?.campaign_name}_${data?.campaign_start_date}_${data?.campaign_end_date}.csv`;
              downloadLink.click();
              uiStore.isLoading = false;
            },
            () => {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: 'Unable to download logs.' });
            }
          );
        }
      });
    };

    const editCampaign = (data, type) => {
      setEditCampaignData(data);
      setToggleEditModal(true);
      setEditType(type);
    };

    const navigateToEditCampaign = (addType = '') => {
      aggCampaignStore.getEditCampaignData(editCampaignData?.id).then(
        (res) => {
          if (res?.data?.success) {
            navigationService.goToAggCampaign(
              'edit',
              res?.data?.draft_data,
              addType === 'activeAddType' ? addType : editType
            );
          } else {
            showAckErrorMessage({ message: 'unable to edit' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const closeModal = () => {
      setToggleEditModal(false);
      setEditType('');
    };

    const downloadManageCampaignNetworkReport = () => {
      univisionStore.downloadNetworkReport(modalData.adv_id, modalData.id).then((res) => {
        if (res && res.data) {
          axios.get(res.data.s3_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/json' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `Report.csv`;
              downloadLink.click();
              uiStore.isLoading = false;
            },
            () => {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: 'Unable to download logs.' });
            }
          );
        }
      });
    };
    const downloadManageCampaignDayPartReport = () => {
      univisionStore.downloadDaypartReport(modalData.adv_id, modalData.id).then((res) => {
        if (res && res.data) {
          axios.get(res.data.s3_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/json' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `Report.csv`;
              downloadLink.click();
              uiStore.isLoading = false;
            },
            () => {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: 'Unable to download logs.' });
            }
          );
        } else {
          showAckErrorMessage({ message: 'No file found on server.' });
        }
      });
    };

    return (
      <MainContent>
        {id === '' && (
          <>
            <PageHeader className="flex-container2">
              <PageTitle>Manage Linear Addressable Campaigns</PageTitle>
              <StyledHeader>
                <div className="flex-container1 float-right-imp">
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
            <NcmManageSummary tradeData={tradeData} summaryData={summaryData} impressionsCount={impressionsCount} />
            <div className="nav nav-tabs">
              <NcmManageTabs
                onTabChange={onTabChange}
                activeTab={activeTab}
                tradeData={filteredTradeData}
                ncmManageTradeTabs={NcmManageTradeTabs}
                show={true}
              />
            </div>
            <NcmManageTable
              searchDataList={searchDataList}
              activeTab={activeTab}
              activeTradesTableTitle={activeTradesTableTitle}
              completedTradesTableTitle={completedTradesTableTitle}
              pausedTradesTableTitle={pausedTradesTableTitle}
              pendingDistributorTradesTableTitle={pendingDistributorTradesTableTitle}
              pendingUCITradesTableTitle={pendingUCITradesTableTitle}
              handleTableButtonAction={handleTableButtonAction}
              toggle={toggle}
              activeAccordion={activeAccordion}
              orderDetailData={orderDetailData}
              orderReplacementInfo={orderReplacementInfo}
              handleSearchTextChange={handleSearchTextChange}
              isLoading={uiStore.isLoading}
              accordionHeader={accordionHeader}
              getViewTrades={getViewTrades}
              isLoadingAccordion={isLoadingAccordion}
              navigationService={navigationService}
              getVideoUrlForAccordion={getVideoUrlForAccordion}
              activeReportData={activeReportData}
              activeAccordionHeader={activeAccordionHeader}
              handleModalAction={handleModalAction}
              setToggleGraph={setToggleGraph}
              downloadCampaignReport={downloadCampaignReport}
              orderLineDetails={orderLineDetails}
              editCampaign={editCampaign}
              goToAggOrderDetails={goToAggOrderDetails}
              goToAggAddTarget={goToAggAddTarget}
              toggleOrderCancelModal={toggleOrderCancelModal}
              toggleApproveModal={toggleApproveModal}
              authStore={authStore}
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
              orderLineDetails={orderLineDetails}
            />
            <CreativeAdPreviewModal
              showModal={activeModal === 'preview' || activeModal === 'accVideo'}
              closeModal={closeCreativeVideoModal}
              creativeModalData={creativeModalData}
            />
            <ViewDetails
              showModal={activeModal === 'details'}
              closeModal={() => onSetActiveModal('')}
              viewDetailsList={viewReportsDetailsList}
              viewDetailsTitles={viewAccordionDetailsTitles}
            />
            <ReactLoader isLoading={uiStore.isLoading} />
          </>
        )}

        <>
          {id === 'graph' && <ViewGraph modalData={modalData} id={id} />}
          {(id === 'report' || id === 'pacing_details') && (
            <>
              <PacingReportsTableContainer
                modalData={modalData}
                id={id}
                pacingReportsTitles={pacingReportsTitles}
                pacingReportsList={pacingReportData}
                handleModalAction={handleModalAction}
                downloadCampaignReport={downloadCampaignReport}
                navigationService={navigationService}
                setId={setId}
                aggCampaignStore={aggCampaignStore}
              />
              <ViewDetails
                showModal={activeModal === 'pacing_details'}
                closeModal={() => onSetActiveModal('')}
                viewDetailsList={viewReportsDetailsList}
                viewDetailsTitles={viewAccordionDetailsTitles}
              />
            </>
          )}
          {id === 'network_report' && (
            <TableContainer
              postCampaignNetworkTitles={postCampaignNetworkTitles}
              postCampaignNetworkList={networkReportData}
              id={id}
              downloadNetworkReport={downloadManageCampaignNetworkReport}
              setId={setId}
            />
          )}
          {id === 'daypart_report' && (
            <DayPartTableContainer
              postCampaignDayPartTitles={postCampaignDayPartTitles}
              postCampaignNetworkList={dayPartReportsData}
              id={id}
              downloadDaypartReport={downloadManageCampaignDayPartReport}
              setId={setId}
            />
          )}
        </>
        <Modal show={toggleEditModal} onHide={closeModal}>
          <Modal.Header closeButton>{`Edit campaign ${editCampaignData?.name}`}</Modal.Header>
          <Modal.Body>
            {editType !== 'active' ? (
              <div className="mt10 mb10">{`Are you sure you want to edit campaign ${editCampaignData?.name} ?`}</div>
            ) : (
              <div>Do you want to?</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {editType !== 'active' ? (
              <CustomButton
                buttonClassName="capitalize"
                type="primary"
                buttonText={`Yes`}
                handleButtonClick={() => navigateToEditCampaign()}
              />
            ) : (
              <>
                <CustomButton
                  buttonClassName="capitalize mr10"
                  type="primary"
                  buttonText={`Add new Audience(in existing campaign)`}
                  handleButtonClick={() => navigateToEditCampaign('activeAddType')}
                />
                <CustomButton
                  buttonClassName="capitalize"
                  type="primary"
                  buttonText={`Edit Ongoing Campaign`}
                  handleButtonClick={() => navigateToEditCampaign()}
                />
              </>
            )}

            <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
          </Modal.Footer>
        </Modal>
        <OrderOrderLineCancelModal
          showModal={showOrderCancelModal}
          toggleModal={toggleOrderCancelModal}
          orderData={cancelOrderData}
          onSubmit={onCancelOrder}
          type={'Order'}
        />
        <Modal show={showApproveModal} onHide={toggleApproveModal} className="network-logs-modal-scroll">
          <Modal.Header closeButton>Approve Order</Modal.Header>
          <Modal.Body>
            <div className="flex-container1 mb20">
              <p>Are you sure you want to approve order {approveOrderData?.name} ? </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton
              buttonClassName="capitalize mr10"
              type="primary"
              buttonText={`Yes`}
              handleButtonClick={() => {
                onApproveUCIPending(approveOrderData);
              }}
            />
            <CustomButton
              type="secondary"
              buttonText="Close"
              buttonClassName="ml10"
              handleButtonClick={toggleApproveModal}
            />
          </Modal.Footer>
        </Modal>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

UnivisionManageCampaigns.propTypes = {
  authStore: PropTypes.object,
  manageCampaignStore: PropTypes.object,
  uiStore: PropTypes.object,
  navigationService: PropTypes.object,
};
export default withStore(UnivisionManageCampaigns);
