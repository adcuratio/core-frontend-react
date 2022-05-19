import { action, observable } from 'mobx';
import API from '../api';

class OperatorStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable aneLogData = [];
  @observable dishLogData = [];

  @action async getAneLogData(month, year) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = `/operator/get_activity_logs?month=${month}&year=${year}`;
    try {
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      if (res.data.success === true) {
        this.aneLogData = res.data;
      } else {
        this.aneLogData = [];
      }
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      this.aneLogData = [];
      return error;
    }
  }

  @action async getDishLogData() {
    this.rootStore.uiStore.isLoading = true;
    const url = '/operator/list_dish_log';
    try {
      const res = await API.get(url);
      this.rootStore.uiStore.isLoading = false;
      if (res.data.success === true) {
        this.dishLogData = res.data;
      } else {
        this.dishLogData = [];
      }
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      this.dishLogData = [];
      return error;
    }
  }

  @action async getAneLog(filename) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/operator/get_activity_log?filename=${filename}`;
      const res = await API.get(url);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getLogRange(startDate, endDate) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/operator/get_log_range?from_date=${startDate}&to_date=${endDate}`;
      const res = await API.get(url);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getDishRange(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/operator/get_dish_range_log?dish_range_id=${id}`;
      const res = await API.get(url);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getAllManageCreatives() {
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

  @action async operAckCreative(_data) {
    this.rootStore.uiStore.isLoading = true;
    const data = {
      identifier_list: [_data.identifier],
    };
    try {
      const res = await API.post('/pilot/receive_creatives/', data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  @action async confirmEncoding(_data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/pilot/encode_creative/', _data);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  //API for manage campaign tags listing
  @action async getAllCampaignTags() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/ncm/get_segment_tags/');
      return res;
    } catch (e) {
      this.rootStore.uiStore.isLoading = false;
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  //API for add attribute ID confirmation button
  @action async addAttributeId(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/ncm/add_attribute_id/', payload);
      return res;
    } catch (error) {
      throw error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  //API for confirming campaign tags
  @action async confirmTag(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/ncm/ack_segment_tag/', data);
      return res;
    } catch (error) {
      throw error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async ApproveDeclineAction(payload, id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/audience/v1/custom_audience/${id}/`, payload);
      return res;
    } catch (error) {
      throw error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default OperatorStore;
