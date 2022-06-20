import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../CustomButton';

const CreativesHeader = (props) => {
  const { onPageRefresh, showUploadCreativesModal } = props;

  return (
    <div>
      <div className="flex-container2">
        <p className="main-heading">Creatives</p>
        <div className="flex-container1">
          <div className="ml10">
            <CustomButton
              type="primary"
              handleButtonClick={showUploadCreativesModal}
              buttonText="Upload a New Creative"
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
  showUploadCreativesModal: PropTypes.func,
  isViewPool: PropTypes.bool,
};

CreativesHeader.defaultProps = {
  onPageRefresh: () => {},
  showUploadCreativesModal: () => {},
  isViewPool: false,
};

export default CreativesHeader;
