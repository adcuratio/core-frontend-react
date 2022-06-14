import React from 'react';
import PropTypes from 'prop-types';

const ValidationErrorMessage = (props) => {
  const { errorInfo } = props;

  return (
    <>
      {errorInfo?.messages?.length ? (
        <div className="alert-danger pt10 pl10 pr10 pb5">
          {errorInfo.messages?.map((data, index) => (
            <div className="pb5" key={`error_message_${index}`}>
              {data}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

ValidationErrorMessage.propTypes = {
  errorInfo: PropTypes.object,
};

ValidationErrorMessage.defaultProps = {
  errorInfo: {},
};

export default ValidationErrorMessage;
