import { observable, action, makeObservable } from 'mobx';
import API from '../api';

class NetworkStore {

  networkData = null;
  companies = null;

  constructor(
    networkData,
    companies
  ) {
    makeObservable(this, {
      networkData: observable,
      companies: observable,
      getListOfDates: action,
      getNetworkAdInventory: action,
      getAllCompanies: action,
      createChannel: action,
      createShow: action,
      getAllCreatives: action,
      getVideoUrl: action,
      approveCreative: action,
      editApproveCreative: action,
      declineCreative: action,
      getLogs: action,
      getFoxLogs: action,
      getLogsDetails: action,
      getFoxLogsDetails: action,
      searchLogDetails: action,
      foxSearchLogDetails: action,
      getTraffickingPlanPage: action,
      getFoxTraffickingPlanPage: action,
      approveQA: action,
      declineQA: action,
      saveCreative: action,
      uploadSaveCreative: action,
      getAllChannels: action,
      getCreatives: action,
      getCreativesForReview: action,
      getAggregateNetworksFilterData: action,
      getAggregateNetworksTableData: action,
    })
  }

  getListOfDates() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/v2/addressable_inventory/');
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getNetworkAdInventory(activeTab, activeDate, url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? `/admin/v2/addressable_inventory/?inv_type=${activeTab}&week_start=${activeDate}` : url;
    try {
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getAllCompanies() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/advertiser/get_company_list/');
      this.companies = res.data.data;
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  createChannel(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/admin/channels/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  createShow(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/admin/show_list/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getAllCreatives() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = '/pilot/get_creative_files/';
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getVideoUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/pilot/get_ftp_creative_files/?item_id=${creativeId}`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  approveCreative(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/pilot/approve_creative/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  editApproveCreative(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put('/pilot/approve_creative/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  declineCreative(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/pilot/decline_creative/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getLogs(month, year) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/list_logs/?month=${month}&year=${year}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getFoxLogs(month, year) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/fox_log_list/?month=${month}&year=${year}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getLogsDetails(logId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/get_log_details/?log_id=${logId}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getFoxLogsDetails(logId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/fox_log_detail/?fox_log_track_id=${logId}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  searchLogDetails(logId, search) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/get_log_details/?log_id=${logId}&search=${search}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  foxSearchLogDetails(logId, search) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/fox_log_detail/?fox_log_track_id=${logId}&search=${search}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getTraffickingPlanPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/get_log_details/?${url.split('?')[1]}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getFoxTraffickingPlanPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/fox_log_detail?${url.split('?')[1]}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  approveQA(data) {
    this.rootStore.uiStore.isLoading = true;

    try {
      const res = await API.post('/fox_cbs/approve_qa_creative/', data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  declineQA(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/fox_cbs/decline_qa_creative/', data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [manage creatives module] Upload a new creative.
  saveCreative(
    isciCreative,
    isciIdentifier,
    isciFile,
    entityId,
    entityType,
    deliveryVendor = '',
    selectedchannels,
    houseId
  ) {
    this.rootStore.uiStore.isLoading = true;
    const formData = new FormData();
    formData.append('creative_name', isciCreative);
    formData.append('identifier', isciIdentifier);
    formData.append('entity_id', entityId);
    formData.append('entity_type', entityType);
    formData.append('creative_file_name', isciFile);
    formData.set('channel_list', JSON.stringify(selectedchannels));
    formData.append('house_id', houseId);
    if (deliveryVendor) {
      formData.append('delivery_vendor', deliveryVendor);
    }

    try {
      const res = await API.post('/pilot/upload_creative_files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        this.forUploadCreative = res.data.data;
      }
      return res.data;
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  // [manage creatives module] Upload a new creative.
  uploadSaveCreative(
    isciCreative,
    isciIdentifier,
    isciFile,
    entityId,
    entityType,
    deliveryVendor = '',
    selectedNetworkOption,
    selectedAdOption

    // selectedchannels,
  ) {
    this.rootStore.uiStore.isLoading = true;
    const formData = new FormData();
    formData.append('creative_name', isciCreative);
    formData.append('identifier', isciIdentifier);
    formData.append('entity_id', entityId);
    formData.append('entity_type', entityType);
    formData.append('creative_file_name', isciFile);
    formData.append('network_feed', JSON.stringify(selectedNetworkOption));
    formData.append('ad_type', Number(selectedAdOption));

    // formData.set('channel_list', JSON.stringify(selectedchannels));
    if (deliveryVendor) {
      formData.append('delivery_vendor', deliveryVendor);
    }

    try {
      const res = await API.post('/pilot/upload_creative_files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        this.forUploadCreative = res.data.data;
      }
      return res.data;
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [manage creatives module] Getting list of all the available channels for a network.
  getAllChannels() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/admin/channels/');
      if (res.data.success === true) {
        this.networkData = res.data.data[0];
      } else {
        this.networkData = [];
      }
      return res;
    } catch (error) {
      this.networkData = [];
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [manage creatives module] Getting list of creatives. (pagination enabled)
  getCreatives(url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? '/creative/v1/creatives/' : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [review creatives module] Getting list of creatives. (pagination enabled)
  getCreativesForReview(activeTab, url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? `/creative/v1/replacement_creatives/?status_type=${activeTab}` : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  getAggregateNetworksFilterData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/schedules/v1/aggregation-inventory/');
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  getAggregateNetworksTableData(url, pageUrl) {
    this.rootStore.uiStore.isLoading = true;
    const getUrl = !pageUrl ? `/schedules/v1/aggregation-inventory/?${url}` : pageUrl;
    try {
      const res = await API.get(getUrl);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default NetworkStore;
