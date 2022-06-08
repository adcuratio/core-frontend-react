import { observable, action, makeObservable } from 'mobx';
import API from '../api';

import { showAckErrorMessage } from './../common/utils';

class AdvSchStore {

  adspotsDate = null;
  networkFeedbackData = null;
  ADInventory = null;

  constructor(
    adspotsDate,
    networkFeedbackData,
    ADInventory
  ) {
    makeObservable(this, {
      adspotsDate: observable,
      networkFeedbackData: observable,
      ADInventory: observable,
      resolveDeal: action,
      getEDI: action,
      getEDIInfo: action,
      getEDIPage: action,
      changeEDIApproval: action,
      uploadEdiFromAgency: action,
      resolveEdiFiles: action,
    });
  }

  handleAPIErrors = (
    res,
    configuredErrorMsg = 'An unexpected error occurred. If the problem persists, please contact the Adcuratio administrator for further support.'
  ) => {
    if (res && res.status !== 200 && res.status !== 201) {
      if (res.data.message) {
        showAckErrorMessage({ message: res.data.message });
      } else {
        showAckErrorMessage({ message: configuredErrorMsg });
      }
    }
  };

  async resolveDeal(resolveNum) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/edi/campaign_resolve_view/?deal_number=${resolveNum}`);
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      }
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getEDI() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/edi/ediview/');
      this.rootStore.uiStore.isLoading = false;
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      } else {
        showAckErrorMessage();
      }
      return error.response;
    }
  }

  async getEDIInfo(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/edi/get_deal_info/?edi_id=${id}`);
      this.rootStore.uiStore.isLoading = false;
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      } else {
        showAckErrorMessage();
      }
      return error.response;
    }
  }

  async getEDIPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(url);
      this.rootStore.uiStore.isLoading = false;
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      } else {
        showAckErrorMessage();
      }
      return error.response;
    }
  }

  async changeEDIApproval(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/edi/approve_deal/', payload);
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      } else {
        showAckErrorMessage();
      }
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async uploadEdiFromAgency(media) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/edi/ediview/', media);
      this.rootStore.uiStore.isLoading = false;
      this.handleAPIErrors(res);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      if (error.response.status === 415) {
        showAckErrorMessage({ message: error.response.statusText });
      } else if (error.response.status === 406) {
        showAckErrorMessage({ message: error.response.data });
      } else if (error.response.status === 403 && error.response.data.detail) {
        showAckErrorMessage({ message: error.response.data.detail });
      } else {
        showAckErrorMessage();
      }
      return error.response;
    }
  }

  async resolveEdiFiles(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put('/edi/campaign_resolve_view/', payload);
      return response;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default AdvSchStore;
