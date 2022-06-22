import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';

import { showAckErrorMessage, showAckMessage, numberValidation } from '../../../common/utils';
import CustomButton from '../../../components/CustomButton';

const AddDishCount = inject('uiStore')(
  observer((props) => {
    const { closeModal, handleOnSuccessResponse, getAllCampaignTags, univisionStore, modalData, tabList } = props;
    const [nameValue, setNameValue] = useState('');

    // Function to add an attribute ID.
    const onAddDishCount = () => {
      if (numberValidation(nameValue)) {
        if (nameValue.length > 10) {
          showAckErrorMessage({ message: 'Dish count should not be greater than 10. ' });
          return;
        }
        const payload = {
          dish_count: nameValue,
        };
        univisionStore.addDishCount(modalData.id, payload).then(
          (res) => {
            if (res && res.status === 200) {
              handleOnSuccessResponse(res.data);
              showAckMessage({ message: 'Dish Count added successfully' });
              if (
                (modalData?.data_provider === 'live_ramp' && modalData?.household_count !== 0) ||
                modalData?.data_provider === 'audience_request_form'
              ) {
                getAllCampaignTags(tabList[1]);
              } else {
                getAllCampaignTags();
              }
              closeModal();
            } else {
              showAckErrorMessage({ message: 'Unable to add dish count.' });
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
          message: ' Please enter a valid dish count.',
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
          <Modal.Title>Add Dish Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb5">Enter Dish Count</p>
          <input
            type="number"
            min="1"
            style={{ width: '100%', marginLeft: '5px' }}
            onChange={handleInputChange}
            value={parseInt(nameValue)}
            placeholder="Enter the Dish Count."
          />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="secondary" buttonClassName="mr10" buttonText="Add" handleButtonClick={onAddDishCount} />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

AddDishCount.propTypes = {
  closeModal: PropTypes.func,
  handleOnSuccessResponse: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  univisionStore: PropTypes.object,
  modalData: PropTypes.object,
  tabList: PropTypes.array,
};

export default AddDishCount;
