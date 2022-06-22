import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../CustomButton';

import ReactPickyFilter from '../ReactPickyFilter';

const AdvSchHeader = (props) => {
  const {
    onUploadNewDeal,
    OnOpenCalenderView,
    advFilterAllData,
    advFilterSelectedData,
    brandFilterAllData,
    brandFilterSelectedData,
    applyFilter,
    onPageRefresh,
    hideUploadDeal,
    isReadonly,
  } = props;

  return (
    <div className="flex-container2 mb10">
      <div className="main-heading">Deals</div>
      <div className="flex-container1">
        <ReactPickyFilter
          allOptions={advFilterAllData}
          selectedData={advFilterSelectedData}
          onFilterChange={applyFilter}
          id="adv_filter"
          selectAllText="Select All Advertisers"
          allSelectedPlaceholder="All Advertisers"
        />
        <ReactPickyFilter
          allOptions={brandFilterAllData}
          selectedData={brandFilterSelectedData}
          onFilterChange={applyFilter}
          id="brand_filter"
          selectAllText="Select All Brands"
          allSelectedPlaceholder="All Brands"
        />

        {!hideUploadDeal ? (
          <CustomButton
            type="primary"
            buttonText="Upload New Deal File"
            buttonClassName="ml10"
            handleButtonClick={onUploadNewDeal}
            isDisabled={isReadonly}
          />
        ) : null}

        <CustomButton
          type="primary"
          buttonText="Calendar View"
          buttonClassName="ml10 mr10"
          handleButtonClick={OnOpenCalenderView}
        />

        <CustomButton type="primary" buttonText="Refresh" buttonClassName="" handleButtonClick={onPageRefresh} />
      </div>
    </div>
  );
};

AdvSchHeader.propTypes = {
  onUploadNewDeal: PropTypes.func,
  OnOpenCalenderView: PropTypes.func,
  advFilterAllData: PropTypes.array,
  advFilterSelectedData: PropTypes.array,
  applyFilter: PropTypes.func,
  brandFilterAllData: PropTypes.array,
  brandFilterSelectedData: PropTypes.array,
  onPageRefresh: PropTypes.func,
  hideUploadDeal: PropTypes.bool,
  isReadonly: PropTypes.bool,
};

AdvSchHeader.defaultProps = {
  onUploadNewDeal: () => {},
  OnOpenCalenderView: () => {},
  advFilterAllData: [],
  advFilterSelectedData: [],
  applyFilter: () => {},
  onPageRefresh: () => {},
  hideUploadDeal: false,
};

export default AdvSchHeader;
