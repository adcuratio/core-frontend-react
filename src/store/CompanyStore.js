import { observable, action } from 'mobx';
import API from '../api';

class CompanyStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable companies = [];

  @action async getAllCompanies() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/advertiser/get_company_list/');
      this.companies = res.data.data;
      return res;
    } catch (error) {
      this.rootStore.isLoading = false;
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getAllCompaniesWithCampaigns() {
    this.rootStore.isLoading = true;

    const res = await API.get(
      '/advertiser/get_company_list/?include_campaign=true&include_adid=true&is_cmt_request=true'
    );
    this.companies = res.data.data;
    this.rootStore.isLoading = false;
  }

  @action async getCompanyMSGTree(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getUrl = `/admin/get_all_companies/?company_id=${id}`;
      const res = await API.get(getUrl);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      this.rootStore.uiStore.isLoading = false;
      return error.response;
    }
  }
}

export default CompanyStore;
