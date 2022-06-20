import React from 'react';
import PropTypes from 'prop-types';

import QuickFilterSummary from '../quick-filter-summary';
import CompleteFilterSummary from '../complete-filter-summary';

import './index.css';

const SegmentSummary = (props) => {
  const { onSegmentDataChange, activeFilterTab, liteFilters, completeFilters, experianFilters } = props;
  return (
    <div className="segment-summary segment-summary-height">
      <h3 className="segment-summary-heading">Segment Summary</h3>
      <div className="segment-summary-content">
        <div className="mt10">
          <p className="form-title">Segment Name</p>
          <input type="text" name="name" placeholder="Enter a Name" onChange={(e) => onSegmentDataChange(e, 'name')} />
        </div>
        <div className="mt10">
          <p className="form-title">Segment Description</p>
          <textarea
            rows="2"
            cols="50"
            placeholder="Enter a description"
            onChange={(e) => onSegmentDataChange(e, 'description')}
          ></textarea>
        </div>
        {activeFilterTab && activeFilterTab.value === 0 && <QuickFilterSummary filterData={liteFilters} />}
        {activeFilterTab && activeFilterTab.value === 1 && <CompleteFilterSummary filterData={completeFilters} />}

        {activeFilterTab && activeFilterTab.value === 3 && <CompleteFilterSummary filterData={experianFilters} />}
      </div>
    </div>
  );
};

SegmentSummary.propTypes = {
  onSegmentDataChange: PropTypes.func,
  activeFilterTab: PropTypes.object,
  liteFilters: PropTypes.array,
  completeFilters: PropTypes.array,
  experianFilters: PropTypes.array,
};

SegmentSummary.defaultProps = {
  onSegmentDataChange: () => {},
  activeFilterTab: {},
  liteFilters: [],
  completeFilters: [],
  experianFilters: [],
};

export default SegmentSummary;
