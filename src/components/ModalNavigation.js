import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from './CustomButton';

const ModalContainer = (props) => {
  const { showModal, toggleModal, handleNavigation, navigationMessage } = props;
  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Body>Are you sure you want to cancel the {navigationMessage} ?</Modal.Body>
      <Modal.Footer>
        <CustomButton type="primary" buttonText="Confirm" buttonClassName="mr15" handleButtonClick={handleNavigation} />
        <CustomButton type="secondary" buttonText="Close" buttonClassName="" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

ModalContainer.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  handleNavigation: PropTypes.func,
  navigationMessage: PropTypes.string,
};

ModalContainer.defaultProps = {
  showModal: false,
  toggleModal: () => {},
  handleNavigation: () => {},
  navigationMessage: '',
};

export default ModalContainer;
