import { action, observable, makeObservable } from 'mobx';
import API from '../api';

class FoxVizioStore {

  impressionDataListing = null;

  constructor(
    impressionDataListing,
  ) {
    makeObservable(this, {
      impressionDataListing: observable,
      getImpressionData: action,
    })
  }

  getImpressionData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/vizio_fox/impression_data/');
      if (res && res.status === 200) {
        this.impressionDataListing = res.data.results;
      }
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default FoxVizioStore;
