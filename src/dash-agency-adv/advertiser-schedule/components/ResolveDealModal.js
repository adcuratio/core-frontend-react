import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import RadioButton from '../../../components/RadioButton';
import CustomDropDown, { StyledDropdown } from '../../../components/CustomDropDown';

import { processName } from '../../../common/utils';

const RadioWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  label > span {
    color: #243643 !important;
    font-size: 12px !important;
    font-weight: bold !important;
  }
`;

const ResolveDealModal = (props) => {
  const {
    showModal,
    companyList,
    resolveData,
    selectedBrand,
    handleApprove,
    closeModal,
    handleFormChange,
    onHandleSelect,
    selectedValue,
    selectedSubBrand,
  } = props;

  const options = [
    {
      id: 1,
      label: 'Brand',
      onChangeFunction: onHandleSelect,
      value: 'brand',
    },
    {
      id: 2,
      label: 'SubBrand',
      onChangeFunction: onHandleSelect,
      value: 'sub_brand',
    },
    {
      id: 3,
      label: `Create New Entity(Brand) as ${resolveData.adspot_list[0].default_brand}`,
      onChangeFunction: onHandleSelect,
      value: 'new_brand',
    },
  ];

  const isBrandSelected = () => companyList[0]?.company?.brands?.some((brand) => brand.isSelected);

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static">
      <Modal.Header closeButton>Resolve Deals</Modal.Header>
      <Modal.Body>
        <RadioWrapper>
          {options.map((option) => (
            <RadioButton
              key={option.id}
              label={option.label}
              isChecked={selectedValue === option.value || false}
              value={option.id}
              onChangeFunction={() => option.onChangeFunction(option.value)}
            />
          ))}
        </RadioWrapper>

        {(selectedValue === 'brand' || selectedValue === 'sub_brand') && (
          <>
            <div className="form-title">
              <span>Select brand to merge with</span>
            </div>
            <StyledDropdown>
              <CustomDropDown
                key="brand"
                options={companyList[0].company.brands}
                selectedValue={{ name: processName(selectedBrand), id: selectedBrand.id }}
                onSelect={(option) => handleFormChange(option.id, 'brand')}
                optionKey={'display_name'}
              />
            </StyledDropdown>
          </>
        )}

        {selectedValue === 'sub_brand' && companyList?.length !== 0 && isBrandSelected() && (
          <div className="mt10 mb20">
            <div className="form-title">
              <span>Select sub-brand to merge with</span>
            </div>

            <StyledDropdown>
              <CustomDropDown
                key="subbrand"
                options={selectedBrand.sub_brands_with_ids}
                selectedValue={{ name: selectedSubBrand.display_name, id: selectedSubBrand.id }}
                onSelect={(option) => handleFormChange(option.id, 'subBrand')}
                optionKey={'display_name'}
              />
            </StyledDropdown>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText={'Approve'} handleButtonClick={handleApprove} />
      </Modal.Footer>
    </Modal>
  );
};

ResolveDealModal.propTypes = {
  showModal: PropTypes.bool,
  companyList: PropTypes.array,
  resolveData: PropTypes.object,
  selectedBrand: PropTypes.object,
  handleApprove: PropTypes.func,
  closeModal: PropTypes.func,
  handleFormChange: PropTypes.func,
  onHandleSelect: PropTypes.func,
  selectedValue: PropTypes.string,
  selectedSubBrand: PropTypes.object,
};

ResolveDealModal.defaultProps = {
  showModal: false,
  companyList: [],
  resolveData: {},
  selectedBrand: {},
  selectedSubBrand: {},
  handleApprove: () => {},
  closeModal: () => {},
  handleFormChange: () => {},
  onHandleSelect: () => {},
  selectedValue: 'brand',
};

export default ResolveDealModal;
