import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Modal, Col, Row, FormControl } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

const OrderOrderLineCancelModal = (props) => {
  const { showModal, toggleModal, onSubmit, orderData, type } = props;
  const [cancelComment, setCancelComment] = useState('');

  //console.log(orderData);
  return (
    <Modal show={showModal} onHide={toggleModal} className="network-logs-modal-scroll">
      <Modal.Header closeButton>Cancel {type}</Modal.Header>
      <Modal.Body>
        <div className="flex-container1 mb20">
          <p>
            Are you sure you want to cancel {type} {orderData?.name} ?
          </p>
        </div>
        <div className="mt20">
          <Row className="flex-container1">
            <Col md={2} sm={2}>
              <p className="f12 bold">Comment: </p>
            </Col>
            <Col md={9} sm={9}>
              <FormControl
                type="text"
                value={cancelComment}
                placeholder="Reason to Cancel"
                onChange={(e) => setCancelComment(e.target.value)}
              ></FormControl>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize mr10"
          type="primary"
          buttonText={`Submit`}
          handleButtonClick={() => {
            onSubmit(orderData, cancelComment);
            setCancelComment('');
          }}
        />
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

OrderOrderLineCancelModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  onSubmit: PropTypes.func,
  orderData: PropTypes.object,
  type: PropTypes.string,
};

export default OrderOrderLineCancelModal;
