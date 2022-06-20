import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Panel, Modal } from 'react-bootstrap';
import styled from 'styled-components';

import CustomButton from '../CustomButton';

import { showAckMessage, showAckErrorMessage, formatEmail, formatText } from '../../common/utils';

import {
  AgencyAdminCreatedSuccess,
  AgencyAdminUpdatedSuccess,
  DistributorAdminCreatedSuccess,
  DistributorAdminUpdatedSuccess,
  NetworkAdminCreatedSuccess,
  NetworkAdminUpdatedSuccess,
  FillRequiredFields,
  FirstNameValidation,
  LastNameValidation,
  PhoneNumberValidation,
  EmailIdValidation,
  PasswordValidation,
  PasswordConfirmPasswordMismatch,
} from './MessageConstants';

export const PhoneBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #b4b8bb;
`;

// add this from utils once account management merged
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

const UserAdminInfo = inject('userStore')(
  observer((props) => {
    const { closeModule, userStore, selectedUser, handleDataChangeOnSuccess, accordianData, mode, activeKey, type } =
      props;
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
        formDataCpy.first_name = accordianData?.first_name;
        formDataCpy.last_name = accordianData?.last_name;
        formDataCpy.phone = accordianData?.phone?.replace('+1', '');
        setFormData(formDataCpy);
      }
    }, []);

    const onSaveData = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (mode === 'add') {
        if (type === 'agency') {
          const payload = {
            agency_id: selectedUser?.id,
            first_name: formatText(formData?.first_name),
            last_name: formatText(formData?.last_name),
            password: formData?.password,
            phone: formatText(formData?.phone),
            email: formatEmail(formData?.email),
          };
          userStore.saveAgencyAdmin(payload).then(
            (response) => {
              if (response.success) {
                payload.id = response.data.user_id;
                handleDataChangeOnSuccess(payload);
                showAckMessage({ message: AgencyAdminCreatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message: JSON.stringify(response?.data?.message) ?? 'Something went wrong while adding Agency Admin!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'distributor') {
          const payload = {
            operator_id: selectedUser?.id,
            first_name: formatText(formData?.first_name),
            last_name: formatText(formData?.last_name),
            password: formData?.password,
            phone: formatText(formData?.phone),
            email: formatEmail(formData?.email),
          };
          userStore.saveOperatorAdmin(payload).then(
            (response) => {
              if (response.success) {
                payload.id = response.data.user_id;
                handleDataChangeOnSuccess(payload);
                showAckMessage({ message: DistributorAdminCreatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message:
                    JSON.stringify(response?.data?.message) ?? 'Something went wrong while adding Distributor Admin !',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'network') {
          const payload = {
            network_id: selectedUser?.id,
            first_name: formatText(formData?.first_name),
            last_name: formatText(formData?.last_name),
            password: formData?.password,
            phone: formatText(formData?.phone),
            email: formatEmail(formData?.email),
          };
          userStore.saveNetworkAdmin(payload).then(
            (response) => {
              if (response.success) {
                payload.id = response.data.user_id;
                handleDataChangeOnSuccess(payload);
                showAckMessage({ message: NetworkAdminCreatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message:
                    JSON.stringify(response?.data?.message) ?? 'Something went wrong while adding Network Admin!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        }
      } else {
        const payload = {
          user_id: accordianData?.id,
          first_name: formatText(formData?.first_name),
          last_name: formatText(formData?.last_name),
          phone: formatText(formData?.phone),
          read_only: accordianData?.read_only,
        };
        if (type === 'agency') {
          userStore.editAgencyAdmin(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: AgencyAdminUpdatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message:
                    JSON.stringify(response?.data?.message) ?? 'Something went wrong wihile Updating Agency Admin!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'distributor') {
          userStore.editOperatorAdmin(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: DistributorAdminUpdatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message:
                    JSON.stringify(response?.data?.message) ?? 'Something went wrong while updating Distributor Admin!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'network') {
          userStore.editNetworkAdmin(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: NetworkAdminUpdatedSuccess });
                closeModule();
              } else {
                showAckErrorMessage({
                  message:
                    JSON.stringify(response?.data?.message) ?? 'Something went wrong while updating Network Admin!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        }
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
      } else {
        if (first_name.length < 2 || !/^[a-zA-Z]*$/.test(first_name)) {
          errorList.messages.push(FirstNameValidation);
          errorList.errorFieldsInfo.first_name = true;
        }
        if (last_name.length < 2 || !/^[a-zA-Z]*$/.test(last_name)) {
          errorList.messages.push(LastNameValidation);
          errorList.errorFieldsInfo.last_name = true;
        }
        if (phone.length !== 10 || !phone || !/^[1-9][0-9]{9}$/.test(phone)) {
          errorList.errorFieldsInfo.phone = true;
          errorList.messages.push(PhoneNumberValidation);
        }
        if (mode === 'add') {
          if (!validateEmail(email)) {
            errorList.errorFieldsInfo.email = true;
            errorList.messages.push(EmailIdValidation);
          }
          if (!validatePassword(password)) {
            errorList.errorFieldsInfo.password = true;
            errorList.messages.push(PasswordValidation);
          }
          if (password && confirm_passpord && confirm_passpord !== password) {
            errorList.errorFieldsInfo.confirm_passpord = true;
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

    const renderMainContent = () => (
      <>
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
                handleButtonClick={onSaveData}
              />
              <CustomButton
                type="secondary"
                buttonText="Close"
                buttonClassName="ml10"
                handleButtonClick={closeModule}
              />
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
        {errorInfo?.messages?.length ? (
          <div className="alert-danger pt10 pl10 pr10 pb5">
            {errorInfo.messages?.map((data, index) => (
              <div className="pb5" key={`error_message_${index}`}>
                {data}
              </div>
            ))}
          </div>
        ) : null}
      </>
    );
    if (mode === 'add') {
      return (
        <Modal show={true} onHide={closeModule}>
          <Modal.Header closeButton>
            {type === 'agency' ? 'Add New Agency Admin' : type === 'distributor' ? 'Add New Distributor Admin' : null}
          </Modal.Header>
          <Modal.Body>{renderMainContent()}</Modal.Body>
          <Modal.Footer>
            <CustomButton type="primary" buttonText="Save" handleButtonClick={onSaveData} />
            <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModule} />
          </Modal.Footer>
        </Modal>
      );
    }
    return (
      <Panel eventKey={accordianData.id} key={accordianData.id}>
        <Panel.Heading>
          <Panel.Title toggle>{`${formData.first_name} ${formData.last_name}`}</Panel.Title>
        </Panel.Heading>
        <Panel.Body collapsible>{activeKey === accordianData.id ? renderMainContent() : null}</Panel.Body>
      </Panel>
    );
  })
);

export default UserAdminInfo;
