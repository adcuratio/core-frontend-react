import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CustomButton from '../../components/CustomButton';
import { getFilterJSONText } from './FilterJSONText';

const filterJSONData = (props) => {
  const { segmentData } = props;
  return (
    <OverlayTrigger
      trigger={['hover', 'focus']}
      rootClose
      placement="left"
      placementforTooltip={props.placementforTooltip}
      overlay={
        <Popover id="popover-positioned-scrolling-left" className="segments-card-json-tooltip" title={segmentData.name}>
          <p className="mb10">Description: {segmentData.description}</p>
          {getFilterJSONText(segmentData.filter_json)}
        </Popover>
      }
    >
      <div>
        <CustomButton type="button_blue" buttonText="Know more" buttonClassName="" />
      </div>
    </OverlayTrigger>
  );
};

filterJSONData.propTypes = {
  segmentData: PropTypes.object,
  placementforTooltip: PropTypes.any,
};
export default filterJSONData;
