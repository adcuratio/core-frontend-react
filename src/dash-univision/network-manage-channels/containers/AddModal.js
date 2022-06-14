import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import CustomButton from '../../../components/CustomButton';
import ValidationErrorMessage from '../components/ValidationErrorMessage';

import { showAckErrorMessage } from '../../../common/utils';

const AddModal = inject(
  'networkStore',
  'uiStore'
)(
  observer((props) => {
    const errorsObject = { name: false };
    const { showModal, activeModal, closeModal, handleRefreshOnSuccess, selectedChannel, networkStore } = props;
    const [formData, setFormData] = useState({});
    const [errorInfo, setErrorInfo] = useState({ errorFieldsInfo: errorsObject, messages: [] });

    const clearValidation = () => {
      if (errorInfo.messages.length) {
        const errorList = {
          errorFieldsInfo: errorsObject,
          messages: [],
        };
        setErrorInfo(errorList);
      }
    };

    const handleFormDataChange = (value, id) => {
      clearValidation();
      const formDataCpy = JSON.parse(JSON.stringify(formData));
      if (id === 'name') formDataCpy.name = value;
      setFormData(formDataCpy);
    };

    const onSave = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (activeModal === 'network') {
        const channel = { name: formData.name };
        networkStore.createChannel(channel).then((res) => {
          if (res.data && res.data.success) {
            handleRefreshOnSuccess();
          } else {
            handleAPIErrors(res);
          }
        });
      } else if (activeModal === 'show') {
        const show = {
          name: formData.name,
          channel_id: selectedChannel.id,
        };
        networkStore.createShow(show).then((res) => {
          if (res.data && res.data.success) {
            handleRefreshOnSuccess(show);
          } else {
            handleAPIErrors(res);
          }
        });
      }
    };

    const onValidate = () => {
      const errorList = {
        errorFieldsInfo: errorsObject,
        messages: [],
      };
      if (!formData.name) {
        errorList.errorFieldsInfo.name = true;
        errorList.messages.push(`${activeModal === 'network' ? 'Network' : 'Show'} name should not be empty`);
      }
      setErrorInfo(errorList);
      if (errorList.messages.length) {
        return false;
      }
      return true;
    };

    const handleAPIErrors = (res) => {
      if (res && res.status === 200) {
        if (res.data && res.data.success === false) {
          if (res.data.message) {
            showAckErrorMessage({ message: res.data.message });
          } else {
            showAckErrorMessage({ message: 'Soemthing went wrong!' });
          }
        }
      } else showAckErrorMessage({ message: 'Unable to add data!' });
    };

    return (
      <Modal show={showModal} onHide={closeModal} dialogClassName="modal-popup-box">
        <Modal.Header closeButton>Add {activeModal}</Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <p className="mb5">
                Name: <span className="error-indicator">*</span>
              </p>
              <input type="text" name="name" onChange={(e) => handleFormDataChange(e.target.value, 'name')} />
            </div>
          </div>
          <ValidationErrorMessage errorInfo={errorInfo} />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Create" handleButtonClick={() => onSave()} />
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

AddModal.defaultProps = {
  modalData: { name: '' },
};

export default AddModal;
