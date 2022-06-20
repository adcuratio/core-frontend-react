import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FilterContainer from '../../containers/filter-container';
import SegmentCategoryTabs from '../segment-category-tabs';
import AvailableCategoriesModal from '../available-categories-modal';

const QuickFilterContent = (props) => {
  const {
    liteFilters,
    handleTabChangeFunc,
    handleSelectAllOrNoneFunc,
    handleTitleTabChange,
    handleSelectAllForCategories,
    handleUserInputFunc,
    handleAddRemoveFunc,
  } = props;

  const [showAvailableCategoryModal, setShowAvailableCategoryModal] = useState(false);

  const toggleAvailableCategoryModal = () => {
    setShowAvailableCategoryModal(!showAvailableCategoryModal);
  };

  const onTabClick = (data) => {
    handleTitleTabChange(data);
  };

  const getFilterContainer = () => {
    const activeLite = liteFilters.find((data) => data.isTabSelectedToShow && data.isSelected);
    if (activeLite) {
      return (
        <FilterContainer
          allFilters={liteFilters}
          lite={activeLite}
          handleTabChangeFunc={handleTabChangeFunc}
          handleUserInputFunc={handleUserInputFunc}
          handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
          type={'lite'}
        />
      );
    }
  };

  return (
    <div>
      <SegmentCategoryTabs
        filterData={liteFilters}
        toggleAvailableCategoryModal={toggleAvailableCategoryModal}
        onTabClick={onTabClick}
        addRemoveCategoryTitle="Add/Remove Category"
        type={'quick-filter'}
      />

      <div className="scrollable">{getFilterContainer()}</div>
      <AvailableCategoriesModal
        showModal={showAvailableCategoryModal}
        toggleModal={toggleAvailableCategoryModal}
        handleButtonAction={handleSelectAllForCategories}
        filterData={liteFilters}
        handleCheckboxChange={(data) => handleAddRemoveFunc(data, 'non_credit')}
        type="lite"
      />
    </div>
  );
};

QuickFilterContent.propTypes = {
  liteFilters: PropTypes.array,
  handleAddRemoveFunc: PropTypes.func,
  handleTabChangeFunc: PropTypes.func,
  handleTitleTabChange: PropTypes.func,
  handleUserInputFunc: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
  handleSelectAllForCategories: PropTypes.func,
};

export default QuickFilterContent;
