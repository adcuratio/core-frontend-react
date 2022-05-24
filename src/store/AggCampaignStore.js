import { action, observable, makeObservable } from 'mobx';
import API from '../api';
import moment from 'moment';

class AggCampaignStore {
  
  dataProviderList = null;
  creativesListData = null;
  editCampaignListingData = null;
  networkList = null;
  daypartList = null;
  showNameList = null;

  constructor(
    dataProviderList,
    creativesListData,
    editCampaignListingData,
    networkList,
    daypartList,
    showNameList
  ) {
    makeObservable(this, {
      dataProviderList: observable,
      creativesListData: observable,
      editCampaignListingData: observable,
      networkList: observable,
      daypartList: observable,
      showNameList: observable,
      getAggInventory: action,
      editAggInventory: action,
      createSavetoDrafts: action,
      getCampaignDratfs: action,
      deleteCampaignDraft: action,
      getCreativesData: action,
      getEditCampaignData: action,
      getDataProvider: action,
      getFilterBasedonDataProvider: action,
      getNetworksData: action,
      cancelOrder: action,
      cancelOrderline: action,
      addNewAudienceGroup: action,
      editOrderLine: action,
      getViewOrderlineData: action,
      onApproveUCIPending: action,
      getShowsData: action,
    })
  }
  

  getAggInventory(payload) {
    this.rootStore.uiStore.isLoading = true;
    const res = await API.post(`/campaign/create_trade/`, payload);
    if (res.data.success) {
      this.response = res.data.success;
      this.rootStore.uiStore.isLoading = false;
      return res;
    } else {
      this.rootStore.uiStore.isLoading = false;
      return res;
    }
  }

  editAggInventory(tradeId, payload) {
    const res = await API.put(`/campaign/create_trade/${tradeId}/`, payload);
    if (res.data.success) {
      this.response = res.data.success;
      return res;
    } else {
      return res;
    }
  }

  createSavetoDrafts(payload) {
    const res = await API.post(`/campaign/v1/campaign_draft/`, payload);
    if (res.data.success) {
      this.response = res.data.success;
      return res;
    }
  }

  getCampaignDratfs() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/campaign/v1/campaign_draft/`);
      if (res.data.success) {
        this.response = res.data.success;
        this.rootStore.uiStore.isLoading = false;
        return res;
      } else {
        return res.data;
      }
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  deleteCampaignDraft(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/campaign/v1/campaign_draft/${payload}/`);
      if (res.data.success) {
        this.response = res.data.success;
        this.rootStore.uiStore.isLoading = false;
        return res;
      } else {
        return res.data;
      }
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  //Filtering Creatives
  getCreativesData(entityId, type, duration = null, searchValue = null) {
    this.rootStore.uiStore.isLoading = true;
    try {
      let getURL;

      if (duration && searchValue) {
        getURL = `/creative/v1/creatives/?entity_type=company&entity_id=${entityId}&order_type=${type}&search=${searchValue}&duration=[${duration}]`;
      } else if (duration && !searchValue) {
        getURL = `/creative/v1/creatives/?entity_type=company&entity_id=${entityId}&order_type=${type}&duration=[${duration}]`;
      } else if (searchValue && !duration) {
        getURL = `/creative/v1/creatives/?entity_type=company&entity_id=${entityId}&order_type=${type}&search=${searchValue}`;
      } else {
        getURL = `/creative/v1/creatives/?entity_type=company&entity_id=${entityId}&order_type=${type}`;
      }

      const res = await API.get(getURL);
      if (res.data.success) {
        this.creativesListData = res.data.data.results;
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getEditCampaignData(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/campaign/create_trade/?trade_id=${tradeId}`);
      if (res?.status === 200) {
        if (res?.data?.success) {
          this.editCampaignListingData = res?.data?.draft_data;
          return res;
        }
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  //Get Data Provider
  getDataProvider(companyId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/advertiser/adc_group/?is_wanted=true&company_id=${companyId}`);
      if (res.data.success) {
        this.dataProviderList = res.data.data;
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  //Get filtered data after selecting particular data Provider
  getFilterBasedonDataProvider({ data_provider, entity_id }) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/advertiser/adc_group/?is_wanted=true&data_provider=${data_provider}&company_id=${entity_id}`
      );
      if (res.data.success) {
        this.response = res.data.success;
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  getNetworksData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/admin/channels`);
      if (res.data.success) {
        const tempNetworkList = [];
        res?.data?.data?.[0]?.channels?.forEach((channel_obj) => {
          if (channel_obj?.display_name && channel_obj?.id) {
            tempNetworkList.push({
              name: channel_obj?.display_name,
              id: parseInt(channel_obj?.id),
            });
          }
        });
        this.networkList = tempNetworkList;

        const tempDaypartList = [];
        let channel = res?.data?.data?.[0]?.channels?.find((channel) => channel?.name === 'unimas');
        if (!channel) {
          channel = res?.data?.data?.[0]?.channels?.[0];
        }
        channel?.dayparts?.forEach((daypart_obj) => {
          if (daypart_obj?.name && daypart_obj?.id) {
            tempDaypartList.push({
              name: `${daypart_obj?.name} (${moment(daypart_obj?.start_time, ['HH.mm.ss']).format('hh:mma')} - ${moment(
                daypart_obj?.end_time,
                ['HH.mm.ss']
              ).format('hh:mma')} EST)`,
              id: parseInt(daypart_obj?.id),
            });
          }
        });
        this.daypartList = tempDaypartList;
        return res.data;
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  cancelOrder(tradeId, comment) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/campaign/create_trade/${tradeId}/`, { status: 'Canceled', cancel_comment: comment });
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  cancelOrderline(tradeId, comment) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/campaign/univision_orderline/${tradeId}/`, comment);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  addNewAudienceGroup(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/campaign/univision_orderline/`, payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  editOrderLine(tradeId, editData) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/campaign/univision_orderline/${tradeId}/`, editData);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  getViewOrderlineData(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/campaign/univision_orderline/?orderline_id=${tradeId}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  onApproveUCIPending(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/campaign/create_trade/${tradeId}/`, { status: 'Approved' });
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  getShowsData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/schedules/programs/`);
      if (res.status === 200) {
        const copy = [];
        res?.data?.data?.forEach((data) => {
          copy.push({ value: data?.show_name, label: data?.show_name, id: data?.id });
        });
        this.showNameList = [...copy];
      } else {
        return res;
      }
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default AggCampaignStore;
