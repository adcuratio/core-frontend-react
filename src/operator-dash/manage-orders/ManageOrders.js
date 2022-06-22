import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Pusher from 'pusher-js';
import axios from 'axios';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import ReactLoader from '../../components/ReactLoader';
import CreativesAdPreviewModal from '../../components/CreativesAdPreviewModal';
import TabContainer from '../../components/TabContainer';
import SearchBox from '../../components/SearchBox';
import { ManageTable, InventoryModal, OrderLinesModal, OrderlineActionModal, ActionModal } from './components/index';

import {
  ManageOrderTabs,
  manageHeaderList,
  orderLinesTableColumn,
  inventoryTableColumn,
  declineCodes,
  accrodionHeaderList,
  sasoOrderLinesTableColumn,
} from './JsonData';
import { processUTCtoEST, showAckErrorMessage, showAckMessage, applySearch, formatText } from '../../common/utils';
import withStore from '../../hocs/WithStore';

const ManageOrders = inject(
  'tradeStore',
  'uiStore',
  'creativesVideoStore'
)(
  observer((props) => {
    const { uiStore, tradeStore, creativesVideoStore } = props;

    const [activeTab, setActiveTab] = useState(ManageOrderTabs[0]);
    const [headerList, setHeaderList] = useState([]);
    const [orderList, setOrderList] = useState({});
    const [orderCategorizedList, setOrderCategorizedList] = useState({});
    const [activeModal, setActiveModal] = useState('');
    const [selectedOrder, setSelectedOrder] = useState({});
    const [orderLines, setOrderLines] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const [activeAccordion, setActiveAccordion] = useState({});
    const [orderDetails, setOrderDetails] = useState({});
    const [creativeModalData, setCreativeModalData] = useState('');
    const [order, setOrder] = useState({});

    // order accept/decline data {id: order id, reason: decline comment}
    const [actionData, setActionData] = useState({});
    const [isSocket, setIsSocket] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isLoadingAccordion, setIsLoadingAccordion] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [orderType, setOrderType] = useState('');
    const [orderInfoMetadata, setOrderInfoMetadata] = useState({});

    useEffect(() => {
      setHeaderList(manageHeaderList(activeTab));
      getOrderList();
    }, []);

    // Intialize socket to
    // Get orderlines status
    useEffect(() => {
      if (isSocket) {
        setIsSocket(false);
        setupSocket();
      }
    }, [orderLines, isSocket]);

    const getOrderList = () => {
      setIsLoadingTable(true);
      tradeStore.getOrderList().then(
        (res) => {
          if (res && res.status === 200 && res.data?.success) {
            const concatenatedArray = JSON.parse(JSON.stringify(res?.data?.data?.orders || []));
            const catList = buildOrderTableData(concatenatedArray);
            setOrderList(catList);
            setOrderCategorizedList(catList);
            setIsLoadingTable(false);
          } else {
            showAckErrorMessage({ message: res?.data?.message || 'Unable to fetch orders' });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Unable to fetch orders' });
        }
      );
    };

    const getRequiredOrderData = (order) => ({
      id: order.id,
      order_id: order?.trade_operator?.order_id || '---',
      inventory_owner: order?.inventory_owner || '---',
      agency: order.agency_name,
      advertiser_name: order.adv_company_name,
      brand: order.adv_brand_name || '---',
      sub_brand: order.adv_sub_brand_name || '---',
      order_name: order.name || '---',
      number_of_creatives: order?.creative_count?.toString() || 'N/A',
      order_type: order?.order_type || 'N/A',
      decline_comment: order?.trade_operator?.decline_comment || 'N/A',
      error: order?.trade_operator?.error || 'N/A',
      order_status: order?.trade_operator?.status,
      unapproved: order?.orderline_stats?.Unapproved,
    });

    // Seperate orders based on order status
    const buildOrderTableData = (orders = []) => {
      const pendingOrders = [],
        activeOrders = [],
        completedOrders = [],
        pendingProcessingOrders = [],
        cancelledOrders = [];

      orders.forEach((order) => {
        const orderObj = getRequiredOrderData(order);

        if (order?.trade_operator?.status === 4) {
          pendingOrders.push(orderObj);
          orderObj.status = 'Pending';
        } else if (order?.trade_operator?.status === 2) {
          completedOrders.push(orderObj);
          orderObj.status = 'Completed';
        } else if (order?.trade_operator?.status === 5) {
          cancelledOrders.push(orderObj);
          orderObj.status = 'Declined';
        } else if (order?.trade_operator?.status < 3) {
          activeOrders.push(orderObj);
          orderObj.status = 'Approved';
        } else if (order?.trade_operator?.status === 6) {
          pendingProcessingOrders.push(orderObj);
          orderObj.status = 'PendingProcessing';
        } else if (order?.trade_operator?.status === 7) {
          pendingProcessingOrders.push(orderObj);
          orderObj.status = 'PendingProcessing';
        }
      });

      return {
        pendingOrders,
        pendingProcessingOrders,
        activeOrders,
        completedOrders,
        cancelledOrders,
      };
    };

    /**
     * Change tabs
     * SelectedTab: object
     */
    const onTabChange = (selectedTab) => {
      setActiveTab(selectedTab);
      setHeaderList(manageHeaderList(selectedTab));
      setActiveAccordion('');
    };

    const createApprovalObjForSegment = (status_list) => {
      const approvalArr = status_list?.channel_daypart_approved_list?.reduce(
        (a, apprObj) => [...a, ...Object.values(apprObj).flat()],
        []
      );
      if (status_list?.declined === true || status_list?.declined?.length > 0) {
        return { status: 'Declined' };
      } else if (approvalArr?.length > 0 || Object.keys(status_list?.qa_approved || {}).length > 0) {
        return { status: 'Approved', approvalArr };
      } else {
        return { status: 'Unapproved' };
      }
    };

    // Handle view of table accordion
    const onViewOrderDetails = (order) => {
      const order_id = order.id;
      setSelectedOrder(order);
      setActiveAccordion(order_id);
      setIsLoadingAccordion(true);
      if (order_id && (order_id !== activeAccordion || !activeAccordion)) {
        tradeStore.getDishOrderDetails(order_id).then(
          (res) => {
            setIsLoadingAccordion(false);
            if (res && res.status === 200 && res.data?.success) {
              const segments = res.data.data.creative_details || [];
              segments.forEach((seg) => {
                seg.ad_names = seg?.ad_name;
                seg.identifiers = seg?.identifier;
                seg.asset_id = seg?.adid_meta_file_upload?.[0]?.asset_id;
                seg.s3_thumbnail_url = seg?.adid_meta_file_upload?.[0]?.s3_thumbnail_url;
                seg.attributeId = btoa(seg.name).slice(0, 6);
                seg.approval = createApprovalObjForSegment(
                  (seg?.adid_meta_file_upload[0]?.status_list &&
                    Object.values(seg?.adid_meta_file_upload[0]?.status_list)[0]) ||
                    {}
                );
                seg.approval.approvalArr = seg.approval.approvalArr || [{}];
                seg.approval.approvalArr[0].modified = processUTCtoEST(seg.approval?.approvalArr?.[0]?.modified);

                const confirmed_at = seg.approval?.approvalArr[0]?.modified
                  ? `${seg.approval.approvalArr[0].modified} ET`
                  : '';

                seg.confirmed = `${
                  seg?.adid_meta_file_upload?.[0]?.is_received?.[0]?.is_received ? `Approved` : `Unapproved`
                } ${confirmed_at ? ` at ${confirmed_at}` : ''}`;
              });
              setOrderDetails(segments);
              return segments;
            } else {
              showAckErrorMessage({ message: res?.data?.message || 'Unable to fetch order details' });
            }
          },
          () => {
            showAckErrorMessage({ message: 'Unable to fetch order details' });
          }
        );
      } else {
        setActiveAccordion(false);
      }
    };

    /**
     * Show orderlines
     *
     * @params isFromApproval : boolean, is for
     * Get rderlines data without
     * showing orderline modal
     */
    const onViewOrderlines = (e, order, isFromApproval = false) => {
      setOrder(order);
      setOrderType(order?.order_type);
      e.stopPropagation();
      uiStore.isLoading = !isFromApproval;
      tradeStore.getDishOrderDetails(order.id).then(
        (res) => {
          if (res && res.status === 200 && res.data?.success) {
            const order_lines = res?.data?.data?.orderline_details?.orderline_data || [];
            order_lines.forEach((item) => {
              item.ad_ids = item.ad_id;
              item.sales_ids = item.sales_id;
              item.orderline_id = item.dish_orderline_id;
              item.attr_code = item?.targeting?.TargetingType?.IncludedTerm?.[0]?.Include?.Code || '---';
              item.activation_time = item.activation_time ? `${processUTCtoEST(item.activation_time)} ET` : '---';
              item.deactivation_time = item.deactivation_time ? `${processUTCtoEST(item.deactivation_time)} ET` : '---';
              item.status = isFromApproval && item.status === 'Active' ? 'Active' : item.status;
            });
            setOrderLines(order_lines);
            if (isFromApproval) {
              setIsSocket(true);
              setActiveModal('orderline_status');
              setSelectedOrder(order);
            } else {
              setSelectedOrder(order);
              setActiveModal('order_lines');
            }
          } else {
            // No need to show error
            if (!isFromApproval) showAckErrorMessage({ message: res.data?.message || 'No Data Found' });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Unable to fetch orderlines' });
        }
      );
    };

    // Get inventory detail
    const onViewInventory = (e, order) => {
      e.stopPropagation();
      if (order.id) {
        tradeStore.getInventoryDetails(order.id).then(
          (res) => {
            if (res && res.status === 200) {
              processOderInfo(res.data, true);
              setSelectedOrder(order);
              setActiveModal('inventory');
            } else {
              showAckErrorMessage({ message: res?.data?.message || 'Unable to fetch order lines' });
            }
          },
          () => {
            showAckErrorMessage({ message: 'Unable to fetch orderlines' });
          }
        );
      }
    };
    //Download inventory details
    const onDownloadInventoryDetails = (e, order) => {
      e.stopPropagation();
      uiStore.isLoading = true;
      if (order) {
        uiStore.isLoading = true;
        tradeStore.downloadInventory(order.id).then(
          (res) => {
            if (res.status === 200) {
              axios.get(res?.data?.data?.s3_url).then((a) => {
                const blob = new Blob([a.data], { type: 'application/json' });
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = `download.csv`;
                downloadLink.click();
                uiStore.isLoading = false;
                // showAckMessage({ message: res?.data?.message || 'File downloaded successfully.' });
              });
            } else {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: res.data?.message || 'Server Error' });
            }
          },
          () => {
            uiStore.isLoading = false;
            props.util.showAckErrorMessage({ message: 'Error in downloading the file.' });
          }
        );
      } else props.util.showAckErrorMessage({ message: 'No file found on server.' });
    };

    const orderInventoryChangePage = (newUrl) => {
      if (!newUrl) {
        return;
      }
      tradeStore.getInventoryPage(newUrl).then(
        (res) => {
          if (res && res.status === 200) {
            // const result = res.data;
            processOderInfo(res.data);
          }
        },
        () => {
          showAckErrorMessage({ message: 'Unable to fetch orderlines' });
        }
      );
    };

    const processOderInfo = (data, setTotalPage) => {
      const result = data;
      const filteredArray = result?.results?.map((adspot) => {
        const selectedDetail = {
          advertiserName: result.advertiser_name || '---',
          brandName: result.brand_name || '---',
          subBrand: result.sub_brand_name || '---',
          Channel: adspot.channel || '---',
          adId: adspot.i_isci ? adspot.i_isci : result.default_adid ?? '---',
          programName: adspot.i_show_name || '---',
          assetID: result.asset_id || '---',
          airDate: adspot.i_flighting_date || '---',
          showStartTime: adspot.i_show_start_time ? `${processUTCtoEST(adspot.i_show_start_time)} ET` : '---',
          showEndTime: adspot.i_show_end_time ? `${processUTCtoEST(adspot.i_show_end_time)} ET` : '---',
          adspotAiringTime: adspot.i_airing_time ? `${processUTCtoEST(adspot.i_airing_time)} ET` : '---',
          windowStartTime: adspot.i_start_timeframe ? `${processUTCtoEST(adspot.i_start_timeframe)} ET` : '---',
          windowEndTime: adspot.i_end_timeframe ? `${processUTCtoEST(adspot.i_end_timeframe)} ET` : '---',
          spotUsn: adspot.i_airing_id || '---',
          duration: adspot.duration ? `${adspot.duration}sec` : '---',
        };
        return selectedDetail;
      });
      setInventoryList(filteredArray);

      // setediInfoData(data.results);
      // Setting pagination data
      const ediInfoMetadataCpy = JSON.parse(JSON.stringify(orderInfoMetadata));
      ediInfoMetadataCpy.nextUrl = data.next;
      ediInfoMetadataCpy.prevUrl = data.previous;
      if (setTotalPage) {
        ediInfoMetadataCpy.totalPages = Math.ceil(data.count / data.results.length);
      }
      ediInfoMetadataCpy.currentPage = data.next
        ? Math.ceil(new URL(data.next).searchParams.get('page') - 1)
        : ediInfoMetadataCpy.totalPages;
      setOrderInfoMetadata(ediInfoMetadataCpy);
    };

    // Handle approve or decline action
    const onHandleAction = (e, actionType, order) => {
      e.stopPropagation();
      setSelectedOrder(order);
      setActionData({ id: order.id });
      setActiveModal(actionType);
      // setActiveModal('orderline_status');

      // if (actionType === 'approve') {
      //   onViewOrderlines(e, order, true);
      // }
    };

    // Close modal
    const onCloseModal = () => {
      setSelectedOrder({});
      setActiveModal('');
    };

    // Get Video Url
    // Show Creative using file id
    const getVideoUrlForAccordion = (segment) => {
      const preview_id = segment?.adid_meta_file_upload?.[0]?.id;
      if (preview_id) {
        creativesVideoStore.getVideoUrl(preview_id).then(
          (res) => {
            if (res && res.success && res.data) {
              setActiveModal('accVideo');
              setCreativeModalData(res.data);
            } else {
              showAckErrorMessage({ message: 'Creative data is not found.' });
            }
          },
          () => {
            showAckErrorMessage('Cannot get video file data for the creative.');
          }
        );
      } else {
        uiStore.isLoading = false;
        showAckErrorMessage('No creative data available.');
      }
    };

    const handleOrderlineStatus = (e, id, type) => {
      e.preventDefault();
      const payload = { sales_id: id };
      if (type === 'orderlineApprove') {
        payload.status = 'active';
      } else if (type === 'orderlineDecline') {
        payload.status = 'canceled';
      }

      tradeStore
        .approveOrderline(payload)
        .then(
          (res) => {
            if (res?.data && res.status === 200) {
              if (type === 'orderlineApprove') {
                showAckMessage({
                  message: res.data.message ?? `Orderline approved successfully`,
                });
                // setActiveModal('');
              } else if (type === 'orderlineDecline') {
                showAckMessage({
                  message: res.data.message ?? `Orderline declined successfully`,
                });
                // setActiveModal('');
              }
            } else {
              showAckErrorMessage({ message: 'some error occured' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        )
        .finally(() => {
          if (type === 'orderlineDecline') {
            onViewOrderlines(e, order, true);
          }
          getOrderList();
        });
    };

    // Gets trigger on approve or decline order
    // Validate all required field
    const onHandleConfirm = (e) => {
      e.preventDefault();
      const payload = { trade_id: actionData.id };

      if (activeModal === 'approve') {
        setActiveModal('');
        payload.status = 0;
      } else if (activeModal === 'resubmit') {
        setActiveModal('');
        payload.status = 0;
      } else if (activeModal === 'decline') {
        if (actionData?.reason?.id === undefined) {
          showAckErrorMessage({
            message: 'Please select a reason before declining',
          });
          return;
        } else if (!actionData?.reason?.reason?.trim()) {
          showAckErrorMessage({
            message: 'Decline message should not be empty',
          });
          return;
        } else {
          payload.status = 5;
          payload.comment = formatText(actionData?.reason?.reason);
        }
      }

      tradeStore.changeOrderState(payload).then(
        (res) => {
          if (res && res.status === 200) {
            ['approve', 'resubmit'].includes(activeModal)
              ? onViewOrderlines(e, selectedOrder, true)
              : setActiveModal('');
            moveOrder(actionData.id, orderList, orderCategorizedList, payload);

            if (activeModal === 'decline') {
              showAckMessage({
                message: `Order declined successfully`,
              });
            }
            if (activeModal === 'resubmit') {
              showAckMessage({
                message: `Order resubmitted successfully`,
              });
            }
          } else {
            showAckErrorMessage({ message: res?.data || 'Unable to change status' });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Unable to change status' });
        }
      );
      getOrderList();
    };

    const onChangeDeclineReason = (e, reason) => {
      setActionData({ ...actionData, reason });
    };

    // Update orders after approve/decline
    const updateOrders = (id, orderList, updatedObj) => {
      const orders = JSON.parse(JSON.stringify(orderList));
      const selectObjKey = updatedObj.status === 5 ? 'cancelledOrders' : 'activeOrders';
      const item = orders['pendingOrders'].find((e) => e.id === id);
      const orderObj = {
        ...item,
        status: updatedObj.status === 5 ? 'Declined' : 'Approved',
        decline_comment: updatedObj?.comment || 'N/A',
      };
      orders[selectObjKey].unshift(orderObj);
      orders.pendingOrders = orders.pendingOrders.filter((e) => e.id !== id);
      return orders;
    };

    // Based on approve/decline order action
    // Move Order details to specific tab
    const moveOrder = (id, orderList, orderCategorizedList, updatedOrder) => {
      const filteredOrderList = updateOrders(id, orderList, updatedOrder);
      const filteredCategorizedList = updateOrders(id, orderCategorizedList, updatedOrder);
      setOrderList(filteredOrderList);
      setOrderCategorizedList(filteredCategorizedList);
    };

    // Pusher Setup
    const setupSocket = async () => {
      uiStore.isLoading = isSocket;
      try {
        const pusher = await new Pusher(process.env.REACT_APP_PUSHER_APP_ID, { cluster: 'mt1' });
        const socketChannel = await pusher.subscribe('my-channel');

        await socketChannel.bind('ORDER_CREATE', (data) => {
          showAckMessage({ message: `Order ${data.SalesID} created successfully.` });
        });

        await socketChannel.bind('ORDERLINE_CREATE', (data) => {
          setOrderLines((prevState) => {
            const order_lines = JSON.parse(JSON.stringify(prevState));

            const index = order_lines?.findIndex((e) => e.sales_id === data.SalesID);
            if (index !== -1) {
              order_lines[index] = {
                ...order_lines[index],
                order_id: data.dish_order_id,
                orderline_id: data.dish_orderline_id,
                status: data.error ? 'Pending' : 'Created',
                error: data.error ? data.error : '',
              };
            }
            return order_lines;
          });
        });
      } catch (error) {
        showAckErrorMessage({ message: error });
      } finally {
        uiStore.isLoading = false;
      }
    };

    const onChangeSearch = (inputValue) => {
      setSearchValue(inputValue);
      const filteredOrders = {};
      Object.entries(orderList).forEach(([key, list]) => {
        filteredOrders[key] = applySearch(inputValue, list, headerList);
      });
      setOrderCategorizedList(filteredOrders);
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Review Orders</PageTitle>
        </PageHeader>
        <div className="flex-container2">
          <TabContainer tabList={ManageOrderTabs} activeTab={activeTab} onTabChange={onTabChange} />

          <SearchBox handleSearchTextChange={onChangeSearch} searchValue={searchValue} />
        </div>

        <div style={{ height: '70vh', overflow: 'auto' }}>
          <ManageTable
            activeTab={activeTab}
            tableHeaderList={headerList}
            orderCategorizedList={orderCategorizedList}
            onToggle={onViewOrderDetails}
            onViewOrderlines={onViewOrderlines}
            onViewInventory={onViewInventory}
            onClickAction={onHandleAction}
            activeAccordion={activeAccordion}
            orderDetails={orderDetails}
            getVideoUrlForAccordion={getVideoUrlForAccordion}
            isLoadingAccordion={isLoadingAccordion}
            isLoadingTable={isLoadingTable}
            accrodionHeaderList={accrodionHeaderList}
            selectedOrder={selectedOrder}
            onDownloadInventoryDetails={onDownloadInventoryDetails}
          />
        </div>

        <OrderLinesModal
          isModalActive={activeModal === 'order_lines'}
          closeModal={onCloseModal}
          tableColumns={orderLinesTableColumn}
          orderLines={orderLines}
          order={selectedOrder}
          orderType={orderType}
          sasoTableColumns={sasoOrderLinesTableColumn}
        />

        <InventoryModal
          isModalActive={activeModal === 'inventory'}
          closeModal={onCloseModal}
          tableColumns={inventoryTableColumn}
          inventoryList={inventoryList}
          order={selectedOrder}
          orderInfoMetadata={orderInfoMetadata}
          orderInventoryChangePage={orderInventoryChangePage}
        />

        <CreativesAdPreviewModal
          showModal={activeModal === 'accVideo'}
          closeModal={onCloseModal}
          creativeModalData={creativeModalData}
        />

        {/* Approve / Decline Modal */}
        <ActionModal
          isModalActive={activeModal === 'approve' || activeModal === 'decline' || activeModal === 'resubmit'}
          closeModal={onCloseModal}
          actionData={{
            actionType: activeModal,
            selectedValue: actionData.reason,
            reasons: declineCodes,
            onChangeReason: onChangeDeclineReason,
          }}
          order={selectedOrder}
          onHandleConfirm={onHandleConfirm}
        />
        <OrderlineActionModal
          isModalActive={activeModal === 'orderline_status'}
          closeModal={onCloseModal}
          actionData={{
            actionType: activeModal,
          }}
          // onHandleConfirm={onHandleConfirm}
          tableColumns={orderLinesTableColumn}
          orderLines={orderLines}
          order={selectedOrder}
          orderType={orderType}
          sasoTableColumns={sasoOrderLinesTableColumn}
          handleOrderlineStatus={handleOrderlineStatus}
        />
        {/* <DeclineModal
          isModalActive={activeModal === 'decline'}
          closeModal={onCloseModal}
          order={selectedOrder}
          actionData={{
            actionType: activeModal,
            selectedValue: actionData.reason,
            reasons: declineCodes,
            onChangeReason: onChangeDeclineReason,
          }}
          onHandleConfirm={onHandleConfirm}
        /> */}
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

ManageOrders.propTypes = {};

export default withStore(ManageOrders);
