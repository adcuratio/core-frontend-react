import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, Row, Col, OverlayTrigger } from 'react-bootstrap';
import { desiredImpressionTooltip } from './tool-tips';

const DesiredImpressionCpmSelector = (props) => {
  const { desiredImpressions, onChangeDesiredImpressions, cpm, onChamgeCpm } = props;

  return (
    <Row>
      <Col md={3} sm={3}>
        <p className="f12">
          Desired Impressions for Campaign
          <OverlayTrigger placement="right" overlay={desiredImpressionTooltip}>
            <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
          </OverlayTrigger>
        </p>
      </Col>
      <Col md={3} sm={3}>
        <FormControl
          type="number"
          min={1}
          placeholder="Enter Impressions"
          value={desiredImpressions || ''}
          onChange={(e) => onChangeDesiredImpressions(e.target.value)}
          style={{ width: '200px', height: '30px' }}
        />
      </Col>
      <Col md={3} sm={3}>
        <p className="f12">CPM</p>
      </Col>
      <Col md={3} sm={3}>
        <FormControl
          type="number"
          min={1}
          placeholder="Enter CPM"
          value={cpm || ''}
          onChange={(e) => onChamgeCpm(e.target.value)}
          style={{ width: '200px', height: '30px' }}
        />
      </Col>
    </Row>
  );
};

DesiredImpressionCpmSelector.propTypes = {
  desiredImpressions: PropTypes.any,
  onChangeDesiredImpressions: PropTypes.func,
  cpm: PropTypes.any,
  onChamgeCpm: PropTypes.func,
};

export default DesiredImpressionCpmSelector;
