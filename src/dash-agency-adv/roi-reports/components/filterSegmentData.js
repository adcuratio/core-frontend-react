import { showAckErrorMessage } from '../../../common/utils';

const filterSegmentData = ({ activeFilterTab, liteFilters, completeFilters }) => {
  if (activeFilterTab.value === 0) {
    let flag = 0;
    let flagForCombo = 0;
    liteFilters.forEach((obj) => {
      obj.template.filters.forEach((obj1) => {
        if (
          obj1.isTabSelected &&
          !obj1.value &&
          obj1.title !== 'Annual Income' &&
          obj1.title !== 'Individual Age' &&
          obj1.filter_name !== 'Children Age' &&
          obj1.title !== 'Automobile'
        ) {
          flag = 1;
        }
        if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name !== 'Children Age' && !obj1.value) {
          if (!obj1.handler_field_present.value) {
            flagForCombo = 1;
          }
        } else if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name !== 'Children Age') {
          if (obj1.value === 'Any') {
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
        if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name === 'Children Age' && !obj1.value) {
          if (!obj1.handler_field.value) {
            flagForCombo = 1;
          }
        } else if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name === 'Children Age') {
          if (obj1.handler_field.value === 'Yes') {
            if (obj1.value === 'Any') {
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
        if (obj1.title === 'Individual Age' && obj1.isTabSelected) {
          if (obj1.min > obj1.max) {
            flag = 2;
          } else if (!obj1.min && !obj.max) {
            flag = 3;
          }
        }
      });
    });
    if (flagForCombo === 1) {
      const message = 'Please select all values of combination filter!';
      showAckErrorMessage({ message });
      return;
    }
    if (flag === 2) {
      const message = 'minimum value should not be greater than maximum value in individual age filter!';
      showAckErrorMessage({ message });
      return;
    }
    if (flag === 3) {
      const message = 'please select both values of individual age!';
      showAckErrorMessage({ message });
      return;
    }
    if (flag === 1) {
      const message = 'Please select values!';
      showAckErrorMessage({ message });
      return;
    }

    const temp = {};
    liteFilters.forEach((obj) => {
      const temp1 = {};
      obj.template.filters.forEach((filter) => {
        if (filter.isTabSelected && (filter.title === 'Annual Income' || filter.title === 'Estimated Net worth')) {
          const range = [];
          filter.optionsArray.forEach((opt) => {
            for (let i = opt.value[0]; i < opt.value[1]; i++) {
              range.push(i);
            }
          });
          const uniq = [...new Set(range)];
          // console.log(range);
          // console.log(uniq);
          const elements = [];
          if (filter.title === 'Annual Income') {
            uniq.forEach((val) => {
              elements.push(filter.options[val]);
            });
          } else {
            uniq.forEach((val) => {
              elements.push(filter.options[0].values[val]);
            });
          }

          // console.log(elements);
          temp1[filter.filter_name] = elements;
        } else if (
          filter.value &&
          filter.isTabSelected &&
          filter.title !== 'Individual Age' &&
          filter.field_type !== 'combo'
        ) {
          temp1[filter.filter_name] = filter.value;
        } else if (filter.isTabSelected && filter.title === 'Individual Age') {
          const temp3 = { min: filter.min, max: filter.max };
          temp1[filter.filter_name] = temp3;
        } else if (filter.field_type === 'combo' && filter.isTabSelected && filter.filter_name === 'Children Age') {
          const temp4 = {};
          temp4[filter.handler_field.filter_name] = filter.handler_field.value.toLowerCase();
          if (filter.handler_field.value === 'Yes') {
            if (filter.value === 'Any') {
              temp4['required'] = 'no';
              temp4[filter.key_value_map_if_children_present[0].filter_name] = filter.value;
              if (filter.key_value_map_any.value === 'default') {
                temp4['children_details'] = { gender: '' };
              } else {
                temp4['children_details'] = { gender: filter.key_value_map_any.value };
              }
              temp1['children'] = temp4;
            } else {
              temp4['required'] = 'yes';
              temp4[filter.key_value_map_if_children_present[0].filter_name] = filter.value;
              temp4.children_details = [];
              filter.comboFilters.forEach((fill) => {
                const temp3 = {};
                fill.forEach((fillie) => {
                  temp3[fillie.title.slice(0, -2)] = fillie.value;
                });
                temp4.children_details.push(temp3);
              });
              temp1['children'] = temp4;
            }
          } else {
            temp4[filter.key_value_map_if_children_present[0].filter_name] = '';
            temp4['required'] = 'no';
            temp4.children_details = [];
            temp1['children'] = temp4;
          }
        } else if (filter.field_type === 'combo' && filter.isTabSelected && filter.filter_name !== 'Children Age') {
          const temp5 = [];
          const temp7 = {};
          temp7[filter.handler_field_present.filter_name] = filter.handler_field_present.value.toLowerCase();
          if (filter.handler_field_present.value === 'Yes') {
            if (filter.value === 'Any') {
              temp7['number_of_vehicles'] = filter.value.toLowerCase();
              temp7['required'] = 'no';
              const temp6 = {};
              filter.handler_field_any.forEach((fillie) => {
                if (fillie.value === 'Any') {
                  temp6[fillie.filter_name.slice(8)] = '';
                } else {
                  temp6[fillie.filter_name.slice(8)] = fillie.value;
                }
              });
              temp7['vehicle_details'] = temp6;
              temp1[filter.filter_name] = temp7;
            } else {
              temp7['number_of_vehicles'] = filter.value;
              temp7['required'] = 'yes';
              filter.comboFilters.forEach((fill) => {
                const temp6 = {};
                fill.forEach((fillie) => {
                  temp6[fillie.filter_name.slice(8, -2)] = fillie.value;
                });
                temp5.push(temp6);
              });
              temp7['vehicle_details'] = temp5;
              temp1[filter.filter_name] = temp7;
            }
          } else {
            temp7['required'] = 'no';
            temp7['number_of_vehicles'] = '';
            temp7['vehicle_details'] = temp5;
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
    // console.log(toJS(temp));
    if (temp?.Personas?.niches_5_0?.length === 0) {
      delete temp.Personas;
    }
    // console.log(temp);
    if (Object.keys(temp).length === 0) {
      const message = 'Filters cannot be empty!';
      showAckErrorMessage({ message });
      return;
    }
    return temp;
  }
  if (activeFilterTab.value === 1) {
    let flag = 0;
    let flagForCombo = 0;
    completeFilters.forEach((obj) => {
      obj.template.filters.forEach((obj1) => {
        if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name !== 'Children Age' && !obj1.value) {
          if (!obj1.handler_field_present.value) {
            flagForCombo = 1;
          }
        } else if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name !== 'Children Age') {
          if (obj1.value === 'Any') {
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
        } else if (obj1.field_type === 'combo' && obj1.isTabSelected && obj1.filter_name === 'Children Age') {
          if (obj1.handler_field.value === 'Yes') {
            if (obj1.value === 'Any') {
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
        } else if (obj1.isTabSelected && !obj1.value && obj1.title !== 'Individual Age') {
          flag = 1;
        } else if (obj1.title === 'Individual Age' && obj1.isTabSelected) {
          if (obj1.min > obj1.max) {
            flag = 2;
          } else if (!obj1.min && !obj.max) {
            flag = 3;
          }
        }
      });
    });

    if (flag === 2) {
      const message = 'minimum value should not be greater than maximum value in individual age filter!';
      showAckErrorMessage({ message });
      return;
    }
    if (flag === 3) {
      const message = 'please select both values of individual age!';
      showAckErrorMessage({ message });
      return;
    }
    if (flag === 1) {
      const message = 'Please select Values!';
      showAckErrorMessage({ message });
      return;
    }
    if (flagForCombo === 1) {
      const message = 'Please select all values of combination filter!';
      showAckErrorMessage({ message });
      return;
    }

    const temp = {};
    completeFilters.forEach((obj) => {
      const temp1 = {};

      if (obj.name === 'Credit' && obj.isSelected) {
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
        if (filter.isTabSelected && (filter.title === 'Annual Income' || filter.title === 'Estimated Net worth')) {
          const range = [];
          filter.optionsArray.forEach((opt) => {
            for (let i = opt.value[0]; i < opt.value[1]; i++) {
              range.push(i);
            }
          });
          const uniq = [...new Set(range)];
          const elements = [];
          if (filter.title === 'Annual Income') {
            uniq.forEach((val) => {
              elements.push(filter.options[val]);
            });
          } else {
            uniq.forEach((val) => {
              elements.push(filter.options[0].values[val]);
            });
          }
          temp1[filter.filter_name] = elements;
        } else if (filter.field_type === 'combo' && filter.isTabSelected && filter.filter_name === 'Children Age') {
          const temp4 = {};
          temp4[filter.handler_field.filter_name] = filter.handler_field.value.toLowerCase();
          if (filter.handler_field.value === 'Yes') {
            if (filter.value === 'Any') {
              temp4['required'] = 'no';
              temp4[filter.key_value_map_if_children_present[0].filter_name] = filter.value;
              if (filter.key_value_map_any.value === 'default') {
                temp4['children_details'] = { gender: '' };
              } else {
                temp4['children_details'] = { gender: filter.key_value_map_any.value };
              }
              temp1['children'] = temp4;
            } else {
              temp4['required'] = 'yes';
              temp4[filter.key_value_map_if_children_present[0].filter_name] = filter.value;
              temp4.children_details = [];
              filter.comboFilters.forEach((fill) => {
                const temp3 = {};
                fill.forEach((fillie) => {
                  temp3[fillie.title.slice(0, -2)] = fillie.value;
                });
                temp4.children_details.push(temp3);
              });
              temp1['children'] = temp4;
            }
          } else {
            temp4[filter.key_value_map_if_children_present[0].filter_name] = '';
            temp4['required'] = 'no';
            temp4.children_details = [];
            temp1['children'] = temp4;
          }
        } else if (
          filter.value &&
          filter.isTabSelected &&
          filter.field_type !== 'combo' &&
          (filter.title !== 'Annual Income' || filter.title !== 'Estimated Net worth')
        ) {
          temp1[filter.filter_name] = filter.value;
        } else if (filter.title === 'Individual Age' && filter.isTabSelected) {
          const temp3 = { min: filter.min, max: filter.max };
          temp1[filter.filter_name] = temp3;
        } else if (filter.field_type === 'combo' && filter.isTabSelected && filter.filter_name !== 'Children Age') {
          const temp5 = [];
          const temp7 = {};
          temp7[filter.handler_field_present.filter_name] = filter.handler_field_present.value.toLowerCase();
          if (filter.handler_field_present.value === 'Yes') {
            if (filter.value === 'Any') {
              temp7['number_of_vehicles'] = filter.value.toLowerCase();
              temp7['required'] = 'no';
              const temp6 = {};
              filter.handler_field_any.forEach((fillie) => {
                if (fillie.value === 'Any') {
                  temp6[fillie.filter_name.slice(8)] = '';
                } else {
                  temp6[fillie.filter_name.slice(8)] = fillie.value;
                }
              });
              temp7['vehicle_details'] = temp6;
              temp1[filter.filter_name] = temp7;
            } else {
              temp7['number_of_vehicles'] = filter.value;
              temp7['required'] = 'yes';
              filter.comboFilters.forEach((fill) => {
                const temp6 = {};
                fill.forEach((fillie) => {
                  temp6[fillie.filter_name.slice(8, -2)] = fillie.value;
                });
                temp5.push(temp6);
              });
              temp7['vehicle_details'] = temp5;
              temp1[filter.filter_name] = temp7;
            }
          } else {
            temp7['required'] = 'no';
            temp7['number_of_vehicles'] = '';
            temp7['vehicle_details'] = temp5;
            temp1[filter.filter_name] = temp7;
            // console.log(temp1);
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
      const message = 'Filters cannot be empty!';
      showAckErrorMessage({ message });
      return;
    }
    return temp;
  }
  return;
};

export default filterSegmentData;
