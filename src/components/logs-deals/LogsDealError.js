import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

import { StepPaneHeading } from '../Typography';

const LogsDealError = (props) => {
  const { errorData, networkName } = props;
  const renderErrorMessage = (errorValue) => {
    if (Array.isArray(errorValue)) return <p>Error Message: {errorValue.join(', ')}</p>;
    else if (typeof errorValue === 'string') return <p>Error Message: {errorValue}</p>;
    else if (Object.prototype.toString.call(errorValue) === '[object Object]') {
      return (
        <Table striped condensed>
          <thead>
            <tr>
              <th>Spot USN</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(errorValue).map(([spotUSN, msg], eid) => (
              <tr key={eid}>
                <td>{spotUSN}</td>
                <td>
                  <p>{Array.isArray(msg) ? <>{msg.join(', ')}</> : msg}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  const renderErrorSegment = (errors) => {
    const errorArray = Object.entries(errors);
    return errorArray.map(([errorKey, errorValue]) => (
      <div key={errorKey} className="mt10">
        <h3>Error Type: {errorKey}</h3>
        {renderErrorMessage(errorValue)}
      </div>
    ));
  };

  return errorData ? (
    <div className="mb10">
      <StepPaneHeading>Hard_Checks Failed {networkName ? ` for network ${networkName}` : ''}:</StepPaneHeading>
      {errorData.Hard_Check
        ? renderErrorSegment(errorData.Hard_Check)
        : errorData['Hard Check']
        ? renderErrorSegment(errorData['Hard Check'])
        : 'No errors.'}
      <hr />
      <StepPaneHeading>Soft_Checks Failed {networkName ? ` for network ${networkName}` : ''}:</StepPaneHeading>
      {errorData.Soft_Check
        ? renderErrorSegment(errorData.Soft_Check)
        : props.errorData['Soft Check']
        ? renderErrorSegment(errorData['Soft Check'])
        : 'No errors'}
    </div>
  ) : (
    <p>No errors.</p>
  );
};

LogsDealError.propTypes = {
  errorData: PropTypes.object,
  networkName: PropTypes.string,
};

LogsDealError.defaultProps = {
  networkName: '',
  errorData: {},
};

export default LogsDealError;
