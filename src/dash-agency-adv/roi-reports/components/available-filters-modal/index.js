import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../../components/CustomButton';

import ArrayCheckboxContainer from '../array-checkbox-container';

const AvailableFiltersModal = (props) => {
  const { showModal, toggleModal, handleSelectAllOrNoneFunc, handleTabChangeFunc, filterData, type } = props;

  const handleCheckboxChange = (data) => {
    handleTabChangeFunc(filterData, data, type);
  };

  const getCheckboxContent = () => {
    let arrayData;
    if (type === 'credit') {
      arrayData = filterData.filters;
    } else {
      arrayData = filterData.template.filters;
    }
    if (arrayData) {
      const arrayDataComp = [];
      arrayDataComp.push(
        <ArrayCheckboxContainer
          key={`${type}-${filterData.title}`}
          type={`${type}-${filterData.title}`}
          arrayData={arrayData}
          handleCheckboxChange={handleCheckboxChange}
        />
      );
      return arrayDataComp;
    }
  };

  return (
    <Modal show={showModal} onHide={toggleModal}>
      <Modal.Header closeButton>
        <Modal.Title> Available Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb20">
          <CustomButton
            type="primary"
            buttonText="Select All"
            buttonClassName="mr10"
            handleButtonClick={() => handleSelectAllOrNoneFunc(type, filterData, 'all')}
          />
          <CustomButton
            type="primary"
            buttonText="Select None"
            handleButtonClick={() => handleSelectAllOrNoneFunc(type, filterData, 'none')}
          />
        </div>
        {getCheckboxContent()}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={toggleModal} />
      </Modal.Footer>
    </Modal>
  );
};

AvailableFiltersModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  handleSelectAllOrNoneFunc: PropTypes.func,
  filterData: PropTypes.object,
  handleTabChangeFunc: PropTypes.func,
  type: PropTypes.string,
};

AvailableFiltersModal.defaultProps = {
  showModal: false,
  toggleModal: () => {},
  handleSelectAllOrNoneFunc: () => {},
  filterData: {},
  handleTabChangeFunc: () => {},
  type: '',
};

export default AvailableFiltersModal;
