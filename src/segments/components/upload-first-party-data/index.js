import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';

import './index.css';

const sampleFileLink = '/data/stb_file.xlsx';

const FirstPartyWrapper = styled.div`
  background-color: #e7e9ea;
  padding: 20px;
`;

const UploadFirstPartyData = (props) => {
  const {
    handleFileUploadSubmit
  } = props;

  const [counter] = useState(0);
  const fileInputRef = useRef();

  const onDownloadFile = () => {
    window.open(sampleFileLink);
  };

  const onSubmitFile = () => {
    if (fileInputRef.current.files[0]) {
      handleFileUploadSubmit(fileInputRef.current.files[0]);
    }
  };

  const getFileUploadComp = (type) => {
    let title = 'Epsilon file Upload';
    if (type === 'adcuratio_file_upload') {
      title = 'Adcuratio file upload';
    }
    return (
      <div className="mb10">
        <h3 className="segments-fu-title">{title}</h3>
        <div className="mt5">
          <span className="mr5">Select file:</span>
          <label><input key={counter} type="file" accept=".csv,.xls,.xlsx" ref={fileInputRef} /></label>
          <CustomButton
            type='primary'
            buttonText="Submit"
            handleButtonClick={onSubmitFile} />
        </div>
        <p className="segments-download-sample-file" onClick={onDownloadFile}>Download Sample File</p>
      </div>
    );
  }

  return (
    <FirstPartyWrapper>
      { getFileUploadComp('adcuratio_file_upload') }
      { getFileUploadComp('epsilon_file_upload') }
      <p className="sample-download pt10">* Data Provider is: epsilon. To change data provider contact Super admin.</p>
      <p className="pt10 pb10">
        To upload very large files, please go to our FTP Server &nbsp;
        <a className="bold" href="ftp://ftpupload.adcuratio.net">ftpupload.adcuratio.net</a>
        . You can use FileZilla or WinSCP to upload files.
      </p>
    </FirstPartyWrapper>
  );
};

UploadFirstPartyData.propTypes = {
  handleFileUploadSubmit: PropTypes.func,
};

export default UploadFirstPartyData;
