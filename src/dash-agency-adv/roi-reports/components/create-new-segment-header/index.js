import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import CustomButton from '../../../../components/CustomButton';

import './index.css';

const CreateNewSegmentHeader = (props) => {
  const { onHandleAction, isExpanded, onToggle } = props;

  return (
    <div className="create-new-seg-header" onClick={() => onToggle()}>
      <p className="create-new-seg-header-title">
        {'Select audience filters for the report'}
        <span className="pl5 v-align-middle">{!isExpanded ? <FaChevronDown /> : <FaChevronUp />}</span>
      </p>
      <div>
        <CustomButton
          type="primary"
          buttonText={'Update ROI Report'}
          buttonClassName="mr10"
          handleButtonClick={onHandleAction}
        />
      </div>
    </div>
  );
};

CreateNewSegmentHeader.propTypes = {
  onHandleAction: PropTypes.func,
  isExpanded: PropTypes.bool,
  onToggle: PropTypes.func,
};

CreateNewSegmentHeader.defaultProps = {
  onHandleAction: () => {},
  isExpanded: false,
  onToggle: () => {},
};

export default CreateNewSegmentHeader;
