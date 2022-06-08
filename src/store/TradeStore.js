import { action, makeObservable } from 'mobx';
import API from '../api';

class TradeStore {
  constructor() {
    makeObservable(this, {
      getOrderList: action,
      getOrderlines: action,
      getOrderDetails: action,
      getDishOrderDetails: action,
      getInventoryDetails: action,
      getInventoryPage: action,
      changeOrderState: action,
      approveOrderline: action,
      downloadInventory: action,
    })
  }

  async getOrderList() {
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

  async getOrderlines(order_id) {
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

  async getOrderDetails(id) {
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

  async getDishOrderDetails(id) {
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

  async getInventoryDetails(id) {
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

  async getInventoryPage(url) {
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

  async changeOrderState(payload) {
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

  async approveOrderline(payload) {
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

  async downloadInventory(tradeId) {
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
