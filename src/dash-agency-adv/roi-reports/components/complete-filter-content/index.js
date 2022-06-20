import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AvailableCategoriesModal from '../available-categories-modal';
import SegmentCategoryTabs from '../segment-category-tabs';
import FilterContainer from '../../containers/filter-container';

const CompleteFilters = (props) => {
  const {
    completeFilters,
    handleTabChangeFunc,
    handleSelectAllOrNoneFunc,
    handleAddRemoveFunc,
    handleTitleTabChangeForCredit,
    handleUserInputFunc,
    handleSelectAllForCategories,
    handleTitleTabChangeForComplete,
  } = props;

  const [showAvailableCategoryModal, setShowAvailableCategoryModal] = useState(false);

  const toggleAvailableCategoryModal = () => {
    setShowAvailableCategoryModal(!showAvailableCategoryModal);
  };

  const onTabClick = (data) => {
    handleTitleTabChangeForComplete(data);
  };

  const getFilterContainer = () => {
    const activeLite = completeFilters.find((data) => data.isTabSelectedToShow && data.isSelected);
    if (activeLite) {
      return (
        <FilterContainer
          allFilters={completeFilters}
          lite={activeLite}
          handleTabChangeFunc={handleTabChangeFunc}
          handleUserInputFunc={handleUserInputFunc}
          handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
          handleAddRemoveFunc={handleAddRemoveFunc}
          handleTitleTabChangeForCredit={handleTitleTabChangeForCredit}
          handleSelectAllForCategories={handleSelectAllForCategories}
          type={'complete'}
        />
      );
    }
  };

  return (
    <div>
      <p className="mb10">
        <span className="icon-color">*</span>
        Additional charges will be applicable.
      </p>
      <SegmentCategoryTabs
        filterData={completeFilters}
        toggleAvailableCategoryModal={toggleAvailableCategoryModal}
        onTabClick={onTabClick}
        addRemoveCategoryTitle="Add/Remove Category"
        type={'complete-filter'}
      />

      <div>{getFilterContainer()}</div>

      <AvailableCategoriesModal
        showModal={showAvailableCategoryModal}
        toggleModal={toggleAvailableCategoryModal}
        handleButtonAction={handleSelectAllForCategories}
        filterData={completeFilters}
        handleCheckboxChange={(data) => handleAddRemoveFunc(data, 'non_credit')}
        type="comp"
      />
    </div>
  );
};

CompleteFilters.propTypes = {
  completeFilters: PropTypes.array,
  handleAddRemoveFunc: PropTypes.func,
  handleTabChangeFunc: PropTypes.func,
  handleTitleTabChangeForComplete: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
  handleTitleTabChangeForCredit: PropTypes.func,
  handleUserInputFunc: PropTypes.func,
  handleSelectAllForCategories: PropTypes.func,
};
export default CompleteFilters;
