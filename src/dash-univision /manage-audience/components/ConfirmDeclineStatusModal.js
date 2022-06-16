import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import CustomButton from '../../../components/CustomButton';

const ConfirmDeclineStatusModal = (props) => {
  const { showModal, closeModal, actionType, confirmDeclineAudience } = props;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">{`${actionType}`} audience segment?</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt10 mb10">{`Are you sure want to ${actionType} this audience segment?`}</div>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize"
          type="secondary"
          buttonText={`${actionType}`}
          handleButtonClick={() => confirmDeclineAudience(actionType)}
        />
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ConfirmDeclineStatusModal.PropTypes = {
  showModal: PropTypes.func,
  closeModal: PropTypes.func,
  actionType: PropTypes.string,
  confirmDeclineAudience: PropTypes.func,
};

ConfirmDeclineStatusModal.propTypes = {
  showModal: () => {},
  closeModal: () => {},
  actionType: '',
  confirmDeclineAudience: () => {},
};

export default ConfirmDeclineStatusModal;
