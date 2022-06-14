import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const DashboardButtonBox = styled.div`
  height: 160px;
  background-color: #243643;
  color: white;
  width: 205px;
  padding: 20px;
  text-align: center;
  border: 1px solid #243643;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 20px;
  }

  @media only screen and (max-width: 1600px) {
    height: 150px;
    // width: 150px !important;
    padding: 15px;
  }
`;

const DashboardButtonText = styled.div`
  height: 50%;
`;

const DashboardButtonIcon = styled.div`
  height: 50%;
  font-size: 30px;
  @media only screen and (max-width: 1600px) {
    height: 50%;
    font-size: 20px;
  }
`;

const DashboardButton = (props) => {
  const {
    buttonText,
    ButtonIcon,
    handleButtonClick,
    buttonIconClass,
    buttonClass,
    infoSignClass,
    tooltipText,
    isDisabled,
    isGreyOut,
  } = props;
  return (
    <DashboardButtonBox
      className={buttonClass}
      onClick={() => (!isDisabled ? handleButtonClick() : {})}
      style={{ opacity: isGreyOut ? '0.8' : null }}
    >
      <DashboardButtonText>
        {buttonText}
        {tooltipText && (
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="standard-campaign-tooltip">{tooltipText}</Tooltip>}>
            <i className={infoSignClass} aria-hidden="true" />
          </OverlayTrigger>
        )}
      </DashboardButtonText>
      <DashboardButtonIcon>
        <ButtonIcon className={`fa-lg ${buttonIconClass}`}></ButtonIcon>
      </DashboardButtonIcon>
    </DashboardButtonBox>
  );
};

DashboardButton.propTypes = {
  buttonText: PropTypes.string,
  ButtonIcon: PropTypes.func,
  handleButtonClick: PropTypes.func,
  buttonIconClass: PropTypes.string,
  buttonClass: PropTypes.string,
  infoSignClass: PropTypes.string,
  tooltipText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isGreyOut: PropTypes.bool,
};

DashboardButton.defaultProps = {
  buttonText: '',
  ButtonIcon: () => 'N/A',
  handleButtonClick: () => {},
  buttonIconClass: '',
  buttonClass: '',
  infoSignClass: '',
  tooltipText: '',
};

export default DashboardButton;
