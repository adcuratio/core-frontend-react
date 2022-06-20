import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';

import { formatNumber } from '../../../common/utils';

import { getFilterJSONText } from '../../../segments/components/FilterJSONText';
import CustomButton from '../../../components/CustomButton';
import RadioButton from '../../../components/RadioButton';

const TotalGroup = styled.div`
  background-color: #ffffff;
`;

const TotalGroupsTitleWrap = styled.div`
  border-bottom: 1px solid;
  border-color: #a9a9a9;
  padding: 15px 0px;
`;

const TgTitleNum = styled.div`
  font-size: 40px;
  font-weight: bold;
  vertical-align: middle;
  color: #eea32c;
`;

const TotalGroupsTitle = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const Card = styled.div`
  .card-box {
    padding: 10px 8px;
    width: 210px !important;
    height: 95px !important;
    display: inline-block;
    margin: 4px 4px;
    background-color: #fff;
    border: 1px solid;
    border-color: #e7e9ea;
    position: relative;
    cursor: pointer;
  }
  .card-selected {
    background-color: #faf2e6;
    border: 1px solid #eea32c;
  }
  .card-desc {
    padding-left: 24px;
  }
  .card-descs {
    padding-left: 0px;
  }
  .mt-close {
    margin-top: -52px;
  }
`;

const DistIndividual = styled.span`
  display: inline-block;
  vertical-align: middle;
  color: #000;
`;

const CardTitle = styled.div`
  font-weight: bold;
  color: #26282a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
`;

const RemoveChip = styled.span`
  font-family: 'FontAwesome';
  font-weight: 900;
  font-size: 25px;
  cursor: pointer;
  color: #000;
`;

const AddChip = styled.div`
  font-family: 'FontAwesome';
  font-weight: 900;
  font-size: 19px;
  position: absolute;
`;

const SegmentData = (props) => {
  const {
    entityData,
    toggleGroupSelection,
    availableSegments,
    selectedSegments,
    toggleDataProvider,
    dataProvider,
    uniqueDataProvider,
  } = props;

  const selectedSegmentsCount = (
    <TotalGroupsTitleWrap>
      <div className="mr10">
        <TgTitleNum>
          <span>{selectedSegments?.length}</span>
          <DistIndividual className="ml15 mb5">
            <p>Selected</p>
            <p>segments</p>
          </DistIndividual>
        </TgTitleNum>
      </div>
      <TotalGroupsTitle className="pull-right"></TotalGroupsTitle>
    </TotalGroupsTitleWrap>
  );

  const availableSegmentsCount = (
    <TotalGroupsTitleWrap>
      <div className="ml20">
        <TgTitleNum>
          <span>{availableSegments?.length}</span>
          <DistIndividual className="ml15 mb5">
            <p>Available</p>
            <p>segments</p>
          </DistIndividual>
        </TgTitleNum>
      </div>
      <TotalGroupsTitle className="pull-right"></TotalGroupsTitle>
    </TotalGroupsTitleWrap>
  );

  const forSelected = entityData?.filter((a) => a.isSelected);

  const forIndividualCount = entityData?.filter((c) => !c.isSelected && c.individual_count !== 0 && c.processed);

  const renderSegmentData = (segments) =>
    segments?.map((b) => {
      if (b?.data_provider === dataProvider) {
        return (
          <Card key={b.id}>
            <div
              className={b.isSelected ? 'col-md-6 card-box card-selected' : 'col-md-6 card-box'}
              onClick={!b.isSelected ? (e) => toggleGroupSelection(e, b) : null}
            >
              <span>{!b.isSelected ? <AddChip>+</AddChip> : null}</span>
              <div className={!b.isSelected ? 'card-desc' : 'card-descs'}>
                <CardTitle>
                  <span>{b.name}</span>
                </CardTitle>
                <div className="segment-count bold capitalize">Data Provider: {b.data_provider}</div>

                <div className="segment-count">Household Count: {formatNumber(b.household_count)}</div>

                <div className="pull-right mt-close">
                  {b.isSelected ? <RemoveChip onClick={(e) => toggleGroupSelection(e, b)}>&times;</RemoveChip> : null}
                </div>
                <div>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement={b.isSelected ? 'right' : 'left'}
                    overlay={
                      <Popover
                        id="popover-positioned-scrolling-left"
                        className="segments-card-json-tooltip"
                        title={b.name}
                      >
                        <div className="mb10">Description: {b.description}</div>
                        <div className="mb10">{getFilterJSONText(b.filter_json)}</div>
                      </Popover>
                    }
                  >
                    <div>
                      <CustomButton
                        buttonId={'overlay-trigger'}
                        type="button_blue"
                        buttonText="Know more"
                        onClick={(e) => toggleGroupSelection(e, b)}
                      />
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Card>
        );
      }
      return true;
    });

  const getSegmentsBody = () => {
    const segmentBody = entityData?.length ? (
      <>
        <div className="flex-container1">
          <span className="mb10">Data Provider:</span>
          {uniqueDataProvider.map((a) => (
            <span key={a} className="capitalize ml5">
              <RadioButton label={a} value={a} isChecked={a === dataProvider} onChangeFunction={toggleDataProvider} />
            </span>
          ))}
        </div>
        <div>
          <div>
            <div className="col-md-6">
              <TotalGroup>
                {selectedSegmentsCount}
                <div className="mt10">{renderSegmentData(forSelected)}</div>
              </TotalGroup>
            </div>
            <div className="col-md-6">
              <TotalGroup>
                {availableSegmentsCount}
                <div className="mt10">{renderSegmentData(forIndividualCount)}</div>
              </TotalGroup>
            </div>
          </div>
        </div>
      </>
    ) : (
      <div>
        <div className="col-md-6">
          <TotalGroup>
            {selectedSegmentsCount}
            <div className="mt10 pb15"></div>
          </TotalGroup>
        </div>
        <div className="col-md-6">
          <TotalGroup>
            {availableSegmentsCount}
            <div className="mt10 pb15"></div>
          </TotalGroup>
        </div>
      </div>
    );
    return segmentBody;
  };

  return <div>{getSegmentsBody()}</div>;
};

SegmentData.propTypes = {
  entityData: PropTypes.array,
  toggleGroupSelection: PropTypes.func,
  availableSegments: PropTypes.array,
  selectedSegments: PropTypes.array,
  toggleDataProvider: PropTypes.func,
  dataProvider: PropTypes.string,
  uniqueDataProvider: PropTypes.array,
};

SegmentData.defaultProps = {
  entityData: [],
  toggleGroupSelection: () => {},
  availableSegments: [],
  selectedSegments: [],
  toggleDataProvider: () => {},
  uniqueDataProvider: [],
};

export default SegmentData;
