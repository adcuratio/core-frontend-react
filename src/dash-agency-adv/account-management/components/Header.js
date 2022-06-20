import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  AddSubagency,
  AddAdvertiser,
  AddAgencyRep,
  AddAdvertiserAdmin,
  AddBrand,
  AddSubBrand,
} from '../constants/ModalConstants';

import CustomButton from '../../../components/CustomButton';

import SearchBox from '../../../components/SearchBox';

export const SearchBoxWrapper = styled.div`
  width: 285px;
  border: 1px solid black;
`;

const Header = (props) => {
  const { headingName, searchValue, handleSearchTextChange, handleButtonAction, activeTab, isReadonly } = props;

  return (
    <div className="flex-container2 ml10 mr10 mt10">
      <h3 className="main-heading">{headingName}</h3>
      <div className="flex-container1">
        <SearchBox handleSearchTextChange={handleSearchTextChange} searchValue={searchValue} />
        {activeTab.id === 'subagencies' ? (
          <CustomButton
            type="primary"
            buttonText="Add Sub-Agency"
            buttonClassName="ml15"
            handleButtonClick={() => handleButtonAction(AddSubagency)}
            isDisabled={isReadonly}
          />
        ) : activeTab.id === 'advertisers' ? (
          <CustomButton
            type="primary"
            buttonText="Add Advertiser"
            buttonClassName="ml15"
            handleButtonClick={() => handleButtonAction(AddAdvertiser)}
            isDisabled={isReadonly}
          />
        ) : activeTab.id === 'agency_rep' ? (
          <CustomButton
            type="primary"
            buttonText="Add Agency Representative"
            buttonClassName="ml15"
            handleButtonClick={() => handleButtonAction(AddAgencyRep)}
            isDisabled={isReadonly}
          />
        ) : activeTab.id === 'advertiser_admin' ? (
          <CustomButton
            type="primary"
            buttonText="Add Advertiser Admin"
            buttonClassName="ml15"
            handleButtonClick={() => handleButtonAction(AddAdvertiserAdmin)}
            isDisabled={isReadonly}
          />
        ) : activeTab.id === 'brands' ? (
          <>
            <CustomButton
              type="primary"
              buttonText="Add Brand"
              buttonClassName="ml15"
              handleButtonClick={() => handleButtonAction(AddBrand)}
              isDisabled={isReadonly}
            />
            <CustomButton
              type="primary"
              buttonText="Add Sub Brand"
              buttonClassName="ml15"
              handleButtonClick={() => handleButtonAction(AddSubBrand)}
              isDisabled={isReadonly}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

Header.propTypes = {
  headingName: PropTypes.string,
  searchValue: PropTypes.string,
  handleSearchTextChange: PropTypes.func,
  handleButtonAction: PropTypes.func,
  activeTab: PropTypes.object,
  isReadonly: PropTypes.bool,
};

Header.defaultProps = {
  headingName: '',
  searchValue: '',
  handleSearchTextChange: () => {},
  handleButtonAction: () => {},
  activeTab: {},
};

export default Header;
