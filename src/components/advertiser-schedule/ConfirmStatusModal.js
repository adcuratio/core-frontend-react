import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../CustomButton';

const ConfirmStatusModal = (props) => {
  const { showModal, closeModal, confirmEDIStatus, nameValue, modalData } = props;
  const { actionType, handleInputAction } = modalData;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">{`${actionType}`} Deal?</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt10 mb10">{`Are you sure you want to ${actionType} this deal?`}</div>
        {actionType === 'decline' && (
          <input
            type="text"
            onChange={handleInputAction}
            value={nameValue}
            placeholder="Enter the reason before declining the deal."
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize"
          type="secondary"
          buttonText={`${actionType}`}
          handleButtonClick={confirmEDIStatus}
        />
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ConfirmStatusModal.propTypes = {
  showModal: PropTypes.func,
  closeModal: PropTypes.func,
  activeModal: PropTypes.string.isRequired,
  confirmEDIStatus: PropTypes.func,
  handleInputChange: PropTypes.func,
  modalData: PropTypes.object,
  nameValue: PropTypes.any,
};

ConfirmStatusModal.propTypes = {
  showModal: () => {},
  closeModal: () => {},
  confirmEDIStatus: () => {},
  handleInputChange: () => {},
  modalData: () => {},
  nameValue: () => {},
};

export default ConfirmStatusModal;
