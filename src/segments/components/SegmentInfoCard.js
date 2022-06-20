import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaHourglass } from 'react-icons/fa';
import styled from 'styled-components';

import { formatNumber } from './../../common/utils';

import CustomButton from './../../components/CustomButton';

import KnowMoreModal from '../../components/KnowMoreModal';

export const SegmentCount = styled.p`
  font-family: OpenSans;
  font-weight: lighter;
  color: #94969a;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

export const SegmentInfoIcon = styled.div`
  color: #696969;
`;

const SegmentInfoCard = (props) => {
  const { segmentData, handleButtonFunc, filterJSONText, type, isReadonly } = props;
  const [toggleModal, setToggleModal] = useState(false);

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };

  return (
    <div className="target-seg-card target-group-card-seg">
      <div className="card-title mb4">{segmentData.name}</div>
      <SegmentCount className="capitalize bold">Data Provider: {segmentData.data_provider}</SegmentCount>
      <div>
        {segmentData.processed && (
          <SegmentCount>Household Count: {formatNumber(segmentData.household_count)}</SegmentCount>
        )}
        {segmentData.processed && (
          <SegmentCount>Individual Count: {formatNumber(segmentData.individual_count)}</SegmentCount>
        )}
        {segmentData.processed && (
          <SegmentCount>
            Adcuratio Footprint Household Count:{' '}
            {segmentData.distributor_footprint_count?.adcuratio_footprint_hh_count
              ? formatNumber(segmentData.distributor_footprint_count.adcuratio_footprint_hh_count)
              : 'N/A'}
          </SegmentCount>
        )}
        {segmentData.processed && (
          <SegmentCount>
            Adcuratio Footprint Individual Count:{' '}
            {segmentData.distributor_footprint_count?.adcuratio_footprint_indvi_count
              ? formatNumber(segmentData.distributor_footprint_count.adcuratio_footprint_indvi_count)
              : 'N/A'}
          </SegmentCount>
        )}
        <div className="flex-container1 mt5">
          {!segmentData.processed && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="processing_progress">Processing in progress</Tooltip>}
            >
              <SegmentInfoIcon>
                <FaHourglass />
              </SegmentInfoIcon>
            </OverlayTrigger>
          )}

          <div className="flex-container1 ml-auto">
            {!isReadonly && (
              <CustomButton
                type="button_blue"
                buttonText={type === 'archive' ? 'Archive' : 'Unarchive'}
                buttonClassName="mr5"
                handleButtonClick={() => handleButtonFunc(segmentData)}
              />
            )}
            <CustomButton type="button_blue" buttonText="Know more" handleButtonClick={handleToggleModal} />
            <KnowMoreModal
              description={segmentData.description}
              title={segmentData.name}
              filterJSONText={filterJSONText}
              showModal={toggleModal}
              handleToggleModal={handleToggleModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

SegmentInfoCard.propTypes = {
  segmentData: PropTypes.object,
  handleButtonFunc: PropTypes.func,
  filterJSONText: PropTypes.any,
  type: PropTypes.string,
  isReadonly: PropTypes.bool,
};

SegmentInfoCard.defaultProps = {
  segmentData: {},
};

export default SegmentInfoCard;
