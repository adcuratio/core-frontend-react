import React from 'react';
import PropTypes from 'prop-types';

import QuickFilterSummary from '../quick-filter-summary';
import CompleteFilterSummary from '../complete-filter-summary';

import './index.css';

const SegmentSummary = (props) => {
  const { activeFilterTab, liteFilters, completeFilters } = props;
  return (
    <div className="segment-summary">
      <h3 className="segment-summary-heading">Summary</h3>
      <div className="segment-summary-content">
        {activeFilterTab && activeFilterTab.value === 0 && <QuickFilterSummary filterData={liteFilters} />}
        {activeFilterTab && activeFilterTab.value === 1 && <CompleteFilterSummary filterData={completeFilters} />}
      </div>
    </div>
  );
};

SegmentSummary.propTypes = {
  activeFilterTab: PropTypes.object,
  liteFilters: PropTypes.array,
  completeFilters: PropTypes.array,
};

SegmentSummary.defaultProps = {
  activeFilterTab: {},
  liteFilters: [],
  completeFilters: [],
};

export default SegmentSummary;
