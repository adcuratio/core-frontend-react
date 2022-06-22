import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

import CustomButton from '../../CustomButton';

const UploadNewDeal = inject('advSchStore')(
  observer((props) => {
    const { showModal, closeModal, advSchStore, getListingData, isUnivisionDash } = props;

    const [ediFile, setEdiFile] = useState({});

    const handleFileChange = (e) => {
      if (e.target.files?.length) {
        setEdiFile(e.target.files[0]);
      }
    };

    const onUploadFile = () => {
      if (!(ediFile && ediFile.name)) {
        showAckErrorMessage({
          message: 'Please select a file',
        });
        return;
      }

      const media = new FormData();
      media.append('edi_file', ediFile);
      advSchStore.uploadEdiFromAgency(media).then(
        (res) => {
          setEdiFile({});
          if (res && (res.status === 200 || res.status === 201)) {
            showAckMessage({
              message: 'Successfully uploaded',
            });
            getListingData();
            closeModal();
          } else {
            showAckErrorMessage({ message: 'Something went wrong while uploading Deal file !' });
          }
        },
        () => {
          setEdiFile({});
          showAckErrorMessage();
        }
      );
    };

    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload new deal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="campaign-upload-wrapper">
            <div className="upload-block">
              <div className="file-name-wrapper">
                <span className="file-text">File: </span>
                <span className="upload-file-name" title={ediFile.name}>
                  {ediFile.name}
                </span>
              </div>
              <div className="btn btn-default campaign-btn file-upload" ng-show="!uploadResponse">
                <span className="glyphicon glyphicon-upload"></span> Browse
                <input
                  type="file"
                  id="uploadFile"
                  onChange={handleFileChange}
                  accept={isUnivisionDash ? '.xlsx' : '.xml'}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
          <CustomButton type="primary" buttonText="Upload" buttonClassName="ml10" handleButtonClick={onUploadFile} />
        </Modal.Footer>
      </Modal>
    );
  })
);

UploadNewDeal.propTypes = {
  showModal: PropTypes.func,
  closeModal: PropTypes.func,
  getListingData: PropTypes.func,
  isUnivisionDash: PropTypes.bool,
};

UploadNewDeal.defaultProps = {
  showModal: () => {},
  closeModal: () => {},
  getListingData: () => {},
  isUnivisionDash: false,
};

export default UploadNewDeal;
