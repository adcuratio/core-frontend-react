import { action } from 'mobx';
import API from '../api';

class CreativesStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  // Getting video URL of a creative.
  // Common for vizio-admin, super-admin, network-admin (review), agency-adv creatives
  @action async getVideoUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/pilot/get_ftp_creative_files/?item_id=${creativeId}`;
      const res = await API.get(getURL);
      return res;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // Getting video URL of a watermarked creative.
  // Common for vizio-admin, super-admin, network-admin (manage + watermark) creatives
  @action async getWatermarkedVideoUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/creative/v1/preview_watermark_creative/${creativeId}/`;
      const res = await API.get(getURL);
      return res;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [watermark creatives module] Getting download url for watermarked creative.
  // Common for vizio-admin, super-admin, network-admin creatives
  @action async getWatermarkedVideoDownloadUrl(creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/creative/v1/download_watermark_creative/${creativeId}/`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [watermark creatives module] Getting list of creatives. (pagination enabled)
  // Common for vizio-admin, super-admin, network-admin creatives
  @action async getCreativesForQA(activeTab, url) {
    this.rootStore.uiStore.isLoading = true;
    const getURL = !url ? `/creative/v1/watermarked_creatives/?status_type=${activeTab}` : url;
    try {
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // [watermark creatives module] Approve/Decline watermarked creative.
  // Common for vizio-admin, super-admin, network-admin creatives
  @action async watermarkQA(data, pk) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/creative/v1/watermarked_creatives/${pk}/`, data);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async editWatermarkID(id, payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/creative/v1/generate_watermark/${id}`, payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async fingerprintWatermarkID(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/creative/v1/preview_mediainfo/${id}/`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  @action async DownloadWatermarkID(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/creative/v1/download_mediainfo/${id}/`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async confirmWatermarkID(id, payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.patch(`/creative/v1/univision_creative/${id}/`, payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default CreativesStore;
