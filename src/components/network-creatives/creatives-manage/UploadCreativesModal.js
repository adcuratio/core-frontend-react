import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import { toJS } from 'mobx';
import { formatText, getEntityType, showAckErrorMessage, showAckMessage } from '../../../common/utils';

import CustomButton from '../../CustomButton';
import CreativeForm from './CreativeForm';

const formInitialState = {
  selectedCompany: 0,
  isciEntity: '',
  isciIdentifier: '',
  isciCreative: '',
  fileData: null,
  selectedDeliveryVendorOption: '',
  deliveryVendorFreeText: '',
  selectedChannels: [],
  houseId: '',
};

const UploadCreativesModal = inject('networkStore')(
  observer((props) => {
    const { networkStore, showModal, closeModal, getAllCreatives, isFoxDash } = props;

    const [uploadCreativesData, setUploadCreativesData] = useState(formInitialState);

    //Function for handling the submit button while uploading creatives.
    const handleISCISubmit = () => {
      const uploadCreativesCpy = { ...uploadCreativesData };
      let deliveryVendorVal = uploadCreativesCpy.selectedDeliveryVendorOption;
      if (uploadCreativesCpy.selectedDeliveryVendorOption === 'other') {
        deliveryVendorVal = formatText(uploadCreativesCpy.deliveryVendorFreeText);
      }
      if (
        formatText(uploadCreativesData.isciCreative) &&
        formatText(uploadCreativesData.isciIdentifier) &&
        uploadCreativesData.fileData &&
        uploadCreativesData.fileData.files[0] &&
        uploadCreativesData.isciEntity &&
        uploadCreativesData.isciEntity.id &&
        deliveryVendorVal &&
        uploadCreativesData.selectedChannels.length
      ) {
        networkStore
          .saveCreative(
            formatText(uploadCreativesData.isciCreative),
            formatText(uploadCreativesData.isciIdentifier),
            uploadCreativesData.fileData.files[0],
            uploadCreativesData.isciEntity.id,
            getEntityType(uploadCreativesData.isciEntity),
            deliveryVendorVal,
            uploadCreativesData.selectedChannels,
            formatText(uploadCreativesData.houseId)
          )
          .then(
            (res) => {
              if (res?.success) {
                if (res.data && res.data.is_exist) {
                  showAckErrorMessage({ message: 'ID already exists. Please try again with different Identifier.' });
                } else {
                  showAckMessage({
                    message: 'Upload successful.',
                  });
                  closeUploadModal();
                  getAllCreatives();
                }
              } else
                showAckErrorMessage({ message: res?.message ?? 'Something went wrong while Uploading Creative file!' });
            },
            () => {
              showAckErrorMessage();
            }
          );
      } else showAckErrorMessage({ message: 'Please select or fill all the required fields.' });
    };

    // Function to handle closing of modal.
    const closeUploadModal = () => {
      setUploadCreativesData({ ...formInitialState });
      closeModal();
    };

    // Function to get all the companies data.
    const companyData = toJS(networkStore.companies);

    return (
      <Modal show={showModal} onHide={closeUploadModal} backdrop="static">
        <Modal.Header closeButton>Upload New Creatives</Modal.Header>
        <Modal.Body>
          <CreativeForm
            {...props}
            uploadCreativesData={uploadCreativesData}
            companyData={companyData}
            setUploadCreativesData={setUploadCreativesData}
            isFoxDash={isFoxDash}
          />
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            type="primary"
            buttonText="Submit"
            buttonClassName="element-right-align mt5"
            handleButtonClick={handleISCISubmit}
          ></CustomButton>
        </Modal.Footer>
      </Modal>
    );
  })
);

UploadCreativesModal.propTypes = {
  networkStore: PropTypes.object,
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  getAllCreatives: PropTypes.func,
  channelList: PropTypes.array,
  deliveryVendorChoices: PropTypes.array,
  setChannelList: PropTypes.func,
  isFoxDash: PropTypes.bool,
};

UploadCreativesModal.defaultProps = {
  getAllCreatives: () => {},
  deliveryVendorChoices: [],
  isFoxDash: false,
};

export default UploadCreativesModal;
