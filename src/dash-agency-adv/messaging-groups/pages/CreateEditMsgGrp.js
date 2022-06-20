import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';
import { MainContent } from '../../../components/PageLayout';

import MsgGrpAccordion from '../components/MsgGrpAccordion';
import SegmentData from '../components/SegmentData';
import ReplacementCreative from '../components/ReplacementCreative';

const LayoutPadding = styled.div`
  padding: 20px 20px 40px;
`;

const MainHeading = styled.div`
  font-family: opensans;
  font-size: 24px;
  color: #243643;
  padding-top: 15px;
  padding-bottom: 15px;
  font-weight: bold;
`;

const CreateNewMsgGrp = (props) => {
  const {
    entityData,
    repCreativeData,
    selectedEntityId,
    toggleGroupSelection,
    saveMessagingGroup,
    toggleDefaultAdIdSelection,
    handleFormData,
    formData,
    availableSegments,
    selectedSegments,
    isEdit,
    editMsgGrpData,
    entityDetails,
    toggleDataProvider,
    dataProvider,
    uniqueDataProvider,
    nextPageUrl,
    handlePagination,
    tableRef,
  } = props;

  const [accordionState, setAccordionState] = useState([true, false]);

  const onClickAccordion = (activeIndex) => {
    setAccordionState(accordionState.map((a, index) => (index === activeIndex ? !a : a)));
  };

  const cancelMsgGrp = () => {
    window.history.back();
  };

  const segmentAccordionData = (
    <SegmentData
      entityData={entityData}
      toggleGroupSelection={toggleGroupSelection}
      availableSegments={availableSegments}
      selectedSegments={selectedSegments}
      toggleDataProvider={toggleDataProvider}
      dataProvider={dataProvider}
      uniqueDataProvider={uniqueDataProvider}
    />
  );

  const replacementCreativeAccrodionData = (
    <ReplacementCreative
      repCreativeData={repCreativeData}
      toggleDefaultAdIdSelection={toggleDefaultAdIdSelection}
      nextPageUrl={nextPageUrl}
      handlePagination={handlePagination}
      tableRef={tableRef}
    />
  );

  return (
    <MainContent>
      <LayoutPadding className="bg-white">
        <div className="flex-container6">
          <MainHeading>
            {isEdit ? (
              <span>
                Edit {`"${editMsgGrpData?.name}"`} Messaging Group for{' '}
                <span className="capitalize">
                  {editMsgGrpData?.entity_type === 'brand' ? editMsgGrpData?.brand : null}
                  {editMsgGrpData?.entity_type === 'company' ? editMsgGrpData?.advertiser : null}
                  {editMsgGrpData?.entity_type === 'sub_brand' ? editMsgGrpData?.sub_brand : null}
                </span>{' '}
                <span className="capitalize">
                  ({editMsgGrpData?.entity_type === 'brand' ? 'Brand' : null}
                  {editMsgGrpData?.entity_type === 'company' ? 'Company' : null}
                  {editMsgGrpData?.entity_type === 'sub_brand' ? 'Sub-Brand' : null})
                </span>
              </span>
            ) : (
              <span>
                Create new Messaging Group for <span className="capitalize">{selectedEntityId?.name}</span>{' '}
                <span className="capitalize">({entityDetails.type})</span>
              </span>
            )}
          </MainHeading>

          <div className="flex-container2 ml-auto-imp">
            <span className="ml10">Name:</span>
            <span className="ml5">
              <FormControl
                type="text"
                placeholder="Enter Name"
                value={formData}
                onChange={(e) => handleFormData(e.target.value)}
              />
            </span>
            <CustomButton
              type="secondary"
              buttonText="Cancel"
              buttonClassName="ml10"
              handleButtonClick={() => cancelMsgGrp()}
            />
          </div>
        </div>

        <div className="mt10">
          <MsgGrpAccordion
            isActive={accordionState[0]}
            title="Step-1 : Segments Contained Within Messaging Group"
            index={0}
            content={segmentAccordionData}
            onClickAccordion={onClickAccordion}
          />
          <div className="mt5">
            <MsgGrpAccordion
              isActive={accordionState[1]}
              title="Step-2 : Select Message For Swap"
              index={1}
              content={replacementCreativeAccrodionData}
              onClickAccordion={onClickAccordion}
            />
          </div>
        </div>
        <div className="mt5">
          <CustomButton
            type="primary"
            buttonText="Save Messaging Group"
            buttonClassName="pull-right"
            handleButtonClick={() => saveMessagingGroup()}
          />
        </div>
      </LayoutPadding>
    </MainContent>
  );
};

CreateNewMsgGrp.propTypes = {
  entityData: PropTypes.array,
  repCreativeData: PropTypes.array,
  selectedEntityId: PropTypes.object,
  toggleGroupSelection: PropTypes.func,
  saveMessagingGroup: PropTypes.func,
  toggleDefaultAdIdSelection: PropTypes.func,
  handleFormData: PropTypes.func,
  formData: PropTypes.string,
  availableSegments: PropTypes.array,
  selectedSegments: PropTypes.array,
  isEdit: PropTypes.bool,
  editMsgGrpData: PropTypes.object,
  entityDetails: PropTypes.object,
  toggleDataProvider: PropTypes.func,
  dataProvider: PropTypes.string,
  uniqueDataProvider: PropTypes.array,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  tableRef: PropTypes.object,
};

CreateNewMsgGrp.defaultProps = {
  entityData: [],
  repCreativeData: [],
  selectedEntityId: {},
  toggleGroupSelection: () => {},
  saveMessagingGroup: () => {},
  toggleDefaultAdIdSelection: () => {},
  handleFormData: () => {},
  formData: '',
  availableSegments: [],
  selectedSegments: [],
  isEdit: null,
  editMsgGrpData: {},
  entityDetails: {},
  toggleDataProvider: () => {},
  uniqueDataProvider: [],
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default CreateNewMsgGrp;
