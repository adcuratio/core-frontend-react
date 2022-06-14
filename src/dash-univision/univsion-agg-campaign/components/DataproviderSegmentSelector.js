import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import withStore from '../../../hocs/WithStore';

import { Row, Col, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';

const DataproviderSegmentSelector = inject('aggCampaignStore')(
  observer((props) => {
    const { segmentData, onChangeSegmentData, selectedCompanyId, aggCampaignStore } = props;

    // const segment_obj = {
    //   data_provider: null,
    //   segment_id: null,
    //   household_count: null,
    //   segment_name: null,
    // };

    const onChangeDataprovider = async (value) => {
      const response = await aggCampaignStore.getFilterBasedonDataProvider({
        data_provider: value,
        entity_id: selectedCompanyId,
      });
      sessionStorage.setItem('segmentlist', JSON.stringify(response?.data?.data));
      onChangeSegmentData({ data_provider: value });
    };

    const onChangeSegment = (segVal) => {
      onChangeSegmentData({
        ...segmentData,
        segment_id: segVal?.id,
        household_count: segVal?.household_count || 0,
        segment_name: segVal?.name,
        row_count: segVal?.row_count || 0,
      });
    };

    const handleDataproviderChange = (value) => onChangeDataprovider(value);
    const list = JSON.parse(sessionStorage.getItem('segmentlist'));

    return (
      <>
        <Row>
          <Col md={3} sm={3}>
            <p className="f12">Data Provider</p>
          </Col>
          <Col md={3} sm={3}>
            <div>
              <select
                value={segmentData?.data_provider || ''}
                onChange={(e) => handleDataproviderChange(e.target.value)}
                className="date-picker-length f12"
              >
                <option value="" disabled>
                  Select DataProvider
                </option>
                <option value="live_ramp">LiveRamp</option>
                <option value="audience_request_form">Custom Audience</option>
                <option value="first_party">UCI FirstParty</option>
              </select>
            </div>
          </Col>
        </Row>

        {segmentData?.data_provider ? (
          <>
            <Row className="mt10">
              <Col md={3} sm={3}>
                <p className="f12">Segment Name</p>
              </Col>
              <Col md={3} sm={3}>
                <ButtonToolbar>
                  <DropdownButton
                    className="date-picker-length f12 overflow-hidden"
                    title={segmentData?.segment_name || 'Select Segment'}
                    id={'segment_drop_sel'}
                  >
                    <MenuItem disabled={true}>Select Segment</MenuItem>
                    {list?.map((val) => (
                      <MenuItem
                        className="date-picker-length f12 overflow-hidden"
                        key={val?.id}
                        onSelect={() => onChangeSegment(val)}
                      >
                        {val?.name || '---'}
                      </MenuItem>
                    ))}
                  </DropdownButton>
                </ButtonToolbar>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">Audience Size</p>
              </Col>
              <Col md={3} sm={3}>
                <p className="f12">{segmentData?.row_count ? segmentData?.row_count?.toLocaleString() : '-'}</p>
              </Col>
            </Row>
            <Row></Row>
          </>
        ) : null}
      </>
    );
  })
);

DataproviderSegmentSelector.propTypes = {
  segmentData: PropTypes.object,
  onChangeSegmentData: PropTypes.func,
  selectedCompanyId: PropTypes.any,
};

export default withStore(DataproviderSegmentSelector);
