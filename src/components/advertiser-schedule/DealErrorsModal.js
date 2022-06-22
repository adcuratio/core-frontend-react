import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../CustomButton';

import LogsDealError from '../logs-deals/LogsDealError';

const DealErrors = (props) => {
  const { showModal, closeModal, errorModalData } = props;

  if (errorModalData) {
    return (
      <Modal show={showModal} onHide={closeModal} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>Errors ocurred in {errorModalData.edi_filename} deal file</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-box-scroll">
          <LogsDealError errorData={errorModalData.error} />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  }
  return <></>;
};

DealErrors.propTypes = {
  showModal: PropTypes.func,
  closeModal: PropTypes.func,
  errorModalData: PropTypes.any.isRequired,
};

DealErrors.propTypes = {
  showModal: () => {},
  closeModal: () => {},
};

export default DealErrors;
