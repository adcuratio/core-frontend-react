// We can directly call this component if we want use any button in our app
// If we want to change any style of button we can use in one page
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

export const ButtonPrimary = styled.button`
  font-size: 12px;
  padding: 0px 15px !important;
  background-color: #98c22a;
  color: #fff;
  border: 1px solid #98c22a;
  min-height: 35px;

  &:disabled {
    opacity: 0.3;
    background-color: #696969;
    pointer-events: none;
  }
`;

export const ButtonSecondary = styled.button`
  font-size: 14px;
  padding: 0px 15px !important;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  min-height: 35px;
`;

export const ButtonTernary = styled.button`
  background-color: #35495d;
  color: #fff;
  min-height: 35px;
  font-family: opensans;
  font-size: 14px;
  font-weight: 600;
  border: 0;
  text-decoration: none;
  text-align: center;
  border-radius: 2px;
  cursor: pointer;
  padding: 0 20px;

  &:disabled {
    background-color: #d2d2d2;
    font-weight: 100;
  }
`;

export const ButtonBlue = styled.button`
  font-size: 12px;
  background-color: transparent;
  border: 0px;
  color: #0000ee;
`;

const CustomButton = (props) => {
  const {
    buttontype,
    buttonId,
    buttonText,
    buttonClassName,
    handleButtonClick,
    type,
    children,
    isDisabled,
    ...rest
  } = props;

  if (type === "primary") {
    return (
      <ButtonPrimary
        id={buttonId}
        type={buttontype === "submit" ? "submit" : "button"}
        className={buttonClassName}
        onClick={handleButtonClick}
        disabled={isDisabled}
      >
        {children}
        {buttonText}
      </ButtonPrimary>
    );
  } else if (type === "secondary") {
    return (
      <ButtonSecondary
        id={buttonId}
        type={buttontype === "submit" ? "submit" : "button"}
        className={buttonClassName}
        onClick={handleButtonClick}
      >
        {children}
        {buttonText}
      </ButtonSecondary>
    );
  } else if (type === "ternary") {
    return (
      <ButtonTernary
        id={buttonId}
        type="button"
        className={buttonClassName}
        onClick={handleButtonClick}
        disabled={isDisabled}
      >
        {children}
        {buttonText}
      </ButtonTernary>
    );
  } else if (type === "button_blue") {
    return (
      <ButtonBlue
        id={buttonId}
        type="button"
        className={buttonClassName}
        onClick={handleButtonClick}
      >
        {children}
        {buttonText}
      </ButtonBlue>
    );
  }
  return (
    <button
      id={buttonId}
      type="button"
      className={buttonClassName}
      onClick={handleButtonClick}
      {...rest}
    >
      {children}
      {buttonText}
    </button>
  );
};

CustomButton.propTypes = {
  buttontype: PropTypes.string,
  buttonText: PropTypes.string,
  buttonClassName: PropTypes.string,
  handleButtonClick: PropTypes.func,
  type: PropTypes.string,
  isDisabled: PropTypes.bool,
  buttonId: PropTypes.string,
  children: PropTypes.any,
};

CustomButton.defaultProps = {
  buttontype: "",
  buttonText: "",
  buttonClassName: "",
  handleButtonClick: () => {},
  type: "",
  buttonId: "",
};

export default CustomButton;
