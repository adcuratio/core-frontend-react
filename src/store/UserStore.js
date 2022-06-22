import { action, makeObservable } from "mobx";

import API from "../api";

class UserStore {
  constructor() {
    makeObservable(this, {
      getAgencyList: action,
      getAllAgencyAdmin: action,
      saveAgency: action,
      editAgency: action,
      saveAgencyAdmin: action,
      editAgencyAdmin: action,
      getAllOperator: action,
      getAllOperatorAdmin: action,
      saveOperator: action,
      saveOperatorAdmin: action,
      editOperator: action,
      editOperatorAdmin: action,
      getAllNetworks: action,
      getAllUserNetworks: action,
      getAllSubChannelsInfo: action,
      saveNetwork: action,
      saveNetworkAdmin: action,
      editNetworkAdmin: action,
      editNetwork: action,
      getAllNetworkAdmin: action,
    });
  }

  async getAgencyList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get("/agency/get_agency_list/");
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllAgencyAdmin(agencyId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/admin/list_agency_admins/?agency_id=${agencyId}`
      );
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveAgency(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/admin/create_agency/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editAgency(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/admin/edit_agency/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveAgencyAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/admin/agency_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editAgencyAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/admin/agency_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllOperator() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get("/pilot/operator/");
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllOperatorAdmin(operatorId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/operator_admin/?operator_id=${operatorId}`
      );
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveOperator(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/pilot/operator/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveOperatorAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/pilot/operator_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editOperator(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/pilot/operator/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editOperatorAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/pilot/operator_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllNetworks() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get("/admin/list_networks/");
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getAllUserNetworks() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/users/networks/`);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getAllSubChannelsInfo(networkId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`/users/networks/?id=${networkId}`);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveNetwork(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/admin/create_network/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveNetworkAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post(`/admin/network_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editNetworkAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/admin/network_admin/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editNetwork(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/admin/edit_network/`, payload);
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllNetworkAdmin(networkId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/admin/list_network_admins/?network_id=${networkId}`
      );
      return res.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default UserStore;
