import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import { hasProperty } from '../../../common/utils';

const CompleteFilterSummary = (props) => {
  const { filterData } = props;
  return (
    <div className="segment-summary-container-height">
      {filterData.map((obj) => {
        if (obj.isSelected) {
          if (obj.name !== 'Credit' && !hasProperty(obj.template, 'sub_cat')) {
            return (
              <div className="form-row" key={obj.name}>
                <p className="form-title">{obj.name}</p>
                <div>
                  {obj.template.filters.map((filter, index) => {
                    const filterKey = filter.filter_name + index;
                    if (filter.isTabSelected && filter.field_type === 'combo') {
                      return (
                        <div key={filterKey}>
                          {filter.handler_field.title !== 'Number of Vehicles' && (
                            <p className="mt5">
                              {filter.handler_field.title} :
                              <span className="ml10">{filter.handler_field.value || filter.value}</span>
                            </p>
                          )}
                          {filter.handler_field.value === 'Yes' && (
                            <p className="mt5">
                              {filter.key_value_map_if_children_present[0].title} :
                              <span className="ml10">{filter.value}</span>
                            </p>
                          )}
                          {filter.handler_field.value === 'Yes' &&
                            filter.value === 'Any' &&
                            filter.filter_name === 'Children Age' && (
                              <p>
                                {filter.key_value_map_any.title} :{' '}
                                <span className="ml10">{filter.key_value_map_any.value}</span>
                              </p>
                            )}
                          {filter.handler_field.title === 'Number of Vehicles' && (
                            <p>
                              {' '}
                              {filter.handler_field_present.title} :
                              <span className="ml10">{filter.handler_field_present.value || filter.value}</span>
                            </p>
                          )}
                          {hasProperty(filter, 'handler_field_present') &&
                            filter.handler_field_present.value === 'Yes' && (
                              <p className="mt5">
                                {filter.handler_field.title} :
                                <span className="ml10">{filter.handler_field.value || filter.value}</span>
                              </p>
                            )}
                          {hasProperty(filter, 'handler_field_present') &&
                            filter.handler_field_present.value === 'Yes' &&
                            filter.value === 'Any' &&
                            filter.filter_name === 'vehicle' &&
                            filter.handler_field_any.map((fil) => (
                              <p key={fil.filter_name}>
                                <span>
                                  {fil.title} : <span>{fil.value}</span>
                                </span>
                              </p>
                            ))}
                          {filter.value !== 'Any' &&
                            filter.handler_field.value === 'Yes' &&
                            filter.comboFilters.map((fil) => (
                              <div key={filter.comboFilters.indexOf(fil)}>
                                {fil.map((fill) => (
                                  <div key={fill.title}>
                                    {fill.title.slice(0, -1)} :&nbsp;&nbsp;&nbsp;
                                    <span>
                                      {fill.title.slice(0, -2) === 'age' && `${fill.value[0]} to ${fill.value[1]}`}
                                    </span>
                                    <span>{fill.title.slice(0, -2) === 'gender' && fill.value}</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          {filter.value !== 'Any' &&
                            hasProperty(filter, 'handler_field_present') &&
                            filter.handler_field_present.value === 'Yes' &&
                            filter.comboFilters.map((fil, index) => (
                              <div key={filter.comboFilters.indexOf(fil)}>
                                <p>{filter.filter_name === 'vehicle' && `Vehicle ${index + 1}`}</p>
                                {fil.map((fill) => (
                                  <div key={fill.title}>
                                    {fill.title.split(' ')?.[1] || fill.title} :&nbsp;&nbsp;&nbsp;
                                    <span>{fill.value}</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      );
                    } else if (
                      filter.isTabSelected &&
                      (filter.title === 'Annual Income' || filter.title === 'Estimated Net worth')
                    ) {
                      return (
                        <p key={filterKey}>
                          {filter.title} :
                          <span className="ml10">
                            {filter.optionsArray.map((opt, idx) => (
                              <span key={idx}>
                                {`${opt.summaryOpt[opt.value[0]]} to ${opt.summaryOpt[opt.value[1]]}, `}
                              </span>
                            ))}
                          </span>
                        </p>
                      );
                    } else if (
                      (filter.isTabSelected || filter.isFilterSelected) &&
                      filter.field_type !== 'combo' &&
                      !hasProperty(filter, 'min')
                    ) {
                      return (
                        <div key={filterKey}>
                          {filter.title} :&nbsp;&nbsp;&nbsp;
                          <span>{Array.isArray(filter.value) ? filter.value?.join(', ') : filter.value}</span>
                        </div>
                      );
                    } else if (filter.isTabSelected && filter.field_type !== 'combo' && hasProperty(filter, 'min')) {
                      return (
                        <div key={filterKey}>
                          {filter.title} :&nbsp;&nbsp;&nbsp;
                          <div>
                            min :&nbsp;&nbsp;&nbsp;<span>{filter.min}</span>
                            &nbsp;&nbsp;&nbsp; max :&nbsp;&nbsp;&nbsp;
                            <span>{filter.max}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          } else if (hasProperty(obj.template, 'sub_cat') && obj.name !== 'Auto') {
            return (
              <div key={`complete-${obj.name}-summary`} className="">
                <div className="form-row" key={obj.name}>
                  <p className="form-title">{obj.name}</p>
                  {obj.template.sub_cat.map((subCat) => {
                    if (subCat.isHeadingSelected || subCat[`is${obj.name}HeadingSelected`]) {
                      return (
                        <div key={subCat.title} className="form-row">
                          <p className="form-title">{subCat.title}</p>
                          {subCat.filters.map((sub) => {
                            if (sub.isFilterSelected) {
                              return (
                                <div key={sub.filter_name}>
                                  <div>
                                    {sub.title === 'Age' && (
                                      <span>
                                        {sub.title} :&nbsp;&nbsp;{sub.summary}
                                      </span>
                                    )}
                                    {sub.title !== 'Age' && (
                                      <span>
                                        {sub.title} :&nbsp;&nbsp;{sub.value}
                                      </span>
                                    )}
                                  </div>
                                  {sub.options.map((op) => {
                                    if (op.isValueSelected) {
                                      return (
                                        <span key={op.val}>
                                          <span>{op.val}, &nbsp;</span>
                                        </span>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          } else if (obj.name === 'Auto') {
            return (
              <div key={`complete-${obj.name}-summary`} className="">
                <div className="form-row" key={obj.name}>
                  <p className="form-title">{obj.name}</p>
                  {obj.template.sub_cat.map((subCat) => {
                    if (subCat[`is${obj.name}HeadingSelected`]) {
                      return (
                        <div key={subCat.title} className="form-row">
                          <p className="form-title">{subCat.title}</p>
                          {subCat.sub_cat.map((subSubCat) => {
                            if (subSubCat.isAutoSubCategoryHeadingSelected) {
                              return (
                                <div key={subSubCat.title} className="form-row">
                                  <p className="form-title">{subSubCat.title}</p>
                                  {subSubCat.filters.map((sub) => {
                                    if (sub.isFilterSelected) {
                                      return (
                                        <div key={sub.filter_name}>
                                          <div>
                                            {sub.title} :&nbsp;&nbsp;{sub.value}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          }
        }
        return null;
      })}
    </div>
  );
};

CompleteFilterSummary.propTypes = {
  filterData: PropTypes.array,
};

CompleteFilterSummary.defaultProps = {
  filterData: [],
};

export default CompleteFilterSummary;
