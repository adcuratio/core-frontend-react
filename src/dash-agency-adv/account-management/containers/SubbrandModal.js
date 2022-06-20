import React, { useState, useEffect } from 'react';
import { Modal, ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';

import ValidationErrorMessage from '../components/ValidationErrorMessage';
import FormLabel from '../components/FormLabel';

import {
  FillRequiredFields,
  UpdateSubbrandSuccessMessage,
  CreateSubbrandSuccessMessage,
  SelectAdvertiser,
  SelectBrand,
  NameLengthValidation,
} from '../constants/MessageConstants';

import { showAckMessage, showAckErrorMessage, formatText } from '../../../common/utils';

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

const SubbrandModal = inject('accountManagementStore')(
  observer((props) => {
    const { showModal, closeModal, accountManagementStore, modalData, handleDataUpdateOnSuccess, mode } = props;
    const { companyList } = props.accountManagementStore;
    const [formData, setFormData] = useState({
      company_id: '',
      brand_id: '',
      sub_brand_name: '',
    });
    const [errorInfo, setErrorInfo] = useState({
      errorFieldsInfo: {
        company_id: false,
        brand_id: false,
        sub_brand_name: false,
      },
      messages: [],
    });

    useEffect(() => {
      // Prefilling when user tries to edit
      if (mode === 'edit') {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.sub_brand_name = modalData.active_sub_brand.name;
        setFormData(formDataCpy);
      }
    }, []);

    const onValidate = () => {
      const errorInfoCpy = {
        errorFieldsInfo: {
          company_id: false,
          brand_id: false,
          sub_brand_name: false,
        },
        messages: [],
      };
      if (mode === 'add') {
        if (!formData.company_id) {
          errorInfoCpy.errorFieldsInfo.company_id = true;
          errorInfoCpy.messages.push(SelectAdvertiser);
          setErrorInfo(errorInfoCpy);
        } else if (!formData.brand_id) {
          errorInfoCpy.errorFieldsInfo.brand_id = true;
          errorInfoCpy.messages.push(SelectBrand);
          setErrorInfo(errorInfoCpy);
        } else if (formatText(formData.sub_brand_name).length < 1) {
          errorInfoCpy.errorFieldsInfo.sub_brand_name = true;
          errorInfoCpy.messages.push(FillRequiredFields);
          setErrorInfo(errorInfoCpy);
        } else if (formatText(formData.sub_brand_name).length > 250) {
          errorInfoCpy.errorFieldsInfo.sub_brand_name = true;
          errorInfoCpy.messages.push(NameLengthValidation);
          setErrorInfo(errorInfoCpy);
        }
      } else {
        if (formatText(formData.sub_brand_name).length < 1) {
          errorInfoCpy.errorFieldsInfo.sub_brand_name = true;
          errorInfoCpy.messages.push(FillRequiredFields);
          setErrorInfo(errorInfoCpy);
        }
        if (formatText(formData.sub_brand_name).length > 250) {
          errorInfoCpy.errorFieldsInfo.sub_brand_name = true;
          errorInfoCpy.messages.push(NameLengthValidation);
          setErrorInfo(errorInfoCpy);
        }
      }
      if (errorInfoCpy.messages.length) {
        return false;
      }
      return true;
    };

    const clearValidation = () => {
      if (errorInfo.messages.length) {
        const errorList = {
          errorFieldsInfo: {
            company_id: false,
            brand_id: false,
            sub_brand_name: false,
          },
          messages: [],
        };
        setErrorInfo(errorList);
      }
    };

    const getBrands = () => {
      const companiesCpy = JSON.parse(JSON.stringify(companyList));
      let brandsData = [];
      if (formData.company_id && companiesCpy) {
        const selectedCompanyIndex = companiesCpy.findIndex((d) => d.id === Number(formData.company_id));
        if (selectedCompanyIndex !== -1) {
          brandsData = companiesCpy[selectedCompanyIndex].brands;
        }
      }
      return brandsData;
    };

    const handleFormChange = (value, id) => {
      clearValidation();
      if (id === 'company_id' && value.id !== formData.company_id) {
        const formDataCpy = {
          company_id: value.id,
          company_name: value.name,
          brand_id: '',
          sub_brand_name: '',
        };
        setFormData(formDataCpy);
      } else if (id === 'brand_id' && value.id !== formData.brand_id) {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.brand_id = value.id;
        formDataCpy.brand_name = value.name;
        setFormData(formDataCpy);
      } else if (id === 'sub_brand_name') {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.sub_brand_name = value;
        setFormData(formDataCpy);
      }
    };

    const onSaveData = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (mode === 'add') {
        const payload = {
          name: formatText(formData.sub_brand_name),
          company_id: formData.company_id,
          brand_id: formData.brand_id,
        };
        accountManagementStore.saveSubBrand(payload).then(
          (response) => {
            if (response.success) {
              const updatedData = { ...response.data };
              updatedData.brand_id = Number(formData.brand_id);
              handleDataUpdateOnSuccess(updatedData);
              closeModal();
              showAckMessage({ message: CreateSubbrandSuccessMessage });
            } else {
              showAckErrorMessage({
                message: response?.message ?? 'Something went wrong while adding SubBrand!',
              });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else {
        const payload = {
          name: formatText(formData.sub_brand_name),
          company_id: modalData.company,
          brand_id: modalData.id,
          sub_brand_id: modalData.active_sub_brand.id,
        };
        accountManagementStore.updateSubBrand(payload).then(
          (response) => {
            if (response.success) {
              handleDataUpdateOnSuccess(payload);
              closeModal();
              showAckMessage({ message: UpdateSubbrandSuccessMessage });
            } else {
              showAckErrorMessage({
                message: response?.data?.message ?? 'Something went wrong while updating SubBrand!',
              });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      }
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>{mode === 'add' ? 'Add' : 'Edit'} Sub Brand</Modal.Header>
        <Modal.Body>
          {mode === 'add' ? (
            <div className="row">
              <div className="col-md-6 dropdown-scrollable">
                <FormLabel labelName="Advertiser" />
                <ButtonToolbar>
                  <StyledDropdown>
                    <DropdownButton
                      className={`drpdwn-width text-ellipsis  ${
                        errorInfo.errorFieldsInfo['company_id'] ? 'error' : ''
                      }`}
                      title={formData.company_name || 'Select'}
                      id="company_id"
                    >
                      {companyList?.length > 0 ? (
                        companyList.map((company, index) => (
                          <MenuItem
                            key={`company_list_${index}`}
                            title={company.name.length && company.name.length > 29 ? company.name : ''}
                            value={company.id}
                            onSelect={() => handleFormChange(company, 'company_id')}
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
                <div className="col-md-6 dropdown-scrollable">
                  <FormLabel labelName="Brand" />
                  <ButtonToolbar>
                    <StyledDropdown>
                      <DropdownButton
                        className={`drpdwn-width text-ellipsis  ${
                          errorInfo.errorFieldsInfo['brand_id'] ? 'error' : ''
                        }`}
                        title={formData.brand_name || 'Select'}
                        id="brand_id"
                      >
                        {getBrands().length > 0 ? (
                          getBrands().map((brand, index) => (
                            <MenuItem
                              key={`company_list_${index}`}
                              title={brand.name.length && brand.name.length > 29 ? brand.name : ''}
                              onSelect={() => handleFormChange(brand, 'brand_id')}
                              active={formData.brand_id === brand.id}
                            >
                              {brand.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem className="drpdwn-width pointer-none">No Brands Available</MenuItem>
                        )}
                      </DropdownButton>
                    </StyledDropdown>
                  </ButtonToolbar>
                </div>
              ) : null}
              {formData.company_id && formData.brand_id ? (
                <div className="col-md-6">
                  <FormLabel labelName="Name" />
                  <input
                    type="text"
                    className={errorInfo.errorFieldsInfo['sub_brand_name'] ? 'error' : ''}
                    onChange={(e) => handleFormChange(e.target.value, 'sub_brand_name')}
                    value={formData.sub_brand_name}
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <FormLabel labelName="Name" />
              <input
                className={errorInfo.errorFieldsInfo['sub_brand_name'] ? 'error' : ''}
                type="text"
                onChange={(e) => handleFormChange(e.target.value, 'sub_brand_name')}
                value={formData.sub_brand_name}
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

export default SubbrandModal;
