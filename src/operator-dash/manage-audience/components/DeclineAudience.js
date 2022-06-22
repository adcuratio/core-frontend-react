import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import DeclineModal from '../../../components/manage-campaign-tags/DeclineModal';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const DeclineAudience = inject(
  'operatorStore',
  'uiStore'
)(
  observer((props) => {
    const { operatorStore, closeModal, modalData, handleOnSuccessResponse, getAllCampaignTags } = props;

    const onDeclineTag = () => {
      const data = {
        segment_file_id: modalData,
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
        <DeclineModal closeModal={closeModal} onDecline={onDeclineTag} />
      </div>
    );
  })
);

DeclineAudience.propTypes = {
  operatorStore: PropTypes.object,
  closeModal: PropTypes.func,
  modalData: PropTypes.any,
  handleOnSuccessResponse: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
};

export default DeclineAudience;
