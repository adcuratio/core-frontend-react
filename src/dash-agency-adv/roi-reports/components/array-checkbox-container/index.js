/* eslint-disable no-prototype-builtins */

import React from 'react';
import PropTypes from 'prop-types';

const ArrayCheckboxContainer = (props) => {
  const { arrayData, handleCheckboxChange, type } = props;

  return arrayData?.map((data, index) => {
    let isSelected;
    if (data.hasOwnProperty('isTabSelected')) {
      isSelected = data.isTabSelected;
    } else if (data.hasOwnProperty('isHeadingSelected')) {
      isSelected = data.isHeadingSelected;
    } else if (data.hasOwnProperty('isFilterSelected')) {
      isSelected = data.isFilterSelected;
    } else {
      isSelected = data.isSelected;
    }

    return (
      <label key={`${type}-${data.filter_name}-${index}`} className="checkbox-container mr10 mb10">
        {data.name ? data.name : data.title ? data.title : data.filter_name || 'Number of Vehicles'}
        <input type="checkbox" checked={isSelected} onChange={() => handleCheckboxChange(data)} />
        <span className="checkmark"></span>
      </label>
    );
  });
};

ArrayCheckboxContainer.propTypes = {
  arrayData: PropTypes.array,
  handleCheckboxChange: PropTypes.func,
  type: PropTypes.string,
};

ArrayCheckboxContainer.defaultProps = {
  arrayData: [],
  handleCheckboxChange: () => {},
};

export default ArrayCheckboxContainer;
