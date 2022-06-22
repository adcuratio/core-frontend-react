/* eslint-disable */
import React from "react";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";

import { MainContent, PageContent } from "../../../components/PageLayout";

import Loader from "../../../components/ReactLoader";

import SegmentFilterTabs from "../../../segments/components/segment-filter-tabs";
import CreateNewSegmentHeader from "../../../segments/components/create-new-segment-header";
import SegmentSummary from "../../../segments/components/segment-summary";
import QuickFilterContent from "../../../segments/components/quick-filter-content";
import CompleteFilterContent from "../../../segments/components/complete-filter-content";
import UploadFirstPartyData from "../../../segments/components/upload-first-party-data";
import ExperianFilterContent from "../../../segments/components/experian-filter-content/experianFilterContent";

//import withStore from "../../../hocs/WithStore";

import "../Segments.css";
import "../../../styles/unwantedGroup.css";

import {
  formatText,
  showAckMessage,
  showAckErrorMessage,
  hasProperty,
  validateName,
} from "../../../common/utils";
import CustomButton from "../../../components/CustomButton";

const segmentFilterTabData = [
  //tab selection quick, complete or first party
  // {
  //   id: 'quick_filters',
  //   name: 'Epsilon Quick Filters',
  //   tooltipText: 'Filters with immediate household count',
  //   value: 0,
  // },
  // {
  //   id: 'complete_filters',
  //   name: 'Adcuratio Complete Audience Filters',
  //   tooltipText: 'Takes 24 hours to calculate household count',
  //   value: 1,
  // },
  // {
  //   id: 'experian_filters',
  //   name: 'Experian Quick Filters',
  //   tooltipText: 'Takes 24 hours to calculate household count',
  //   value: 3,
  // },
  // {
  //   id: 'first_party',
  //   name: 'Adcuratio Experian Filters',
  //   tooltipText: 'Filters with Experian data',
  //   value: 2,
  // },
  {
    id: "audience_request",
    name: "Audience Request Form",
    value: 4,
  },
  {
    id: "live_ramp",
    name: "LiveRamp Request Form",
    value: 5,
  },
  {
    id: "first_party",
    name: "UCI First Party Form",
    value: 6,
  },
];

class SelectFilters extends React.Component {
  constructor(props) {
    super(props);
    //const liteFilters = toJS(props.univisionStore.liteFilters) || []; get all the filer for lite group
    //const completeFilters = toJS(props.univisionStore.fullFilters) || [];  get all the filters for the complete group
    this.state = {
      activeFilterTab: segmentFilterTabData[0],
      segmentName: "",
      segmentDescription: "",
      liteFilters: [],
      completeFilters: [],
      isPageLoading: true,
    };
    this._isMounted = false;
  }

  componentDidMount = () => {};

  onSegmentDataChange = (event, id) => {
    if (id === "name") {
      this.setState({ segmentName: event.target.value });
    }
    if (id === "description") {
      this.setState({ segmentDescription: event.target.value });
    }
    if (id === "liveRampCount") {
      this.setState({ liveRampCount: event.target.value });
    }
    if (id === "firstPartyCount") {
      this.setState({ firstPartyCount: event.target.value });
    }
  };

  componentDidMount = () => {
    this._isMounted = true;
    this._isMounted &&
      !this.state.liteFilters.length &&
      this.props.segmentStore.getAllLiteGroupCompanies().then((res) => {
        this.setState({ ...this.state, liteFilters: res });
      });
    this._isMounted &&
      !this.state.completeFilters.length &&
      this.props.segmentStore.getAllTspFullGroupCompanies().then((res) => {
        this.setState({
          ...this.state,
          completeFilters: res,
          isPageLoading: false,
        });
      });
    this._isMounted &&
      !this.state.experianFilters &&
      this.props.segmentStore.getAllExperianFilters().then((res) => {
        this.setState({ ...this.state, experianFilters: res });
      });
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  onFilterTabChange = (activeFilterTab) => {
    this.setState({
      activeFilterTab,
    });
  };

  handleSelectAllOrNoneFunc = (id, title, type) => {
    // to select all the filters or deselect all the avaible filters under a category.
    // under title , the whole object of selected category comes. under type none or all comes for respective action.
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === "quick_filters") {
      const { liteFilters } = this.state;
      const index = liteFilters.indexOf(title);
      if (type === "none") {
        liteFilters[index].template.filters.map(
          (obj) => (obj.isTabSelected = false)
        );
      } else if (type === "all") {
        liteFilters[index].template.filters.map(
          (obj) => (obj.isTabSelected = true)
        );
      }
      this.setState({ liteFilters });
    } else if (activeFilterTab.id === "complete_filters") {
      if (id === "credit") {
        const { completeFilters } = this.state;

        const indexOfCredit = completeFilters.findIndex(
          (fil) => fil.name === "Credit"
        );
        const indexOfFilter =
          completeFilters[indexOfCredit].template.sub_cat.indexOf(title);
        if (type === "all") {
          completeFilters[indexOfCredit].template.sub_cat[
            indexOfFilter
          ].filters.map((fillie) => (fillie.isFilterSelected = true));
        } else if (type === "none") {
          completeFilters[indexOfCredit].template.sub_cat[
            indexOfFilter
          ].filters.map((fillie) => (fillie.isFilterSelected = false));
        }
        this.setState({ completeFilters });
      } else {
        const { completeFilters } = this.state;
        const index = completeFilters.indexOf(title);
        if (type === "none") {
          completeFilters[index].template.filters.map(
            (obj) => (obj.isTabSelected = false)
          );
        } else if (type === "all") {
          completeFilters[index].template.filters.forEach((obj) => {
            if (obj.title === "Number of Vehicles") {
              obj.isTabSelected = false;
            } else {
              obj.isTabSelected = true;
            }
          });
        }
        this.setState({ completeFilters });
      }
    }
  };

  handleAddRemoveFunc = (activeData, id) => {
    // to select or remove a particular category from available categories. eg, demogarphics, automotive etc
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === "quick_filters") {
      const { liteFilters } = this.state;

      if (liteFilters && liteFilters.length) {
        const indexVal = liteFilters.indexOf(activeData);

        liteFilters.forEach((data, dataIndex) => {
          if (indexVal === dataIndex) {
            data.isSelected = !data.isSelected;
            data.template.filters.forEach((templateFilter) => {
              templateFilter.isTabSelected = false;
            });
            data.isTabSelectedToShow = false;
          }
        });
        let flag = false;
        liteFilters.forEach((data) => {
          if (data.isSelected && data.isTabSelectedToShow) {
            flag = true;
          }
        });
        if (liteFilters.find((data) => data.isSelected) && !flag) {
          const activeLiteIndex = liteFilters.indexOf(
            liteFilters.find((data) => data.isSelected)
          );
          liteFilters[activeLiteIndex].isTabSelectedToShow = true;
          liteFilters.forEach((lite) => {
            if (liteFilters.indexOf(lite) !== activeLiteIndex) {
              lite.isTabSelectedToShow = false;
            }
          });
        }
      }
      this.setState({ liteFilters });
    } else if (activeFilterTab.id === "complete_filters") {
      if (id === "credit") {
        const { completeFilters } = this.state;
        const indexOfCredit = completeFilters.findIndex(
          (obj) => obj.name === "Credit"
        );
        const index =
          completeFilters[indexOfCredit].template.sub_cat.indexOf(activeData);
        const headingSelectedValue =
          completeFilters[indexOfCredit].template.sub_cat[index]
            .isHeadingSelected;
        completeFilters[indexOfCredit].template.sub_cat[
          index
        ].isHeadingSelected = !headingSelectedValue;

        this.setState({
          completeFilters,
        });
      } else {
        const { completeFilters } = this.state;

        if (completeFilters && completeFilters.length) {
          const indexVal = completeFilters.indexOf(activeData);

          completeFilters.forEach((data, dataIndex) => {
            if (indexVal === dataIndex) {
              data.isSelected = !data.isSelected;
              data.template.filters.forEach((templateFilter) => {
                templateFilter.isTabSelected = false;
              });
              data.isTabSelectedToShow = false;
            }
          });
          let flag = false;
          completeFilters.forEach((data) => {
            if (data.isSelected && data.isTabSelectedToShow) {
              flag = true;
            }
          });
          if (completeFilters.find((data) => data.isSelected) && !flag) {
            const activeLiteIndex = completeFilters.indexOf(
              completeFilters.find((data) => data.isSelected)
            );
            completeFilters[activeLiteIndex].isSelected = true;
            completeFilters[activeLiteIndex].isTabSelectedToShow = true;
            completeFilters.forEach((lite) => {
              if (completeFilters.indexOf(lite) !== activeLiteIndex) {
                lite.isTabSelectedToShow = false;
              }
            });
          }
        }

        this.setState({ completeFilters });
      }
    }
  };

  handleUserInputFuncForExperian = ({
    selectedValue,
    title,
    filtersForExperian,
    activeSubCategoryData,
    type,
  }) => {
    const { experianFilters } = this.state;
    if (type === "experian_quick") {
      const indexOfCat = experianFilters.indexOf(filtersForExperian);
      const indexOfFilter =
        experianFilters[indexOfCat].template.filters.indexOf(title);
      if (
        experianFilters[indexOfCat].template.filters[indexOfFilter]
          .field_type === "multi-select-dropdown"
      ) {
        if (title.filter_name === "zip_code") {
          if (
            experianFilters[indexOfCat].template.filters[
              indexOfFilter
            ].value.includes(selectedValue)
          ) {
            const newArr = experianFilters[indexOfCat].template.filters[
              indexOfFilter
            ].value.filter((item) => item !== selectedValue);
            delete experianFilters[indexOfCat].template.filters[indexOfFilter]
              .value;
            experianFilters[indexOfCat].template.filters[indexOfFilter].value =
              newArr;
          } else {
            if (
              experianFilters[indexOfCat].template.filters[indexOfFilter]
                .value === ""
            ) {
              const arr = [selectedValue];
              experianFilters[indexOfCat].template.filters[
                indexOfFilter
              ].value = arr;
            } else {
              experianFilters[indexOfCat].template.filters[
                indexOfFilter
              ].value.push(selectedValue);
            }
          }
        } else {
          if (
            experianFilters[indexOfCat].template.filters[indexOfFilter]
              .value === ""
          ) {
            const arr = [selectedValue];
            experianFilters[indexOfCat].template.filters[indexOfFilter].value =
              arr;
          } else {
            delete experianFilters[indexOfCat].template.filters[indexOfFilter]
              .value;
            experianFilters[indexOfCat].template.filters[indexOfFilter].value =
              selectedValue;
          }
        }
      } else if (
        experianFilters[indexOfCat].template.filters[indexOfFilter]
          .filter_name === "mosaic_global_household"
      ) {
        const valString = [];
        experianFilters[indexOfCat].template.filters[
          indexOfFilter
        ].options.forEach((item) => {
          if (item.val === selectedValue.val) {
            item.isValueSelected = !item.isValueSelected;
          }
          if (item.isValueSelected) {
            valString.push(item.val);
          }
        });
        experianFilters[indexOfCat].template.filters[indexOfFilter].value =
          valString;
      } else {
        experianFilters[indexOfCat].template.filters[indexOfFilter].value =
          selectedValue;
        if (
          hasProperty(
            experianFilters[indexOfCat].template.filters[indexOfFilter],
            "isValue"
          )
        ) {
          experianFilters[indexOfCat].template.filters[indexOfFilter].isValue =
            !experianFilters[indexOfCat].template.filters[indexOfFilter]
              .isValue;
          experianFilters[indexOfCat].template.filters[indexOfFilter].isValue
            ? (experianFilters[indexOfCat].template.filters[
                indexOfFilter
              ].value = selectedValue)
            : (experianFilters[indexOfCat].template.filters[
                indexOfFilter
              ].value = "");
        }
      }
    } else if (type === "experian_non_auto") {
      const indexOfCat = experianFilters.indexOf(activeSubCategoryData);
      const indexOfSubCat =
        experianFilters[indexOfCat].template.sub_cat.indexOf(
          filtersForExperian
        );
      const indexOfFilter =
        experianFilters[indexOfCat].template.sub_cat[
          indexOfSubCat
        ].filters.indexOf(title);

      experianFilters[indexOfCat].template.sub_cat[indexOfSubCat].filters[
        indexOfFilter
      ].value = selectedValue;
      if (hasProperty(title, "isValue")) {
        experianFilters[indexOfCat].template.sub_cat[indexOfSubCat].filters[
          indexOfFilter
        ].isValue =
          !experianFilters[indexOfCat].template.sub_cat[indexOfSubCat].filters[
            indexOfFilter
          ].isValue;
        experianFilters[indexOfCat].template.sub_cat[indexOfSubCat].filters[
          indexOfFilter
        ].isValue
          ? (experianFilters[indexOfCat].template.sub_cat[
              indexOfSubCat
            ].filters[indexOfFilter].value = selectedValue)
          : (experianFilters[indexOfCat].template.sub_cat[
              indexOfSubCat
            ].filters[indexOfFilter].value = "");
      }
      if (title.title === "Age") {
        experianFilters[indexOfCat].template.sub_cat[indexOfSubCat].filters[
          indexOfFilter
        ].summary = `${selectedValue[0]} to ${selectedValue[1]}`;
      }
    } else if (type === "experian_auto") {
      const AutoData = experianFilters.filter((exp) => exp.name === "Auto");
      const indexOfAuto = experianFilters.indexOf(AutoData[0]);
      const indexOfCat = experianFilters[indexOfAuto].template.sub_cat.indexOf(
        activeSubCategoryData
      );
      const indexOfSubSubCategory =
        experianFilters[indexOfAuto].template.sub_cat[
          indexOfCat
        ].sub_cat.indexOf(filtersForExperian);
      const indexOfFilter =
        experianFilters[indexOfAuto].template.sub_cat[indexOfCat].sub_cat[
          indexOfSubSubCategory
        ].filters.indexOf(title);
      experianFilters[indexOfAuto].template.sub_cat[indexOfCat].sub_cat[
        indexOfSubSubCategory
      ].filters[indexOfFilter].value = selectedValue;
    }
    this.setState({ ...this.state, experianFilters });
  };

  handleUserInputFunc = (values, id) => {
    // to handle the user input for value selection from available filters
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === "quick_filters") {
      const temp = this.state.liteFilters;
      const index = temp.indexOf(values[0]);
      if (
        (values[1].field_type === "checkbox" &&
          values[1].title === "Annual Income") ||
        (values[1].field_type === "dropdown" &&
          values[1].title === "Estimated Net worth")
      ) {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === "1") {
          const clone = JSON.parse(
            JSON.stringify(
              temp[index].template.filters[filterIndex].optionsArray[
                temp[index].template.filters[filterIndex].optionsArray.length -
                  1
              ]
            )
          );
          clone.index =
            parseInt(
              temp[index].template.filters[filterIndex].optionsArray[
                temp[index].template.filters[filterIndex].optionsArray.length -
                  1
              ]["index"]
            ) + 1;
          clone.index = `${clone.index}`;
          temp[index].template.filters[filterIndex].optionsArray.push(clone);
        } else if (values[2] === "0") {
          let flag = 0;
          if (
            temp[index].template.filters[filterIndex].optionsArray.length === 1
          ) {
            const message = "One filter should at least be there!";
            showAckErrorMessage({ message });
            flag = 1;
          }
          if (flag === 1) {
            return;
          } else {
            temp[index].template.filters[filterIndex].optionsArray.pop();
          }
        } else {
          temp[index].template.filters[filterIndex].optionsArray[
            values[2][1] - 1
          ].value = values[2][0];
        }
      } else if (
        values[1].field_type === "checkbox" &&
        values[1].title !== "Annual Income"
      ) {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (
          temp[index].template.filters[filterIndex].value.indexOf(values[2]) !==
          -1
        ) {
          const arr = temp[index].template.filters[filterIndex].value.filter(
            (val) => values[2] !== val
          );
          temp[index].template.filters[filterIndex].value = arr;
        } else {
          temp[index].template.filters[filterIndex].value.push(values[2]);
        }
      } else if (
        values[1].field_type === "combo" &&
        values[1].filter_name !== "Children Age"
      ) {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === "Yes" || values[2] === "No" || values[2] === "") {
          temp[index].template.filters[
            filterIndex
          ].handler_field_present.value = values[2];
        } else if (typeof values[2] === "string") {
          const num = parseInt(values[2]);
          if (values[2] === "Any") {
            temp[index].template.filters[filterIndex].value = values[2];
          } else {
            const arrayForCombo = [];
            for (let i = 1; i <= num; i++) {
              const copyArray = temp[index].template.filters[
                filterIndex
              ].key_value_map.map((a) => ({
                ...a,
              }));
              const combos = [];
              for (let j = 0; j < copyArray.length; j++) {
                const t = copyArray[j];
                t.filter_name = `${t.filter_name} ${i}`;
                t.title = `${t.title} ${i}`;
                combos.push(t);
              }
              arrayForCombo.push(combos);
            }
            temp[index].template.filters[filterIndex].comboFilters =
              arrayForCombo;
            temp[index].template.filters[filterIndex].value = values[2];
          }
        } else {
          if (temp[index].template.filters[filterIndex].value === "Any") {
            temp[index].template.filters[filterIndex].handler_field_any.forEach(
              (fill) => {
                if (fill.filter_name === values[2][0]) {
                  fill.value = values[2][1];
                }
              }
            );
          } else {
            temp[index].template.filters[filterIndex].comboFilters.forEach(
              (combo) => {
                const indexofCombo =
                  temp[index].template.filters[
                    filterIndex
                  ].comboFilters.indexOf(combo);
                combo.forEach((comboFil) => {
                  if (
                    comboFil.filter_name.slice(0, -2) === "vehicle_make" &&
                    comboFil.filter_name === values[2][0]
                  ) {
                    const model = [];
                    this.props.segmentStore
                      .getCorrespondingModelYear(values[2][1])
                      .then((data) => {
                        if (data && data.model_year?.length !== 0) {
                          data.model_year.forEach((modelArr) =>
                            model.push(modelArr.model)
                          );
                          const modalYear = [{ values: model }];
                          const modelNew = {
                            ...temp[index].template.filters[filterIndex]
                              .comboFilters[indexofCombo][1],
                          };
                          delete temp[index].template.filters[filterIndex]
                            .comboFilters[indexofCombo][1];
                          temp[index].template.filters[
                            filterIndex
                          ].comboFilters[indexofCombo][1] = {
                            ...modelNew,
                            options: modalYear,
                            value: "",
                            model_year_data: data,
                          };
                          temp[index].template.filters[
                            filterIndex
                          ].comboFilters[indexofCombo][2].value = "";
                        } else {
                          temp[index].template.filters[
                            filterIndex
                          ].comboFilters[indexofCombo][1] = {
                            ...temp[index].template.filters[filterIndex]
                              .comboFilters[indexofCombo][1],
                            options: [{ values: [] }],
                            value: "",
                          };
                        }
                        this.setState({ ...this.state, liteFilters: temp });
                      });
                  } else if (
                    comboFil.filter_name.slice(0, -2) === "vehicle_model" &&
                    comboFil.filter_name === values[2][0]
                  ) {
                    temp[index].template.filters[filterIndex].comboFilters[
                      indexofCombo
                    ][1].model_year_data.model_year.forEach((model) => {
                      if (model.model === values[2][1]) {
                        const modalYear = [{ values: model.years }];
                        const yearNew = {
                          ...temp[index].template.filters[filterIndex]
                            .comboFilters[indexofCombo][2],
                        };
                        delete temp[index].template.filters[filterIndex]
                          .comboFilters[indexofCombo][2];
                        temp[index].template.filters[filterIndex].comboFilters[
                          indexofCombo
                        ][2] = {
                          ...yearNew,
                          options: modalYear,
                          value: "",
                        };
                      }
                    });
                  }
                  if (comboFil.filter_name === values[2][0]) {
                    comboFil.value = values[2][1];
                  }
                });
              }
            );
          }
        }
      } else if (
        values[1].field_type === "combo" &&
        values[1].filter_name === "Children Age"
      ) {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === "Yes" || values[2] === "No" || values[2] === "") {
          temp[index].template.filters[filterIndex].handler_field.value =
            values[2];
        } else if (values[2] === "Any") {
          temp[index].template.filters[filterIndex].value = values[2];
        } else if (Number.isInteger(parseInt(values[2]))) {
          const num = parseInt(values[2]);
          const arrayForCombo = [];
          for (let i = 1; i <= num; i++) {
            const copyArray = temp[index].template.filters[
              filterIndex
            ].key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.map(
              (a) => ({
                ...a,
              })
            );
            const combos = [];
            for (let j = 0; j < copyArray.length; j++) {
              const t = copyArray[j];
              t.title = `${t.title} ${i}`;
              combos.push(t);
            }
            arrayForCombo.push(combos);
          }
          temp[index].template.filters[filterIndex].comboFilters =
            arrayForCombo;
          temp[index].template.filters[filterIndex].value = values[2];
        } else {
          if (temp[index].template.filters[filterIndex].value === "Any") {
            temp[index].template.filters[filterIndex].key_value_map_any.value =
              values[2][1];
          } else {
            temp[index].template.filters[filterIndex].comboFilters.forEach(
              (fil) => {
                fil.forEach((fill) => {
                  if (fill.title === values[2][0]) {
                    fill.value = values[2][1];
                  }
                });
              }
            );
          }
        }
      } else if (values[1].title === "Individual Age") {
        if (values[2][0] === "min") {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          temp[index].template.filters[filterIndex].min = values[2][1];
        } else if (values[2][0] === "max") {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          temp[index].template.filters[filterIndex].max = values[2][1];
        }
      } else if (values[1].title !== "Estimated Net worth") {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        temp[index].template.filters[filterIndex].value = values[2];
      }

      this.setState({ ...this.setState, liteFilters: temp });
    } else if (activeFilterTab.id === "complete_filters") {
      if (id === "credit") {
        const temp = this.state.completeFilters;
        const creditCard = temp.filter((obj) => obj.name === "Credit");

        const indexOfCredit = temp.indexOf(creditCard[0]);
        const index = temp[indexOfCredit].template.sub_cat.indexOf(values[0]);
        const filterIndex = temp[indexOfCredit].template.sub_cat[
          index
        ].filters.indexOf(values[1]);
        const optionIndex = temp[indexOfCredit].template.sub_cat[index].filters[
          filterIndex
        ].options.indexOf(values[2]);
        temp[indexOfCredit].template.sub_cat[index].filters[
          filterIndex
        ].options[optionIndex].isValueSelected =
          !temp[indexOfCredit].template.sub_cat[index].filters[filterIndex]
            .options[optionIndex].isValueSelected;

        this.setState({ ...this.state, completeFilters: temp });
      } else {
        const temp = this.state.completeFilters;
        const index = temp.indexOf(values[0]);
        if (
          (values[1].field_type === "checkbox" &&
            values[1].title === "Annual Income") ||
          (values[1].field_type === "dropdown" &&
            values[1].title === "Estimated Net worth")
        ) {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === "1") {
            const clone = JSON.parse(
              JSON.stringify(
                temp[index].template.filters[filterIndex].optionsArray[
                  temp[index].template.filters[filterIndex].optionsArray
                    .length - 1
                ]
              )
            );
            clone.index =
              parseInt(
                temp[index].template.filters[filterIndex].optionsArray[
                  temp[index].template.filters[filterIndex].optionsArray
                    .length - 1
                ]["index"]
              ) + 1;
            clone.index = `${clone.index}`;
            temp[index].template.filters[filterIndex].optionsArray.push(clone);
          } else if (values[2] === "0") {
            let flag = 0;
            if (
              temp[index].template.filters[filterIndex].optionsArray.length ===
              1
            ) {
              const message = "One filter should at least be there!";
              showAckErrorMessage({ message });
              flag = 1;
            }
            if (flag === 1) {
              return;
            } else {
              temp[index].template.filters[filterIndex].optionsArray.pop();
            }
          } else {
            temp[index].template.filters[filterIndex].optionsArray[
              values[2][1] - 1
            ].value = values[2][0];
          }
        } else if (
          values[1].field_type === "combo" &&
          values[1].filter_name === "Children Age"
        ) {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === "Yes" || values[2] === "No" || values[2] === "") {
            temp[index].template.filters[filterIndex].handler_field.value =
              values[2];
          } else if (values[2] === "Any") {
            temp[index].template.filters[filterIndex].value = values[2];
          } else if (Number.isInteger(parseInt(values[2]))) {
            const num = parseInt(values[2]);
            const arrayForCombo = [];
            for (let i = 1; i <= num; i++) {
              const copyArray = temp[index].template.filters[
                filterIndex
              ].key_value_map_if_children_present[0].details_of_children_according_to_value_of_number_of_children.details_filter.map(
                (a) => ({
                  ...a,
                })
              );
              const combos = [];
              for (let j = 0; j < copyArray.length; j++) {
                const t = copyArray[j];
                t.title = `${t.title} ${i}`;
                combos.push(t);
              }
              arrayForCombo.push(combos);
            }
            temp[index].template.filters[filterIndex].comboFilters =
              arrayForCombo;
            temp[index].template.filters[filterIndex].value = values[2];
          } else {
            if (temp[index].template.filters[filterIndex].value === "Any") {
              temp[index].template.filters[
                filterIndex
              ].key_value_map_any.value = values[2][1];
            } else {
              temp[index].template.filters[filterIndex].comboFilters.forEach(
                (fil) => {
                  fil.forEach((fill) => {
                    if (fill.title === values[2][0]) {
                      fill.value = values[2][1];
                    }
                  });
                }
              );
            }
          }
        } else if (values[1].field_type === "checkbox") {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (
            temp[index].template.filters[filterIndex].value.indexOf(
              values[2]
            ) !== -1
          ) {
            const arr = temp[index].template.filters[filterIndex].value.filter(
              (val) => values[2] !== val
            );
            temp[index].template.filters[filterIndex].value = arr;
          } else {
            temp[index].template.filters[filterIndex].value.push(values[2]);
          }
        } else if (values[1].title === "Individual Age") {
          if (values[2][0] === "min") {
            const filterIndex = temp[index].template.filters.indexOf(values[1]);
            temp[index].template.filters[filterIndex].min = values[2][1];
          } else if (values[2][0] === "max") {
            const filterIndex = temp[index].template.filters.indexOf(values[1]);
            temp[index].template.filters[filterIndex].max = values[2][1];
          }
        } else if (
          values[1].field_type === "combo" &&
          values[1].filter_name !== "Children Age"
        ) {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === "Yes" || values[2] === "No" || values[2] === "") {
            temp[index].template.filters[
              filterIndex
            ].handler_field_present.value = values[2];
          } else if (typeof values[2] === "string") {
            const num = parseInt(values[2]);
            if (values[2] === "Any") {
              temp[index].template.filters[filterIndex].value = values[2];
            } else {
              const arrayForCombo = [];
              for (let i = 1; i <= num; i++) {
                const copyArray = temp[index].template.filters[
                  filterIndex
                ].key_value_map.map((a) => ({
                  ...a,
                }));
                const combos = [];
                for (let j = 0; j < copyArray.length; j++) {
                  const t = copyArray[j];
                  t.filter_name = `${t.filter_name} ${i}`;
                  t.title = `${t.title} ${i}`;
                  combos.push(t);
                }
                arrayForCombo.push(combos);
              }
              temp[index].template.filters[filterIndex].comboFilters =
                arrayForCombo;
              temp[index].template.filters[filterIndex].value = values[2];
            }
          } else {
            if (temp[index].template.filters[filterIndex].value === "Any") {
              temp[index].template.filters[
                filterIndex
              ].handler_field_any.forEach((fill) => {
                if (fill.filter_name === values[2][0]) {
                  fill.value = values[2][1];
                }
              });
            } else {
              temp[index].template.filters[filterIndex].comboFilters.forEach(
                (fil) => {
                  fil.forEach((fill) => {
                    if (
                      fill.filter_name.slice(0, -2) === "vehicle_make" &&
                      fill.filter_name === values[2][0]
                    ) {
                      const model = [];
                      this.props.segmentStore
                        .getCorrespondingModelYear(values[2][1])
                        .then((data) => {
                          data.model_year.forEach((modelArr) => {
                            model.push(modelArr.model);
                          });
                          fil[1].options[0].values = model;
                          this.setState({
                            ...this.state,
                            completeFilters: temp,
                          });
                        });
                    } else if (
                      fill.filter_name.slice(0, -2) === "vehicle_model" &&
                      fill.filter_name === values[2][0]
                    ) {
                      this.props.univisionStore.modelYearForVehicleMake.model_year.forEach(
                        (model) => {
                          if (model.model === values[2][1]) {
                            fil[2].options[0].values = model.years;
                          }
                        }
                      );
                    }
                    if (fill.filter_name === values[2][0]) {
                      fill.value = values[2][1];
                    }
                  });
                }
              );
            }
          }
        } else {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          temp[index].template.filters[filterIndex].value = values[2];
        }
        this.setState({ ...this.setState, completeFilters: temp });
      }
    }
  };

  handleTitleTabChange = (title) => {
    //to change the category selection. highlighted by a yellow underline
    const objs = this.state.liteFilters;
    const index = this.state.liteFilters.indexOf(title);
    objs.forEach((obj) => {
      if (objs.indexOf(obj) === index) {
        obj.isTabSelectedToShow = true;
      } else {
        obj.isTabSelectedToShow = false;
      }
    });
    this.setState({ ...this.state, liteFilters: objs });
  };

  handleTitleTabChangeForComplete = (title) => {
    // to change the category for catory selection for completed filters. highlighted by yellow underline
    const objs = this.state.completeFilters;
    const index = this.state.completeFilters.indexOf(title);
    objs.forEach((obj) => {
      if (objs.indexOf(obj) === index) {
        obj.isTabSelectedToShow = true;
      } else {
        obj.isTabSelectedToShow = false;
      }
    });
    this.setState({ ...this.state, completeFilters: objs });
  };

  handleTitleTabChangeForCredit = (credit) => {
    // to change the category slection for credit filters.
    const temp = this.state.completeFilters;
    const creditCard = this.state.completeFilters.filter(
      (obj) => obj.name === "Credit"
    );

    const indexOfCredit = temp.indexOf(creditCard[0]);
    const index =
      this.state.completeFilters[indexOfCredit].template.sub_cat.indexOf(
        credit
      );
    temp[indexOfCredit].template.sub_cat.forEach((filter) => {
      if (temp[indexOfCredit].template.sub_cat.indexOf(filter) === index) {
        filter.isCreditTabSelected = true;
      } else {
        filter.isCreditTabSelected = false;
      }
    });
    this.setState({ ...this.state, completeFilters: temp });
  };

  handleTitleTabChangeForExperian = (experian) => {
    const experianCpy = this.state.experianFilters;
    const index = this.state.experianFilters.indexOf(experian);
    experianCpy.forEach((obj) => {
      if (experianCpy.indexOf(obj) === index) {
        obj.isTabSelectedToShow = true;
      } else {
        obj.isTabSelectedToShow = false;
      }
    });
    this.setState({ ...this.state, experianFilters: experianCpy });
  };

  handleSubCategoryTitleTabChange = (parentData, parentName, selectedData) => {
    const experianCpy = [...this.state.experianFilters];
    if (parentName !== "auto_sub") {
      const indexOfParent = experianCpy.indexOf(parentData);
      const indexOfChild = parentData.template.sub_cat.indexOf(selectedData);
      experianCpy[indexOfParent].template.sub_cat.forEach((sub) => {
        if (
          experianCpy[indexOfParent].template.sub_cat.indexOf(sub) ===
          indexOfChild
        ) {
          sub[`is${parentData.name}TabSelected`] = true;
        } else {
          sub[`is${parentData.name}TabSelected`] = false;
        }
      });
    } else {
      const autoFilter = experianCpy.filter((exp) => exp.name === "Auto");
      const indexOfAuto = experianCpy.indexOf(autoFilter[0]);
      const indexOfSubCategory =
        autoFilter[0].template.sub_cat.indexOf(parentData);
      const indexOfSubSubCategory =
        autoFilter[0].template.sub_cat[indexOfSubCategory].sub_cat.indexOf(
          selectedData
        );
      experianCpy[indexOfAuto].template.sub_cat[
        indexOfSubCategory
      ].sub_cat.forEach((sub) => {
        if (
          experianCpy[indexOfAuto].template.sub_cat[
            indexOfSubCategory
          ].sub_cat.indexOf(sub) === indexOfSubSubCategory
        ) {
          sub.isAutoSubCategorySelected = true;
        } else {
          sub.isAutoSubCategorySelected = false;
        }
      });
    }
    this.setState({ ...this.state, experianFilters: experianCpy });
  };

  handleAddRemoveCategoryForExperianFunc = (data) => {
    const { experianFilters } = this.state;
    const indexVal = experianFilters.indexOf(data);
    experianFilters.forEach((exp, dataIndex) => {
      if (dataIndex === indexVal) {
        exp.isSelected = !exp.isSelected;
        exp.isTabSelectedToShow = false;
      }
    });
    let flag = false;
    experianFilters.forEach((data) => {
      if (data.isSelected && data.isTabSelectedToShow) {
        flag = true;
      }
    });
    if (experianFilters.find((data) => data.isSelected) && !flag) {
      const activeLiteIndex = experianFilters.indexOf(
        experianFilters.find((data) => data.isSelected)
      );
      experianFilters[activeLiteIndex].isTabSelectedToShow = true;
      experianFilters.forEach((lite) => {
        if (experianFilters.indexOf(lite) !== activeLiteIndex) {
          lite.isTabSelectedToShow = false;
        }
      });
    }
    this.setState({ ...this.state, experianFilters });
  };

  handleSelectAllOrNoneForExperianFunc = (type, nora) => {
    const { experianFilters } = this.state;
    if (nora === "all" && type === "exp") {
      experianFilters.forEach((exp) => {
        exp.isSelected = true;
      });
    } else if (nora === "none" && type === "exp") {
      experianFilters.forEach((exp) => {
        exp.isSelected = false;
      });
    }
    this.setState({ ...this.state, experianFilters });
  };

  handleTabChangeFunctionsForExperian = (
    title,
    activeData,
    id = "",
    activeSubCategoryData
  ) => {
    const { experianFilters } = this.state;
    if (id === "experian_non_auto") {
      const subCategoryIndex = experianFilters.indexOf(activeSubCategoryData);
      const indexOfSubCat =
        experianFilters[subCategoryIndex].template.sub_cat.indexOf(title);
      const indexOfFilter =
        experianFilters[subCategoryIndex].template.sub_cat[
          indexOfSubCat
        ].filters.indexOf(activeData);

      experianFilters[subCategoryIndex].template.sub_cat[indexOfSubCat].filters[
        indexOfFilter
      ].isFilterSelected =
        !experianFilters[subCategoryIndex].template.sub_cat[indexOfSubCat]
          .filters[indexOfFilter].isFilterSelected;
    } else if (id === "experian_quick") {
      const indexOfCat = experianFilters.indexOf(title);
      const indexOfFilter =
        experianFilters[indexOfCat].template.filters.indexOf(activeData);
      experianFilters[indexOfCat].template.filters[
        indexOfFilter
      ].isFilterSelected =
        !experianFilters[indexOfCat].template.filters[indexOfFilter]
          .isFilterSelected;
    }
    this.setState({ ...this.state, experianFilters });
  };

  handleAutoTabFilters = ({
    activeSubCategoryData,
    filtersForExperian,
    data,
  }) => {
    const { experianFilters } = this.state;

    const autoFilter = experianFilters.filter((exp) => exp.name === "Auto");
    const indexOfAuto = experianFilters.indexOf(autoFilter[0]);

    const indexOfAutoSubCategory = experianFilters[
      indexOfAuto
    ].template.sub_cat.indexOf(activeSubCategoryData);
    const indexOfSubSubCategory =
      experianFilters[indexOfAuto].template.sub_cat[
        indexOfAutoSubCategory
      ].sub_cat.indexOf(filtersForExperian);
    experianFilters[indexOfAuto].template.sub_cat[
      indexOfAutoSubCategory
    ].sub_cat[indexOfSubSubCategory].filters.forEach((fil) => {
      if (fil.filter_name === data.filter_name) {
        fil.isFilterSelected = !fil.isFilterSelected;
      }
    });
    this.setState({ ...this.state, experianFilters });
  };

  handleSelectAllOrNoneFiltersForExperian = (id, title, type, subCatData) => {
    const { experianFilters } = this.state;
    if (id === "experian_non_auto") {
      const indexOfCategory = experianFilters.indexOf(subCatData);
      const indexOfSubCat =
        experianFilters[indexOfCategory].template.sub_cat.indexOf(title);
      if (type === "all") {
        experianFilters[indexOfCategory].template.sub_cat[
          indexOfSubCat
        ].filters.forEach((fill) => {
          fill.isFilterSelected = true;
        });
      } else {
        experianFilters[indexOfCategory].template.sub_cat[
          indexOfSubCat
        ].filters.forEach((fill) => {
          fill.isFilterSelected = false;
        });
      }
    } else if (id === "experian_quick") {
      const indexOfCat = experianFilters.indexOf(title);
      type === "all"
        ? experianFilters[indexOfCat].template.filters.forEach(
            (fil) => (fil.isFilterSelected = true)
          )
        : experianFilters[indexOfCat].template.filters.forEach(
            (fil) => (fil.isFilterSelected = false)
          );
    } else if (id === "experian_auto") {
      const autoData = experianFilters.filter((exp) => exp.name === "Auto");
      const indexOfAuto = experianFilters.indexOf(autoData[0]);
      const indexOfCat =
        experianFilters[indexOfAuto].template.sub_cat.indexOf(subCatData);
      const indexOfSubSubCategory =
        experianFilters[indexOfAuto].template.sub_cat[
          indexOfCat
        ].sub_cat.indexOf(title);
      type === "all"
        ? experianFilters[indexOfAuto].template.sub_cat[indexOfCat].sub_cat[
            indexOfSubSubCategory
          ].filters.forEach((fil) => (fil.isFilterSelected = true))
        : experianFilters[indexOfAuto].template.sub_cat[indexOfCat].sub_cat[
            indexOfSubSubCategory
          ].filters.forEach((fil) => (fil.isFilterSelected = false));
    }

    this.setState({ ...this.state, experianFilters });
  };

  handleTabChangeFunc = (title, activeData, id = "") => {
    // to add or remove a particular filter,glyphicon icon available on top can be used
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === "quick_filters") {
      const temp1 = this.state.liteFilters;
      const index1 = temp1.indexOf(title);
      const index = temp1[index1].template.filters.indexOf(activeData);
      temp1[index1].template.filters[index].isTabSelected =
        !temp1[index1].template.filters[index].isTabSelected;
      this.setState({ ...this.state, liteFilters: temp1 });
    } else if (activeFilterTab.id === "complete_filters") {
      if (id === "credit") {
        const temp = this.state.completeFilters;
        const creditCard = this.state.completeFilters.filter(
          (obj) => obj.name === "Credit"
        );
        const indexOfCredit = temp.indexOf(creditCard[0]);
        const index = temp[indexOfCredit].template.sub_cat.indexOf(title);
        const filterIndex =
          temp[indexOfCredit].template.sub_cat[index].filters.indexOf(
            activeData
          );
        temp[indexOfCredit].template.sub_cat[index].filters[
          filterIndex
        ].isFilterSelected =
          !temp[indexOfCredit].template.sub_cat[index].filters[filterIndex]
            .isFilterSelected;
        this.setState({ ...this.state, completeFilters: temp });
      } else {
        const temp1 = this.state.completeFilters;
        const index1 = temp1.indexOf(title);
        const index = temp1[index1].template.filters.indexOf(activeData);
        temp1[index1].template.filters[index].isTabSelected =
          !temp1[index1].template.filters[index].isTabSelected;
        this.setState({ ...this.state, completeFilters: temp1 });
      }
    }
  };

  handleSelectAllForCategories = (type, nora) => {
    // to select all the categores or removies all, available in category modal
    if (type === "lite") {
      const temp = this.state.liteFilters;
      if (nora === "all") {
        temp.forEach((fil) => {
          fil.isSelected = true;
        });
      } else if (nora === "none") {
        temp.forEach((fil) => {
          fil.template.filters.forEach((filter) => {
            filter.isTabSelected = false;
          });
          fil.isSelected = false;
        });
      }
      this.setState({ ...this.state, liteFilters: temp });
    } else if (type === "comp") {
      const temp = this.state.completeFilters;
      if (nora === "all") {
        temp.forEach((fil) => {
          fil.isSelected = true;
        });
      } else if (nora === "none") {
        temp.forEach((fil) => {
          fil.template.filters.forEach((filter) => {
            filter.isTabSelected = false;
          });
          fil.isSelected = false;
        });
      }
      this.setState({ ...this.state, completeFilters: temp });
    } else if (type === "credit") {
      const { completeFilters } = this.state;
      const index = completeFilters.findIndex((fil) => fil.name === "Credit");
      if (nora === "all") {
        completeFilters[index].template.sub_cat.map(
          (fil) => (fil.isHeadingSelected = true)
        );
      } else if (nora === "none") {
        completeFilters[index].template.sub_cat.map(
          (fil) => (fil.isHeadingSelected = false)
        );
      }
      this.setState({ completeFilters });
    }
  };

  saveAPIcall = (temp = null) => {
    // to ping api for segment creation
    let payload;
    let segmentType;
    const { activeFilterTab } = this.state;
    if (activeFilterTab.value === 0) {
      segmentType = "tsp_lite";
    } else if (activeFilterTab.value === 1) {
      segmentType = "tsp_full";
    } else if (activeFilterTab.value === 3) {
      segmentType = "experian_standard";
    }
    if (
      activeFilterTab.value === 0 ||
      activeFilterTab.value === 1 ||
      activeFilterTab.value === 3
    ) {
      payload = {
        description: formatText(this.state.segmentDescription),
        filter_json: temp,
        is_stb: false,
        is_wanted: true,
        name: formatText(this.state.segmentName),
        segment_type: segmentType,
        company_id: this.props.$state.params.companyId,
        is_targetfile_required: true,
      };
      if (this.props.$state.params.selectedNodeDataType === "brand") {
        payload.brand_id = this.props.$state.params.selectedNodeData.id;
      } else if (
        this.props.$state.params.selectedNodeDataType === "sub_brand"
      ) {
        payload.sub_brand_id = this.props.$state.params.selectedNodeData.id;
      }
    } else if (activeFilterTab.value === 2) {
      payload = {
        description: formatText(this.state.segmentDescription),
        is_stb: true,
        is_wanted: true,
        name: formatText(this.state.segmentName),
        segment_type: "Stb",
        is_targetfile_required: true,
      };

      if (this.props.$state.params.selectedNodeDataType === "brand") {
        payload.company_id = this.props.$state.params.companyId;
        payload.brand_id = this.props.$state.params.selectedNodeData.id;
      } else if (this.props.$state.params.selectedNodeDataType === "company") {
        payload.company_id = this.props.$state.params.companyId;
      }
    }

    this.props.segmentStore
      .postUserDataForSegmentCreation(payload)
      .then((res) => {
        if (res === undefined) {
          showAckErrorMessage({
            message: "Something went wrong while saving Segment!",
          });
        }
        //POST request
        if (res.data.success) {
          const message = "Segment created successfully";
          showAckMessage({ message });
          this.props.navigationService.goToUnivisionViewAudience();
        } else {
          const message = res.data.message;
          showAckErrorMessage({ message });
        }
      });
  };

  segmentTabSwitch = () => {
    // segment tab switch for complete, quick or first party
    const { activeFilterTab } = this.state;
    if (activeFilterTab.value === 0) {
      return (
        <QuickFilterContent
          handleTitleTabChange={this.handleTitleTabChange}
          liteFilters={this.state.liteFilters}
          handleAddRemoveFunc={this.handleAddRemoveFunc}
          handleTabChangeFunc={this.handleTabChangeFunc}
          handleUserInputFunc={this.handleUserInputFunc}
          handleSelectAllOrNoneFunc={this.handleSelectAllOrNoneFunc}
          handleSelectAllForCategories={this.handleSelectAllForCategories}
        />
      );
    } else if (activeFilterTab.value === 1) {
      return (
        <CompleteFilterContent
          handleTitleTabChangeForComplete={this.handleTitleTabChangeForComplete}
          completeFilters={this.state.completeFilters}
          handleAddRemoveFunc={this.handleAddRemoveFunc}
          handleTabChangeFunc={this.handleTabChangeFunc}
          handleUserInputFunc={this.handleUserInputFunc}
          handleSelectAllOrNoneFunc={this.handleSelectAllOrNoneFunc}
          handleTitleTabChangeForCredit={this.handleTitleTabChangeForCredit}
          handleSelectAllForCategories={this.handleSelectAllForCategories}
        />
      );
    } else if (activeFilterTab.value === 2) {
      return <UploadFirstPartyData handleFileUploadSubmit={() => {}} />;
    } else if (activeFilterTab.value === 3) {
      return (
        <ExperianFilterContent
          experianFilters={this.state.experianFilters}
          handleTitleTabChangeForExperian={this.handleTitleTabChangeForExperian}
          handleSubCategoryTitleTabChange={this.handleSubCategoryTitleTabChange}
          handleAddRemoveCategoryForExperianFunc={
            this.handleAddRemoveCategoryForExperianFunc
          }
          handleSelectAllOrNoneForExperianFunc={
            this.handleSelectAllOrNoneForExperianFunc
          }
          handleTabChangeFunctionsForExperian={
            this.handleTabChangeFunctionsForExperian
          }
          handleSelectAllOrNoneFiltersForExperian={
            this.handleSelectAllOrNoneFiltersForExperian
          }
          handleAutoTabFilters={this.handleAutoTabFilters}
          handleUserInputFuncForExperian={this.handleUserInputFuncForExperian}
        />
      );
    } else if (activeFilterTab.value === 4) {
      return (
        <>
          <div className="segment-form">
            <div className="">
              <div className="mt10">
                <p className="form-title">Segment Name</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter a Name"
                  onChange={(e) => this.onSegmentDataChange(e, "name")}
                />
              </div>
              <div className="mt10">
                <p className="form-title">Segment Description</p>
                <textarea
                  rows="2"
                  cols="50"
                  placeholder="Enter a description"
                  onChange={(e) => this.onSegmentDataChange(e, "description")}
                ></textarea>
              </div>
              <div className="flex-container6">
                <div className="mt10 ml-auto">
                  <CustomButton
                    type="primary"
                    buttonText="Save"
                    buttonClassName="mr10"
                    handleButtonClick={this.onSaveSegment}
                  />
                  <CustomButton
                    type="secondary"
                    buttonText="Cancel"
                    handleButtonClick={this.onCancelSegment}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (activeFilterTab.value === 5 || activeFilterTab.value === 6) {
      return (
        <>
          <div className="segment-form">
            <div className="">
              <div className="mt10">
                <p className="form-title">Segment Name</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter a Name"
                  onChange={(e) => this.onSegmentDataChange(e, "name")}
                />
              </div>
              <div className="mt10">
                <p className="form-title">Segment Description</p>
                <textarea
                  rows="2"
                  cols="50"
                  placeholder="Enter a description"
                  onChange={(e) => this.onSegmentDataChange(e, "description")}
                ></textarea>
              </div>
              {activeFilterTab.value === 5 && (
                <div className="mt10">
                  <p className="form-title">LiveRamp Count</p>
                  <input
                    type="number"
                    name="liveRampCount"
                    placeholder="Enter liveRamp count"
                    style={{ width: "34vw" }}
                    onChange={(e) =>
                      this.onSegmentDataChange(e, "liveRampCount")
                    }
                  />
                </div>
              )}
              {activeFilterTab.value === 6 && (
                <div className="mt10">
                  <p className="form-title">UCI First Party Count</p>
                  <input
                    type="number"
                    name="firstPartyCount"
                    placeholder="Enter UCI First Party count"
                    style={{ width: "34vw" }}
                    onChange={(e) =>
                      this.onSegmentDataChange(e, "firstPartyCount")
                    }
                  />
                </div>
              )}
              <div className="flex-container6">
                <div className="mt10 ml-auto">
                  <CustomButton
                    type="primary"
                    buttonText="Save"
                    buttonClassName="mr10"
                    handleButtonClick={this.onSaveSegment}
                  />
                  <CustomButton
                    type="secondary"
                    buttonText="Cancel"
                    handleButtonClick={this.onCancelSegment}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  onSaveSegment = () => {
    const { activeFilterTab } = this.state;
    if (activeFilterTab.value === 0) {
      let flag = 0;
      let flagForCombo = 0;
      this.state.liteFilters.forEach((obj) => {
        obj.template.filters.forEach((obj1) => {
          if (
            obj1.isTabSelected &&
            !obj1.value &&
            obj1.title !== "Annual Income" &&
            obj1.title !== "Individual Age" &&
            obj1.filter_name !== "Children Age" &&
            obj1.title !== "Automobile"
          ) {
            flag = 1;
          }
          // if (obj1.title === 'Personas' && obj1.isTabSelected && obj1.value.length === 0) {
          //   flag = 1;
          // }
          if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name !== "Children Age" &&
            !obj1.value
          ) {
            if (!obj1.handler_field_present.value) {
              flagForCombo = 1;
            }
          } else if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name !== "Children Age"
          ) {
            if (obj1.value === "Any") {
              obj1.handler_field_any.forEach((fil) => {
                if (!fil.value) {
                  flagForCombo = 1;
                }
              });
            } else {
              obj1.comboFilters.forEach((fil) => {
                fil.forEach((fillie) => {
                  if (!fillie.value) {
                    flagForCombo = 1;
                  }
                });
              });
            }
          }
          if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name === "Children Age" &&
            !obj1.value
          ) {
            if (!obj1.handler_field.value) {
              flagForCombo = 1;
            }
          } else if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name === "Children Age"
          ) {
            if (obj1.handler_field.value === "Yes") {
              if (obj1.value === "Any") {
                if (!obj1.key_value_map_any.value) {
                  flagForCombo = 1;
                }
              } else {
                obj1.comboFilters.forEach((fil) => {
                  fil.forEach((fillie) => {
                    if (!fillie.value) {
                      flagForCombo = 1;
                    }
                  });
                });
              }
            } else if (!obj1.handler_field.value) {
              flagForCombo = 1;
            }
          }
          if (obj1.title === "Individual Age" && obj1.isTabSelected) {
            if (obj1.min > obj1.max) {
              flag = 2;
            } else if (!obj1.min && !obj.max) {
              flag = 3;
            }
          }
        });
      });
      if (flagForCombo === 1) {
        const message =
          "Please select all values of combination filter before saving!";
        showAckErrorMessage({ message });
        return;
      }
      if (flag === 2) {
        const message =
          "minimum value should not be greater than maximum value in individual age filter!";
        showAckErrorMessage({ message });
        return;
      }
      if (flag === 3) {
        const message =
          "please select both values of individual age before saving!";
        showAckErrorMessage({ message });
        return;
      }
      if (flag === 1) {
        const message = "Please select Values before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!validateName(this.state.segmentName, true)) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      // if (!formatText(this.state.segmentDescription)) {
      //   const message = 'Please provide description before saving!';
      //   showAckErrorMessage({ message });
      //   return;
      // }

      const temp = {};
      this.state.liteFilters.forEach((obj) => {
        const temp1 = {};
        obj.template.filters.forEach((filter) => {
          if (
            filter.isTabSelected &&
            (filter.title === "Annual Income" ||
              filter.title === "Estimated Net worth")
          ) {
            const range = [];
            filter.optionsArray.forEach((opt) => {
              for (let i = opt.value[0]; i < opt.value[1]; i++) {
                range.push(i);
              }
            });
            const uniq = [...new Set(range)];
            const elements = [];
            if (filter.title === "Annual Income") {
              uniq.forEach((val) => {
                elements.push(filter.options[val]);
              });
            } else {
              uniq.forEach((val) => {
                elements.push(filter.options[0].values[val]);
              });
            }

            temp1[filter.filter_name] = elements;
          } else if (
            filter.value &&
            filter.isTabSelected &&
            filter.title !== "Individual Age" &&
            filter.field_type !== "combo"
          ) {
            temp1[filter.filter_name] = filter.value;
          } else if (
            filter.isTabSelected &&
            filter.title === "Individual Age"
          ) {
            const temp3 = { min: filter.min, max: filter.max };
            temp1[filter.filter_name] = temp3;
          } else if (
            filter.field_type === "combo" &&
            filter.isTabSelected &&
            filter.filter_name === "Children Age"
          ) {
            const temp4 = {};
            temp4[filter.handler_field.filter_name] =
              filter.handler_field.value.toLowerCase();
            if (filter.handler_field.value === "Yes") {
              if (filter.value === "Any") {
                temp4["required"] = "no";
                temp4[filter.key_value_map_if_children_present[0].filter_name] =
                  filter.value;
                if (filter.key_value_map_any.value === "default") {
                  temp4["children_details"] = { gender: "" };
                } else {
                  temp4["children_details"] = {
                    gender: filter.key_value_map_any.value,
                  };
                }
                temp1["children"] = temp4;
              } else {
                temp4["required"] = "yes";
                temp4[filter.key_value_map_if_children_present[0].filter_name] =
                  filter.value;
                temp4.children_details = [];
                filter.comboFilters.forEach((fill) => {
                  const temp3 = {};
                  fill.forEach((fillie) => {
                    temp3[fillie.title.slice(0, -2)] = fillie.value;
                  });
                  temp4.children_details.push(temp3);
                });
                temp1["children"] = temp4;
              }
            } else {
              temp4[filter.key_value_map_if_children_present[0].filter_name] =
                "";
              temp4["required"] = "no";
              temp4.children_details = [];
              temp1["children"] = temp4;
            }
          } else if (
            filter.field_type === "combo" &&
            filter.isTabSelected &&
            filter.filter_name !== "Children Age"
          ) {
            const temp5 = [];
            const temp7 = {};
            temp7[filter.handler_field_present.filter_name] =
              filter.handler_field_present.value.toLowerCase();
            if (filter.handler_field_present.value === "Yes") {
              if (filter.value === "Any") {
                temp7["number_of_vehicles"] = filter.value.toLowerCase();
                temp7["required"] = "no";
                const temp6 = {};
                filter.handler_field_any.forEach((fillie) => {
                  if (fillie.value === "Any") {
                    temp6[fillie.filter_name.slice(8)] = "";
                  } else {
                    temp6[fillie.filter_name.slice(8)] = fillie.value;
                  }
                });
                temp7["vehicle_details"] = temp6;
                temp1[filter.filter_name] = temp7;
              } else {
                temp7["number_of_vehicles"] = filter.value;
                temp7["required"] = "yes";
                filter.comboFilters.forEach((fill) => {
                  const temp6 = {};
                  fill.forEach((fillie) => {
                    temp6[fillie.filter_name.slice(8, -2)] = fillie.value;
                  });
                  temp5.push(temp6);
                });
                temp7["vehicle_details"] = temp5;
                temp1[filter.filter_name] = temp7;
              }
            } else {
              temp7["required"] = "no";
              temp7["number_of_vehicles"] = "";
              temp7["vehicle_details"] = temp5;
              temp1[filter.filter_name] = temp7;
            }
          }
        });
        if (Object.keys(temp1).length === 0) {
          return;
        } else {
          if (obj.name) {
            temp[obj.name] = temp1;
          }
        }
      });

      if (temp?.Personas?.niches_5_0?.length === 0) {
        delete temp.Personas;
      }

      if (Object.keys(temp).length === 0) {
        const message = "Please select some filters!";
        showAckErrorMessage({ message });
        return;
      }
      this.saveAPIcall(temp);
    }
    if (activeFilterTab.value === 1) {
      let flag = 0;
      let flagForCombo = 0;
      this.state.completeFilters.forEach((obj) => {
        obj.template.filters.forEach((obj1) => {
          if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name !== "Children Age" &&
            !obj1.value
          ) {
            if (!obj1.handler_field_present.value) {
              flagForCombo = 1;
            }
          } else if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name !== "Children Age"
          ) {
            if (obj1.value === "Any") {
              obj1.handler_field_any.forEach((fil) => {
                if (!fil.value) {
                  flagForCombo = 1;
                }
              });
            } else {
              obj1.comboFilters.forEach((fil) => {
                fil.forEach((fillie) => {
                  if (!fillie.value) {
                    flagForCombo = 1;
                  }
                });
              });
            }
          } else if (
            obj1.field_type === "combo" &&
            obj1.isTabSelected &&
            obj1.filter_name === "Children Age"
          ) {
            if (obj1.handler_field.value === "Yes") {
              if (obj1.value === "Any") {
                if (!obj1.key_value_map_any.value) {
                  flagForCombo = 1;
                }
              } else {
                obj1.comboFilters.forEach((fil) => {
                  fil.forEach((fillie) => {
                    if (!fillie.value) {
                      flagForCombo = 1;
                    }
                  });
                });
              }
            } else if (!obj1.handler_field.value) {
              flagForCombo = 1;
            }
          } else if (
            obj1.isTabSelected &&
            !obj1.value &&
            obj1.title !== "Individual Age"
          ) {
            flag = 1;
          } else if (obj1.title === "Individual Age" && obj1.isTabSelected) {
            if (obj1.min > obj1.max) {
              flag = 2;
            } else if (!obj1.min && !obj.max) {
              flag = 3;
            }
          }
        });
      });

      if (flag === 2) {
        const message =
          "minimum value should not be greater than maximum value in individual age filter!";
        showAckErrorMessage({ message });
        return;
      }
      if (flag === 3) {
        const message =
          "please select both values of individual age before saving!";
        showAckErrorMessage({ message });
        return;
      }
      if (flag === 1) {
        const message = "Please select Values before saving!";
        showAckErrorMessage({ message });
        return;
      }
      if (flagForCombo === 1) {
        const message =
          "Please select all values of combination filter before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!validateName(this.state.segmentName, true)) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      // if (!formatText(this.state.segmentDescription)) {
      //   const message = 'Please provide description before saving!';
      //   showAckErrorMessage({ message });
      //   return;
      // }

      const temp = {};
      this.state.completeFilters.forEach((obj) => {
        const temp1 = {};

        if (obj.name === "Credit" && obj.isSelected) {
          obj.template.sub_cat.forEach((filters) => {
            const temp2 = {};
            filters.filters.forEach((filterVal) => {
              const tempForCredit = [];
              if (filterVal.isFilterSelected) {
                filterVal.options.forEach((val) => {
                  if (val.isValueSelected) {
                    tempForCredit.push(val.val);
                  }
                });
                if (tempForCredit.length === 0) {
                  return;
                } else {
                  temp2[filterVal.filter_name] = tempForCredit;
                }
              }
            });
            if (Object.keys(temp2).length !== 0) {
              temp1[filters.title] = temp2;
            }
          });
          if (Object.keys(temp1).length !== 0) {
            temp[obj.name] = temp1;
          }
        }
        obj.template.filters.forEach((filter) => {
          if (
            filter.isTabSelected &&
            (filter.title === "Annual Income" ||
              filter.title === "Estimated Net worth")
          ) {
            const range = [];
            filter.optionsArray.forEach((opt) => {
              for (let i = opt.value[0]; i < opt.value[1]; i++) {
                range.push(i);
              }
            });
            const uniq = [...new Set(range)];
            const elements = [];
            if (filter.title === "Annual Income") {
              uniq.forEach((val) => {
                elements.push(filter.options[val]);
              });
            } else {
              uniq.forEach((val) => {
                elements.push(filter.options[0].values[val]);
              });
            }
            temp1[filter.filter_name] = elements;
          } else if (
            filter.field_type === "combo" &&
            filter.isTabSelected &&
            filter.filter_name === "Children Age"
          ) {
            const temp4 = {};
            temp4[filter.handler_field.filter_name] =
              filter.handler_field.value.toLowerCase();
            if (filter.handler_field.value === "Yes") {
              if (filter.value === "Any") {
                temp4["required"] = "no";
                temp4[filter.key_value_map_if_children_present[0].filter_name] =
                  filter.value;
                if (filter.key_value_map_any.value === "default") {
                  temp4["children_details"] = { gender: "" };
                } else {
                  temp4["children_details"] = {
                    gender: filter.key_value_map_any.value,
                  };
                }
                temp1["children"] = temp4;
              } else {
                temp4["required"] = "yes";
                temp4[filter.key_value_map_if_children_present[0].filter_name] =
                  filter.value;
                temp4.children_details = [];
                filter.comboFilters.forEach((fill) => {
                  const temp3 = {};
                  fill.forEach((fillie) => {
                    temp3[fillie.title.slice(0, -2)] = fillie.value;
                  });
                  temp4.children_details.push(temp3);
                });
                temp1["children"] = temp4;
              }
            } else {
              temp4[filter.key_value_map_if_children_present[0].filter_name] =
                "";
              temp4["required"] = "no";
              temp4.children_details = [];
              temp1["children"] = temp4;
            }
          } else if (
            filter.value &&
            filter.isTabSelected &&
            filter.field_type !== "combo" &&
            (filter.title !== "Annual Income" ||
              filter.title !== "Estimated Net worth")
          ) {
            temp1[filter.filter_name] = filter.value;
          } else if (
            filter.title === "Individual Age" &&
            filter.isTabSelected
          ) {
            const temp3 = { min: filter.min, max: filter.max };
            temp1[filter.filter_name] = temp3;
          } else if (
            filter.field_type === "combo" &&
            filter.isTabSelected &&
            filter.filter_name !== "Children Age"
          ) {
            const temp5 = [];
            const temp7 = {};
            temp7[filter.handler_field_present.filter_name] =
              filter.handler_field_present.value.toLowerCase();
            if (filter.handler_field_present.value === "Yes") {
              if (filter.value === "Any") {
                temp7["number_of_vehicles"] = filter.value.toLowerCase();
                temp7["required"] = "no";
                const temp6 = {};
                filter.handler_field_any.forEach((fillie) => {
                  if (fillie.value === "Any") {
                    temp6[fillie.filter_name.slice(8)] = "";
                  } else {
                    temp6[fillie.filter_name.slice(8)] = fillie.value;
                  }
                });
                temp7["vehicle_details"] = temp6;
                temp1[filter.filter_name] = temp7;
              } else {
                temp7["number_of_vehicles"] = filter.value;
                temp7["required"] = "yes";
                filter.comboFilters.forEach((fill) => {
                  const temp6 = {};
                  fill.forEach((fillie) => {
                    temp6[fillie.filter_name.slice(8, -2)] = fillie.value;
                  });
                  temp5.push(temp6);
                });
                temp7["vehicle_details"] = temp5;
                temp1[filter.filter_name] = temp7;
              }
            } else {
              temp7["required"] = "no";
              temp7["number_of_vehicles"] = "";
              temp7["vehicle_details"] = temp5;
              temp1[filter.filter_name] = temp7;
            }
          }
        });
        if (Object.keys(temp1).length === 0) {
          return;
        } else {
          temp[obj.name] = temp1;
        }
      });
      if (temp?.Personas?.niches_5_0?.length === 0) {
        delete temp.Personas;
      }
      if (Object.keys(temp).length === 0) {
        const message = "Please select some filters!";
        showAckErrorMessage({ message });
        return;
      }
      this.saveAPIcall(temp);
    } else if (activeFilterTab.value === 3) {
      let flag = 0;

      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!validateName(this.state.segmentName, true)) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      // if (!formatText(this.state.segmentDescription)) {
      //   const message = 'Please provide description before saving!';
      //   showAckErrorMessage({ message });
      //   return;
      // }
      const tempObj = {};
      const { experianFilters } = this.state;

      experianFilters.forEach((exp) => {
        if (hasProperty(exp.template, "sub_cat")) {
          if (exp.name === "Auto") {
            exp.template.sub_cat.forEach((subCat) => {
              subCat.sub_cat.forEach((subSubCategory) => {
                subSubCategory.filters.forEach((filter) => {
                  if (filter.isFilterSelected && !filter.value.length) {
                    flag = 1;
                  }
                });
              });
            });
          } else {
            exp.template.sub_cat.forEach((subCat) => {
              subCat.filters.forEach((filter) => {
                if (filter.isFilterSelected && !filter.value.length) {
                  flag = 1;
                }
              });
            });
          }
        } else {
          exp.template.filters.forEach((filter) => {
            if (filter.isFilterSelected && !filter.value.length) {
              flag = 1;
            }
          });
        }
      });

      if (flag === 1) {
        const message = "Please select Values before saving!";
        showAckErrorMessage({ message });
        return;
      }

      experianFilters.forEach((exp) => {
        if (hasProperty(exp.template, "sub_cat")) {
          if (exp.name === "Auto") {
            const AutoSub = {};
            exp.template.sub_cat.forEach((subCat) => {
              const Auto = {};
              let SubSubObj = {};
              subCat.sub_cat.forEach((subSubCategory) => {
                subSubCategory.filters.forEach((filter) => {
                  if (filter.value !== "") {
                    SubSubObj[filter.filter_name] = filter.value;
                  }
                });
                if (Object.keys(SubSubObj).length !== 0) {
                  Auto[subSubCategory.title] = SubSubObj;
                }
                SubSubObj = {};
              });

              if (Object.keys(Auto).length !== 0) {
                AutoSub[subCat.title] = Auto;
              }
            });
            if (Object.keys(AutoSub).length !== 0) {
              tempObj["Auto"] = AutoSub;
            }
          } else {
            let Auto = {};
            exp.template.sub_cat.forEach((subCat) => {
              let SubSubObj = {};

              subCat.filters.forEach((filter) => {
                if (filter.value !== "") {
                  SubSubObj[filter.filter_name] = filter.value;
                }
              });
              if (Object.keys(SubSubObj).length !== 0) {
                Auto[subCat.title] = SubSubObj;
              }
              SubSubObj = {};
            });
            if (Object.keys(Auto).length !== 0) {
              tempObj[exp.name] = Auto;
            }
            Auto = {};
          }
        } else {
          const SubSubObj = {};
          exp.template.filters.forEach((filter) => {
            if (filter.value !== "") {
              SubSubObj[filter.filter_name] = filter.value;
            }
          });

          if (Object.keys(SubSubObj).length !== 0) {
            tempObj[exp.name] = SubSubObj;
          }
        }
      });

      Object.keys(tempObj).forEach((key) => {
        Object.keys(tempObj[key]).forEach((index) => {
          if (
            tempObj[key][index] === undefined ||
            (key === "Geographic" && tempObj[key][index].length === 0)
          ) {
            delete tempObj[key][index];
          }
        });
        if (Object.keys(tempObj[key]).length === 0) {
          delete tempObj[key];
        }
      });

      if (Object.keys(tempObj).length === 0) {
        const message = "Please select some filters!";
        showAckErrorMessage({ message });
        return;
      }
      this.saveAPIcall(tempObj);
    } else if (activeFilterTab.value === 4) {
      const tableState = 2;
      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!this.state.segmentName) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      // if (!formatText(this.state.segmentDescription)) {
      //   const message = 'Please provide description before saving!';
      //   showAckErrorMessage({ message });
      //   return;
      // }

      const payload = {
        company_id: this.props.$state.params.companyId,
        data_provider: "audience_request_form",
        name: this.state.segmentName,
        description: formatText(this.state.segmentDescription),
        household_count: this.state.arfCount,
      };

      this.props.univisionStore.createAudienceRequest(payload).then((res) => {
        if (res) {
          const message = "Audience created successfully";
          showAckMessage({ message });
          this.props.navigationService.goToUnivisionViewAudience(tableState);
        } else {
          const message = res.data.message;
          showAckErrorMessage({ message });
        }
      });
    } else if (activeFilterTab.value === 5) {
      const tableState = 2;
      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!this.state.segmentName) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      if (!this.state.liveRampCount) {
        showAckErrorMessage({ message: "Please provide LiveRamp count!" });
        return;
      }

      if (this.state.liveRampCount < 0) {
        showAckErrorMessage({ message: "LiveRamp Count cannot be negative!" });
        return;
      }

      // if (!formatText(this.state.segmentDescription)) {
      //   const message = 'Please provide description before saving!';
      //   showAckErrorMessage({ message });
      //   return;
      // }

      const liveRamppayload = {
        company_id: this.props.$state.params.companyId,
        data_provider: "live_ramp",
        name: this.state.segmentName,
        description: formatText(this.state.segmentDescription),
        household_count: this.state.liveRampCount,
      };

      this.props.univisionStore
        .createAudienceRequest(liveRamppayload)
        .then((res) => {
          if (res) {
            const message = "Audience created successfully";
            showAckMessage({ message });
            this.props.navigationService.goToUnivisionViewAudience(tableState);
          } else {
            const message = res.data.message;
            showAckErrorMessage({ message });
          }
        });
    } else if (activeFilterTab.value === 6) {
      const tableState = 2;
      if (!formatText(this.state.segmentName)) {
        const message = "Please provide a name before saving!";
        showAckErrorMessage({ message });
        return;
      }

      if (!this.state.segmentName) {
        showAckErrorMessage({ message: "Please provide valid segment name!" });
        return;
      }

      if (!this.state.firstPartyCount) {
        showAckErrorMessage({ message: "Please provide FirstParty count!" });
        return;
      }

      if (this.state.firstPartyCount < 0) {
        showAckErrorMessage({
          message: "FirstParty Count cannot be negative!",
        });
        return;
      }

      const firstPartyPayload = {
        company_id: this.props.$state.params.companyId,
        data_provider: "first_party",
        name: this.state.segmentName,
        description: formatText(this.state.segmentDescription),
        household_count: this.state.firstPartyCount,
      };

      this.props.univisionStore
        .createAudienceRequest(firstPartyPayload)
        .then((res) => {
          if (res) {
            const message = "Audience created successfully";
            showAckMessage({ message });
            this.props.navigationService.goToUnivisionViewAudience(tableState);
          } else {
            const message = res.data.message;
            showAckErrorMessage({ message });
          }
        });
    }

    if (activeFilterTab.value === 2) {
      const message = "Please upload file";
      showAckErrorMessage({ message });
      this.saveAPIcall();
    }
  };

  onCancelSegment = () => {
    this.props.navigationService.goToManageAudienceLanding();
  };

  render() {
    const { activeFilterTab, liteFilters, completeFilters, experianFilters } =
      this.state;
    return this.props.$state.params.companyId &&
      this.state.liteFilters &&
      this.state.completeFilters ? (
      <MainContent>
        <PageContent className="segment-page-container-height">
          <Row>
            <Col md={9}>
              <CreateNewSegmentHeader
                selectedNodeData={this.props.$state.params.selectedNodeData}
                onCancelSegment={this.onCancelSegment}
                onSaveSegment={this.onSaveSegment}
                activeFilterTab={activeFilterTab}
                audienceRequestForm={true}
              />
              <SegmentFilterTabs
                segmentFilterTabData={segmentFilterTabData}
                activeFilterTab={activeFilterTab}
                onFilterTabChange={this.onFilterTabChange}
              />
              <div>
                {liteFilters.length > 0 &&
                  completeFilters.length > 0 &&
                  this.segmentTabSwitch()}
              </div>
            </Col>
            {activeFilterTab.value !== 4 &&
            activeFilterTab.value !== 5 &&
            activeFilterTab.value !== 6 ? (
              <Col md={3}>
                <SegmentSummary
                  onSegmentDataChange={this.onSegmentDataChange}
                  activeFilterTab={activeFilterTab}
                  liteFilters={liteFilters}
                  completeFilters={completeFilters}
                  experianFilters={experianFilters}
                />
              </Col>
            ) : null}
          </Row>
        </PageContent>
        <Loader
          isLoading={this.state.isPageLoading || this.props.uiStore.isLoading}
        />
      </MainContent>
    ) : (
      <div>{this.onCancelSegment()}</div>
    );
    // console.log(toJS(this.props.$state.params));
    // return(
    //   <MainContent>
    //     <PageContent className="segment-page-container-height">
    //       <h1></h1>
    //     </PageContent>
    //   </MainContent>
    // );
  }
}

SelectFilters.propTypes = {
  univisionStore: PropTypes.object,
  segmentStore: PropTypes.object,
  companyStore: PropTypes.object,
  selectedNodeData: PropTypes.object,
  selectedNodeDataType: PropTypes.string,
  showAckMessage: PropTypes.func,
  showAckErrorMessage: PropTypes.func,
  goToSegmentsAndReset: PropTypes.func,
  companyId: PropTypes.any,
  uiStore: PropTypes.object,
  navigationService: PropTypes.object,
  $state: PropTypes.object,
};

export default inject(
  "uiStore",
  "univisionStore",
  "segmentStore"
)(observer(SelectFilters));
