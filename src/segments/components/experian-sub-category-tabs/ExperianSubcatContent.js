import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AvailableLifeStyleCategoryModal from './AvailableLifestyleCategoryModal';

import { SegmentTabWrapper } from '../segment-category-tabs/index';

import ExperianFilters from '../experian-filter-container/filterContainer';

import { hasProperty } from '../../../common/utils';

import '../segment-category-tabs/index.css';

const ExperianSubCatContent = (props) => {
  const {
    experianFilters,
    activeTabData,
    subCategoryName,
    handleSubCategoryTitleTabChange,
    handleTabChangeFunctionsForExperian,
    handleSelectAllOrNoneFiltersForExperian,
    handleAutoTabFilters,
    handleUserInputFuncForExperian,
  } = props;

  const [showLifestyleModal, setShowLifestyleModal] = useState(false);

  const toggleAvailableFiltersModal = () => {
    setShowLifestyleModal(!showLifestyleModal);
    document.activeElement.blur();
  };

  const getSubCategories = (category) => {
    const subCategory = [];
    if (category.name !== 'Lifestyles') {
      category.template.sub_cat.forEach((filter, index) => {
        subCategory.push(
          <li
            onClick={() => handleSubCategoryTitleTabChange(category, subCategoryName, filter)}
            key={`${'experian_sub'}-${filter.name}-${index}`}
          >
            <span className={filter[`is${category.name}TabSelected`] ? 'segments-tab-active' : ''}>
              {filter.title ? filter.title : filter.name}
            </span>
          </li>
        );
      });
    } else {
      //for lifestyle
      const activeSubCategoryData = activeTabData.template.sub_cat.find(
        (data) => data[`is${activeTabData.name}TabSelected`]
      );
      subCategory.push(
        <li
          onClick={() => handleSubCategoryTitleTabChange(category, subCategoryName, activeSubCategoryData)}
          key={`${'experian_sub_lifestyle'}-${activeSubCategoryData.name}-${category.template.sub_cat.indexOf(
            activeSubCategoryData
          )}`}
        >
          <span className={activeSubCategoryData[`is${category.name}TabSelected`] ? 'segments-tab-active' : ''}>
            {activeSubCategoryData.title ? activeSubCategoryData.title : activeSubCategoryData.name}
          </span>
        </li>
      );
      subCategory.push(
        <li key={`exp_${category.name}_rest_categories`}>
          <div className="add-category-tab">
            <a href="" className="add-filters segement-add-remove-button" onClick={toggleAvailableFiltersModal}>
              +{category.template.sub_cat.length - 1} more
            </a>
          </div>
        </li>
      );
    }

    return subCategory;
  };

  const getAutoSubSubCategories = (auto) => {
    const subSubCategory = [];
    auto.template.sub_cat.forEach((subCat) => {
      if (subCat[`is${auto.name}TabSelected`]) {
        subSubCategory.push(
          <p className="experian-sub-cat-heading-name" key={`${auto.name}`}>
            {subCat.title} Sub Menu:
          </p>
        );
        subCat.sub_cat.forEach((subSubCat, index) => {
          subSubCategory.push(
            <li
              onClick={() => handleSubCategoryTitleTabChange(subCat, 'auto_sub', subSubCat)}
              key={`${'experian_sub_sub'}-${subSubCat.name ? subSubCat.name : subSubCat.title}-${index}`}
            >
              <span className={subSubCat.isAutoSubCategorySelected ? 'segments-tab-active' : ''}>
                {subSubCat.title ? subSubCat.title : subSubCat.name}
              </span>
            </li>
          );
        });
      }
    });
    return subSubCategory;
  };

  const getFilterContent = (activeTabData) => {
    if (activeTabData.name === 'Auto') {
      const activeSubCategoryData = activeTabData.template.sub_cat.find(
        (data) => data[`is${activeTabData.name}TabSelected`]
      );
      const activeSubSubCategoryData = activeSubCategoryData.sub_cat.find((data) => data.isAutoSubCategorySelected);

      return (
        <ExperianFilters
          filtersForExperian={activeSubSubCategoryData}
          activeSubCategoryData={activeSubCategoryData}
          handleTabChangeFunctionsForExperian={handleTabChangeFunctionsForExperian}
          handleSelectAllOrNoneFiltersForExperian={handleSelectAllOrNoneFiltersForExperian}
          type="experian_auto"
          handleAutoTabFilters={handleAutoTabFilters}
          handleUserInputFuncForExperian={handleUserInputFuncForExperian}
        />
      );
    } else if (hasProperty(activeTabData.template, 'sub_cat')) {
      const activeSubCategoryData = activeTabData.template.sub_cat.find(
        (data) => data[`is${activeTabData.name}TabSelected`]
      );
      return (
        <ExperianFilters
          activeSubCategoryData={activeTabData}
          filtersForExperian={activeSubCategoryData}
          handleTabChangeFunctionsForExperian={handleTabChangeFunctionsForExperian}
          handleSelectAllOrNoneFiltersForExperian={handleSelectAllOrNoneFiltersForExperian}
          type="experian_non_auto"
          experianFilters={experianFilters}
          handleUserInputFuncForExperian={handleUserInputFuncForExperian}
        />
      );
    } else {
      return (
        <ExperianFilters
          filtersForExperian={activeTabData}
          handleTabChangeFunctionsForExperian={handleTabChangeFunctionsForExperian}
          handleSelectAllOrNoneFiltersForExperian={handleSelectAllOrNoneFiltersForExperian}
          type="experian_quick"
          experianFilters={experianFilters}
          handleUserInputFuncForExperian={handleUserInputFuncForExperian}
        />
      );
    }
  };

  return (
    <div className="experian-sub-cat-margin">
      {hasProperty(activeTabData.template, 'sub_cat') ? (
        <SegmentTabWrapper>
          <p className="experian-sub-cat-heading-name">{subCategoryName} Sub Menu:</p>
          <ul className="segments-tab display-inline">{getSubCategories(activeTabData)}</ul>
          <AvailableLifeStyleCategoryModal
            showModal={showLifestyleModal}
            toggleModal={toggleAvailableFiltersModal}
            filterData={activeTabData}
            subCategoryName={subCategoryName}
            handleTabChangeFunc={handleSubCategoryTitleTabChange}
          />
        </SegmentTabWrapper>
      ) : (
        <div></div>
      )}
      {subCategoryName === 'Auto' && (
        <SegmentTabWrapper>
          <ul className="segments-tab experian-sub-cat-margin">{getAutoSubSubCategories(activeTabData)}</ul>
        </SegmentTabWrapper>
      )}
      {getFilterContent(activeTabData)}
    </div>
  );
};

ExperianSubCatContent.propTypes = {
  experianFilters: PropTypes.array,
  activeTabData: PropTypes.object,
  subCategoryName: PropTypes.string,
  handleSubCategoryTitleTabChange: PropTypes.func,
  handleTabChangeFunctionsForExperian: PropTypes.func,
  handleSelectAllOrNoneFiltersForExperian: PropTypes.func,
  handleAutoTabFilters: PropTypes.func,
  handleUserInputFuncForExperian: PropTypes.func,
};

export default ExperianSubCatContent;
