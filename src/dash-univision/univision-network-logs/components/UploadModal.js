import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CustomButton from '../../../components/CustomButton';

const ModalData = (props) => {
  const { showModal, closeModal } = props;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title> Upload Trafficking Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please go to our SFTP server (52.55.134.5) location to upload new Trafficking Plans.</p>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ModalData.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
};

ModalData.defaultProps = {
  showModal: false,
  closeModal: () => {},
};

export default ModalData;
