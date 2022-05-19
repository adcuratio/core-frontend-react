import { action, observable, makeObservable } from "mobx";
import API from "../api";

class AccountManagementStore {
  segmentsList = null;
  advertiserAdminData = null;
  agencyRepData = null;
  subagencyList = null;
  companyList = null;
  brandsList = null;

  constructor(
    segmentsList,
    advertiserAdminData,
    agencyRepData,
    subagencyList,
    companyList,
    brandsList
  ) {
    makeObservable(this, {
      segmentsList: observable,
      advertiserAdminData: observable,
      agencyRepData: observable,
      subagencyList: observable,
      companyList: observable,
      brandsList: observable,
      getAllAgencyRep: action,
      getAllAgencyRepUnivision: action,
      getAllAdvertiserAdmin: action,
      getAllSegments: action,
      getAllCompanies: action,
      getAllBrands: action,
      getAllSubAgencies: action,
      saveSubAgency: action,
      editSubAgency: action,
      editAdvertiserAdmin: action,
      saveAdvertiser: action,
      saveAgencyRep: action,
      editAgencyRep: action,
      saveAdvertiserAdmin: action,
      editAdvertiserAdmin: action,
      saveBrand: action,
      updateBrand: action,
      saveSubBrand: action,
      updateSubBrand: action,
    });
  }

  getSubagenciesList = (data) => {
    const subagencyList = [];
    data.forEach((agency) => {
      agency.sub_agency.forEach((subagency) => {
        subagency.agency = agency.name;
        subagencyList.push(subagency);
      });
    });
    return subagencyList;
  };

  getCompaniesList = (data) => {
    const companyListData = data.map((company) => company.company);
    return companyListData;
  };

  async getAllAgencyRep() {
    this.agencyRepData = null;
    try {
      const response = await API.get(
        "/advertiser/get_user_list/?user_type=Agency Rep"
      );
      if (response.data.success) {
        this.agencyRepData = response.data.data;
      }
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getAllAgencyRepUnivision() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        "/advertiser/get_user_list/?user_type=Network Admin"
      );
      return response;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllAdvertiserAdmin() {
    this.advertiserAdminData = null;
    try {
      const response = await API.get(
        "/advertiser/get_user_list/?user_type=Advertiser Admin"
      );
      if (response.data.success) {
        this.advertiserAdminData = response.data.data;
      }
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getAllSegments() {
    this.segmentsList = null;
    try {
      const response = await API.post("/agency/segment_hierarchy/");
      if (response.data.success) {
        this.segmentsList = response.data.data;
      }
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async getAllCompanies(includeAdIds, isCmtRequest) {
    this.companyList = null;
    this.rootStore.uiStore.isLoading = true;
    try {
      let queryURL = `/advertiser/get_company_list/?include_campaign=${true}`;
      if (includeAdIds) {
        queryURL += `&include_adid=${true}`;
      }
      if (isCmtRequest) {
        queryURL += `&is_cmt_request=${true}`;
      }
      const response = await API.get(queryURL);
      if (response.data.success) {
        this.companyList = this.getCompaniesList(response.data.data);
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllBrands() {
    this.brandsList = null;
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/advertiser/get_company_list/?include_campaign=${true}`
      );
      if (response.data.success) {
        const brList = [];
        response.data.data.forEach((company) => {
          company.company.brands.forEach((brand) => {
            brand.company_name = company.company.name;
            brand.sub_brands_with_ids = JSON.parse(
              JSON.stringify(brand.sub_brands)
            );
            brand.campaigns = brand.campaigns.map((campaign) => campaign.name);
            brand.sub_brands = brand.sub_brands.map((sb) => sb.name);
            brList.push(brand);
          });
        });
        this.brandsList = brList;
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllSubAgencies() {
    this.subagencyList = null;
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get("/agency/get_agency_list/");
      if (response.data.success) {
        this.subagencyList = this.getSubagenciesList(response.data.data);
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveSubAgency(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/agency/sub_agency/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editSubAgency(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put("/agency/sub_agency/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveAdvertiser(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/agency/company/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveAgencyRep(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/agency/agency_rep/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editAgencyRep(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put("/agency/agency_rep/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveAdvertiserAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/agency/advertiser_admin/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async editAdvertiserAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put("/agency/advertiser_admin/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveBrand(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/advertiser/create_brand/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async updateBrand(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put("/advertiser/edit_brand/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async saveSubBrand(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post("/advertiser/create_sub_brand/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async updateSubBrand(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put("/advertiser/edit_sub_brand/", payload);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default AccountManagementStore;
