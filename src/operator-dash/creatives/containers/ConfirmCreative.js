import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';

import withStore from '../../../hocs/WithStore';

import CustomButton from '../../../components/CustomButton';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const ConfirmCreative = inject('operatorStore')(
  observer((props) => {
    const { showModal, closeModal, operatorStore, modalData, handleSuccessResponse, modalType } = props;

    // POST to API after processing creative data for confirning creative ot encoding
    const confirmCreative = () => {
      if (modalType === 'operatorAck') {
        const creativey = {
          identifier: modalData.identifier,
        };
        operatorStore.operAckCreative(creativey).then(
          (res) => {
            if (res && res.status === 200) {
              handleSuccessResponse();
              showAckMessage({
                message: 'Successfully Confirmed.',
              });
              closeModal();
            } else {
              showAckErrorMessage({ message: 'Something went wrong while confirming receipt!' });
            }
          },
          () => showAckErrorMessage({ message: 'No creative data available.' })
        );
      } else if (modalType === 'encoding') {
        const creativey = {
          identifier: modalData.identifier,
        };
        operatorStore.confirmEncoding(creativey).then(
          (res) => {
            if (res && res.status === 200) {
              handleSuccessResponse();
              showAckMessage({
                message: 'Successfully Confirmed.',
              });
              closeModal();
            } else {
              showAckErrorMessage({ message: 'Something went wrong while confirming Encoding!' });
            }
          },
          () => showAckErrorMessage({ message: 'No creative data available.' })
        );
      }
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Confirm {modalType === 'operatorAck' && 'Creative'}
            {modalType === 'encoding' && 'Encoding'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure this creative has been
          {
            // Confirmation message based on type of modal
            modalType === 'operatorAck' && ' received by the digital delivery vendor?'
          }
          {
            // Confirmation message based on type of modal
            modalType === 'encoding' && ' successfully encoded by the encoding team?'
          }
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            buttonClassName="mr10"
            type="secondary"
            buttonText="Confirm"
            handleButtonClick={() => confirmCreative()}
          />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

ConfirmCreative.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  creativeVideoUrl: PropTypes.string,
  modalType: PropTypes.string,
};

export default withStore(ConfirmCreative);
