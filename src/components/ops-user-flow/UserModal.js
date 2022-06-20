import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import CustomButton from '../CustomButton';

import { showAckMessage, showAckErrorMessage, formatText } from '../../common/utils';

import {
  AgencyCreatedSuccess,
  AgencyUpdatedSuccess,
  DistributorUpdatedSuccess,
  NetworkCreatedSuccess,
  NetworkUpdatedSuccess,
  ChannelAdminUpdatedSuccess,
} from './MessageConstants';

const UserModal = inject('userStore')(
  observer((props) => {
    const { showModal, closeModal, userStore, handleDataChangeOnSuccess, modalData, mode, type } = props;
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
      if (mode === 'edit') {
        const formDataCpy = JSON.parse(JSON.stringify(formData));
        if (type === 'channel' || type === 'distributor' || type === 'network') {
          formDataCpy.name = modalData.display_name;
        } else {
          formDataCpy.name = modalData.name;
        }

        setFormData(formDataCpy);
      }
    }, []);

    const onSaveData = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (mode === 'add') {
        const payload = {
          name: formatText(formData.name),
        };
        if (type === 'agency') {
          userStore.saveAgency(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: AgencyCreatedSuccess });
                payload.id = response.data.agency_id;
                payload.agency_id = response.data.agency_id;
                handleDataChangeOnSuccess(payload);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.data?.message ?? 'Something went wrong while adding Agency!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'network') {
          userStore.saveNetwork(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: NetworkCreatedSuccess });
                handleDataChangeOnSuccess(response.data);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.data?.message ?? 'Something went wrong while adding Network!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        }
      } else {
        if (type === 'agency') {
          const payload = {
            agency_id: modalData.id,
            name: formatText(formData.name),
          };
          userStore.editAgency(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: AgencyUpdatedSuccess });
                handleDataChangeOnSuccess(payload);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.data?.message ?? 'Something went wrong while updating Agency!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'distributor') {
          const payload = {
            operator_id: modalData.id,
            display_name: formatText(formData.name),
          };
          userStore.editOperator(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: DistributorUpdatedSuccess });
                handleDataChangeOnSuccess(payload);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.data?.message ?? 'Something went wrong while updating Distributor!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'network') {
          const payload = {
            network_id: modalData.id,
            name: formatText(formData.name),
          };
          userStore.editNetwork(payload).then(
            (response) => {
              if (response.success) {
                showAckMessage({ message: NetworkUpdatedSuccess });
                handleDataChangeOnSuccess(payload);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.date?.message ?? 'Something went wrong while updating Network!',
                });
              }
            },
            () => {
              showAckErrorMessage();
            }
          );
        } else if (type === 'channel') {
          const payload = {
            network_id: modalData.id,
            name: formatText(formData.name),
          };
          userStore.editNetwork(payload).then(
            (response) => {
              if (response.success) {
                payload.channel_id = modalData.id;
                payload.network_id = modalData.parent;
                showAckMessage({ message: ChannelAdminUpdatedSuccess });
                handleDataChangeOnSuccess(payload);
                closeModal();
              } else {
                showAckErrorMessage({
                  message: response?.data?.message ?? 'Something went wrong while updating Channel!',
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
      const errorInfoCpy = {
        errorFieldsInfo: {
          name: false,
        },
        messages: [],
      };
      if (formatText(formData.name).length < 1) {
        errorInfoCpy.errorFieldsInfo.name = true;
        errorInfoCpy.messages.push('Please enter name to proceed!');
        setErrorInfo(errorInfoCpy);
      }
      if (formatText(formData.name).length > 250) {
        errorInfoCpy.errorFieldsInfo.name = true;
        errorInfoCpy.messages.push('Input characters should not be greater than 250 characters');
        setErrorInfo(errorInfoCpy);
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
        <Modal.Header closeButton>
          {type === 'agency'
            ? mode === 'add'
              ? 'Add Agency Details'
              : 'Edit Agency Details'
            : type === 'distributor'
            ? mode === 'add'
              ? 'Add Distributor Details'
              : 'Edit Distributor Details'
            : type === 'network'
            ? mode === 'add'
              ? 'Add Network Details'
              : 'Edit Network Details'
            : type === 'channel'
            ? mode === 'add'
              ? 'Add Channel Details'
              : 'Edit Channel Details'
            : null}
        </Modal.Header>
        <Modal.Body>
          <p className="mb5">
            Name: <span className="error-indicator">*</span>
          </p>
          <input
            type="text"
            onChange={(e) => handleFormChange('name', e.target.value)}
            value={formData.name}
            className={errorInfo.errorFieldsInfo['name'] ? 'error' : ''}
          />
          {errorInfo?.messages?.length ? (
            <div className="alert-danger pt10 pl10 pr10 pb5">
              {errorInfo.messages?.map((data, index) => (
                <div className="pb5" key={`error_message_${index}`}>
                  {data}
                </div>
              ))}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Save" handleButtonClick={onSaveData} />
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

export default UserModal;
