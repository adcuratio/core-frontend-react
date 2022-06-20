import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { observer, inject } from 'mobx-react';

import UploadCreatives from '../../../components/UploadCreatives';

const UploadCreativesModal = inject(
  'companyStore',
  'campaignStore'
)(
  observer((props) => {
    const { showModal, closeModal, deliveryVendorChoices, getAllCreatives } = props;

    return (
      <Modal show={showModal} onHide={closeModal} backdrop="static">
        <Modal.Header closeButton>Upload New Creatives</Modal.Header>
        <Modal.Body>
          <UploadCreatives
            deliveryVendorChoices={deliveryVendorChoices}
            getAllCreatives={getAllCreatives}
            closeModal={closeModal}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  })
);
UploadCreativesModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  getAllCreatives: PropTypes.func,
  deliveryVendorChoices: PropTypes.array,
};

export default UploadCreativesModal;
