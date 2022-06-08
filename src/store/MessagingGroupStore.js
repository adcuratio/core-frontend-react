import { action, makeObservable} from 'mobx';

import API from '../api';

class MessagingGroupStore {
  constructor() {
    makeObservable(this, {
      getAllMessagingGroup: action,
      deleteMsgGrp: action,
      getVideoUrl: action,
      getAllCompanies: action,
      getAllGroupsByEntity: action,
      getAdidMetaData: action,
      saveMessagingGroup: action,
      editMessagingGroup: action,
    });
  }

  async getAllMessagingGroup() {
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

  async deleteMsgGrp(companyId, segmentId) {
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

  async getVideoUrl(creativeId) {
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

  async getAllCompanies(includeAdIds) {
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

  async getAllGroupsByEntity(entityId, entityType) {
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
  async getAdidMetaData(obj) {
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

  async saveMessagingGroup(payload) {
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

  async editMessagingGroup(payload) {
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
