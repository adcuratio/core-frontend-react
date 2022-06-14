import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Modal } from 'react-bootstrap';
import CustomButton from '../../../components/CustomButton';

const ForecastDetail = (props) => {
  const { showModal, closeModal, forecastDetailData } = props;

  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">{forecastDetailData.name} Details</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <div className="ex-agg-padding">
            <Row>
              <Col md={2} sm={2} className="flex-container1">
                <p className="f12 mr20" style={{ fontWeight: 'bold' }}>
                  Start Data:
                </p>
                <span>{forecastDetailData?.start_date}</span>
              </Col>
              <Col md={2} sm={2} className="flex-container1">
                <p className="f12 mr20" style={{ fontWeight: 'bold' }}>
                  End Date:
                </p>
                <span>{forecastDetailData?.end_date}</span>
              </Col>
              <Col md={4} sm={4} className="flex-container1">
                <p className="f12 mr20" style={{ fontWeight: 'bold' }}>
                  Included Networks:
                </p>
                <span>{forecastDetailData?.included_networks?.join(', ')}</span>
              </Col>
              <Col md={4} sm={4} className="flex-container1">
                <p className="f12 mr20" style={{ fontWeight: 'bold' }}>
                  Excluded Networks:
                </p>
                <span>{forecastDetailData?.excluded_networks?.join(', ')}</span>
              </Col>
            </Row>
            <Row className="mt10">
              <Col md={3} sm={3} className="flex-container1">
                <p className="f12 mr20" style={{ fontWeight: 'bold' }}>
                  Frequency:
                </p>
                <span>
                  {forecastDetailData?.frequency_count
                    ? `${forecastDetailData?.frequency_count} / ${forecastDetailData?.frequency_period}`
                    : '10/Week'}
                </span>
              </Col>
            </Row>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ForecastDetail.propTypes = {
  forecastDetailData: PropTypes.object,
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
};

ForecastDetail.defaultProps = {
  forecastDetailData: {},
  showModal: false,
  closeModal: () => {},
};

export default ForecastDetail;
