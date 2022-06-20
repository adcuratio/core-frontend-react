import React from 'react';
import PropTypes from 'prop-types';

const FormLabel = (props) => {
  const { labelName } = props;

  return (
    <>
      <p className="mb5">
        {labelName}: <span className="error-indicator">*</span>
      </p>
    </>
  );
};

FormLabel.propTypes = {
  labelName: PropTypes.string,
};

FormLabel.defaultProps = {
  labelName: '',
};

export default FormLabel;
