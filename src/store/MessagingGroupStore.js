import { action } from 'mobx';

import API from '../api';

class MessagingGroupStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action async getAllMessagingGroup() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/advertiser/get_messaging_group/');
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async deleteMsgGrp(companyId, segmentId) {
    this.rootStore.uiStore.isLoading = true;
    const payload = {
      data: {
        company_id: companyId,
        id: segmentId,
      },
    };
    try {
      const res = await API.delete('/advertiser/segment/', payload);
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
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

  @action async getAllCompanies(includeAdIds) {
    this.rootStore.uiStore.isLoading = true;
    try {
      let queryURL = `/advertiser/get_company_list/?include_campaign=${true}`;
      if (includeAdIds) {
        queryURL += `&include_adid=${true}`;
      }

      const response = await API.get(queryURL);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getAllGroupsByEntity(entityId, entityType) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const isWanted = true;
      const queryParam = {
        is_wanted: isWanted,
      };
      const queryURL = `/advertiser/adc_group/`;
      if (entityType === 'company') {
        queryParam.company_id = entityId;
      } else if (entityType === 'brand') {
        queryParam.brand_id = entityId;
      } else {
        queryParam.sub_brand_id = entityId;
      }

      const response = await API.get(queryURL, { params: queryParam });
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // obj structure: {entityId: null, entityType: null, url: null}
  @action async getAdidMetaData(obj) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const queryURL = !obj?.url
        ? `/creative/v1/creatives/?entity_type=${obj?.entityType}&entity_id=${obj?.entityId}`
        : obj.url;
      const response = await API.get(queryURL);
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async saveMessagingGroup(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/advertiser/segment/', payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async editMessagingGroup(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put('/advertiser/segment/', payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default MessagingGroupStore;
