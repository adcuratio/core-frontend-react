import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import DealError from './LogsDealError';

const LogsDealErrorModal = (props) => {
  const { showModal, closeModal, activeLogData } = props;
  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Errors occurred in {activeLogData?.edi_filename} deal file
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup-box-scroll">
        {activeLogData?.error && <DealError errorData={activeLogData.error}></DealError>}
      </Modal.Body>
    </Modal>
  );
};
LogsDealErrorModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  onCloseErrorModal: PropTypes.func,
  activeLogData: PropTypes.any,
};
LogsDealErrorModal.defaultProps = {
  onCloseErrorModal: () => {},
  activeLogData: {},
  showModal: true,
  closeModal: () => {},
};

export default LogsDealErrorModal;
