import { observable, action, makeObservable } from "mobx";
import API from "../api";
import IncomeOptions from "../../reactNg/store/IncomeFilterFile";
import NetWorthOptions from "../../reactNg/store/NetWorthFilterFile";
import ChildrenAgeOptions from "../../reactNg/store/ChildrenAge";
import ShopperSliderOptions from "../../reactNg/store/ShopperViewSlider";
import StyleSliderOptions from "../../reactNg/store/ShoppingStyleSlider";
import {
  ExperianAgeSlider,
  CommonSlider,
  ExperianIncomeSlider,
} from "../../reactNg/store/experianSlider";

//import ExperianJsonData from '../../reactNg/segments/containers/ExperianJson';
import { hasProperty } from "../common/utils";

class SegmentStore {
  segments = null;
  liteFilters = null;
  fullFilters = null;
  modelYearForVehicleMake = null;
  experianFilters = null; //JSON.parse(JSON.stringify(ExperianJsonData));

  archivedSegments = {
    totalPages: 1,
  };

  constructor(
    segments,
    liteFilters,
    fullFilters,
    modelYearForVehicleMake,
    experianFilters,
    archivedSegments
  ) {
    makeObservable(this, {
      segments: observable,
      liteFilters: observable,
      fullFilters: observable,
      modelYearForVehicleMake: observable,
      experianFilters: observable,
      archivedSegments: observable,
      getAllSegments: action,
      getCorrespondingModelYear: action,
      getAllLiteGroupCompanies: action,
      getZipCode: action,
      getAllExperianFilters: action,
      getAllTspFullGroupCompanies: action,
      postUserDataForSegmentCreation: action,
      getAllArchivedSegments: action,
      getAllArchivedSegmentsPage: action,
      unarchiveSegments: action,
      archiveSegments: action,
    });
  }

  async getAllSegments(groupType, node, entityType) {
    try {
      this.rootStore.uiStore.isLoading = true;
      let isWanted = false;
      if (groupType && groupType === "wanted") isWanted = true;
      const queryParam = {
        is_wanted: isWanted,
      };
      if (entityType === "brand") {
        queryParam.brand_id = node.id;
      } else if (entityType === "company") {
        queryParam.company_id = node.id;
      } else {
        queryParam.sub_brand_id = node.id;
      }

      const res = await API.get("/advertiser/adc_group/", {
        params: queryParam,
      });
      const groups = res.data.data;
      if (groups && groups.length) {
        groups.forEach((group) => {
          if (group.filter_json && typeof group.filter_json !== "object") {
            group.filter_json = JSON.parse(group.filter_json);
          } else if (!group.filter_json) {
            group.filter_json = {};
          }
        });
      }
      this.segments = groups;
    } catch (err) {
      return err.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getCorrespondingModelYear(make) {
    try {
      this.rootStore.uiStore.isLoading = true;
      const res = await API.get(
        `/advertiser/get_vehicle_filters/?vehicle_make=${make}`
      );
      this.modelYearForVehicleMake = res.data;
      return res.data;
    } catch (err) {
      return err.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllLiteGroupCompanies() {
    try {
      this.rootStore.uiStore.isLoading = true;
      const res1 = await API.get("/advertiser/get_vehicle_filters/");
      const typeData = {};
      typeData.type = "tsp_lite";
      const res = await API.post("/filter_template/", typeData);
      this.liteFilters = res.data;
      this.liteFilters = this.liteFilters.map((lite) => {
        const temp = lite.template.filters.map((filter) => {
          if (lite.name === "Lifestyle") {
            filter.field_type = "table";
            return { ...filter, isTabSelected: false, value: "Yes" };
          } else if (
            filter.field_type === "dropdown" &&
            filter.title === "Shopping Styles"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              optionsArray: StyleSliderOptions,
              value: "",
            };
          } else if (
            filter.field_type === "dropdown" &&
            (filter.title === "Brand Loyalists" ||
              filter.title === "Whats on Sale Shoppers")
          ) {
            return {
              ...filter,
              isTabSelected: false,
              optionsArray: ShopperSliderOptions,
              value: "",
            };
          } else if (
            filter.field_type === "checkbox" &&
            filter.title === "Personas"
          ) {
            return { ...filter, isTabSelected: true, value: [] };
          } else if (
            filter.field_type === "checkbox" &&
            filter.title === "Annual Income"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              value: [],
              optionsArray: [IncomeOptions],
              repeat: "1",
              userValues: [],
            };
          } else if (
            filter.field_type === "dropdown" &&
            filter.title === "Estimated Net worth"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              value: [],
              optionsArray: [NetWorthOptions],
              repeat: "1",
              userValues: [],
            };
          } else if (
            filter.field_type === "dropdown" &&
            filter.title === "Individual Age"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              value: "",
              min: "",
              max: "",
            };
          } else if (
            filter.field_type === "combo" &&
            filter.filter_name !== "Children Age"
          ) {
            filter.handler_field_present.value = "";
            filter.handler_field_any.forEach((fil) => {
              fil.value = "Any";
            });
            filter.key_value_map.forEach((fil) => {
              fil.value = "";
            });
            filter.key_value_map.forEach((fil) => {
              if (fil.title === "Vehicle Make") {
                fil.options[0].values = res1.data.make_list;
              }
            });
            return {
              ...filter,
              isTabSelected: false,
              value: "",
              comboFilters: [],
            };
          } else if (
            filter.field_type === "combo" &&
            filter.filter_name === "Children Age"
          ) {
            filter.key_value_map_any.value = "";
            filter.handler_field.value = "";
            filter.key_value_map_if_children_present[0].value = "1";
            filter.key_value_map_if_children_present[0].isSelected = false;
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.pop();
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.push(
              ChildrenAgeOptions
            );
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.forEach(
              (fil) => {
                if (fil.type !== "range") {
                  fil.value = "";
                }
              }
            );
            filter.comboFilters = [];
            return { ...filter, isTabSelected: false, value: "" };
          } else {
            return { ...filter, isTabSelected: false, value: "" };
          }
        });
        lite.template.filters = temp;

        return { ...lite, isSelected: true, isTabSelectedToShow: false };
      });
      this.liteFilters[0].isTabSelectedToShow = true;
      return this.liteFilters;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getZipCode(zip) {
    try {
      this.rootStore.uiStore.isLoading = true;
      const zipCode = await API.post("/filter_template/", {
        type: "zip_code",
        search_value: zip,
      });
      return zipCode;
    } catch (err) {
      return err.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllExperianFilters() {
    try {
      this.rootStore.isLoading = true;
      const typeData = {};
      typeData.type = "experian_standard";
      const res = await API.post("/filter_template/", typeData);
      this.experianFilters = res.data;
      //this.experianFilters = ExperianJsonData;
      this.experianFilters = this.experianFilters.map((exp) => {
        if (exp.name === "Auto") {
          exp.template.sub_cat.forEach((auto) => {
            auto.isAutoTabSelected = false;
            auto.isAutoHeadingSelected = true;
            auto.sub_cat.forEach((auto_sub_cat) => {
              auto_sub_cat.isAutoSubCategorySelected = false;
              auto_sub_cat.isAutoSubCategoryHeadingSelected = true;
              auto_sub_cat.filters.forEach((filter) => {
                filter.isFilterSelected = false;
                filter.value = "";
              });
            });
            auto.sub_cat[0].isAutoSubCategorySelected = true;
          });
          exp.template.sub_cat[0].isAutoTabSelected = true;
        } else if (hasProperty(exp.template, "sub_cat")) {
          exp.template.sub_cat.forEach((cat) => {
            cat[`is${exp.name}TabSelected`] = false;
            cat[`is${exp.name}HeadingSelected`] = true;
            cat.filters.forEach((filter) => {
              filter.isFilterSelected = false;
              filter.value = "";
              if (
                filter.field_type === "slider" &&
                filter.filter_name === "age"
              ) {
                filter.optionsArray = ExperianAgeSlider;
              } else if (
                filter.field_type === "slider" &&
                filter.title === "Household Income Range"
              ) {
                filter.optionsArray = ExperianIncomeSlider;
                filter.minOption = 1;
                filter.maxOption = 13;
              } else if (filter.field_type === "slider") {
                filter.optionsArray = CommonSlider;
                filter.minOption = 1;
                filter.maxOption = 10;
              } else if (filter.field_type === "table") {
                filter.isValue = false;
              }
            });
          });
          exp.template.sub_cat[0][`is${exp.name}TabSelected`] = true;
        } else {
          exp.template.filters.forEach((filter) => {
            if (filter.field_type === "slider") {
              filter.optionsArray = CommonSlider;
              filter.minOption = 1;
              filter.maxOption = 10;
              filter.value = "";
            } else {
              if (filter.field_type === "multi-select-dropdown") {
                filter.value = [];
              }
              if (filter.filter_name === "mosaic_global_household") {
                const filterOptions = filter.options[0].values.map((val) => ({
                  val,
                  isValueSelected: false,
                }));
                filter.options = filterOptions;
                filter.value = "";
              }
              if (filter.field_type === "table") {
                filter.isValue = false;
              }
              if (
                exp.name === "Presence of Child" ||
                exp.name === "Social Media" ||
                exp.name === "Online Subscriptions" ||
                exp.name === "Consumer Behaviours" ||
                exp.name === "Geographic"
              ) {
                filter.value = "";
              }
              filter.isFilterSelected = false;
            }
          });
        }
        return { ...exp, isSelected: true, isTabSelectedToShow: false };
      });
      this.experianFilters[0].isTabSelectedToShow = true;
      return this.experianFilters;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllTspFullGroupCompanies() {
    // let typeData = {};
    // typeData.type = 'tsp_full';
    try {
      this.rootStore.uiStore.isLoading = true;
      const res1 = await API.get("/advertiser/get_vehicle_filters/");
      const res = await API.post("/filter_template/");
      this.fullFilters = res.data;
      this.fullFilters = this.fullFilters.map((lite) => {
        const temp = lite.template.filters.map((filter) => {
          if (lite.name === "Lifestyle") {
            filter.field_type = "table";
            return { ...filter, isTabSelected: false, value: "Yes" };
          } else if (
            filter.field_type === "checkbox" &&
            filter.title !== "Annual Income"
          ) {
            if (filter.filter_name === "niches_5_0") {
              return { ...filter, isTabSelected: true, value: [] };
            } else {
              return { ...filter, isTabSelected: false, value: [] };
            }
          } else if (
            filter.field_type === "combo" &&
            filter.filter_name === "Children Age"
          ) {
            filter.key_value_map_any.value = "";
            filter.handler_field.value = "";
            filter.key_value_map_if_children_present[0].value = "1";
            filter.key_value_map_if_children_present[0].isSelected = false;
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.pop();
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.push(
              ChildrenAgeOptions
            );
            filter.key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.forEach(
              (fil) => {
                if (fil.type !== "range") {
                  fil.value = "";
                }
              }
            );
            filter.comboFilters = [];
            return { ...filter, isTabSelected: false, value: "" };
          } else if (
            filter.field_type === "checkbox" &&
            filter.title === "Personas"
          ) {
            return { ...filter, isTabSelected: false, value: [] };
          } else if (
            filter.field_type === "checkbox" &&
            filter.title === "Annual Income"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              value: [],
              optionsArray: [IncomeOptions],
              repeat: "1",
              userValues: [],
            };
          } else if (
            filter.field_type === "dropdown" &&
            filter.title === "Estimated Net worth"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              value: [],
              optionsArray: [NetWorthOptions],
              repeat: "1",
              userValues: [],
            };
          } else if (
            filter.field_type === "combo" &&
            filter.filter_name !== "Children Age"
          ) {
            filter.handler_field_present.value = "";
            filter.handler_field_any.forEach((fil) => {
              fil.value = "Any";
            });
            filter.key_value_map.forEach((fil) => {
              fil.value = "";
            });
            filter.key_value_map.forEach((fil) => {
              if (fil.title === "Vehicle Make") {
                fil.options[0].values = res1.data.make_list;
              }
            });
            return {
              ...filter,
              isTabSelected: false,
              value: "",
              comboFilters: [],
            };
          } else if (
            filter.field_type === "dropdown" &&
            (filter.title === "Brand Loyalists" ||
              filter.title === "Whats on Sale Shoppers")
          ) {
            return {
              ...filter,
              isTabSelected: false,
              optionsArray: ShopperSliderOptions,
              value: "",
            };
          } else if (
            filter.field_type === "dropdown" &&
            filter.title === "Shopping Styles"
          ) {
            return {
              ...filter,
              isTabSelected: false,
              optionsArray: StyleSliderOptions,
              value: "",
            };
          } else {
            return { ...filter, isTabSelected: false, value: "" };
          }
        });
        lite.template.filters = temp;
        return { ...lite, isSelected: true, isTabSelectedToShow: false };
      });
      this.fullFilters[0].isTabSelectedToShow = true;
      this.fullFilters.forEach((title) => {
        if (title.name === "Credit") {
          title.template.sub_cat.forEach((cat) => {
            cat.isHeadingSelected = true;
            if (title.template.sub_cat.indexOf(cat) === 0) {
              cat.isCreditTabSelected = true;
            } else {
              cat.isCreditTabSelected = false;
            }
            cat.filters.forEach((filter) => {
              filter.isFilterSelected = false;
              const filterOptions = filter.options[0].values.map((val) => ({
                val,
                isValueSelected: false,
              }));
              filter.options = filterOptions;
            });
          });
        }
      });
      return this.fullFilters;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async postUserDataForSegmentCreation(data) {
    try {
      this.rootStore.uiStore.isLoading = true;
      const res = await API.post("/advertiser/adc_group/", data);
      return res;
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllArchivedSegments(entityType, entityId) {
    this.rootStore.uiStore.isLoading = true;

    try {
      const res = await API.get(
        `/advertiser/archive_segment?is_archived=True&${entityType}_id=${entityId}`
      );
      const totalPages = res.data.next
        ? Math.ceil(res.data.count / res.data.results.length)
        : 1;
      this.archivedSegments = { totalPages, ...res.data };
    } catch (error) {
      return error.response;
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }

  async getAllArchivedSegmentsPage(url) {
    this.rootStore.uiStore.isLoading = true;

    try {
      const res = await API.get(url);
      this.archivedSegments = { ...this.archivedSegments, ...res.data };
    } catch (error) {
      return error.response;
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
      const res = await API.put("/advertiser/archive_segment/", payload);
      if (res && res.status === 200 && res?.data?.updated_ids?.length) {
        this.archivedSegments = {
          ...this.archivedSegments,
          results: this.archivedSegments.results.filter(
            (seg) => !res.data.updated_ids.includes(seg.id)
          ),
        };
        return { status: true };
      } else {
        return { success: false, message: res?.data || res?.data?.message };
      }
    } catch (error) {
      return {
        success: false,
        message:
          typeof error.response?.data === "string"
            ? error.response?.data
            : error.response?.message,
      };
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
    let res;
    try {
      res = await API.put("/advertiser/archive_segment/", payload);
      if (res && res.status === 200 && res?.data?.updated_ids?.length) {
        this.segments = this.segments.filter(
          (seg) => !res.data.updated_ids.includes(seg.id)
        );
        return { status: true };
      } else {
        return { success: false, message: res?.data || res?.data?.message };
      }
    } catch (error) {
      return {
        success: false,
        message:
          typeof error.response?.data === "string"
            ? error.response?.data
            : error.response?.message,
      };
    } finally {
      this.rootStore.uiStore.isLoading = false;
    }
  }
}

export default SegmentStore;
