import { action } from 'mobx';
import API from '../api';

class CreativesVideoStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action async getVideoUrl(creativeId) {
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
