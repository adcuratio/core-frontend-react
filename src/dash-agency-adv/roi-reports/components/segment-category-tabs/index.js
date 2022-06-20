import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { hasProperty } from '../../../../common/utils';

export const SegmentTabWrapper = styled.div`
  border-bottom: 1px solid;
  border-color: #94969a;
`;

export const SegmentAddCategoryText = styled.span`
  color: #3366cc;
  font-weight: bold;
  font-size: 14px;
  font-family: opensans;
  cursor: pointer;
`;

import './index.css';

const SegmentCategoryTabs = (props) => {
  const { filterData, toggleAvailableCategoryModal, onTabClick, addRemoveCategoryTitle, type } = props;

  const getTabContent = () => {
    if (filterData && filterData.length) {
      const filterComp = [];
      filterData.forEach((filter, index) => {
        let showData = false;
        if (hasProperty(filter, 'isHeadingSelected') && filter.isHeadingSelected) {
          showData = true;
        } else if (hasProperty(filter, 'isSelected') && filter.isSelected) {
          showData = true;
        }
        let isActive = false;
        if (hasProperty(filter, 'isCreditTabSelected') && filter.isCreditTabSelected) {
          isActive = true;
        } else if (hasProperty(filter, 'isTabSelectedToShow') && filter.isTabSelectedToShow) {
          isActive = true;
        }
        if (showData) {
          filterComp.push(
            <li onClick={() => onTabClick(filter)} key={`${type}-${filter.name}-${index}`}>
              <span className={isActive ? 'segments-tab-active' : ''}>{filter.title ? filter.title : filter.name}</span>
            </li>
          );
        }
      });
      filterComp.push(
        <li onClick={toggleAvailableCategoryModal} key={`${type}-add-remove-category`}>
          <SegmentAddCategoryText>{addRemoveCategoryTitle}</SegmentAddCategoryText>
        </li>
      );
      return filterComp;
    }
    return null;
  };

  return (
    <SegmentTabWrapper>
      <ul className="segments-tab user-select-none">{getTabContent()}</ul>
    </SegmentTabWrapper>
  );
};

SegmentCategoryTabs.propTypes = {
  filterData: PropTypes.array,
  toggleAvailableCategoryModal: PropTypes.func,
  addRemoveCategoryTitle: PropTypes.any,
  onTabClick: PropTypes.func,
  type: PropTypes.string.isRequired,
};

SegmentCategoryTabs.defaultProps = {
  filterData: [],
  toggleAvailableCategoryModal: () => {},
  addRemoveCategoryTitle: {},
  onTabClick: () => {},
};

export default SegmentCategoryTabs;
