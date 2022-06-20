import React from 'react';
import PropTypes from 'prop-types';
import { hasProperty } from '../../../common/utils';

const ArrayCheckboxContainer = (props) => {
  const { arrayData, handleCheckboxChange, type } = props;

  return arrayData?.map((data, index) => {
    let isSelected;
    if (hasProperty(data, 'isTabSelected')) {
      isSelected = data.isTabSelected;
    } else if (hasProperty(data, 'isHeadingSelected')) {
      isSelected = data.isHeadingSelected;
    } else if (hasProperty(data, 'isFilterSelected')) {
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
