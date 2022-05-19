import { action } from 'mobx';
import API from '../api';

class ManageCampaignStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action async getCustomTrades() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/pilot/get_order/');
      return res.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getOrderSummary(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/ncm/order_summary/?trade_id=${tradeId}`);
      return res.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getUnivisionOrderSummary(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/campaign/create_trade/?trade_id=${tradeId}`);
      return res.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getOrderDetail(orderId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/ncm/order_detail/?trade_id=${orderId}`);
      return res.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async changeOrderStatus(tradeId, actionMode, actionComment) {
    this.rootStore.uiStore.isLoading = true;
    try {
      let status;
      if (actionMode === 'approve') {
        status = 0;
      } else if (actionMode === 'decline') {
        status = 5;
      } else if (actionMode === 'advApproval' || actionMode === 'agencyApproval') {
        status = 8;
      }
      const res = await API.post('/advertiser/approve_trade/', {
        trade_id: tradeId,
        status,
        comment: actionComment,
      });

      return res.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async pauseCustomTrade(tradeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/advertiser/pause_trade/', tradeId);
      return res.data.data;
    } catch (e) {
      return e;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getVideoUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/pilot/get_ftp_creative_files/?item_id=${creativeId}`);
      return res.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default ManageCampaignStore;
