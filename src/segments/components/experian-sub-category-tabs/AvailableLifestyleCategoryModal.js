import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

const AvailableLifeStyleCategoryModal = (props) => {
  const { showModal, toggleModal, handleTabChangeFunc, filterData, subCategoryName } = props;
  const getCategoryContent = () =>
    filterData.template.sub_cat.map((cat, index) => (
      <li
        key={`${'experian_sub'}-${cat.name}-${index}`}
        className="checkbox-container mr10 mb10"
        onClick={() => handleTabChangeFunc(filterData, subCategoryName, cat)}
      >
        <span className={cat[`is${filterData.name}TabSelected`] ? 'segments-tab-active' : ''}>
          {cat.title ? cat.title : cat.name}
        </span>
      </li>
    ));

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title> Select Category </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="exp-lifestyle-modal-body-height">
          <ul>{getCategoryContent()}</ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

AvailableLifeStyleCategoryModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  handleTabChangeFunc: PropTypes.func,
  filterData: PropTypes.object,
  subCategoryName: PropTypes.string,
};

export default AvailableLifeStyleCategoryModal;
