import React from 'react';
import { Col, Row, Panel } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import { PageHeader, PageContent, MainContentWithLoader } from '../../components/PageLayout';
import { showAckErrorMessage } from '../../common/utils';
import withStore from '../../hocs/WithStore';

import CreateNewSegmentHeader from './components/create-new-segment-header';
import SegmentSummary from './components/segment-summary';
import QuickFilterContent from './components/quick-filter-content';
import CompleteFilterContent from './components/complete-filter-content';
import Reports from './components/Reports';
import filterSegmentData from './components/filterSegmentData';
import StyledSegmentFilter from './StyledSegmentFilter';
import AuthOkta from './components/AuthOkta';

import '../../segments/Segments.css';
import '../../../styles/unwantedGroup.css';

const segmentFilterTabData = [
  {
    id: 'quick_filters',
    name: 'Adcuratio Audience Quick Filters',
    tooltipText: 'Filters with immediate household count',
    value: 0,
  },
  {
    id: 'complete_filters',
    name: 'Adcuratio Complete Audience Filters',
    tooltipText: 'Takes 24 hours to calculate household count',
    value: 1,
  },
];
@inject('uiStore')
@inject('segmentStore')
@inject('authStore')
@observer
class SegmentFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilterTab: segmentFilterTabData[0],
      liteFilters: [],
      completeFilters: [],
      filterJson: {},
      isExpanded: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const { liteFilters, completeFilters } = this.state;
    if (liteFilters.length === 0 || completeFilters === 0) {
      const liteFilters = await this.props.segmentStore.getAllLiteGroupCompanies();
      const completeFilters = await this.props.segmentStore.getAllTspFullGroupCompanies();
      this.setState({
        ...this.state,
        liteFilters: toJS(liteFilters),
        completeFilters: toJS(completeFilters),
      });
    }
  };

  onFilterTabChange = (activeFilterTab) => {
    this.setState({
      activeFilterTab,
    });
  };

  handleSelectAllOrNoneFunc = (id, title, type) => {
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === 'quick_filters') {
      const { liteFilters } = this.state;
      const index = liteFilters.indexOf(title);
      if (type === 'none') {
        liteFilters[index].template.filters.map((obj) => (obj.isTabSelected = false));
      } else if (type === 'all') {
        liteFilters[index].template.filters.map((obj) => (obj.isTabSelected = true));
      }
      this.setState({ liteFilters });
    } else if (activeFilterTab.id === 'complete_filters') {
      if (id === 'credit') {
        const { completeFilters } = this.state;

        const indexOfCredit = completeFilters.findIndex((fil) => fil.name === 'Credit');
        const indexOfFilter = completeFilters[indexOfCredit].template.sub_cat.indexOf(title);
        if (type === 'all') {
          completeFilters[indexOfCredit].template.sub_cat[indexOfFilter].filters.forEach(
            (fillie) => (fillie.isFilterSelected = true)
          );
        } else if (type === 'none') {
          completeFilters[indexOfCredit].template.sub_cat[indexOfFilter].filters.forEach(
            (fillie) => (fillie.isFilterSelected = false)
          );
        }
        this.setState({ completeFilters });
      } else {
        const { completeFilters } = this.state;
        const index = completeFilters.indexOf(title);
        if (type === 'none') {
          completeFilters[index].template.filters.forEach((obj) => (obj.isTabSelected = false));
        } else if (type === 'all') {
          completeFilters[index].template.filters.forEach((obj) => {
            if (obj.title === 'Number of Vehicles') {
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
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === 'quick_filters') {
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
          return data;
        });
        let flag = false;
        liteFilters.forEach((data) => {
          if (data.isSelected && data.isTabSelectedToShow) {
            flag = true;
          }
        });
        if (liteFilters.find((data) => data.isSelected) && !flag) {
          const activeLiteIndex = liteFilters.indexOf(liteFilters.find((data) => data.isSelected));
          liteFilters[activeLiteIndex].isTabSelectedToShow = true;
          liteFilters.forEach((lite) => {
            if (liteFilters.indexOf(lite) !== activeLiteIndex) {
              lite.isTabSelectedToShow = false;
            }
          });
        }
      }
      this.setState({ liteFilters });
    } else if (activeFilterTab.id === 'complete_filters') {
      if (id === 'credit') {
        const { completeFilters } = this.state;
        const indexOfCredit = completeFilters.findIndex((obj) => obj.name === 'Credit');
        const index = completeFilters[indexOfCredit].template.sub_cat.indexOf(activeData);
        const headingSelectedValue = completeFilters[indexOfCredit].template.sub_cat[index].isHeadingSelected;
        completeFilters[indexOfCredit].template.sub_cat[index].isHeadingSelected = !headingSelectedValue;

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
            return data;
          });
          let flag = false;
          completeFilters.forEach((data) => {
            if (data.isSelected && data.isTabSelectedToShow) {
              flag = true;
            }
          });
          if (completeFilters.find((data) => data.isSelected) && !flag) {
            const activeLiteIndex = completeFilters.indexOf(completeFilters.find((data) => data.isSelected));
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

  handleUserInputFunc = (values, id) => {
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === 'quick_filters') {
      // console.log(toJS(values[1]));
      // console.log(values[2]);
      // console.log(id);
      const temp = this.state.liteFilters;
      const index = temp.indexOf(values[0]);
      if (
        (values[1].field_type === 'checkbox' && values[1].title === 'Annual Income') ||
        (values[1].field_type === 'dropdown' && values[1].title === 'Estimated Net worth')
      ) {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === '1') {
          const clone = JSON.parse(
            JSON.stringify(
              temp[index].template.filters[filterIndex].optionsArray[
                temp[index].template.filters[filterIndex].optionsArray.length - 1
              ]
            )
          );
          clone.index =
            parseInt(
              temp[index].template.filters[filterIndex].optionsArray[
                temp[index].template.filters[filterIndex].optionsArray.length - 1
              ]['index']
            ) + 1;
          // console.log(clone.index);
          clone.index = `${clone.index}`;
          temp[index].template.filters[filterIndex].optionsArray.push(clone);
        } else if (values[2] === '0') {
          let flag = 0;
          if (temp[index].template.filters[filterIndex].optionsArray.length === 1) {
            const message = 'One filter should at least be there!';
            showAckErrorMessage({ message });
            flag = 1;
          }
          if (flag === 1) {
            return;
          } else {
            temp[index].template.filters[filterIndex].optionsArray.pop();
          }
        } else {
          temp[index].template.filters[filterIndex].optionsArray[values[2][1] - 1].value = values[2][0];
        }
      } else if (values[1].field_type === 'checkbox' && values[1].title !== 'Annual Income') {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (temp[index].template.filters[filterIndex].value.indexOf(values[2]) !== -1) {
          const arr = temp[index].template.filters[filterIndex].value.filter((val) => values[2] !== val);
          temp[index].template.filters[filterIndex].value = arr;
        } else {
          temp[index].template.filters[filterIndex].value.push(values[2]);
        }
      } else if (values[1].field_type === 'combo' && values[1].filter_name !== 'Children Age') {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === 'Yes' || values[2] === 'No' || values[2] === '') {
          temp[index].template.filters[filterIndex].handler_field_present.value = values[2];
          // console.log(toJS(temp[index].template.filters[filterIndex]));
        } else if (typeof values[2] === 'string') {
          // console.log(parseInt(values[2]));
          const num = parseInt(values[2]);
          if (values[2] === 'Any') {
            temp[index].template.filters[filterIndex].value = values[2];
          } else {
            const arrayForCombo = [];
            for (let i = 1; i <= num; i++) {
              const copyArray = temp[index].template.filters[filterIndex].key_value_map.map((a) => ({
                ...a,
              }));
              const combos = [];
              // console.log(toJS(copyArray));
              for (let j = 0; j < copyArray.length; j++) {
                const t = copyArray[j];
                t.filter_name = `${t.filter_name} ${i}`;
                t.title = `${t.title} ${i}`;
                combos.push(t);
              }
              arrayForCombo.push(combos);
            }
            // console.log(arrayForCombo);
            temp[index].template.filters[filterIndex].comboFilters = arrayForCombo;
            temp[index].template.filters[filterIndex].value = values[2];
          }
        } else {
          if (temp[index].template.filters[filterIndex].value === 'Any') {
            temp[index].template.filters[filterIndex].handler_field_any.forEach((fill) => {
              if (fill.filter_name === values[2][0]) {
                fill.value = values[2][1];
              }
            });
          } else {
            temp[index].template.filters[filterIndex].comboFilters.forEach((fil) => {
              fil.forEach((fill) => {
                if (fill.filter_name.slice(0, -2) === 'vehicle_make' && fill.filter_name === values[2][0]) {
                  const model = [];
                  this.props.segmentStore.getCorrespondingModelYear(values[2][1]).then((data) => {
                    data.model_year.forEach((modelArr) => {
                      model.push(modelArr.model);
                    });
                    fil[1].options[0].values = model;
                    this.setState({ ...this.state, liteFilters: temp });
                  });
                } else if (fill.filter_name.slice(0, -2) === 'vehicle_model' && fill.filter_name === values[2][0]) {
                  this.props.segmentStore.modelYearForVehicleMake.model_year.forEach((model) => {
                    if (model.model === values[2][1]) {
                      fil[2].options[0].values = model.years;
                    }
                  });
                }
                if (fill.filter_name === values[2][0]) {
                  fill.value = values[2][1];
                }
              });
            });
          }
        }
      } else if (values[1].field_type === 'combo' && values[1].filter_name === 'Children Age') {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        if (values[2] === 'Yes' || values[2] === 'No' || values[2] === '') {
          temp[index].template.filters[filterIndex].handler_field.value = values[2];
          // console.log(toJS(temp[index].template.filters[filterIndex]));
        } else if (values[2] === 'Any') {
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
          temp[index].template.filters[filterIndex].comboFilters = arrayForCombo;
          temp[index].template.filters[filterIndex].value = values[2];
          // console.log(temp[index].template.filters[filterIndex]);
          // console.log(toJS(temp[index].template.filters[filterIndex]));
        } else {
          if (temp[index].template.filters[filterIndex].value === 'Any') {
            temp[index].template.filters[filterIndex].key_value_map_any.value = values[2][1];
          } else {
            temp[index].template.filters[filterIndex].comboFilters.forEach((fil) => {
              fil.forEach((fill) => {
                if (fill.title === values[2][0]) {
                  fill.value = values[2][1];
                }
              });
            });
          }
        }
      } else if (values[1].title === 'Individual Age') {
        if (values[2][0] === 'min') {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          temp[index].template.filters[filterIndex].min = values[2][1];
        } else if (values[2][0] === 'max') {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          temp[index].template.filters[filterIndex].max = values[2][1];
        }
      } else if (values[1].title !== 'Estimated Net worth') {
        const filterIndex = temp[index].template.filters.indexOf(values[1]);
        temp[index].template.filters[filterIndex].value = values[2];
      }

      this.setState({ ...this.setState, liteFilters: temp });
    } else if (activeFilterTab.id === 'complete_filters') {
      if (id === 'credit') {
        const temp = this.state.completeFilters;
        const creditCard = temp.filter((obj) => obj.name === 'Credit');

        const indexOfCredit = temp.indexOf(creditCard[0]);
        const index = temp[indexOfCredit].template.sub_cat.indexOf(values[0]);
        const filterIndex = temp[indexOfCredit].template.sub_cat[index].filters.indexOf(values[1]);
        const optionIndex = temp[indexOfCredit].template.sub_cat[index].filters[filterIndex].options.indexOf(values[2]);
        temp[indexOfCredit].template.sub_cat[index].filters[filterIndex].options[optionIndex].isValueSelected = !temp[
          indexOfCredit
        ].template.sub_cat[index].filters[filterIndex].options[optionIndex].isValueSelected;

        this.setState({ ...this.state, completeFilters: temp });
      } else {
        const temp = this.state.completeFilters;
        const index = temp.indexOf(values[0]);
        if (
          (values[1].field_type === 'checkbox' && values[1].title === 'Annual Income') ||
          (values[1].field_type === 'dropdown' && values[1].title === 'Estimated Net worth')
        ) {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === '1') {
            const clone = JSON.parse(
              JSON.stringify(
                temp[index].template.filters[filterIndex].optionsArray[
                  temp[index].template.filters[filterIndex].optionsArray.length - 1
                ]
              )
            );
            clone.index =
              parseInt(
                temp[index].template.filters[filterIndex].optionsArray[
                  temp[index].template.filters[filterIndex].optionsArray.length - 1
                ]['index']
              ) + 1;
            // console.log(clone.index);
            clone.index = `${clone.index}`;
            temp[index].template.filters[filterIndex].optionsArray.push(clone);
          } else if (values[2] === '0') {
            let flag = 0;
            if (temp[index].template.filters[filterIndex].optionsArray.length === 1) {
              const message = 'One filter should at least be there!';
              showAckErrorMessage({ message });
              flag = 1;
            }
            if (flag === 1) {
              return;
            } else {
              temp[index].template.filters[filterIndex].optionsArray.pop();
            }
          } else {
            temp[index].template.filters[filterIndex].optionsArray[values[2][1] - 1].value = values[2][0];
          }
        } else if (values[1].field_type === 'combo' && values[1].filter_name === 'Children Age') {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === 'Yes' || values[2] === 'No' || values[2] === '') {
            temp[index].template.filters[filterIndex].handler_field.value = values[2];
            // console.log(toJS(temp[index].template.filters[filterIndex]));
          } else if (values[2] === 'Any') {
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
            temp[index].template.filters[filterIndex].comboFilters = arrayForCombo;
            temp[index].template.filters[filterIndex].value = values[2];
            // console.log(temp[index].template.filters[filterIndex]);
            // console.log(toJS(temp[index].template.filters[filterIndex]));
          } else {
            if (temp[index].template.filters[filterIndex].value === 'Any') {
              temp[index].template.filters[filterIndex].key_value_map_any.value = values[2][1];
            } else {
              temp[index].template.filters[filterIndex].comboFilters.forEach((fil) => {
                fil.forEach((fill) => {
                  if (fill.title === values[2][0]) {
                    fill.value = values[2][1];
                  }
                });
              });
            }
          }
        } else if (values[1].field_type === 'checkbox') {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (temp[index].template.filters[filterIndex].value.indexOf(values[2]) !== -1) {
            const arr = temp[index].template.filters[filterIndex].value.filter((val) => values[2] !== val);
            temp[index].template.filters[filterIndex].value = arr;
          } else {
            temp[index].template.filters[filterIndex].value.push(values[2]);
          }
        } else if (values[1].title === 'Individual Age') {
          if (values[2][0] === 'min') {
            const filterIndex = temp[index].template.filters.indexOf(values[1]);
            temp[index].template.filters[filterIndex].min = values[2][1];
          } else if (values[2][0] === 'max') {
            const filterIndex = temp[index].template.filters.indexOf(values[1]);
            temp[index].template.filters[filterIndex].max = values[2][1];
          }
        } else if (values[1].field_type === 'combo' && values[1].filter_name !== 'Children Age') {
          const filterIndex = temp[index].template.filters.indexOf(values[1]);
          if (values[2] === 'Yes' || values[2] === 'No' || values[2] === '') {
            temp[index].template.filters[filterIndex].handler_field_present.value = values[2];
            // console.log(toJS(temp[index].template.filters[filterIndex]));
          } else if (typeof values[2] === 'string') {
            // console.log(parseInt(values[2]));
            const num = parseInt(values[2]);
            if (values[2] === 'Any') {
              temp[index].template.filters[filterIndex].value = values[2];
            } else {
              const arrayForCombo = [];
              for (let i = 1; i <= num; i++) {
                const copyArray = temp[index].template.filters[filterIndex].key_value_map.map((a) => ({
                  ...a,
                }));
                const combos = [];
                // console.log(toJS(copyArray));
                for (let j = 0; j < copyArray.length; j++) {
                  const t = copyArray[j];
                  t.filter_name = `${t.filter_name} ${i}`;
                  t.title = `${t.title} ${i}`;
                  combos.push(t);
                }
                arrayForCombo.push(combos);
              }
              // console.log(arrayForCombo);
              temp[index].template.filters[filterIndex].comboFilters = arrayForCombo;
              temp[index].template.filters[filterIndex].value = values[2];
            }
          } else {
            if (temp[index].template.filters[filterIndex].value === 'Any') {
              temp[index].template.filters[filterIndex].handler_field_any.forEach((fill) => {
                if (fill.filter_name === values[2][0]) {
                  fill.value = values[2][1];
                }
              });
            } else {
              temp[index].template.filters[filterIndex].comboFilters.forEach((fil) => {
                fil.forEach((fill) => {
                  if (fill.filter_name.slice(0, -2) === 'vehicle_make' && fill.filter_name === values[2][0]) {
                    const model = [];
                    this.props.segmentStore.getCorrespondingModelYear(values[2][1]).then((data) => {
                      data.model_year.forEach((modelArr) => {
                        model.push(modelArr.model);
                      });
                      fil[1].options[0].values = model;
                      this.setState({ ...this.state, completeFilters: temp });
                    });
                  } else if (fill.filter_name.slice(0, -2) === 'vehicle_model' && fill.filter_name === values[2][0]) {
                    this.props.segmentStore.modelYearForVehicleMake.model_year.forEach((model) => {
                      if (model.model === values[2][1]) {
                        fil[2].options[0].values = model.years;
                      }
                    });
                  }
                  if (fill.filter_name === values[2][0]) {
                    fill.value = values[2][1];
                  }
                });
              });
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

  // Toggle isTabSelectedToShow value
  // that highlights filter category tab
  // for quick filter tabs
  handleTitleTabChange = (title) => {
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

  // For complete filter tabs
  handleTitleTabChangeForComplete = (title) => {
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

  // For cretit filter tabs
  handleTitleTabChangeForCredit = (credit) => {
    const temp = this.state.completeFilters;
    const creditCard = this.state.completeFilters.filter((obj) => obj.name === 'Credit');

    const indexOfCredit = temp.indexOf(creditCard[0]);
    const index = this.state.completeFilters[indexOfCredit].template.sub_cat.indexOf(credit);
    temp[indexOfCredit].template.sub_cat.forEach((filter) => {
      if (temp[indexOfCredit].template.sub_cat.indexOf(filter) === index) {
        filter.isCreditTabSelected = true;
      } else {
        filter.isCreditTabSelected = false;
      }
    });
    this.setState({ ...this.state, completeFilters: temp });
  };

  handleTabChangeFunc = (title, activeData, id = '') => {
    const { activeFilterTab } = this.state;
    if (activeFilterTab.id === 'quick_filters') {
      const temp1 = this.state.liteFilters;
      const index1 = temp1.indexOf(title);
      const index = temp1[index1].template.filters.indexOf(activeData);
      temp1[index1].template.filters[index].isTabSelected = !temp1[index1].template.filters[index].isTabSelected;
      this.setState({ ...this.state, liteFilters: temp1 });
    } else if (activeFilterTab.id === 'complete_filters') {
      if (id === 'credit') {
        const temp = this.state.completeFilters;
        const creditCard = this.state.completeFilters.filter((obj) => obj.name === 'Credit');
        const indexOfCredit = temp.indexOf(creditCard[0]);
        const index = temp[indexOfCredit].template.sub_cat.indexOf(title);
        const filterIndex = temp[indexOfCredit].template.sub_cat[index].filters.indexOf(activeData);
        temp[indexOfCredit].template.sub_cat[index].filters[filterIndex].isFilterSelected = !temp[indexOfCredit]
          .template.sub_cat[index].filters[filterIndex].isFilterSelected;
        this.setState({ ...this.state, completeFilters: temp });
      } else {
        const temp1 = this.state.completeFilters;
        const index1 = temp1.indexOf(title);
        const index = temp1[index1].template.filters.indexOf(activeData);
        temp1[index1].template.filters[index].isTabSelected = !temp1[index1].template.filters[index].isTabSelected;
        this.setState({ ...this.state, completeFilters: temp1 });
      }
    }
  };

  handleSelectAllForCategories = (type, nora) => {
    if (type === 'lite') {
      const temp = this.state.liteFilters;
      if (nora === 'all') {
        temp.forEach((fil) => {
          fil.isSelected = true;
        });
      } else if (nora === 'none') {
        temp.forEach((fil) => {
          fil.template.filters.forEach((filter) => {
            filter.isTabSelected = false;
          });
          fil.isSelected = false;
        });
      }
      this.setState({ ...this.state, liteFilters: temp });
    } else if (type === 'comp') {
      const temp = this.state.completeFilters;
      if (nora === 'all') {
        temp.forEach((fil) => {
          fil.isSelected = true;
        });
      } else if (nora === 'none') {
        temp.forEach((fil) => {
          fil.template.filters.forEach((filter) => {
            filter.isTabSelected = false;
          });
          fil.isSelected = false;
        });
      }
      this.setState({ ...this.state, completeFilters: temp });
    } else if (type === 'credit') {
      const { completeFilters } = this.state;
      const index = completeFilters.findIndex((fil) => fil.name === 'Credit');
      if (nora === 'all') {
        completeFilters[index].template.sub_cat.map((fil) => (fil.isHeadingSelected = true));
      } else if (nora === 'none') {
        completeFilters[index].template.sub_cat.map((fil) => (fil.isHeadingSelected = false));
      }
      this.setState({ completeFilters });
    }
  };

  // Display UI based on which filter user selects
  segmentTabSwitch = () => {
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
    }
  };

  // Update the latest filters
  onUpdateReport = (e) => {
    e.stopPropagation();
    const filterJson = filterSegmentData(this.state);
    if (filterJson) {
      this.setState({ ...this.state, filterJson });
    }
  };

  // Collapse/expand accordion
  onToggle = () => {
    this.setState({
      ...this.state,
      isExpanded: !this.state.isExpanded,
    });
  };

  // Check okta token
  hasOktaToken = () => {
    const { authStore } = this.props;
    const session_token = authStore.userObj.oktaDetails ? authStore.userObj.oktaDetails.session_token : null;
    const hasToken = window.sessionStorage.oktaSession === 'true' || session_token === null;
    return hasToken;
  };

  render() {
    const { activeFilterTab, liteFilters, completeFilters, filterJson, isExpanded } = this.state;

    // Set Okta Cookies
    if (!this.hasOktaToken()) {
      return <AuthOkta authStore={this.props.authStore} />;
    } else {
      return (
        <StyledSegmentFilter>
          <MainContentWithLoader isPageLoading={this.props.uiStore.isLoading}>
            <PageHeader>
              <PageContent>
                {/* Filters */}
                <Panel id="report-collapsible" expanded={isExpanded} onToggle={() => {}}>
                  <Panel.Heading>
                    <Panel.Title toggle>
                      <CreateNewSegmentHeader
                        onHandleAction={this.onUpdateReport}
                        isExpanded={isExpanded}
                        onToggle={this.onToggle}
                      />
                    </Panel.Title>
                  </Panel.Heading>
                  <Panel.Collapse>
                    <Panel.Body>
                      <Row>
                        <Col md={9}>
                          <div className="mt15">
                            {liteFilters?.length > 0 && completeFilters?.length > 0 && this.segmentTabSwitch()}
                          </div>
                        </Col>
                        <Col md={3}>
                          <SegmentSummary
                            onSegmentDataChange={this.onSegmentDataChange}
                            activeFilterTab={activeFilterTab}
                            liteFilters={liteFilters}
                            completeFilters={completeFilters}
                          />
                        </Col>
                      </Row>
                    </Panel.Body>
                  </Panel.Collapse>
                </Panel>

                <Row className="mt20">
                  <Reports filterJson={filterJson} />
                </Row>
              </PageContent>
            </PageHeader>
          </MainContentWithLoader>
        </StyledSegmentFilter>
      );
    }
  }
}

SegmentFilter.propTypes = {
  segmentStore: PropTypes.object,
  uiStore: PropTypes.object,
  authStore: PropTypes.object,
};

export default withStore(SegmentFilter);
