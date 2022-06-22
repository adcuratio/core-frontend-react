import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const ConfirmTag = inject(
  'operatorStore',
  'uiStore'
)(
  observer((props) => {
    const { operatorStore, closeModal, modalData, handleOnSuccessResponse, getAllCampaignTags } = props;

    // Function for declining the segment tag.
    const onDeclineCampaignTag = () => {
      const data = {
        segment_file_id: modalData.id,
        is_received: false,
      };
      operatorStore.confirmTag(data).then(
        (res) => {
          if (res && res.status === 200) {
            handleOnSuccessResponse(res.data);
            showAckMessage({ message: 'Declined successfully.' });
            getAllCampaignTags();
            closeModal();
          } else {
            showAckErrorMessage();
          }
        },
        (error) => {
          if (error?.status === 400 && error?.data?.message) {
            showAckErrorMessage({ message: error.data.message });
          } else {
            showAckErrorMessage();
          }
        }
      );
    };
    return (
      <div>
        <Modal show={true} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tagging Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure to decline the segments ?</Modal.Body>
          <Modal.Footer>
            <CustomButton
              type="secondary"
              buttonClassName="mr10"
              buttonText="Decline"
              handleButtonClick={onDeclineCampaignTag}
            />
            <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
          </Modal.Footer>
        </Modal>
      </div>
    );
  })
);

ConfirmTag.propTypes = {
  operatorStore: PropTypes.object,
  closeModal: PropTypes.func,
  modalData: PropTypes.object,
  handleOnSuccessResponse: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
};

export default ConfirmTag;
