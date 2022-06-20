import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';

export const Container = styled.header`
  @media only screen and (max-width: 1440px) {
    width: 85%;
  }
`;

const CreativesHeader = (props) => {
  const { onPageRefresh, getAllCompanies, isReadonly } = props;

  return (
    <div>
      <div className="flex-container2">
        <p className="main-heading">Creatives</p>
        <div className="flex-container1">
          <div className="ml10">
            <CustomButton
              type="primary"
              handleButtonClick={getAllCompanies}
              buttonText="Upload a New Creative"
              isDisabled={isReadonly}
            >
              <i className="fa fa-arrow-circle-up fa-lg  mr5" />
            </CustomButton>
          </div>
          <div className="ml10">
            <CustomButton
              type="primary"
              buttonText="Refresh"
              buttonClassName=""
              handleButtonClick={() => onPageRefresh()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

CreativesHeader.propTypes = {
  onPageRefresh: PropTypes.func,
  getAllCompanies: PropTypes.func,
  isReadonly: PropTypes.bool,
};

CreativesHeader.defaultProps = {
  onPageRefresh: () => {},
  getAllCompanies: () => {},
};

export default CreativesHeader;
