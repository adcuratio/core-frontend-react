import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, Row, Col } from 'react-bootstrap';

const FrequencyCapMaxViewSelector = (props) => {
  const { viewsData, onChangeViewsData } = props;

  // const maximum_viewings_obj = {
  //   period: null,
  //   count: null,
  // };

  const onChangeViews = (key, value) => {
    onChangeViewsData({
      ...viewsData,
      [key]: value,
    });
  };

  return (
    <Row className="mt10">
      <Col md={3} sm={3}>
        <p className="f12">Frequency Cap/Mimimum Viewings</p>
      </Col>
      <Col md={3} sm={3}>
        <span style={{ fontSize: '12px', opacity: '0.8', fontWeight: '200' }}>
          Period:
          <br />
        </span>
        <select
          value={viewsData?.period || ''}
          onChange={(e) => onChangeViews('period', e.target.value)}
          className="company-feedback-input date-picker-length f12"
        >
          <option value="" disabled>
            Select Frequency Cap
          </option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="PerFlight">Per flight</option>
        </select>
      </Col>
      <Col md={3} sm={3}></Col>
      <Col md={3} sm={3}>
        <span style={{ fontSize: '12px', opacity: '0.8', fontWeight: '200' }}>
          Count:
          <br />
        </span>
        <FormControl
          style={{ width: '200px', height: '30px' }}
          type="number"
          min="1"
          placeholder="Enter Value"
          value={viewsData?.count || ''}
          onChange={(e) => onChangeViews('count', e.target.value * 1)}
        />
      </Col>
    </Row>
  );
};

FrequencyCapMaxViewSelector.propTypes = {
  viewsData: PropTypes.object,
  onChangeViewsData: PropTypes.func,
};

export default FrequencyCapMaxViewSelector;
