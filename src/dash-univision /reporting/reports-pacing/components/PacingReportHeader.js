import React from 'react';
import PropTypes from 'prop-types';

import ReactPickyFilter from '../../../../components/ReactPickyFilter';

const PacingReportHeader = (props) => {
  const { advFilterAllData, advFilterSelectedData, applyFilter, campaignFilterData, campaignFilterSelectedData } =
    props;

  return (
    <div>
      <div className="flex-container2">
        <p className="main-heading">Pacing Reports</p>
        <div className="flex-container1 ml10">
          <ReactPickyFilter
            allOptions={advFilterAllData}
            selectedData={advFilterSelectedData}
            onFilterChange={applyFilter}
            id="adv_filter"
            selectAllText="Select All Advertisers"
            allSelectedPlaceholder="All Advertisers"
          />
          <ReactPickyFilter
            allOptions={campaignFilterData}
            selectedData={campaignFilterSelectedData}
            onFilterChange={applyFilter}
            id="campaign_filter"
            selectAllText="Select All Campaigns"
            allSelectedPlaceholder="All Campaigns"
          />
        </div>
      </div>
    </div>
  );
};

PacingReportHeader.propTypes = {
  advFilterAllData: PropTypes.array,
  advFilterSelectedData: PropTypes.array,
  applyFilter: PropTypes.func,
  campaignFilterData: PropTypes.array,
  campaignFilterSelectedData: PropTypes.array,
};

PacingReportHeader.defaultProps = {
  applyFilter: () => {},
  advFilterAllData: [],
  advFilterSelectedData: [],
  campaignFilterData: [],
  campaignFilterSelectedData: [],
};

export default PacingReportHeader;
