import { observable, action, makeObservable } from 'mobx';

import API from '../api';

import { errorNotification } from './../common/utils';

class SuperAdminStore {

  adspotsDate = null;
  getWeek = null;
  getTradeId = null;
  getEntityId = null;
  networkFeedbackData = null;
  ADInventory = null;

  constructor(
    adspotsDate,
    getWeek,
    getTradeId,
    getEntityId,
    networkFeedbackData,
    ADInventory,
  ) {
    makeObservable(this, {
      adspotsDate: observable,
      getWeek: observable,
      getTradeId: observable,
      getEntityId: observable,
      networkFeedbackData: observable,
      ADInventory: observable,
      getAdspotsDate: action,
      getFilterData: action,
      getAdspotsForDate: action,
      getNetworkFeedbackData: action,
      getNetworkFeedbackWeekData: action,
      saveAdspots: action,
      getMetaSlotInfoDates: action,
      getMetaSlotInfo: action,
      getCompanyDataProviderList: action,
      updateCompanyDataProvider: action,
      getICD10List: action,
      getIDC10FileDetails: action,
      getXanDeliveryReportsList: action,
      getXanDeliveryReportsDetails: action,
      handleCalculateButton: action,
      opsGetCreatives: action,
      getAllChannels: action,
      associateNetworksToCreatives: action,
      associateChannelsToCreatives: action,
      editAssociatedNetworksToCreatives: action,
      fetchCampaigns: action,
      fetchAdspotDetails: action,
      fetchSlotsDetails: action,
      fetchPrecheckDetails: action,
      fetchSegmentTags: action,
      fetchCreatives: action,
      companyDropdownListMgLogs: action,
      companyDropdownListSegmentLogs: action,
      fetchNetworkLogs: action,
      opsGetCampaigns: action,
      getCampaignDistributors: action,
      modifyAssociatedDistributorsToCampaign: action,
      createNewRecurringSchedule: action,
      getAllSegments: action,
      getCompanyList: action,
      getClientDataFilters: action,
      getPaginatedClientData: action,
      getClientData: action,
      updateClientData: action,
      getActiveLinks: action,
      generateToken: action,
      confirmClientStatusQA: action,
      uploadConsent: action,
      fetchConsent: action,
    });
  }

  getUniqNetworks = (adspots) => [...new Set(adspots.map((a) => a.channel))];

  handleAPIErrors = (
    res,
    configuredErrorMsg = 'An unexpected error occurred. If the problem persists, please contact the Adcuratio administrator for further support.'
  ) => {
    if (res && res.status !== 200 && res.status !== 201) {
      if (res.data.message) {
        errorNotification({ message: res.data.message });
      } else {
        errorNotification({ message: configuredErrorMsg });
      }
    }
  };

  getAdspotsDate() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/addressable_inventory/');
      this.rootStore.uiStore.isLoading = false;
      if (res.status === 200) {
        this.adspotsDate = res.data;
      }
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getFilterData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/get_network_feedback_meta/');
      this.rootStore.uiStore.isLoading = false;
      if (res.status === 200) {
        this.getWeek = res.data.weeks;
        this.getTradeId = res.data.trades;
        this.getEntityId = res.data.entities;
      }
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getAdspotsForDate(selectedDate) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/admin/addressable_inventory/?week_start=${selectedDate}`;
      const res = await API.get(url);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getNetworkFeedbackData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/get_network_feedback/');
      if (res.status === 200) this.networkFeedbackData = res.data;
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getNetworkFeedbackWeekData(selectedWeek, selectedTradeId, selectedEntityId) {
    this.rootStore.uiStore.isLoading = true;
    const queryParam = {};
    if (selectedWeek) {
      queryParam.week = selectedWeek;
    }
    if (selectedTradeId) {
      queryParam.trade_id = selectedTradeId;
    }
    if (selectedEntityId) {
      queryParam.entity_id = selectedEntityId;
    }

    try {
      const res = await API.get('/admin/get_network_feedback/', { params: queryParam });
      if (res.status === 200) this.networkFeedbackData = res.data;
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  saveAdspots(payload = null) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/admin/addressable_inventory/', payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getMetaSlotInfoDates() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/meta_slot_info_dates');
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getMetaSlotInfo(date) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/admin/meta_slot_info/?date_str=${date}`);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getCompanyDataProviderList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/data_providers/');
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  updateCompanyDataProvider(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put('/admin/data_providers/', data);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // ICD10
  getICD10List({ month, year, url = '' }) {
    this.rootStore.uiStore.isLoading = true;
    const requestURL = !url ? `xandr/v1/reports?month=${month}&year=${year}${url}` : url;
    try {
      const res = await API.get(requestURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  // ICD 10 File Details
  getIDC10FileDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`xandr/v1/reports/${id}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // xandr delivery reports view
  getXanDeliveryReportsList({ month, year }, url = '') {
    this.rootStore.uiStore.isLoading = true;
    const requestURL = !url ? `xandr/v1/delivery-reports?month=${month}&year=${year}` : url;
    try {
      const res = await API.get(requestURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  getXanDeliveryReportsDetails(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(url);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  handleCalculateButton(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/admin/venn_diagram/', data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [manage creatives module] Getting list of creatives. (pagination enabled)
  opsGetCreatives(url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? '/admin/get_creative_list/' : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getAllChannels() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/get_channel_group/');
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  associateNetworksToCreatives(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/admin/network_association/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  associateChannelsToCreatives(adId, channelList) {
    this.rootStore.uiStore.isLoading = true;
    const payload = {
      channel_list: channelList,
      adid_id: adId,
    };
    try {
      const res = await API.post(`/admin/channel_group_association/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  editAssociatedNetworksToCreatives(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/admin/network_association/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  // API call for fetching the campaigns.
  fetchCampaigns(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = payload || '/ncm/campaign';
      const res = await API.get(url);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for fetching the ads pot details data.
  fetchAdspotDetails({ tradeId, dataType, url }) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/ncm/status_details/?cmt_id=${tradeId}&option=${dataType}` : url;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for fetching the slots details data.
  fetchSlotsDetails({ tradeId, url }) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/admin/slots_detail/?trade_id=${tradeId}` : url;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for fetching pre-checked data.
  fetchPrecheckDetails(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/ncm/trade_prechecks/?trade_id=${tradeId}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for Attribute Logs
  fetchSegmentTags() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/ncm/get_segment_tags/');
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for creative log page
  fetchCreatives() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const dealUrl = '/pilot/get_creative_files/';
      const res = await API.get(dealUrl);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for handling the change of company in messaging group logs
  companyDropdownListMgLogs(cid) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/admin/get_audience_segments/?entity_id=${cid}&audience_segment_type=messaging_groups`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // API call for handling the change of company in segment logs.
  companyDropdownListSegmentLogs(cid) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/admin/get_audience_segments/?entity_id=${cid}&audience_segment_type=target_segments`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  // API call for fetching network logs.
  fetchNetworkLogs({ selectedMonthInt, selectedYear }) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/list_logs/?month=${selectedMonthInt}&year=${selectedYear}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  opsGetCampaigns() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('campaign/customized_messaging_trades/');
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getCampaignDistributors() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('campaign/distributors/');
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  modifyAssociatedDistributorsToCampaign(payload, id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`campaign/customized_messaging_trades/${id}/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  createNewRecurringSchedule(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/schedules/mock-schedule/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getAllSegments(advId, brandId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/advertiser/adc_group/?is_wanted=${true}&companies=${advId.join(',')}&brands=${brandId.join(',')}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getCompanyList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/advertiser/get_company_list/`;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getClientDataFilters(payload) {
    let getURL;
    this.rootStore.uiStore.isLoading = true;
    try {
      getURL = `/users/hierarchy/?status=${payload.status}`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getPaginatedClientData(payload, url) {
    this.rootStore.uiStore.isLoading = true;
    let getURL;
    if (!url) {
      getURL = `/users/form_info/?status=${payload.status}`;
      if (payload?.search) {
        getURL = `${getURL}&search=${payload.search}`;
      }
      const parsedAdvertisers = payload?.advertisers?.map((v) => encodeURIComponent(v));
      const parsedIndusties = payload?.industries?.map((v) => encodeURIComponent(v));
      const parsedSubIndustries = payload?.sub_industries?.map((v) => encodeURIComponent(v));
      const parsedAgencies = payload?.agencies?.map((v) => encodeURIComponent(v));
      if (parsedAdvertisers?.toString()) {
        getURL = `${getURL}&advertisers=${parsedAdvertisers.toString()}`;
      }
      if (parsedIndusties?.toString()) {
        getURL = `${getURL}&industries=${parsedIndusties.toString()}`;
      }
      if (parsedSubIndustries?.toString()) {
        getURL = `${getURL}&sub_industries=${parsedSubIndustries.toString()}`;
      }
      if (parsedAgencies?.toString()) {
        getURL = `${getURL}&agencies=${parsedAgencies.toString()}`;
      }
      if (payload?.sort_by) {
        let ordering = payload.sort_by;
        if (payload.sort_type === 'des') {
          ordering = `-${payload.sort_by}`;
        }
        getURL = `${getURL}&ordering=${ordering}`;
      }
    } else {
      getURL = url;
    }
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getClientData(url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? '/users/client/' : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  updateClientData(id, data) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = `/users/client/${id}/`;
    try {
      const res = await API.put(getURL, data);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getActiveLinks(url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? '/users/links/' : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  generateToken() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/users/client/`);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  confirmClientStatusQA(data, id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.patch(`/users/client/${id}/`, data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  uploadConsent(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/users/consent_file_upload/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  fetchConsent(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/users/consent_file_upload/?client_form_id=${data}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default SuperAdminStore;
