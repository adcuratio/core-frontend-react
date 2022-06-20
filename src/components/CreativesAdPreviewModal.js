import React from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";

import CustomButton from "./CustomButton";
import VideoPlayer from "./VideoPlayer";

const CreativesAdPreviewModal = (props) => {
  const { showModal, closeModal, creativeModalData } = props;
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Ad Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <VideoPlayer videoUrl={creativeModalData} />
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          type="secondary"
          buttonText="Close"
          buttonClassName="ml10"
          handleButtonClick={closeModal}
        />
      </Modal.Footer>
    </Modal>
  );
};
CreativesAdPreviewModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  creativeModalData: PropTypes.any,
};

CreativesAdPreviewModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
};
export default CreativesAdPreviewModal;
