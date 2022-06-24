import { observable, action, makeObservable } from "mobx";
import API from "../api";

class UnivisionStore {
  segments = null;
  liteFilters = null;
  fullFilters = null;
  modelYearForVehicleMake = null;
  experianFilters = null; //JSON.parse(JSON.stringify(ExperianJsonData));
  manageAudiences = null;

  archivedSegments = {
    totalPages: 1,
  };

  constructor(
    segments,
    liteFilters,
    fullFilters,
    modelYearForVehicleMake,
    experianFilters,
    manageAudiences,
    archivedSegments
  ) {
    makeObservable(this, {
      segments: observable,
      liteFilters: observable,
      fullFilters: observable,
      modelYearForVehicleMake: observable,
      experianFilters: observable,
      manageAudiences: observable,
      archivedSegments: observable,
      getLogs: action,
      getLogsDetails: action,
      getLogsDetail: action,
      getTotalPromoLogsDetails: action,
      searchLogDetails: action,
      getTraffickingPlanPage: action,
      getPromoTraffickingPlanPage: action,
      getAllChannels: action,
      getAllSegments: action,
      getAllDataProviderData: action,
      getCompanyList: action,
      getCTVlogs: action,
      getPacingReportsList: action,
      getAllPacingReportsData: action,
      viewReportsDetails: action,
      viewReportsDetailsPage: action,
      archiveSegments: action,
      getPostCampaignDaypartList: action,
      getAllCampaignDaypartReports: action,
      getAllCampaignNetworkReports: action,
      downloadCampaignNetworkReport: action,
      downloadCampaignDaypartReport: action,
      downloadPacingReport: action,
      unarchiveSegments: action,
      getPostCampaignNetworkList: action,
      getAudience: action,
      getAudienceList: action,
      createAudienceRequest: action,
      saveAudience: action,
      confirmDeclineAudience: action,
      getAdvertiserList: action,
      getManageAudienceData: action,
      addDishCount: action,
      getCampaignAccordionList: action,
      getCampaignImpressionsCount: action,
      downloadCampaignReport: action,
      getAdvertiserLists: action,
      addAdvertiserAction: action,
      addUserAdmin: action,
      updateUserAdmin: action,
      getSubAgencyId: action,
      getAdvertiserListData: action,
      getCampaignDaypartReports: action,
      getCampaignNetworkReports: action,
      getPacingReports: action,
      downloadNetworkReport: action,
      downloadDaypartReport: action,
      getForecastData: action,
    });
  }
  async getForecastData(url, status, archive) {
    this.rootStore.uiStore.isLoading = true;
    let getURL;
    if (!url) {
      if (status === "Pending") {
        getURL = `/forecasts/details/?status=${status}`;
      } else {
        getURL = `/forecasts/details/?status=${status}&is_archived=${archive}`;
      }
    } else {
      getURL = url;
    }
    try {
      const response = await API.get(getURL);
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getLogs(month, year) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_list/?year=${year}&month=${month}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getLogsDetails(logId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?univision_log_track_id=${logId}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getLogsDetail(logId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?univision_log_track_id=${logId}&type=${"BuyBack"}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getTotalPromoLogsDetails(logId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?univision_log_track_id=${logId}&type=${"Promo"}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async searchLogDetails(logId, search) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?univision_log_track_id=${logId}&search=${search}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getTraffickingPlanPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?${url.split("?")[1]}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getPromoTraffickingPlanPage(logId, url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/pilot/univision_log_detail/?type=${"Promo"}&univision_log_track_id=${logId}&${
          url.split("?")[1]
        }`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllChannels() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get("/admin/channels/");
      if (res.data.success === true) {
        this.networkData = res.data.data[0];
      } else {
        this.networkData = [];
      }
      return res;
    } catch (error) {
      this.networkData = [];
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllSegments(advId, brandId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/advertiser/adc_group/?is_wanted=${true}&companies=${advId.join(
          ","
        )}&brands=${brandId.join(",")}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllDataProviderData(dataProvider) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/audience/v1/custom_audience/?is_wanted=true&data_provider=${dataProvider.join(
          ","
        )}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getCompanyList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/advertiser/get_company_list/`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getCTVlogs(month = "", year = "") {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/reports/vizio_ctv_logs/?year=${year}&month=${month}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getPacingReportsList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/reports/get_company_campaign_list/?report_type=${"pacing"}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllPacingReportsData(companyId, campaignId, status) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/pacing_reports/?&company=${companyId?.join(
          ","
        )}&status=${status?.join(",")}&campaign=${campaignId?.join(",")}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async viewReportsDetails(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/reports/pacing_reports_details/?pacing_obj_id=${id}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async viewReportsDetailsPage(url) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(url.split(".net/")[1]);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async archiveSegments(seg) {
    this.rootStore.uiStore.isLoading = true;

    const payload = {
      archive_segments: [seg.id],
      archive: true,
    };
    try {
      const res = await API.put(`/advertiser/archive_segment/`, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getPostCampaignDaypartList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        "/reports/get_company_campaign_list/?report_type=dma"
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllCampaignDaypartReports(url, pageUrl) {
    this.rootStore.uiStore.isLoading = true;
    const getUrl = !pageUrl ? `/reports/post_campaign_dma/?${url}` : pageUrl;
    try {
      const res = await API.get(getUrl);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllCampaignNetworkReports(url, pageUrl) {
    this.rootStore.uiStore.isLoading = true;
    const getUrl = !pageUrl ? `/reports/post_campaign_isci/?${url}` : pageUrl;
    try {
      const res = await API.get(getUrl);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async downloadCampaignNetworkReport(companyId, campaignId, creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_isci_report/?&company=${companyId}&campaign=${campaignId?.join(
          ","
        )}&creative=${creativeId?.join(",")}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async downloadCampaignDaypartReport(companyId, campaignId, creativeId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_dma_report/?&company=${companyId}&campaign=${campaignId?.join(
          ","
        )}&dma=${creativeId?.join(",")}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async downloadPacingReport(companyId, campaignId, status) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_combine_pacing_report/?&company=${companyId?.join(
          ","
        )}&status=${status?.join(",")}&campaign=${campaignId?.join(",")}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async unarchiveSegments(seg) {
    this.rootStore.uiStore.isLoading = true;

    const payload = {
      archive_segments: [seg.id],
      archive: false,
    };
    try {
      const res = await API.put(`/advertiser/archive_segment/`, payload);
      this.rootStore.uiStore.isLoading = false;
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getPostCampaignNetworkList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `/reports/get_company_campaign_list/?report_type=isci`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAudience() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(`audience/v1/custom_audience/?is_wanted=true`);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAudienceList(advId, dp) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get(
        `audience/v1/custom_audience/?is_wanted=true&companies=${advId.join(
          ","
        )}&data_provider=${dp.join(",")}`
      );
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async createAudienceRequest(payload) {
    try {
      this.rootStore.uiStore.isLoading = true;
      const res = await API.post(`/audience/v1/custom_audience/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async saveAudience(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post("/audience/v1/custom_audience/", payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async confirmDeclineAudience(payload, id) {
    try {
      this.rootStore.uiStore.isLoading = true;
      const res = await API.put(`/audience/v1/custom_audience/${id}/`, payload);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAdvertiserList() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/agency/univision_company/`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getManageAudienceData(advId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/audience/v1/custom_audience/?is_wanted=true&companies=${advId.join(
          ","
        )}`
      );
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async addDishCount(id, payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.put(`/audience/v1/custom_audience/${id}/`, payload);
      return res;
    } catch (error) {
      throw error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getCampaignAccordionList(companyId, campaignId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/pacing_reports/?&company=${companyId}&campaign=${campaignId}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getCampaignImpressionsCount() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(`/reports/impression_count_details/`);
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async downloadCampaignReport(id) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_pacing_report/?pacing_obj_id=${id}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getAdvertiserLists() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/advertiser/get_company_list/?include_campaign=true`
      );
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async addAdvertiserAction(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post(`/agency/company/`, payload);
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async addUserAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.post(
        `/network/create_univision_network/`,
        payload
      );
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async updateUserAdmin(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.put(
        `/network/create_univision_network/`,
        payload
      );
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getSubAgencyId() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get("/agency/get_agency_list/");
      return response;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  // Company list api with an extra param is_generic_required
  async getAdvertiserListData() {
    this.rootStore.uiStore.isLoading = true;
    try {
      const getURL = `/advertiser/get_company_list/?is_generic_required=true`;
      const res = await API.get(getURL);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getCampaignDaypartReports(companyId, campaignId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/post_campaign_daypart/?&company=${companyId}&campaign=${campaignId}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getCampaignNetworkReports(companyId, campaignId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/post_campaign_network/?&company=${companyId}&campaign=${campaignId}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async getPacingReports(companyId, campaignId, status) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/pacing_reports/?&company=${companyId}&campaign=${campaignId}&status=${status}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async downloadNetworkReport(companyId, campaignId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_network_report/?&company=${companyId}&campaign=${campaignId}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
  async downloadDaypartReport(companyId, campaignId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const response = await API.get(
        `/reports/download_daypart_report/?&company=${companyId}&campaign=${campaignId}`
      );
      return response.data;
    } catch (err) {
      return err;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}
export default UnivisionStore;
