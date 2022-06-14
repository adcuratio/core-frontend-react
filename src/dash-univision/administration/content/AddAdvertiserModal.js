import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import { formatText, showAckErrorMessage, showAckMessage } from '../../../common/utils';

const AddAdvertiserModal = (props) => {
  const { showModal, closeModal, univisionStore, getAdvertiserList, subAgencyId } = props;
  const [inputValue, setInputValue] = useState('');

  //Input handler for adding advertiser text.
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Submit button handler for advertiser submission action.
  const handleSubmitAdvertiser = () => {
    if (formatText(inputValue)) {
      const payload = {
        name: formatText(inputValue),
        sub_agency_id: subAgencyId,
      };
      univisionStore.addAdvertiserAction(payload).then((res) => {
        if (res && res.status === 200) {
          getAdvertiserList();
          closeModal();
          setInputValue('');
          showAckMessage({ message: 'Advertiser added successfully' });
        } else {
          showAckErrorMessage({ message: res?.data?.message || 'Unable to add attribute id.' });
        }
      });
    } else {
      showAckErrorMessage({ message: 'Please enter Advertiser name' });
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>Add Advertiser</Modal.Header>
      <Modal.Body>
        <input type="text" name="Advertiser_Name" value={inputValue} onChange={(e) => handleInputChange(e)} />
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          type="primary"
          buttonText="Submit"
          buttonClassName="ml10"
          handleButtonClick={() => handleSubmitAdvertiser()}
        />
        <CustomButton type="secondary" buttonText="Cancel" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

AddAdvertiserModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  univisionStore: PropTypes.object,
  getAdvertiserList: PropTypes.func,
  subAgencyId: PropTypes.any,
};

export default AddAdvertiserModal;
