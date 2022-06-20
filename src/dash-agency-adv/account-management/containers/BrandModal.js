import React, { useState, useEffect } from 'react';
import { Modal, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import { showAckMessage, showAckErrorMessage, formatText } from '../../../common/utils';

import ValidationErrorMessage from '../components/ValidationErrorMessage';
import FormLabel from '../components/FormLabel';

import CustomButton from '../../../components/CustomButton';

import {
  FillRequiredFields,
  UpdateBrandSuccessMessage,
  SelectAdvertiser,
  CreateBrandSuccessMessage,
  NameLengthValidation,
} from '../constants/MessageConstants';

const StyledDropdown = styled.div`
  .dropdown,
  .drpdwn-width,
  .dropdown-menu {
    width: 100% !important;
  }
  .dropdown-menu > li > a {
    text-overflow: ellipsis !important;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const BrandModal = inject('accountManagementStore')(
  observer((props) => {
    const { accountManagementStore, showModal, closeModal, modalData, handleDataUpdateOnSuccess, mode } = props;
    const { companyList } = props.accountManagementStore;

    const [formData, setFormData] = useState({
      name: '',
      company_id: '',
    });
    const [errorInfo, setErrorInfo] = useState({
      errorFieldsInfo: {
        name: false,
        company_id: false,
      },
      messages: [],
    });

    useEffect(() => {
      if (mode === 'edit') {
        // prefilling data in edit mode
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.name = modalData.name;
        setFormData(formDataCpy);
      }
    }, []);

    const onValidate = () => {
      const errorInfoCpy = {
        errorFieldsInfo: {
          name: false,
          company_id: false,
        },
        messages: [],
      };
      if (mode === 'add') {
        if (!formData.company_id) {
          errorInfoCpy.errorFieldsInfo.company_id = true;
          errorInfoCpy.messages.push(SelectAdvertiser);
        } else if (formatText(formData.name).length < 1) {
          errorInfoCpy.errorFieldsInfo.name = true;
          errorInfoCpy.messages.push(FillRequiredFields);
        } else if (formatText(formData.name).length > 250) {
          errorInfoCpy.errorFieldsInfo.name = true;
          errorInfoCpy.messages.push(NameLengthValidation);
        }
      } else {
        if (formatText(formData.name).length < 1) {
          errorInfoCpy.errorFieldsInfo.name = true;
          errorInfoCpy.messages.push(FillRequiredFields);
        }
        if (formatText(formData.name).length > 250) {
          errorInfoCpy.errorFieldsInfo.name = true;
          errorInfoCpy.messages.push(NameLengthValidation);
        }
      }
      setErrorInfo(errorInfoCpy);
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

      if (mode === 'add') {
        const payload = {
          name: formatText(formData.name),
          company_id: Number(formData.company_id),
        };

        accountManagementStore.saveBrand(payload).then(
          (response) => {
            if (response.success) {
              const dataToSend = { ...response.data };
              const activeCompany = companyList.find((d) => d.id === payload.company_id);
              dataToSend.company_name = activeCompany.name;
              dataToSend.sub_brands = [];
              handleDataUpdateOnSuccess(dataToSend);
              closeModal();
              showAckMessage({ message: CreateBrandSuccessMessage });
            } else {
              showAckErrorMessage({ message: response?.message ?? 'Something went wrong while adding Brand!' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else {
        const payload = {
          name: formatText(formData.name),
          brand_id: modalData.id,
          company_id: modalData.company,
        };
        accountManagementStore.updateBrand(payload).then(
          (response) => {
            if (response.success) {
              handleDataUpdateOnSuccess(formatText(formData.name));
              closeModal();
              showAckMessage({ message: UpdateBrandSuccessMessage });
            } else {
              showAckErrorMessage({ message: response?.data?.message ?? 'Something went wrong while updating Brand!' });
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
            company_id: false,
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
      } else if (id === 'company_id' && value.id !== formData.company_id) {
        formDataCpy.company_id = value.id;
        formDataCpy.company_name = value.name;
      }
      setFormData(formDataCpy);
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>{mode === 'add' ? 'Add' : 'Edit'} Brand</Modal.Header>
        <Modal.Body>
          {mode === 'add' ? (
            <div className="row">
              <div className="col-md-6 dropdown-scrollable">
                <FormLabel labelName="Advertiser" />
                <ButtonToolbar>
                  <StyledDropdown>
                    <DropdownButton
                      className={`drpdwn-width text-ellipsis ${errorInfo.errorFieldsInfo['company_id'] ? 'error' : ''}`}
                      title={formData.company_name || 'Select'}
                      id="company_id"
                    >
                      {companyList?.length > 0 ? (
                        companyList.map((company, index) => (
                          <MenuItem
                            key={`company_list_${index}`}
                            onSelect={() => handleFormChange('company_id', company)}
                            title={company.name.length && company.name.length > 29 ? company.name : ''}
                            active={formData.company_id === company.id}
                          >
                            {company.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem className="drpdwn-width pointer-none">No Advertisers Available</MenuItem>
                      )}
                    </DropdownButton>
                  </StyledDropdown>
                </ButtonToolbar>
              </div>
              {formData.company_id ? (
                <div className="col-md-6">
                  <FormLabel labelName="Name" />
                  <input
                    type="text"
                    className={errorInfo.errorFieldsInfo['name'] ? 'error' : ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    value={formData.name}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <FormLabel labelName="Name" />
              <input
                type="text"
                onChange={(e) => handleFormChange('name', e.target.value)}
                value={formData.name}
                className={errorInfo.errorFieldsInfo['name'] ? 'error' : ''}
              />
            </>
          )}
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

export default BrandModal;
