import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../components/CustomButton';

import './index.css';

const CreateNewSegmentHeader = (props) => {
  const { selectedNodeData, onCancelSegment, onSaveSegment, activeFilterTab, audienceRequestForm } = props;

  return (
    <div className="create-new-seg-header">
      {audienceRequestForm ? (
        <p className="create-new-seg-header-title">Request New Audience Count for Activation</p>
      ) : (
        <p className="create-new-seg-header-title">Create New Segment for {selectedNodeData.name}</p>
      )}
      {/* <p className="create-new-seg-header-title">Create New Segment for {selectedNodeData.name}</p> */}
      {activeFilterTab.value !== 4 && activeFilterTab.value !== 5 && activeFilterTab.value !== 6 ? (
        <div>
          <CustomButton type="primary" buttonText="Save" buttonClassName="mr10" handleButtonClick={onSaveSegment} />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={onCancelSegment} />
        </div>
      ) : null}
    </div>
  );
};

CreateNewSegmentHeader.propTypes = {
  selectedNodeData: PropTypes.object,
  onCancelSegment: PropTypes.func,
  onSaveSegment: PropTypes.func,
  activeFilterTab: PropTypes.object,
  audienceRequestForm: PropTypes.bool,
};

CreateNewSegmentHeader.defaultProps = {
  selectedNodeData: {},
  onCancelSegment: () => {},
  onSaveSegment: () => {},
  activeFilterTab: {},
  audienceRequestForm: false,
};

export default CreateNewSegmentHeader;
