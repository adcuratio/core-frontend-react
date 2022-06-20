import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import { showAckMessage, showAckErrorMessage, formatText } from '../../../common/utils';

import CustomButton from '../../../components/CustomButton';

import ValidationErrorMessage from '../components/ValidationErrorMessage';
import FormLabel from '../components/FormLabel';

import {
  FillRequiredFields,
  UpdateSubagencySuccessMessage,
  CreateSubagencySuccessMessage,
  NameLengthValidation,
} from '../constants/MessageConstants';

import { EditSubagency } from '../constants/ModalConstants';

const SubAgencyModal = inject('accountManagementStore')(
  observer((props) => {
    const { accountManagementStore, showModal, closeModal, activeModal, modalData, handleSubAgencyDataChange } = props;
    const [formData, setFormData] = useState({
      name: '',
    });
    const [errorInfo, setErrorInfo] = useState({
      errorFieldsInfo: {
        name: false,
      },
      messages: [],
    });

    useEffect(() => {
      // Prefilling when user tries to edit
      if (activeModal === EditSubagency) {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.name = modalData.name;
        setFormData(formDataCpy);
      }
    }, []);

    const onValidate = () => {
      const errorInfoCpy = {
        errorFieldsInfo: {
          name: false,
        },
        messages: [],
      };
      if (formatText(formData.name).length < 1) {
        errorInfoCpy.errorFieldsInfo.name = true;
        errorInfoCpy.messages.push(FillRequiredFields);
        setErrorInfo(errorInfoCpy);
      }
      if (formatText(formData.name).length > 250) {
        errorInfoCpy.errorFieldsInfo.name = true;
        errorInfoCpy.messages.push(NameLengthValidation);
        setErrorInfo(errorInfoCpy);
      }
      if (errorInfoCpy.messages.length) {
        return false;
      }
      return true;
    };

    const onSaveData = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (activeModal === EditSubagency) {
        const payload = {
          name: formatText(formData.name),
          sub_agency_id: modalData.id,
        };
        accountManagementStore.editSubAgency(payload).then(
          (response) => {
            if (response.success) {
              handleSubAgencyDataChange(formatText(formData.name));
              showAckMessage({ message: UpdateSubagencySuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({
                message: response?.message ?? 'Something went wrong while Updating Sub-Agency !',
              });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else {
        const payload = {
          name: formatText(formData.name),
        };
        accountManagementStore.saveSubAgency(payload).then(
          (response) => {
            if (response.success) {
              handleSubAgencyDataChange(formatText(formData.name), response.data.sub_agency_id);
              showAckMessage({ message: CreateSubagencySuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({
                message: response?.data?.message ?? 'Something went wrong while adding Sub-Agency !',
              });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      }
    };

    const clearValidation = () => {
      if (errorInfo.messages.length) {
        const errorList = {
          errorFieldsInfo: {
            name: false,
          },
          messages: [],
        };
        setErrorInfo(errorList);
      }
    };

    const handleFormChange = (id, value) => {
      clearValidation();
      const formDataCpy = JSON.parse(JSON.stringify(formData));
      if (id === 'name') {
        formDataCpy.name = value;
      }
      setFormData(formDataCpy);
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>{activeModal === EditSubagency ? 'Edit' : 'Add'} Sub-Agency Details</Modal.Header>
        <Modal.Body>
          <FormLabel labelName="Name" />
          <input
            type="text"
            onChange={(e) => handleFormChange('name', e.target.value)}
            value={formData.name}
            className={errorInfo.errorFieldsInfo['name'] ? 'error' : ''}
          />
          <ValidationErrorMessage errorInfo={errorInfo} />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Save" handleButtonClick={onSaveData} />
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

export default SubAgencyModal;
