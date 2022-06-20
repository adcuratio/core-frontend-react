import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AvailableCategoriesModal from '../available-categories-modal/index';
import SegmentCategoryTabs from '../segment-category-tabs';
import ExperianSubCatContent from '../experian-sub-category-tabs/ExperianSubcatContent';

const ExperianFilterContent = (props) => {
  const {
    experianFilters,
    handleTitleTabChangeForExperian,
    handleSubCategoryTitleTabChange,
    handleAddRemoveCategoryForExperianFunc,
    handleSelectAllOrNoneForExperianFunc,
    handleTabChangeFunctionsForExperian,
    handleSelectAllOrNoneFiltersForExperian,
    handleAutoTabFilters,
    handleUserInputFuncForExperian,
  } = props;

  const [showAvailableCategoryModal, setShowAvailableCategoryModal] = useState(false);

  const toggleAvailableCategoryModal = () => {
    setShowAvailableCategoryModal(!showAvailableCategoryModal);
  };

  const onTabClick = (data) => {
    handleTitleTabChangeForExperian(data);
  };

  const getSubCategoryContent = () => {
    const activeTab = experianFilters.find((exp) => exp.isTabSelectedToShow && exp.isSelected);
    const activeTabData = experianFilters.filter((exp) => exp.isTabSelectedToShow && exp.isSelected);
    if (activeTab) {
      return (
        <ExperianSubCatContent
          experianFilters={experianFilters}
          activeTabData={activeTabData[0]}
          subCategoryName={activeTabData[0].name}
          handleSubCategoryTitleTabChange={handleSubCategoryTitleTabChange}
          handleTabChangeFunctionsForExperian={handleTabChangeFunctionsForExperian}
          handleSelectAllOrNoneFiltersForExperian={handleSelectAllOrNoneFiltersForExperian}
          handleAutoTabFilters={handleAutoTabFilters}
          handleUserInputFuncForExperian={handleUserInputFuncForExperian}
        />
      );
    }
  };

  return (
    <div>
      <SegmentCategoryTabs
        filterData={experianFilters}
        toggleAvailableCategoryModal={toggleAvailableCategoryModal}
        onTabClick={onTabClick}
        addRemoveCategoryTitle="Add/Remove Category"
        type={'experian-filter'}
      />
      <div>{getSubCategoryContent()}</div>
      <AvailableCategoriesModal
        showModal={showAvailableCategoryModal}
        toggleModal={toggleAvailableCategoryModal}
        handleButtonAction={handleSelectAllOrNoneForExperianFunc}
        filterData={experianFilters}
        handleCheckboxChange={(data) => handleAddRemoveCategoryForExperianFunc(data, 'exp')}
        type="exp"
      />
    </div>
  );
};

ExperianFilterContent.propTypes = {
  experianFilters: PropTypes.array,
  handleTitleTabChangeForExperian: PropTypes.func,
  handleSubCategoryTitleTabChange: PropTypes.func,
  handleAddRemoveCategoryForExperianFunc: PropTypes.func,
  handleSelectAllOrNoneForExperianFunc: PropTypes.func,
  handleTabChangeFunctionsForExperian: PropTypes.func,
  handleSelectAllOrNoneFiltersForExperian: PropTypes.func,
  handleAutoTabFilters: PropTypes.func,
  handleUserInputFuncForExperian: PropTypes.func,
};

export default ExperianFilterContent;
