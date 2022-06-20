import React from 'react';
import PropTypes from 'prop-types';

import './index.css';
import { hasProperty } from '../../../common/utils';

const QuickFilterSummary = (props) => {
  const { filterData } = props;

  const getFilterResult = (templateFilters) => {
    if (templateFilters && templateFilters.length) {
      const templateFilterContent = [];
      templateFilters.forEach((filter, index) => {
        const filterKey = filter.filter_name + index;
        if (filter.isTabSelected && (filter.title === 'Annual Income' || filter.title === 'Estimated Net worth')) {
          templateFilterContent.push(
            <p key={filterKey}>
              {filter.title} :
              <span className="ml10">
                {filter.optionsArray.map((opt, idx) => (
                  <span key={idx}>{`${opt.summaryOpt[opt.value[0]]} to ${opt.summaryOpt[opt.value[1]]}, `}</span>
                ))}
              </span>
            </p>
          );
        } else if (filter.isTabSelected && !hasProperty(filter, 'min') && filter.field_type !== 'combo') {
          templateFilterContent.push(
            <div className="mt5" key={filterKey}>
              {filter.title === 'Personas' && filter.value.length !== 0 && (
                <p>
                  {filter.title}: <span className="ml10">{`${filter.value} `}</span>
                </p>
              )}
              {filter.title !== 'Personas' && (
                <p>
                  {filter.title}: <span className="ml10">{`${filter.value} `}</span>
                </p>
              )}
            </div>
          );
        } else if (filter.isTabSelected && filter.field_type === 'combo') {
          templateFilterContent.push(
            <div key={filterKey}>
              {filter.handler_field.title !== 'Number of Vehicles' && (
                <p className="mt5">
                  {filter.handler_field.title} :
                  <span className="ml10">{filter.handler_field.value || filter.value}</span>
                </p>
              )}
              {filter.handler_field.value === 'Yes' && (
                <p className="mt5">
                  {filter.key_value_map_if_children_present[0].title} :<span className="ml10">{filter.value}</span>
                </p>
              )}
              {filter.handler_field.value === 'Yes' && filter.value === 'Any' && filter.filter_name === 'Children Age' && (
                <p>
                  {filter.key_value_map_any.title} : <span className="ml10">{filter.key_value_map_any.value}</span>
                </p>
              )}
              {filter.handler_field.title === 'Number of Vehicles' && (
                <p>
                  {' '}
                  {filter.handler_field_present.title} :
                  <span className="ml10">{filter.handler_field_present.value || filter.value}</span>
                </p>
              )}
              {hasProperty(filter, 'handler_field_present') && filter.handler_field_present.value === 'Yes' && (
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
                        <span>{fill.title.slice(0, -2) === 'age' && `${fill.value[0]} to ${fill.value[1]}`}</span>
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
                        {fill.title.split(' ')?.[1] || fill.title} :
                        <span>
                          {'   '}
                          {fill.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          );
        } else if (filter.isTabSelected && hasProperty(filter, 'min')) {
          templateFilterContent.push(
            <p className="mt5" key={filterKey}>
              {filter.title} :
              <span className="ml10">
                min :<span className="ml10">{filter.min}</span>
              </span>
              <span className="ml10">
                max :<span className="ml10">{filter.max}</span>
              </span>
            </p>
          );
        }
      });
      return templateFilterContent;
    }
    return null;
  };

  const getFilterData = () => {
    if (filterData && filterData.length) {
      const selectedFilteredData = filterData.filter((data) => data.isSelected);
      if (selectedFilteredData && selectedFilteredData.length) {
        const filterDataComp = [];
        selectedFilteredData.forEach((data) => {
          filterDataComp.push(
            <div key={data.name} className="mb10">
              <p className="quick-filter-summary-heading">{data.name}</p>
              {getFilterResult(data.template.filters)}
            </div>
          );
        });
        return <div className="quick-filter-summary">{filterDataComp}</div>;
      }
    }
    return null;
  };

  return <div className="segment-summary-container-height">{getFilterData()}</div>;
};

QuickFilterSummary.propTypes = {
  filterData: PropTypes.array,
};

QuickFilterSummary.defaultProps = {
  filterData: [],
};

export default QuickFilterSummary;
