import { action, makeObservable } from 'mobx';
import API from '../api';

class XandrStore {
  constructor() {
    makeObservable(this, {
      getAllManageCreatives: action,
      confirmCreative: action,
      getSegmentFilesList: action,
      onUpdateSegmentFile: action,
      getOrderList: action,
      getOrderlines: action,
      getInventoryDetails: action,
      changeOrderState: action,
      getOrderDetails: action,
    });
  }

  getAllManageCreatives(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/xandr-core/v1/creatives/` : url;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  confirmCreative(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/xandr-core/v1/creatives/${id}/`);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  getSegmentFilesList(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/xandr-core/v1/segment_files/` : url;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  onUpdateSegmentFile(fileId, payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.patch(`/xandr-core/v1/segment_files/${fileId}/`, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getOrderList(url, state) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/xandr/v1/orders/?state=${state}` : url;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getOrderlines(order_id, url) {
    try {
      const getURL = !url ? `/xandr/v1/orders/${order_id}/orderlines` : url;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getInventoryDetails(trade_id, url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = !url ? `/ncm/inventory_detail/?trade_id=${trade_id}` : url;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  changeOrderState(id, payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/xandr/v1/orders/${id}/`;
      const res = await API.patch(url, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  getOrderDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getUrl = `/xandr-core/v1/order_details?trade_id=${id}`;
      const res = await API.get(getUrl);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

}

export default XandrStore;
