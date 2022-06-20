import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../CustomButton';

const WatermarkModal = (props) => {
  const { showModal, closeModal, modalData, modalType, modalClass, onHandleAction } = props;

  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName={modalClass}>
      <Modal.Header closeButton>
        <Modal.Title>QA Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to {modalType === 'qa_approve' ? 'confirm' : 'decline'} this creative?
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          type="secondary"
          buttonText={modalType === 'qa_approve' ? 'Confirm' : 'Decline'}
          handleButtonClick={() => onHandleAction(modalType, modalData)}
        />
      </Modal.Footer>
    </Modal>
  );
};

WatermarkModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  modalType: PropTypes.string,
  modalData: PropTypes.object,
  modalClass: PropTypes.string,
  onHandleAction: PropTypes.func,
};

export default WatermarkModal;
