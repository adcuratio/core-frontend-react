import { action, makeObservable } from 'mobx';
import API from '../api';

class CreativesVideoStore {
  constructor() {
    makeObservable(this, {
      getVideoUrl: action,
    })
  }

  getVideoUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(`/pilot/get_ftp_creative_files/?item_id=${creativeId}`);
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default CreativesVideoStore;
