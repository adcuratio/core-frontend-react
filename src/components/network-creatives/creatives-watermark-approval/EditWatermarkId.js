import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl } from 'react-bootstrap';

import CustomButton from '../../CustomButton';

const EditWatermarkModal = (props) => {
  const { showModal, closeModal, formData, modalClass, editWatermarkID, setFormData } = props;

  const handleFormChange = (value) => {
    setFormData(value);
  };

  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName={modalClass}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Watermark ID</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl type="text" value={formData} onChange={(e) => handleFormChange(e.target.value)} />
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="mr10"
          type="primary"
          buttonText="Generate Watermark"
          handleButtonClick={() => editWatermarkID()}
        />
        <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

EditWatermarkModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  modalType: PropTypes.string,
  formData: PropTypes.string,
  modalClass: PropTypes.string,
  editWatermarkID: PropTypes.func,
  setFormData: PropTypes.func,
};

export default EditWatermarkModal;
