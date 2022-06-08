import { action, observable, makeObservable } from 'mobx';
import API from '../api';

class VizioStore {

  impressionDataListing = null;

  constructor(
    impressionDataListing
  ) {
    makeObservable(this, {
      impressionDataListing: observable,
      getTargetSegments: action,
      getCreativesForReview: action,
      confirmCreative: action,
      searchCreativeResult: action,
    })
  }

  

  async getTargetSegments() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/audience/v1/target_files/');
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    }
  }

  // [review creatives module] Getting list of creatives. (pagination enabled)
  async getCreativesForReview(url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? '/creative/v1/replacement_creatives/' : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [review creatives module] Confirming a creative.
  async confirmCreative(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/pilot/ack_creative/', data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async searchCreativeResult(data) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/creative/v1/replacement_creatives/?search=${data}`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default VizioStore;
