import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import './index.css';

const SegmentFilterTabs = (props) => {
  const { segmentFilterTabData, activeFilterTab, onFilterTabChange } = props;

  const getSegmentTabs = () => {
    if (segmentFilterTabData && segmentFilterTabData.length) {
      const filterTabComp = [];
      segmentFilterTabData.forEach((data) => {
        filterTabComp.push(
          <p
            key={data.id}
            className={
              activeFilterTab.id === data.id
                ? 'segment-filter-tab-item segment-filter-tab-item-active'
                : 'segment-filter-tab-item'
            }
            onClick={() => onFilterTabChange(data)}
          >
            {data.name}&nbsp;
            {data.tooltipText && (
              <OverlayTrigger placement="top" overlay={<Tooltip id={data.id}>{data.tooltipText}</Tooltip>}>
                <i className="glyphicon glyphicon-info-sign" aria-hidden="true" />
              </OverlayTrigger>
            )}
          </p>
        );
      });
      return filterTabComp;
    }
    return null;
  };

  return <div className="segment-filter-tab-wrapper mt20 mb20">{getSegmentTabs()}</div>;
};

SegmentFilterTabs.propTypes = {
  segmentFilterTabData: PropTypes.array,
  activeFilterTab: PropTypes.object,
  onFilterTabChange: PropTypes.func,
};

SegmentFilterTabs.defaultProps = {
  segmentFilterTabData: [],
  activeFilterTab: {},
  onFilterTabChange: () => {},
};

export default SegmentFilterTabs;
