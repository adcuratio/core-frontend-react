import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Col, Grid, Row } from 'react-bootstrap';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';
import { formatNumber } from '../../../common/utils';

const StyledCard = styled.div`
  .mn-view-trade-width {
    width: 100% !important;
  }
  .mn-manage-campaign-card {
    font-weight: bold;
    font-size: 16px;
  }
  .mn-manage-campaign-card-desc {
    font-weight: 400 !important;
  }
`;

const StyledModalBody = styled.div`
  .mn-modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
  .mn-mg-data {
    background-color: #f9f9f9;
  }
  .mn-table-margin {
    margin-bottom: 0px !important;
  }
`;

const ViewTradesModal = (props) => {
  const { showModal, closeModal, viewTrades, upgradedAdspot, segmentData, orderLineDetails } = props;

  const Card = (props) => (
    <StyledCard>
      <div
        className="card-ncm group-card mn-view-trade-width"
        style={{ height: props.heightAuto ? 'auto' : '80px', overflowY: 'auto' }}
      >
        <div className="select-campaign-heading card-title mn-manage-campaign-card  ">{props.title}</div>
        {props.description && <div className="capitalize mn-manage-campaign-card-desc">{props.description}</div>}
        {props.children}
      </div>
    </StyledCard>
  );

  Card.propTypes = {
    heightAuto: PropTypes.bool,
    description: PropTypes.any,
    title: PropTypes.string,
    children: PropTypes.object,
  };

  return (
    <Grid fluid={true}>
      <Modal show={showModal} onHide={closeModal} bsSize="large" id="ViewTradeModal">
        <Modal.Header closeButton>View Order Details</Modal.Header>
        <StyledModalBody>
          <Modal.Body className="mn-modal-body">
            <Row>
              <Col sm={6}>
                <Card title="Campaign Name :" description={viewTrades?.name} />
              </Col>
              <Col sm={6} className="pl025">
                <Card title="Start Date :" description={viewTrades?.start_date} />
              </Col>
              <Col sm={6}>
                <Card title="End Date :" description={viewTrades?.end_date} />
              </Col>
              <Col sm={6} className="pl025">
                <Card
                  title="Segment(s) :"
                  description={segmentData?.length ? segmentData?.map((seg) => seg.segment_name).join(', ') : 'N/A'}
                />
              </Col>
            </Row>
            {viewTrades?.additional_notes !== null && (
              <Row>
                <Col sm={12} className="pl025 ml15">
                  <Card title="Additional Note(s) :" description={viewTrades?.additional_notes} />
                </Col>
              </Row>
            )}
            <Col>
              <Card title="Creative Details" heightAuto={true}>
                <table className="table table-striped table-wrapper mt10">
                  <thead>
                    <tr>
                      <th>Creative Name</th>
                      <th>Creative ISCI</th>
                      <th>Asset ID </th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upgradedAdspot && upgradedAdspot.length ? (
                      upgradedAdspot.map((a, index) => (
                        <tr key={`upgradedAd${index}`} className="wrapped-table">
                          <td>{a?.ad_name ?? 'N/A'}</td>
                          <td>{a?.identifier ?? 'N/A'}</td>
                          <td style={{ textTransform: 'none' }}>
                            {a?.adid_meta_file_upload?.[0]?.default_asset_id ?? 'N/A'}
                          </td>
                          <td>{a?.duration} seconds</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-align-center-imp">
                          No Data Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>

              <Card title="Targeting Audience Details" heightAuto={true}>
                <table className="table table-striped table-wrapper mt10">
                  <thead>
                    <tr>
                      <th>Desired Impressions</th>
                      <th>CPM</th>
                      <th>Separation</th>
                      <th>Frequency capping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderLineDetails && orderLineDetails.length ? (
                      orderLineDetails.map((a, index) => (
                        <tr key={`upgradedAd${index}`} className="wrapped-table">
                          <td>{formatNumber(a?.desired_impressions) ?? 'N/A'}</td>
                          <td>{a?.cpm ?? 'N/A'}</td>
                          <td>
                            {a?.separations
                              ? a?.separations > 1
                                ? `${a?.separations} Minutes`
                                : `${a?.separations} Minute`
                              : 'N/A'}
                          </td>
                          <td>
                            {a?.freq_cap_map_viewing?.count} - {a?.freq_cap_map_viewing?.period}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-align-center-imp">
                          No Data Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </Col>
          </Modal.Body>
        </StyledModalBody>
        <Modal.Footer>
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    </Grid>
  );
};

ViewTradesModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  viewTrades: PropTypes.object,
  upgradedAdspot: PropTypes.array,
  mgData: PropTypes.array,
  segmentData: PropTypes.array,
  util: PropTypes.object,
  orderLineDetails: PropTypes.array,
};

ViewTradesModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
};

export default ViewTradesModal;
