import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import { formatText, formatEmail, showAckMessage, showAckErrorMessage } from '../../../common/utils';

import {
  FillRequiredFields,
  FirstNameValidation,
  LastNameValidation,
  PhoneNumberValidation,
  EmailIdValidation,
  PasswordValidation,
  PasswordConfirmPasswordMismatch,
} from '../../../components/ops-user-flow/MessageConstants';

import styled from 'styled-components';
export const PhoneBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #b4b8bb;
`;

const AddUserModal = (props) => {
  const { showModal, closeModal, univisionStore, getAllAgencyRepAPI, mode, modalData } = props;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errorInfo, setErrorInfo] = useState({
    errorFieldsInfo: {
      first_name: false,
      last_name: false,
      phone: false,
      email: false,
      password: false,
      confirm_password: false,
    },
    messages: [],
  });

  useEffect(() => {
    if (mode === 'edit') {
      const formDataCpy = JSON.parse(JSON.stringify(formData));
      formDataCpy.first_name = modalData?.first_name;
      formDataCpy.last_name = modalData?.last_name;
      formDataCpy.phone = modalData?.phone?.replace('+1', '');
      formDataCpy.email = modalData?.email;
      setFormData(formDataCpy);
    }
  }, []);

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
    }
    setFormData(formDataCpy);
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
        },
        messages: [],
      };
      setErrorInfo(errorList);
    }
  };

  const handleSubmitUser = () => {
    const isValid = onValidate();
    if (!isValid) {
      return;
    }
    const payload = {
      first_name: formatText(formData?.first_name),
      last_name: formatText(formData?.last_name),
      password: formData?.password,
      phone: formatText(formData?.phone),
      email: formatEmail(formData?.email),
    };
    univisionStore.addUserAdmin(payload).then(
      (res) => {
        if (res && res.status === 200) {
          showAckMessage({ message: res?.data?.message || 'User Added Successfully' });
          getAllAgencyRepAPI();
          closeModal();
        } else {
          showAckErrorMessage({ message: res?.data?.message || 'Unable to add user.' });
        }
      },
      () => {
        showAckErrorMessage();
      }
    );
  };

  const handleUpdateUser = () => {
    const isValid = onValidate();
    if (!isValid) {
      return;
    }
    const payload = {
      first_name: formatText(formData?.first_name),
      last_name: formatText(formData?.last_name),
      password: formData?.password,
      phone: formatText(formData?.phone),
      user_id: modalData.id,
    };
    univisionStore.updateUserAdmin(payload).then(
      (res) => {
        if (res && res.status === 200) {
          showAckMessage({ message: 'User added successfully' });
          getAllAgencyRepAPI();
          closeModal();
        } else {
          showAckErrorMessage({ message: res?.data?.message || 'Unable to add user.' });
        }
      },
      () => {
        showAckErrorMessage();
      }
    );
  };

  const validateEmail = (email) => {
    if (!email) return false;
    const regex = /^([A-Za-z0-9_+\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (!regex.test(email)) return false;

    return true;
  };
  const validatePassword = (password) => {
    if (!password) return false;
    const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})([A-Za-z\d@$!%*?&])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,25}$/;
    if (!regex.test(password)) return false;

    return true;
  };

  const onValidate = () => {
    const errorList = {
      errorFieldsInfo: {
        first_name: false,
        last_name: false,
        phone: false,
        email: false,
        password: false,
        confirm_password: false,
      },
      messages: [],
    };
    const first_name = formData?.first_name;
    const last_name = formData?.last_name;
    const phone = formData?.phone;
    const email = formData?.email;
    const password = formData?.password;
    const confirm_passpord = formData?.confirm_password;

    if (!first_name || !last_name || !phone || (mode === 'add' && (!email || !password || !confirm_passpord))) {
      if (!first_name) {
        errorList.errorFieldsInfo.first_name = true;
      }
      if (!last_name) {
        errorList.errorFieldsInfo.last_name = true;
      }
      if (!phone) {
        errorList.errorFieldsInfo.phone = true;
      }
      if (mode === 'add') {
        if (!email) {
          errorList.errorFieldsInfo.email = true;
        }
        if (!password) {
          errorList.errorFieldsInfo.password = true;
        }
        if (!confirm_passpord) {
          errorList.errorFieldsInfo.confirm_passpord = true;
        }
      }
      errorList.messages.push(FillRequiredFields);
      showAckErrorMessage({ message: 'Please fill all the required fields!' });
    } else {
      if (first_name.length < 2 || !/^[a-zA-Z]*$/.test(first_name)) {
        errorList.messages.push(FirstNameValidation);
        showAckErrorMessage({
          message: 'First name should have more than a character and should not include digits or special characters!',
        });
        errorList.errorFieldsInfo.first_name = true;
      }
      if (last_name.length < 2 || !/^[a-zA-Z]*$/.test(last_name)) {
        errorList.messages.push(LastNameValidation);
        showAckErrorMessage({
          message: 'Last name should have more than a character and should not include digits or special characters!',
        });
        errorList.errorFieldsInfo.last_name = true;
      }
      if (phone.length !== 10 || !phone || !/^[1-9][0-9]{9}$/.test(phone)) {
        errorList.errorFieldsInfo.phone = true;
        errorList.messages.push(PhoneNumberValidation);
        showAckErrorMessage({
          message: 'Phone number should have 10 digits and should not include letters or special characters!',
        });
      }
      if (mode === 'add') {
        if (!validateEmail(email)) {
          errorList.errorFieldsInfo.email = true;
          errorList.messages.push(EmailIdValidation);
          showAckErrorMessage({ message: 'Enter a valid email ID!' });
        }
        if (!validatePassword(password)) {
          errorList.errorFieldsInfo.password = true;
          errorList.messages.push(PasswordValidation);
          showAckErrorMessage({
            message:
              'Password length should be more than 8 characters and less than 25 characters it should atleast include one upper case,one lower case, one digit and one special character !',
          });
        }
        if (password && confirm_passpord && confirm_passpord !== password) {
          errorList.errorFieldsInfo.confirm_passpord = true;
          errorList.messages.push(PasswordConfirmPasswordMismatch);
          showAckErrorMessage({ message: 'Password and confirm password does not match!' });
        }
      }
    }
    setErrorInfo(errorList);
    if (errorList.messages.length) {
      return false;
    }
    return true;
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6 mb5">
            <p className="mb5">
              First Name: <span className="error-indicator">*</span>
            </p>
            <input
              type="text"
              name="first_name"
              className={errorInfo.errorFieldsInfo['first_name'] ? 'error' : ''}
              value={formData.first_name}
              onChange={(e) => handleFormDataChange(e.target.value, 'first_name')}
              autoComplete="first-name"
            />
          </div>
          <div className="col-md-6 mb5">
            <p className="mb5">
              Last Name: <span className="error-indicator">*</span>
            </p>
            <input
              type="text"
              name="last_name"
              className={errorInfo.errorFieldsInfo['last_name'] ? 'error' : ''}
              value={formData.last_name}
              onChange={(e) => handleFormDataChange(e.target.value, 'last_name')}
              autoComplete="last-name"
            />
          </div>
          <div className="col-md-6 mb5">
            <p className="mb5">
              Phone: <span className="error-indicator">*</span>
            </p>
            <PhoneBox className={errorInfo.errorFieldsInfo['phone'] ? 'error' : ''}>
              <span className="plr7">+1</span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleFormDataChange(e.target.value, 'phone')}
                autoComplete="phone"
                className="border-none-imp"
              />
            </PhoneBox>
          </div>
          {mode === 'edit' ? (
            <div className="col-md-6 mb5">
              <p className="mb5">Action:</p>
              <CustomButton
                type="primary"
                buttonText={mode === 'edit' ? 'Update' : 'Add'}
                handleButtonClick={handleUpdateUser}
              />
              <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
            </div>
          ) : (
            <>
              <div className="col-md-6 mb5">
                <p className="mb5">
                  Email: <span className="error-indicator">*</span>
                </p>
                <input
                  type="email"
                  name="email"
                  className={errorInfo.errorFieldsInfo['email'] ? 'error' : ''}
                  onChange={(e) => handleFormDataChange(e.target.value, 'email')}
                  value={formData.email}
                  autoComplete="email"
                />
              </div>
              <div className="col-md-6">
                <p className="mb5">
                  New Password: <span className="error-indicator">*</span>
                </p>
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
                <p className="mb5">
                  Confirm Password: <span className="error-indicator">*</span>
                </p>
                <input
                  type="password"
                  name="confirm_passpord"
                  className={errorInfo.errorFieldsInfo['confirm_passpord'] ? 'error' : ''}
                  onChange={(e) => handleFormDataChange(e.target.value, 'confirm_password')}
                  value={formData.confirm_password}
                  autoComplete="confirm-password"
                />
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {mode !== 'edit' ? (
          <>
            <CustomButton type="primary" buttonText="Save" handleButtonClick={handleSubmitUser} />
            <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
          </>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
};

AddUserModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  univisionStore: PropTypes.object,
  getAllAgencyRepAPI: PropTypes.func,
  mode: PropTypes.string,
  modalData: PropTypes.object,
};
export default AddUserModal;
