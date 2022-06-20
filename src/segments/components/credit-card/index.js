import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AvailableCategoriesModal from '../available-categories-modal';
import SegmentCategoryTabs from '../segment-category-tabs';
import CreditCardContent from '../credit-card-content';

const CreditCard = (props) => {
  const {
    credit,
    handleTabChangeFunc,
    handleUserInputFunc,
    handleSelectAllOrNoneFunc,
    handleSelectAllForCategories,
    handleAddRemoveFunc,
    handleTitleTabChangeForCredit,
  } = props;

  const [showAvailableCategoryModal, setShowAvailableCategoryModal] = useState(false);

  const toggleAvailableCategoryModal = () => {
    setShowAvailableCategoryModal(!showAvailableCategoryModal);
  };

  const getFilterData = () => {
    const activeData = credit.template.sub_cat.find((data) => data.isCreditTabSelected);
    return (
      <CreditCardContent
        filtersForCredit={activeData}
        handleTabChangeFunc={handleTabChangeFunc}
        handleUserInputFunc={handleUserInputFunc}
        handleSelectAllOrNoneFunc={handleSelectAllOrNoneFunc}
      />
    );
  };

  const onTabClick = (filter) => {
    handleTitleTabChangeForCredit(filter);
  };

  return (
    <div className="form-wrap">
      <SegmentCategoryTabs
        filterData={credit.template.sub_cat}
        toggleAvailableCategoryModal={toggleAvailableCategoryModal}
        onTabClick={onTabClick}
        addRemoveCategoryTitle="Add/Remove Credit Category"
        type={'credit-card'}
      />
      <div>{getFilterData()}</div>
      <AvailableCategoriesModal
        showModal={showAvailableCategoryModal}
        toggleModal={toggleAvailableCategoryModal}
        handleButtonAction={handleSelectAllForCategories}
        filterData={credit.template.sub_cat}
        handleCheckboxChange={(data) => handleAddRemoveFunc(data, 'credit')}
        type="credit"
      />
    </div>
  );
};

CreditCard.propTypes = {
  credit: PropTypes.object,
  handleTabChangeFunc: PropTypes.func,
  handleUserInputFunc: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
  handleSelectAllForCategories: PropTypes.func,
  handleAddRemoveFunc: PropTypes.func,
  handleTitleTabChangeForCredit: PropTypes.func,
};

CreditCard.defaultProps = {
  credit: {},
  handleTabChangeFunc: () => {},
  handleUserInputFunc: () => {},
  handleSelectAllOrNoneFunc: () => {},
  handleSelectAllForCategories: () => {},
  handleAddRemoveFunc: () => {},
  handleTitleTabChangeForCredit: () => {},
};

export default CreditCard;
