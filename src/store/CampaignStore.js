import { observable, action } from 'mobx';
import API from '../api';

class CampaignStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable campaigns = []; // Also referred as Orders at some places

  // Data for form
  @observable formDealIds = [];
  @observable formAdids = [];
  @observable formCreativeDurations = [];
  @observable formAdidsandVendors = {};
  @observable formAdids = [];
  @observable deliveryVendors = [];
  @observable nextPageUrl = '';
  @observable uniqAdspotFilterData = {
    uniqNetworks: [],
    uniqDeals: [],
    uniqFW: [],
    uniqDP: [],
    uniqSN: [],
  };
  @observable formCMTInventory = [];
  @observable relatedMSG = {};
  @observable segmentsAvailableForCopy = [];
  @observable selectedId;
  @observable response;

  @action prepareNCMData() {
    this.formDealIds = [];
    this.formAdids = [];
    this.formCreativeDurations = [];
    this.formAdidsandVendors = {};
    this.formAdids = [];
    this.deliveryVendors = [];
    this.nextPageUrl = '';
    this.uniqNetworks = {
      uniqNetworks: [],
      uniqDeals: [],
      uniqFW: [],
      uniqDP: [],
      uniqSN: [],
    };
    this.formCMTInventory = [];
    this.relatedMSG = {};
    this.segmentsAvailableForCopy = [];
  }
  @action clearNCMData() {
    this.relatedMSG = {};
    this.segmentsAvailableForCopy = [];
  }
  @action clearStep1Data() {
    this.formAdidsandVendors = [];
    this.formAdids = [];
    this.deliveryVendors = [];
    this.nextPageUrl = '';
    this.formDealIds = [];
  }

  @action async getCMTInventory(deals, entityId, entityType, adId) {
    this.rootStore.uiStore.isLoading = true;

    try {
      const res = await API.post('/advertiser/get_cmt_inventory/', {
        deal_id_list: [...deals].map((d) => d.id),
        entity_type: entityType,
        entity_id: entityId,
        ad_ids: [adId],
      });

      this.formCMTInventory = res.data.data.map((inv) => ({
        ...inv,
        is_selected: true,
        adspot_date: inv.adspot_date ? inv.adspot_date.split('T')[0] : 'No datetime data',
      }));
      this.uniqAdspotFilterData = {
        uniqNetworks: [...new Set(this.formCMTInventory.map((net) => net.channel_name))],
        uniqDeals: [...new Set(this.formCMTInventory.map((net) => net.deal_number))],
        uniqFW: [...new Set(this.formCMTInventory.map((net) => net.adspot_date))],
        uniqDP: [...new Set(this.formCMTInventory.map((net) => net.day_part_name))],
        uniqSN: [...new Set(this.formCMTInventory.map((net) => net.show_name))],
      };
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getCreativeDurationForEntity(entityType, entityId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.get('/advertiser/get_creative_duration_list/', {
        params: { entity_type: entityType, entity_id: entityId },
      });
      if (res.status === 200)
        // Filter incoming durations from hardcoded durations
        this.formCreativeDurations = res.data;
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async getDealIds(entityType, entityId, creativeId) {
    this.rootStore.uiStore.isLoading = true;
    const params = {
      entity_type: entityType,
      entity_id: entityId,
    };
    if (creativeId) params.creative_ids = `[${creativeId}]`;
    try {
      const res = await API.get('/edi/get_approved_deals/', {
        params,
      });
      if (res.status === 200) {
        this.formDealIds = res.data.data.map((edi) => ({ ...edi, isSelected: false }));
      }
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  // No processing of default creatives.
  processCreatives = (res) => res.data.data.results;

  // obj structure: {entityType: null, entityId: null, duration: null, url: null}
  @action async getAdids(obj) {
    this.rootStore.uiStore.isLoading = true;
    let queryURL = '';

    if (obj?.url) {
      queryURL = obj?.url;
    } else if (obj?.entityType && obj?.entityId && obj?.duration) {
      obj.duration = `[${obj.duration}]`;
      queryURL = `/creative/v1/creatives/?entity_type=${obj?.entityType}&entity_id=${obj?.entityId}&duration=${obj?.duration}`;
    } else if (obj?.entityType && obj?.entityId) {
      queryURL = `/creative/v1/creatives/?entity_type=${obj?.entityType}&entity_id=${obj?.entityId}`;
    }

    try {
      const res = await API.get(queryURL);

      if (res && res.status === 200) {
        if (res.data && res.data?.success) {
          this.nextPageUrl = res.data?.data?.next;
          this.deliveryVendors = res.data?.delivery_vendor_choices;

          const processedCreatives = this.processCreatives(res);
          let concatenatedArray;
          if (obj?.url) {
            const creativesDataCpy = JSON.parse(JSON.stringify(this.formAdids));
            const processedCreativesCpy = JSON.parse(JSON.stringify(processedCreatives));
            concatenatedArray = [...creativesDataCpy, ...processedCreativesCpy];
          } else {
            concatenatedArray = JSON.parse(JSON.stringify(processedCreatives));
          }
          this.formAdids = concatenatedArray;
        } else throw res.data?.message;
      } else throw new Error('No data on server.');
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action handlePagination() {
    this.getAdids({ url: this.nextPageUrl });
  }

  @action async getSegments(strategy, companyId, entityType, entityId, adId) {
    try {
      const res = await API.get(
        `/advertiser/get_related_messaging_groups/?type=${strategy}&company_id=${companyId}&${entityType}_id=${entityId}&default_adid=${adId}`
      );
      if (res.status === 200) {
        this.relatedMSG = {
          messaging_groups: res.data.data.messaging_groups,
          segments: res.data.data.segments.map((inv) => ({ ...inv, isSelected: true })),
          isValid: true,
        };
      }
    } catch (error) {
      // do something
    }
  }

  @action async getMGDistribution(segArr, mgArr, entityType, entityId) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/ncm/segment_distribution/', {
        giver_id_list: segArr,
        taker_id_list: mgArr,
        entity_type: entityType,
        entity_id: entityId,
      });
      return res.data;
    } catch (e) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async saveNCMCampaign(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.post('/advertiser/customized_trade_view/', payload);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async saveCreative(
    isciCreative,
    isciIdentifier,
    isciFile,
    entityId,
    entityType,
    houseId,
    updateMode,
    deliveryVendor = ''
  ) {
    this.rootStore.uiStore.isLoading = true;
    const formData = new FormData();
    formData.append('creative_name', isciCreative);
    formData.append('identifier', isciIdentifier);
    formData.append('entity_id', entityId);
    formData.append('entity_type', entityType);
    formData.append('creative_file_name', isciFile);
    formData.append('house_id', houseId);
    if (deliveryVendor) {
      formData.append('delivery_vendor', deliveryVendor);
    }

    try {
      let res;
      if (updateMode) {
        res = await API.put('/pilot/upload_creative_files/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        res = await API.post('/pilot/upload_creative_files/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      if (res.status === 200) {
        this.forUploadCreative = res.data.data;
      }
      return res.data;
    } catch (error) {
      // do something
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  @action async copySegment(selectedEntity, entityType) {
    let reqString = `company_id=${selectedEntity.company}`;
    if (entityType === 'brand') reqString = `${reqString}&brand_id=${selectedEntity.id}`;
    // else {
    //   reqString = `${reqString}&brand_id=${$scope.selectedCompany.parent}&sub_brand_id=${$scope.selectedCompany.id}`;
    // }
    //reqString = `${reqString}&brand_id=${brandId}`;
    const hierarchyType = entityType;
    try {
      const res = await API.get(`/advertiser/copy_adc_group/?hierarchy_type=${hierarchyType}&${reqString}`);
      if (res.status === 200) {
        this.segmentsAvailableForCopy = res.data.map((inv) => ({ ...inv, selected: false }));
        return this.segmentsAvailableForCopy;
      }
    } catch (error) {
      // do something
    }
  }

  @action async copySelectedSegments(payload) {
    const res = await API.post('/advertiser/copy_adc_group/', payload);
    if (res.data.success) {
      this.response = res.data.success;
      return res;
    }
  }

  @action async getVideoUrl(creativeId) {
    try {
      const res = await API.get(`/pilot/get_ftp_creative_files/?item_id=${creativeId}`);
      if (res.data.success) {
        return res.data.data;
      }
    } catch (err) {
      // do something
    }
  }
  @action async editHouseIdAction(payload) {
    this.rootStore.uiStore.isLoading = true;
    try {
      const res = await API.patch(`/pilot/upload_creative_files/`, payload);
      return res;
    } catch (error) {
      return error;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default CampaignStore;
