import { action, observable } from 'mobx';
import API from '../api';

class FoxVizioStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable impressionDataListing = [];

  @action async getImpressionData() {
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
