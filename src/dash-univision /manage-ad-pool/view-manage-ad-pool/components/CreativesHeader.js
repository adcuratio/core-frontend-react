import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../../components/CustomButton';
import { Row, Col } from 'react-bootstrap';

import ReactPickyFilter from '../../../../components/ReactPickyFilter';

const CreativesHeader = (props) => {
  const { onPageRefresh, advList, selectedAdv, filterAdv, navigationService } = props;

  return (
    <div>
      <div className="flex-container2">
        <p className="main-heading">View Ad Pool</p>
        <Row>
          <div className="flex-container2 mt10">
            <Col>
              <div className="flex-container1">
                <div className="flex-container1">
                  <ReactPickyFilter
                    allOptions={advList}
                    selectedData={selectedAdv}
                    onFilterChange={filterAdv}
                    id="adv_filter"
                    selectAllText="Select All Advertisers"
                    allSelectedPlaceholder="All Advertisers"
                  />

                  <div className="ml10">
                    <CustomButton
                      type="primary"
                      handleButtonClick={() => {
                        navigationService.goToUploadCreative();
                      }}
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
            </Col>
          </div>
        </Row>
      </div>
    </div>
  );
};

CreativesHeader.propTypes = {
  onPageRefresh: PropTypes.func,
  showUploadCreativesModal: PropTypes.func,
  isViewPool: PropTypes.bool,
  advList: PropTypes.array,
  filterAdv: PropTypes.func,
  selectedAdv: PropTypes.array,
  navigationService: PropTypes.any,
};

CreativesHeader.defaultProps = {
  onPageRefresh: () => {},
  showUploadCreativesModal: () => {},
  isViewPool: false,
};

export default CreativesHeader;
