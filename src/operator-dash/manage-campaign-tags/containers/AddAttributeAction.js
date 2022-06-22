import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { formatText, showAckErrorMessage, showAckMessage } from '../../../common/utils';

import AddAttributeModal from '../../../components/manage-campaign-tags/AddAttributeModal';

const AddAttributeAction = inject(
  'operatorStore',
  'uiStore'
)(
  observer((props) => {
    const { closeModal, operatorStore, handleOnSuccessResponse, modalData, getAllCampaignTags } = props;
    const [nameValue, setNameValue] = useState('');

    // Function to add an attribute ID.
    const onConfirmAction = () => {
      if (nameValue) {
        if (formatText(nameValue)) {
          const payload = {
            attribute_id: formatText(nameValue),
            segment_file_id: modalData.id,
          };
          operatorStore.addAttributeId(payload).then(
            (res) => {
              if (res && res.status === 200) {
                handleOnSuccessResponse(res.data);
                showAckMessage({ message: 'Attribute id added successfully' });
                getAllCampaignTags();
                closeModal();
              } else {
                showAckErrorMessage({ message: 'Unable to add attribute id.' });
              }
            },
            (error) => {
              if (error?.status === 400 && error?.data) {
                showAckErrorMessage({ message: error.data });
              } else {
                showAckErrorMessage({ message: 'Something went wrong while adding Attribute ID' });
              }
            }
          );
        } else {
          showAckErrorMessage({
            message: 'Attribute Id should not contain empty space. Please enter a valid attribute id.',
          });
        }
      } else {
        showAckErrorMessage({ message: 'Please enter attribute id' });
      }
    };

    //Function which handles the input change while adding the attribute ID.
    const handleInputChange = (e) => {
      setNameValue(e.target.value);
    };

    return (
      <AddAttributeModal
        closeModal={closeModal}
        handleInputChange={handleInputChange}
        nameValue={nameValue}
        onConfirmAttribute={onConfirmAction}
      />
    );
  })
);

AddAttributeAction.propTypes = {
  operatorStore: PropTypes.object,
  closeModal: PropTypes.func,
  handleOnSuccessResponse: PropTypes.func,
  modalData: PropTypes.object,
  getAllCampaignTags: PropTypes.func,
};

export default AddAttributeAction;
