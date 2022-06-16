import React from 'react';
import { Modal } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';
import { showAckErrorMessage, showAckMessage } from '../../../../common/utils';

import CustomButton from '../../../../components/CustomButton';
import PropTypes from 'prop-types';

const ConfirmModal = inject('creativesStore')(
  observer((props) => {
    const { creativesStore, modalData, setModal, getAllCreatives } = props;

    const confirmWaterMark = (id) => {
      setModal(false);
      const payload = { status: 1 };
      creativesStore.confirmWatermarkID(id, payload).then(
        (res) => {
          if (res?.data?.data && res?.data?.success === true) {
            showAckMessage({ message: 'Watermark is confirmed' });
            getAllCreatives();
          } else {
            showAckErrorMessage({ message: 'Some Error Occured' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };
    const handleClose = () => {
      setModal(false);
    };

    return (
      <Modal show={true} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Creative Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to confirm this creative?</Modal.Body>
        <Modal.Footer>
          <CustomButton type="secondary" buttonText="confirm" handleButtonClick={() => confirmWaterMark(modalData)} />
        </Modal.Footer>
      </Modal>
    );
  })
);

ConfirmModal.propTypes = {
  getAllCreatives: PropTypes.func,
  // uiStore: PropTypes.object,
};

export default ConfirmModal;
