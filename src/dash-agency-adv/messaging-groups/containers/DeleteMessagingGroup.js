import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';

import withStore from '../../../hocs/WithStore';

import CustomButton from '../../../components/CustomButton';
import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const DeleteMessagingGroup = inject('messagingGroupStore')(
  observer((props) => {
    const { showModal, closeModal, messagingGroupStore, modalData, getAllMessagingGroup } = props;

    // Function to delete messaging group API call
    const deleteMsgGrp = () => {
      messagingGroupStore.deleteMsgGrp(modalData.company, modalData.id).then(
        (res) => {
          closeModal();
          if (res && res.status === 200 && res.data) {
            if (res.data.success) {
              showAckMessage({
                message: res.data.message ? res.data.message : 'Messaging Group deleted successfully',
              });
              getAllMessagingGroup();
            } else if (!res.data.success) {
              if (res.data.message) {
                showAckErrorMessage({ message: res.data.message });
              } else {
                showAckErrorMessage();
              }
            }
          } else {
            showAckErrorMessage();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete messaging group ?</Modal.Body>
        <Modal.Footer>
          <CustomButton
            buttonClassName="mr10"
            type="secondary"
            buttonText="Confirm"
            handleButtonClick={() => deleteMsgGrp()}
          />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

DeleteMessagingGroup.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  getAllMessagingGroup: PropTypes.func,
};

export default withStore(DeleteMessagingGroup);
