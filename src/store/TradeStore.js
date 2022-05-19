import { action } from 'mobx';
import API from '../api';

class TradeStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action async getOrderList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/ncm/get_order/`;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async getOrderlines(order_id) {
    try {
      const getURL = `/ncm/get_orderlines/?trade_id=${order_id}`;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async getOrderDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getUrl = `/ncm/order_detail/?trade_id=${id}`;
      const res = await API.get(getUrl);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async getDishOrderDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getUrl = `/campaign/v1/operator_trade_details/?trade_id=${id}`;
      const res = await API.get(getUrl);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async getInventoryDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/ncm/inventory_detail/?trade_id=${id}`;
      const res = await API.get(getURL);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async getInventoryPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(url);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async changeOrderState(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/advertiser/approve_trade/`;
      const res = await API.post(url, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async approveOrderline(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/campaign/v1/approve_orderline/`;
      const res = await API.post(url, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }

  @action async downloadInventory(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const url = `/schedules/download_inventory_detail/?trade_id=${tradeId}`;
      const res = await API.get(url);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }
}

export default TradeStore;
