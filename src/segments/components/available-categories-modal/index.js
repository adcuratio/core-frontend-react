import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

import ArrayCheckboxContainer from '../array-checkbox-container';

const AvailableCategoriesModal = (props) => {
  const { showModal, toggleModal, handleButtonAction, filterData, handleCheckboxChange, type } = props;

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title> Available Categories</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb20">
          <CustomButton
            type="primary"
            buttonText="Select All"
            buttonClassName="mr10"
            handleButtonClick={() => handleButtonAction(type, 'all')}
          />
          <CustomButton
            type="primary"
            buttonText="Select None"
            handleButtonClick={() => handleButtonAction(type, 'none')}
          />
        </div>
        <ArrayCheckboxContainer
          type={`${type}-${filterData.title}`}
          arrayData={filterData}
          handleCheckboxChange={handleCheckboxChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" buttonClassName="" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

AvailableCategoriesModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  handleButtonAction: PropTypes.func,
  filterData: PropTypes.array,
  handleCheckboxChange: PropTypes.func,
  type: PropTypes.string,
};

AvailableCategoriesModal.defaultProps = {
  showModal: false,
  toggleModal: () => {},
  handleButtonAction: () => {},
  filterData: [],
  handleCheckboxChange: () => {},
  type: '',
};

export default AvailableCategoriesModal;
