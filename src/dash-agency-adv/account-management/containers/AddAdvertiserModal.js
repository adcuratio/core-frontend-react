import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import CustomButton from '../../../components/CustomButton';

import ValidationErrorMessage from '../components/ValidationErrorMessage';
import FormLabel from '../components/FormLabel';

import {
  FillRequiredFields,
  CreateAdvertiserSuccessMessage,
  NameLengthValidation,
} from '../constants/MessageConstants';

import { showAckMessage, showAckErrorMessage, formatText } from '../../../common/utils';

const AddAdvertiserModal = inject('accountManagementStore')(
  observer((props) => {
    const { showModal, closeModal, subagencyList, segments, accountManagementStore, handleAdvertiserDataChange } =
      props;
    const [formData, setFormData] = useState({
      sub_agency: {},
      name: '',
      industry: '',
      sub_industry: '',
    });
    const [errorInfo, setErrorInfo] = useState({
      errorFieldsInfo: {
        sub_agency: false,
        name: false,
        industry: false,
        sub_industry: false,
      },
      messages: [],
    });
    const [subsegments, setSubsegments] = useState([]);

    const clearValidation = () => {
      if (errorInfo.messages.length) {
        const errorList = {
          errorFieldsInfo: {
            sub_agency: false,
            name: false,
            industry: false,
            sub_industry: false,
          },
          messages: [],
        };
        setErrorInfo(errorList);
      }
    };

    const handleFormChange = (id, value) => {
      clearValidation(); // Clearing validation message if user is changing somethings
      const formDataCpy = JSON.parse(JSON.stringify(formData));
      const subagencyListCpy = JSON.parse(JSON.stringify(subagencyList));
      const segmentsCpy = JSON.parse(JSON.stringify(segments));
      const subsegmentsCpy = JSON.parse(JSON.stringify(subsegments));
      if (id === 'sub_agency') {
        formDataCpy.sub_agency = subagencyListCpy[Number(value)];
      } else if (id === 'name') {
        formDataCpy.name = value;
      } else if (id === 'industry') {
        formDataCpy.industry = segmentsCpy[Number(value)];
        setSubsegments(formDataCpy.industry.sub_segment);
      } else if (id === 'sub_industry') {
        formDataCpy.sub_industry = subsegmentsCpy[Number(value)];
      }
      setFormData(formDataCpy);
    };

    const onValidate = () => {
      const errorInfoCpy = {
        errorFieldsInfo: {
          sub_agency: false,
          name: false,
          industry: false,
          sub_industry: false,
        },
        messages: [],
      };
      if (!formData.sub_agency.id) {
        errorInfoCpy.errorFieldsInfo.sub_agency = true;
      }
      if (!formatText(formData.name)) {
        errorInfoCpy.errorFieldsInfo.name = true;
      }
      if (!formData.industry) {
        errorInfoCpy.errorFieldsInfo.industry = true;
      }
      if (!formData.sub_industry) {
        errorInfoCpy.errorFieldsInfo.sub_industry = true;
      }
      if (!formData.sub_agency || !formatText(formData.name) || !formData.industry || !formData.sub_industry) {
        errorInfoCpy.messages.push(FillRequiredFields);
      }
      if (formData.name.length > 250) {
        errorInfoCpy.messages.push(NameLengthValidation);
      }
      setErrorInfo(errorInfoCpy);
      if (errorInfoCpy.messages.length) {
        return false;
      }
      return true;
    };

    const onSaveAdvertiserDetails = () => {
      const isValid = onValidate();
      if (!isValid) {
        return;
      }
      if (!formData.sub_agency.id) {
        showAckErrorMessage({ message: 'Please select the Sub-Agency.' });
        return;
      }
      const payload = {
        name: formatText(formData.name),
        sub_agency_id: formData.sub_agency.id,
        sub_segment_id: formData.sub_industry.id,
      };
      accountManagementStore.saveAdvertiser(payload).then(
        (response) => {
          if (response.success) {
            showAckMessage({ message: CreateAdvertiserSuccessMessage });
            payload.id = response.data.company_id;
            handleAdvertiserDataChange(payload);
            closeModal();
          } else {
            showAckErrorMessage({
              message: response?.message ?? 'Something went wrong while adding Advertiser!',
            });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>Add Advertiser Details</Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <FormLabel labelName="Sub-Agency" />
              <div className="select-wrapper">
                <select
                  className={errorInfo.errorFieldsInfo['sub_agency'] ? 'error' : ''}
                  onChange={(e) => handleFormChange('sub_agency', e.target.value)}
                >
                  <option value="" disabled selected>
                    --SELECT--
                  </option>
                  {subagencyList?.map((subagency, index) => (
                    <option key={`subagency_dropdown_${index}`} value={index}>
                      {subagency.name}
                    </option>
                  ))}
                </select>
                <span className="caret select-icon"></span>
              </div>
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Name" />
              <input
                type="text"
                onChange={(e) => handleFormChange('name', e.target.value)}
                className={errorInfo.errorFieldsInfo['name'] ? 'error' : ''}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <FormLabel labelName="Industry" />
              <div className="select-wrapper">
                <select
                  className={errorInfo.errorFieldsInfo['industry'] ? 'error' : ''}
                  onChange={(e) => handleFormChange('industry', e.target.value)}
                >
                  <option value="" disabled selected>
                    --SELECT--
                  </option>
                  {segments?.map((segment, index) => (
                    <option key={`segment_dropdown_${index}`} value={index}>
                      {segment.name}
                    </option>
                  ))}
                </select>
                <span className="caret select-icon"></span>
              </div>
            </div>
            <div className="col-md-6">
              <FormLabel labelName="Sub-Industry" />
              <div className="select-wrapper">
                <select
                  className={errorInfo.errorFieldsInfo['sub_industry'] ? 'error' : ''}
                  onChange={(e) => handleFormChange('sub_industry', e.target.value)}
                >
                  <option value="" disabled selected>
                    --SELECT--
                  </option>
                  {subsegments?.map((subsegment, index) => (
                    <option key={`subsegment_dropdown_${index}`} value={index}>
                      {subsegment.name}
                    </option>
                  ))}
                </select>
                <span className="caret select-icon"></span>
              </div>
            </div>
          </div>
          <ValidationErrorMessage errorInfo={errorInfo} />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="primary" buttonText="Save" handleButtonClick={onSaveAdvertiserDetails} />
          <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    );
  })
);

export default AddAdvertiserModal;
