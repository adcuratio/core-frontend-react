import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import CustomButton from '../../../components/CustomButton';

import { AddAgencyRep, AddAdvertiserAdmin, EditAgencyRep, EditAdvertiserAdmin } from '../constants/ModalConstants';

import ValidationErrorMessage from '../components/ValidationErrorMessage';
import FormLabel from '../components/FormLabel';

import {
  validateEmail,
  validatePassword,
  showAckMessage,
  showAckErrorMessage,
  formatEmail,
  formatText,
} from '../../../common/utils';

import {
  CreateAgencyRepSuccessMessage,
  UpdateAgencyRepSuccessMessage,
  CreateAdvAdminSuccessMessage,
  UpdateAdvAdminSuccessMessage,
  FirstNameValidation,
  LastNameValidation,
  PhoneNumberValidation,
  EmailIdValidation,
  PasswordValidation,
  PasswordConfirmPasswordMismatch,
  FillRequiredFields,
  FirstNameLengthValidation,
  LastNameLengthValidation,
} from '../constants/MessageConstants';
import CheckBox from '../../../components/CheckBox';

const AgencyRepModal = inject(
  'accountManagementStore',
  'uiStore'
)(
  observer((props) => {
    const {
      accountManagementStore,
      showModal,
      closeModal,
      modalData,
      activeModal,
      navigationService,
      dataUpdateOnSuccess,
    } = props;
    const { subagencyList, companyList } = props.accountManagementStore;

    const [errorInfo, setErrorInfo] = useState({
      errorFieldsInfo: {
        first_name: false,
        last_name: false,
        phone: false,
        email: false,
        password: false,
        confirm_password: false,
        companies_id: false,
        sub_agency_id: false,
        read_only: false,
        adv_company: false,
      },
      messages: [],
    });
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
      confirm_password: '',
      companies_id: [],
      sub_agency_id: '',
      read_only: false,
      adv_company: '',
    });
    const [filteredCompany, setFilteredCompany] = useState([]);

    useEffect(() => {
      // Prefilling old values if user tries to edit old values
      if (activeModal === EditAgencyRep || activeModal === EditAdvertiserAdmin) {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        formDataCpy.first_name = modalData.first_name;
        formDataCpy.last_name = modalData.last_name;
        formDataCpy.phone = modalData.phone.replace('+1', '');
        formDataCpy.read_only = modalData.read_only;
        formDataCpy.sub_agency_id = modalData.sub_agency;
        formDataCpy.companies_id = modalData.companies;
        formDataCpy.adv_company = String(modalData.adv_company);
        setFormData(formDataCpy);
        filterCompanyList(modalData.sub_agency, 'edit_mode');
      }
    }, []);

    const filterCompanyList = (value, isEditModeDefault = false) => {
      const filteredCompanyCpy = [];
      const companyListCpy = JSON.parse(JSON.stringify(companyList));
      for (const id in companyListCpy) {
        if (companyListCpy[id].sub_agency === Number(value)) {
          filteredCompanyCpy.push(companyListCpy[id]);
        }
      }
      if (isEditModeDefault && modalData && modalData.companies && modalData.companies.length) {
        filteredCompanyCpy.forEach((company) => {
          company.selected = modalData.companies.indexOf(company.id) > -1;
        });
      }
      setFilteredCompany(filteredCompanyCpy);
    };

    const clearValidation = () => {
      if (errorInfo.messages.length) {
        const errorList = {
          errorFieldsInfo: {
            first_name: false,
            last_name: false,
            phone: false,
            email: false,
            password: false,
            confirm_password: false,
            companies_id: false,
            sub_agency_id: false,
            read_only: false,
            adv_company: false,
          },
          messages: [],
        };
        setErrorInfo(errorList);
      }
    };

    const handleFormDataChange = (value, id) => {
      clearValidation();
      const formDataCpy = JSON.parse(JSON.stringify(formData));
      if (id === 'first_name') {
        formDataCpy.first_name = value;
      } else if (id === 'last_name') {
        formDataCpy.last_name = value;
      } else if (id === 'phone') {
        formDataCpy.phone = value;
      } else if (id === 'email') {
        formDataCpy.email = value;
      } else if (id === 'password') {
        formDataCpy.password = value;
      } else if (id === 'confirm_password') {
        formDataCpy.confirm_password = value;
      } else if (id === 'read_only') {
        formDataCpy.read_only = value;
      } else if (id === 'sub_agency_id') {
        formDataCpy.sub_agency_id = value;
        formDataCpy.companies_id = [];
        filterCompanyList(value);
      } else if (id === 'companies_id') {
        const filteredCompanyCpy = JSON.parse(JSON.stringify(filteredCompany));
        const companiesIdCpy = [];
        filteredCompanyCpy.forEach((data) => {
          if (data.id === value.id) {
            data.selected = !data.selected;
          }
          if (data.selected) {
            companiesIdCpy.push(data.id);
          }
        });
        formDataCpy.companies_id = companiesIdCpy;
        setFilteredCompany(filteredCompanyCpy);
      } else if (id === 'adv_company') {
        formDataCpy.adv_company = value;
      }
      setFormData(formDataCpy);
    };

    const onSave = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (activeModal === AddAgencyRep) {
        const payload = {
          first_name: formatText(formData.first_name),
          last_name: formatText(formData.last_name),
          password: formData.password,
          phone: `+1${formatText(formData.phone)}`,
          email: formatEmail(formData.email),
          companies_id: formData.companies_id,
          sub_agency_id: formData.sub_agency_id,
          read_only: formData.read_only,
        };
        accountManagementStore.saveAgencyRep(payload).then(
          (response) => {
            if (response.success) {
              dataUpdateOnSuccess(response.data);
              showAckMessage({ message: CreateAgencyRepSuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({ message: response.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (activeModal === EditAgencyRep) {
        const payload = {
          user_id: modalData.id,
          first_name: formatText(formData.first_name),
          last_name: formatText(formData.last_name),
          phone: `+1${formatText(formData.phone)}`,
          companies_id: formData.companies_id,
          sub_agency_id: formData.sub_agency_id,
          read_only: formData.read_only,
        };
        if (formData.password && formData.password !== '') {
          payload.password = formData.password;
        }
        accountManagementStore.editAgencyRep(payload).then(
          (response) => {
            if (response.success) {
              dataUpdateOnSuccess(response.data);
              showAckMessage({ message: UpdateAgencyRepSuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({ message: response.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (activeModal === AddAdvertiserAdmin) {
        const payload = {
          first_name: formatText(formData.first_name),
          last_name: formatText(formData.last_name),
          email: formatEmail(formData.email),
          phone: `+1${formatText(formData.phone)}`,
          subagency_id: Number(formData.sub_agency_id),
          company_id: formData.adv_company,
          password: formData.password,
          read_only: formData.read_only,
        };
        accountManagementStore.saveAdvertiserAdmin(payload).then(
          (response) => {
            if (response.success) {
              dataUpdateOnSuccess(response.data);
              showAckMessage({ message: CreateAdvAdminSuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({ message: response.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (activeModal === EditAdvertiserAdmin) {
        const payload = {
          user_id: modalData.id,
          first_name: formatText(formData.first_name),
          last_name: formatText(formData.last_name),
          phone: `+1${formatText(formData.phone)}`,
          subagency_id: Number(formData.sub_agency_id),
          company_id: formData.adv_company,
          read_only: formData.read_only,
        };
        if (formData.password && formData.password !== '') {
          payload.password = formData.password;
        }
        accountManagementStore.editAdvertiserAdmin(payload).then(
          (response) => {
            if (response.success) {
              dataUpdateOnSuccess(response.data);
              showAckMessage({ message: UpdateAdvAdminSuccessMessage });
              closeModal();
            } else {
              showAckErrorMessage({ message: response.message });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      }
    };

    const onValidate = () => {
      const errorList = {
        errorFieldsInfo: {
          first_name: false,
          last_name: false,
          phone: false,
          email: false,
          password: false,
          confirm_passpord: false,
          sub_agency_id: false,
          companies_id: false,
          adv_company: false,
        },
        messages: [],
      };
      const first_name = formatText(formData.first_name);
      const last_name = formatText(formData.last_name);
      const phone = formatText(formData.phone);
      const email = formData.email;
      const password = formData.password;
      const confirm_passpord = formData.confirm_password;
      const sub_agency_id = formData.sub_agency_id;
      const companies_id = formData.companies_id;
      const adv_company = formData.adv_company;

      // validation scenarios

      if (!first_name || !/^[a-zA-Z]*$/.test(first_name) || first_name.length < 2) {
        errorList.errorFieldsInfo.first_name = true;
      }
      if (!last_name || !/^[a-zA-Z]*$/.test(last_name) || last_name.length < 2) {
        errorList.errorFieldsInfo.last_name = true;
      }
      if (!phone || !/^[1-9][0-9]{9}$/.test(phone) || phone.length !== 10) {
        errorList.errorFieldsInfo.phone = true;
      }
      if (!sub_agency_id) {
        errorList.errorFieldsInfo.sub_agency_id = true;
      }
      if (activeModal === AddAgencyRep || activeModal === EditAgencyRep) {
        if (!companies_id || !companies_id.length) {
          errorList.errorFieldsInfo.companies_id = true;
        }
      } else {
        if (!adv_company) {
          errorList.errorFieldsInfo.adv_company = true;
        }
      }

      if (activeModal === AddAgencyRep || activeModal === AddAdvertiserAdmin) {
        if (!email || !validateEmail(email)) {
          errorList.errorFieldsInfo.email = true;
        }
        if (!password || !validatePassword(password)) {
          errorList.errorFieldsInfo.password = true;
        }
        if (!confirm_passpord || confirm_passpord !== password) {
          errorList.errorFieldsInfo.confirm_passpord = true;
        }
      } else {
        if (password && !validatePassword(password)) {
          errorList.errorFieldsInfo.password = true;
        } else if (!password && confirm_passpord) {
          errorList.errorFieldsInfo.password = true;
        } else if (confirm_passpord !== password) {
          errorList.errorFieldsInfo.password = true;
          errorList.errorFieldsInfo.confirm_passpord = true;
        }
      }

      if (activeModal === AddAgencyRep || activeModal === AddAdvertiserAdmin) {
        if (
          !first_name ||
          !last_name ||
          !phone ||
          !email ||
          !password ||
          !confirm_passpord ||
          !sub_agency_id ||
          (activeModal === AddAgencyRep && !(companies_id && companies_id.length)) ||
          (activeModal === AddAdvertiserAdmin && !adv_company)
        ) {
          errorList.messages.push('Please fill all the required details !!');
        } else {
          if (first_name.length < 2 || !/^[a-zA-Z]*$/.test(first_name)) {
            errorList.messages.push(FirstNameValidation);
          }
          if (last_name.length < 2 || !/^[a-zA-Z]*$/.test(last_name)) {
            errorList.messages.push(LastNameValidation);
          }
          if (first_name.length > 250) {
            errorList.messages.push(FirstNameLengthValidation);
          }
          if (last_name.length > 250) {
            errorList.messages.push(LastNameLengthValidation);
          }
          if (phone.length !== 10 || !phone || !/^[1-9][0-9]{9}$/.test(phone)) {
            errorList.messages.push(PhoneNumberValidation);
          }
          if (!validateEmail(email)) {
            errorList.messages.push(EmailIdValidation);
          }
          if (!validatePassword(password)) {
            errorList.messages.push(PasswordValidation);
          }
          if (password && confirm_passpord && confirm_passpord !== password) {
            errorList.messages.push(PasswordConfirmPasswordMismatch);
          }
        }
      } else {
        if (
          !first_name ||
          !last_name ||
          !phone ||
          !sub_agency_id ||
          (activeModal === EditAgencyRep && !(companies_id && companies_id.length)) ||
          (activeModal === EditAdvertiserAdmin && !adv_company)
        ) {
          errorList.messages.push(FillRequiredFields);
        } else {
          if (first_name.length < 2 || !/^[a-zA-Z]*$/.test(first_name)) {
            errorList.messages.push(FirstNameValidation);
          }
          if (last_name.length < 2 || !/^[a-zA-Z]*$/.test(last_name)) {
            errorList.messages.push(LastNameValidation);
          }
          if (first_name.length > 250) {
            errorList.messages.push(FirstNameLengthValidation);
          }
          if (last_name.length > 250) {
            errorList.messages.push(LastNameLengthValidation);
          }
          if (phone.length !== 10 || !phone || !/^[1-9][0-9]{9}$/.test(phone)) {
            errorList.messages.push(PhoneNumberValidation);
          }

          if (password && !validatePassword(password)) {
            errorList.messages.push(PasswordValidation);
          } else if (!password && confirm_passpord) {
            errorList.messages.push(FillRequiredFields);
          } else if (confirm_passpord !== password) {
            errorList.messages.push(PasswordConfirmPasswordMismatch);
          }
        }
      }

      setErrorInfo(errorList);
      if (errorList.messages.length) {
        return false;
      }
      return true;
    };

    const goToSubagency = () => {
      closeModal();
      navigationService.goToAgencyAdminManageAdvertisers();
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          {activeModal === EditAgencyRep ? 'Edit Agency Rep' : activeModal === AddAgencyRep ? 'Add Agency Rep' : ''}
          {activeModal === EditAdvertiserAdmin
            ? 'Edit Advertiser Admin'
            : activeModal === AddAdvertiserAdmin
            ? 'Add Advertiser Admin'
            : ''}
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <FormLabel labelName="First Name" />
              <input
                type="text"
                name="first_name"
                className={errorInfo.errorFieldsInfo['first_name'] ? 'error' : ''}
                value={formData.first_name}
                onChange={(e) => handleFormDataChange(e.target.value, 'first_name')}
                autoComplete="first-name"
              />
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Last Name" />
              <input
                type="text"
                name="last_name"
                className={errorInfo.errorFieldsInfo['last_name'] ? 'error' : ''}
                value={formData.last_name}
                onChange={(e) => handleFormDataChange(e.target.value, 'last_name')}
                autoComplete="last-name"
              />
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Phone" />
              <div
                className={
                  errorInfo.errorFieldsInfo['phone'] ? 'acc-management-phone-box error' : 'acc-management-phone-box'
                }
              >
                <span>+1</span>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => handleFormDataChange(e.target.value, 'phone')}
                  autoComplete="phone"
                />
              </div>
            </div>
            <div className="col-md-6">
              {activeModal === AddAgencyRep || activeModal === AddAdvertiserAdmin ? (
                <>
                  <FormLabel labelName="Email" />
                  <input
                    type="email"
                    name="email"
                    className={errorInfo.errorFieldsInfo['email'] ? 'error' : ''}
                    onChange={(e) => handleFormDataChange(e.target.value, 'email')}
                    value={formData.email}
                    autoComplete="email"
                  />
                </>
              ) : null}
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Sub-Agency" />
              {subagencyList?.length ? (
                <div className="select-wrapper">
                  <select
                    name="subagency"
                    className={errorInfo.errorFieldsInfo['sub_agency_id'] ? 'error' : ''}
                    value={formData.sub_agency_id}
                    onChange={(e) => handleFormDataChange(e.target.value, 'sub_agency_id')}
                  >
                    <option value="" disabled>
                      --SELECT--
                    </option>
                    {subagencyList?.map((subagency) => (
                      <option key={`subagency_option_${subagency.id}`} value={subagency.id}>
                        {subagency.name}
                      </option>
                    ))}
                  </select>
                  <span className="caret select-icon"></span>
                </div>
              ) : (
                <p className="link" onClick={goToSubagency}>
                  Click here to create sub-agency
                </p>
              )}
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Advertiser" />
              {activeModal === AddAgencyRep || activeModal === EditAgencyRep ? (
                <div
                  className={
                    errorInfo.errorFieldsInfo['companies_id'] ? 'cust-multi-select error' : 'cust-multi-select'
                  }
                >
                  <ul key="advertiser-listing">
                    {filteredCompany?.map((list) => (
                      <li
                        key={`li_${list.id}`}
                        className={list.selected ? 'selected' : ''}
                        onClick={() => handleFormDataChange(list, 'companies_id')}
                      >
                        {list.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="select-wrapper">
                  <select
                    name="company"
                    className={errorInfo.errorFieldsInfo['adv_company'] ? 'error' : ''}
                    value={formData.adv_company}
                    onChange={(e) => handleFormDataChange(e.target.value, 'adv_company')}
                  >
                    <option value="" disabled>
                      --SELECT--
                    </option>
                    {filteredCompany?.map((company) => (
                      <option key={`company_${company.id}`} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <span className="caret select-icon"></span>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <FormLabel labelName="New Password" />
              <input
                type="password"
                name="password"
                className={errorInfo.errorFieldsInfo['password'] ? 'error' : ''}
                onChange={(e) => handleFormDataChange(e.target.value, 'password')}
                value={formData.password}
                autoComplete="new-password"
              />
            </div>

            <div className="col-md-6">
              <FormLabel labelName="Confirm Password" />
              <input
                type="password"
                name="confirm_passpord"
                className={errorInfo.errorFieldsInfo['confirm_passpord'] ? 'error' : ''}
                onChange={(e) => handleFormDataChange(e.target.value, 'confirm_password')}
                value={formData.confirm_password}
                autoComplete="confirm-password"
              />
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Access Control" />
              <CheckBox
                id="readOnlyAdUser"
                label="Make Access Read Only"
                isChecked={formData.read_only}
                onChangeFunction={(e) => handleFormDataChange(e.target.checked, 'read_only')}
              ></CheckBox>
            </div>
          </div>
          <ValidationErrorMessage errorInfo={errorInfo} />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Save" handleButtonClick={() => onSave()} />
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

export default AgencyRepModal;
