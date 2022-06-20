import React from "react";
import PropTypes from "prop-types";

const RadioButton = (props) => {
  const { label, isChecked, isDisabled, onChangeFunction, value } = props;
  return (
    <label
      className={`checkbox-container mr10 mb10 ${
        isDisabled ? "checkbox-disabled" : ""
      }`}
    >
      <span className={isDisabled ? "o60" : "hand-pointer"}>{label}</span>
      <input
        type="radio"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => onChangeFunction(event)}
        value={value}
      />
      <span className="checkmark checkmark-width"></span>
    </label>
  );
};

RadioButton.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  onChangeFunction: PropTypes.func,
  value: PropTypes.any,
};

RadioButton.defaultProps = {
  isChecked: false,
  isDisabled: false,
  label: "",
  onChangeFunction: () => {},
  value: "",
};

export default RadioButton;
