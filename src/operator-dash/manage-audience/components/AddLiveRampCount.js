import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';

import { showAckErrorMessage, showAckMessage, numberValidation } from '../../../common/utils';
import CustomButton from '../../../components/CustomButton';

const AddLiveRampCount = inject('uiStore')(
  observer((props) => {
    const { closeModal, getAllCampaignTags, univisionStore, modalData, tabList } = props;
    const [nameValue, setNameValue] = useState('');

    // Function to add an attribute ID.
    const onAddLiveRampCount = () => {
      if (numberValidation(nameValue)) {
        const payload = {
          live_ramp_count: nameValue,
        };
        univisionStore.addDishCount(modalData.id, payload).then(
          (res) => {
            if (res && res.status === 200) {
              showAckMessage({ message: 'LiveRamp Count added successfully' });
              if (modalData?.tag_file?.row_count !== 0) {
                getAllCampaignTags(tabList[1]);
              } else {
                getAllCampaignTags();
              }
              closeModal();
            } else {
              showAckErrorMessage({ message: 'Unable to add LiveRamp count.' });
            }
          },
          (error) => {
            if (error?.status === 400 && error?.data) {
              showAckErrorMessage({ message: error.data });
            } else {
              showAckErrorMessage();
            }
          }
        );
      } else {
        showAckErrorMessage({
          message: 'Please enter a valid LiveRamp count.',
        });
      }
    };

    //Function which handles the input change while adding the attribute ID.
    const handleInputChange = (e) => {
      setNameValue(e.target.value);
    };

    return (
      <Modal show={true} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add LiveRamp Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb5">Enter LiveRamp Count</p>
          <input
            type="number"
            style={{ width: '100%', marginLeft: '5px' }}
            min="1"
            onChange={handleInputChange}
            value={parseInt(nameValue)}
            placeholder="Enter the LiveRamp Count."
          />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            type="secondary"
            buttonClassName="mr10"
            buttonText="Add"
            handleButtonClick={onAddLiveRampCount}
          />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

AddLiveRampCount.propTypes = {
  closeModal: PropTypes.func,
  handleOnSuccessResponse: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  univisionStore: PropTypes.object,
  modalData: PropTypes.object,
  tabList: PropTypes.array,
};

export default AddLiveRampCount;
