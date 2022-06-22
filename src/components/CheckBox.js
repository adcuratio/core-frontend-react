import React from "react";
import PropTypes from "prop-types";

const CheckBox = (props) => {
  const { label, isChecked, isDisabled, onChangeFunction } = props;
  return (
    <label
      className={`checkbox-container mr10 mb10 ${
        isDisabled ? "checkbox-disabled" : ""
      }`}
    >
      <span className={isDisabled ? "o60" : "hand-pointer"}>{label}</span>
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(event) => onChangeFunction(event)}
      />
      <span className={`checkmark checkmark-width`}></span>
    </label>
  );
};

CheckBox.propTypes = {
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  onChangeFunction: PropTypes.func,
};

CheckBox.defaultProps = {
  isChecked: false,
  isDisabled: false,
  label: "",
  onChangeFunction: () => {},
};

export default CheckBox;
