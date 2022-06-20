import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Col, Grid, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { formatNumber } from '../../../common/utils';

import CustomButton from '../../../components/CustomButton';

const TableWrapper = styled.div`
  height: 50vh;
  overflow: auto;
`;

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
  const { showModal, closeModal, viewTrades, upgradedAdspot, mgData, segmentData, getAdspotView, nextPageUrl } = props;

  const handlePagination = () => {
    getAdspotView(null, nextPageUrl);
  };
  const handleScroll = (e) => {
    const bottom = e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight;
    if (bottom && nextPageUrl) {
      handlePagination();
    }
  };

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
                <Card title="Units Authorized for Upgrade :" description={viewTrades?.adspot_count} />
              </Col>
              <Col sm={6} className="mt5 mb5">
                <Card title="Total Number of Units to Upgrade :" description={viewTrades?.upgrade_adspots_count} />
              </Col>
              <Col sm={6} className="pl025 mt5 mb5">
                <Card title="Campaign/Order Budget :" description={'Pending Business Discussion'} />
              </Col>
              <Col sm={12}>
                <Card title="Protected Segment(s) :" description={segmentData?.map((seg) => seg.name).join(', ')} />
              </Col>

              <Col sm={12}>
                <Card title="Replacement Messaging Groups :" heightAuto={true}>
                  <table className="table table-striped table-wrapper mt10 mn-table-margin">
                    <thead>
                      <tr>
                        <th colSpan="2">Messaging Group name</th>
                        <th>Ratio</th>
                        <th>Frequency Capping</th>
                        <th>Minimum Threshold</th>
                        <th>Frequency Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mgData?.map((msgGroup, index) => (
                        <tr className="mn-mg-data" key={`Unique${index}${msgGroup.id}`}>
                          <td colSpan="2">{msgGroup.name}</td>
                          <td>{msgGroup.ratio}</td>
                          <td>{msgGroup.frequency_cap?.frequency_cap ?? 'N/A'}</td>
                          <td>
                            {msgGroup?.frequency_cap?.min_threshold
                              ? `${msgGroup?.frequency_cap?.min_threshold} %`
                              : 'N/A'}
                          </td>
                          <td>
                            {[0, 1, 2, 3].includes(msgGroup?.frequency_cap?.frequency_cap_period) ? (
                              <>
                                {msgGroup?.frequency_cap?.frequency_cap_period === 0 ? 'Day' : null}
                                {msgGroup?.frequency_cap?.frequency_cap_period === 1 ? 'Week' : null}
                                {msgGroup?.frequency_cap?.frequency_cap_period === 2 ? 'Month' : null}
                                {msgGroup?.frequency_cap?.frequency_cap_period === 3 ? 'Campaign' : null}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </Col>
            </Row>
            <Col>
              <Card title="Authorized Units" heightAuto={true}>
                <TableWrapper className="table table-striped table-wrapper mt10" onScroll={(e) => handleScroll(e)}>
                  <thead>
                    <tr>
                      <th>Deal ID </th>
                      <th>Network</th>
                      <th>Advertiser</th>
                      <th>Brand</th>
                      <th colSpan="2">Potential Flight Days</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Selling Title</th>
                      <th>Unit Rate </th>
                      <th>Unit Duration</th>
                      <th>Spot USN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upgradedAdspot && upgradedAdspot.length ? (
                      upgradedAdspot.map((a, index) => (
                        <tr key={`upgradedAd${index}`} className="wrapped-table">
                          <td>{a.deal_id}</td>
                          <td>{a.channel_name}</td>
                          <td>{a.campaign.advertiser}</td>
                          <td>{a.campaign.brand_name}</td>
                          <td colSpan="2">{a.flighting_dates}</td>
                          <td>{a.show_start_time}</td>
                          <td>{a.show_end_time}</td>
                          <td>{a.show_name}</td>
                          <td>${formatNumber(a.unit_cost)}</td>
                          <td>{a.duration}sec</td>
                          <td>{a.adspot_id}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="text-align-center-imp">
                          No Selected Ad Spots Found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </TableWrapper>
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
  getAdspotView: PropTypes.func,
  nextPageUrl: PropTypes.string,
  util: PropTypes.object,
};

ViewTradesModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
};

export default ViewTradesModal;
