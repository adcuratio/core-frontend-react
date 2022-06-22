import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { showAckErrorMessage, showAckMessage, numberValidation } from '../../../common/utils';

import CustomButton from '../../../components/CustomButton';

const EditCountModal = inject('uiStore')(
  observer((props) => {
    const { closeModal, modalData, univisionStore, getAllCampaignTags } = props;
    const [nameValue, setNameValue] = useState('');

    const handleInputChange = (e) => {
      setNameValue(e.target.value);
    };

    const onEditDishCount = () => {
      if (numberValidation(nameValue)) {
        const payload = {
          dish_count: nameValue,
        };
        univisionStore.addDishCount(modalData, payload).then(
          (res) => {
            if (res && res.status === 200) {
              showAckMessage({ message: 'Dish Count added successfully' });
              getAllCampaignTags();
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

    return (
      <Modal show={true} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className="f-20">Dish Count</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="number"
            min="1"
            style={{ width: '100%', marginLeft: '5px' }}
            onChange={handleInputChange}
            value={parseInt(nameValue)}
            placeholder="Enter Dish Count"
          />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Submit" handleButtonClick={onEditDishCount} />
          <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

EditCountModal.propTypes = {
  closeModal: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  univisionStore: PropTypes.object,
  modalData: PropTypes.any,
};

export default EditCountModal;
