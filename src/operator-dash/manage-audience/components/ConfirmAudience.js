import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import ConfirmTagModal from '../../../components/manage-campaign-tags/ConfirmTagModal';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const ConfirmAudience = inject(
  'operatorStore',
  'uiStore'
)(
  observer((props) => {
    const { operatorStore, closeModal, modalData, handleOnSuccessResponse, getAllCampaignTags, tabList } = props;

    //Function for confirming the segment tag.
    const onConfirmCampaignTag = () => {
      const data = {
        segment_file_id: modalData,
        is_received: true,
      };
      operatorStore.confirmTag(data).then(
        (res) => {
          if (res && res.status === 200) {
            handleOnSuccessResponse(res.data);
            showAckMessage({ message: 'Confirmed successfully.' });
            getAllCampaignTags(tabList[1]);
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
        <ConfirmTagModal closeModal={closeModal} onConfirm={onConfirmCampaignTag} />
      </div>
    );
  })
);

ConfirmAudience.propTypes = {
  operatorStore: PropTypes.object,
  closeModal: PropTypes.func,
  modalData: PropTypes.object,
  handleOnSuccessResponse: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  tabList: PropTypes.array,
};

export default ConfirmAudience;
