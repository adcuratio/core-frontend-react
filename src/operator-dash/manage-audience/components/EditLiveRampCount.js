import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { showAckErrorMessage, showAckMessage, numberValidation } from '../../../common/utils';

import CustomButton from '../../../components/CustomButton';

const EditLiveRampCount = inject('uiStore')(
  observer((props) => {
    const { closeModal, modalData, univisionStore, getAllCampaignTags } = props;
    const [nameValue, setNameValue] = useState('');

    const handleInputChange = (e) => {
      setNameValue(e.target.value);
    };

    const onEditLiveRampCount = () => {
      if (numberValidation(nameValue)) {
        const payload = {
          live_ramp_count: nameValue,
        };
        univisionStore.addDishCount(modalData, payload).then(
          (res) => {
            if (res && res.status === 200) {
              showAckMessage({ message: 'LiveRamp Count added successfully' });
              getAllCampaignTags();
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
          message: ' Please enter a valid Liveramp count.',
        });
      }
    };

    return (
      <Modal show={true} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="f-20">LiveRamp Count</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="number"
            min="1"
            style={{ width: '100%', marginLeft: '5px' }}
            onChange={handleInputChange}
            value={parseInt(nameValue)}
            placeholder="Enter the LiveRamp Count."
          />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Submit" handleButtonClick={onEditLiveRampCount} />
          <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

EditLiveRampCount.propTypes = {
  closeModal: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  univisionStore: PropTypes.object,
  modalData: PropTypes.any,
};

export default EditLiveRampCount;
