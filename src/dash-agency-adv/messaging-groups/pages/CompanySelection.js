import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tree from '../../../components/TreeCompany';
import CustomButton from '../../../components/CustomButton';

import CreateNewMsgGrp from './CreateEditMsgGrp';

const MsgGrpTreeWrapper = styled.div`
  background-color: #ffffff;
  border-right: 1px solid #f1f5f8;
  height: 50%;
  overflow: auto;
`;

const AdvertiserHeading = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #243643;
  padding: 10px 0px;
  margin-right: 65%;
`;

const TreeLevel = styled.div`
  padding: 0px 0px 0px 20px;
  border-radius: 8px;
  position: relative;
  text-transform: capitalize;
  color: #6e7175;
`;

const CompanySelection = (props) => {
  const {
    entityTreeLevelData,
    entityData,
    repCreativeData,
    onSelectEntity,
    toggleGroupSelection,
    saveMessagingGroup,
    toggleDefaultAdIdSelection,
    formData,
    handleFormData,
    availableSegments,
    selectedSegments,
    editMsgGrpData,
    entityDetails,
    toggleDataProvider,
    dataProvider,
    uniqueDataProvider,
    nextPageUrl,
    handlePagination,
    tableRef,
  } = props;
  const [isCreateEditView, setIsCreateEditView] = useState(props.isEdit || false);
  const [selectedEntityId, setSelectedEntityId] = useState({});
  const [showCreateNewMsgGrpButton, setShowCreateNewMsgGrpButton] = useState(false);

  const onSelectEntityCheck = () => setShowCreateNewMsgGrpButton(true);

  const goToAdvertiserDropDown = () => {
    window.history.back();
  };

  return (
    <>
      {!isCreateEditView ? (
        <>
          <div className="mt15 mb15">
            <div className="flex-container2">
              <CustomButton
                type="secondary"
                buttonText="Back"
                buttonClassName="ml48"
                handleButtonClick={() => goToAdvertiserDropDown()}
              />

              {showCreateNewMsgGrpButton ? (
                <CustomButton
                  type="primary"
                  buttonText="Create new Messaging Group"
                  buttonClassName="mr30"
                  handleButtonClick={() => {
                    setIsCreateEditView(!isCreateEditView);
                    onSelectEntity(selectedEntityId);
                  }}
                />
              ) : null}
            </div>
          </div>

          <MsgGrpTreeWrapper className="col-md-offset-2 col-md-8 mt30">
            <AdvertiserHeading>Select Advertiser / Product</AdvertiserHeading>
            <TreeLevel>
              {entityTreeLevelData && (
                <Tree
                  treeData={entityTreeLevelData}
                  onSelect={(id) => {
                    setSelectedEntityId(id);
                    onSelectEntityCheck();
                  }}
                />
              )}
            </TreeLevel>
          </MsgGrpTreeWrapper>
        </>
      ) : (
        <CreateNewMsgGrp
          entityData={entityData}
          repCreativeData={repCreativeData}
          selectedEntityId={selectedEntityId}
          toggleGroupSelection={toggleGroupSelection}
          saveMessagingGroup={saveMessagingGroup}
          toggleDefaultAdIdSelection={toggleDefaultAdIdSelection}
          formData={formData}
          handleFormData={handleFormData}
          availableSegments={availableSegments}
          selectedSegments={selectedSegments}
          isEdit={props.isEdit}
          editMsgGrpData={editMsgGrpData}
          entityDetails={entityDetails}
          toggleDataProvider={toggleDataProvider}
          dataProvider={dataProvider}
          uniqueDataProvider={uniqueDataProvider}
          nextPageUrl={nextPageUrl}
          handlePagination={handlePagination}
          tableRef={tableRef}
        />
      )}
    </>
  );
};

CompanySelection.propTypes = {
  entityTreeLevelData: PropTypes.object,
  onSelectEntity: PropTypes.func,
  entityData: PropTypes.array,
  repCreativeData: PropTypes.array,
  toggleGroupSelection: PropTypes.func,
  saveMessagingGroup: PropTypes.func,
  toggleDefaultAdIdSelection: PropTypes.func,
  formData: PropTypes.string,
  handleFormData: PropTypes.func,
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

CompanySelection.defaultProps = {
  entityTreeLevelData: {},
  onSelectEntity: () => {},
  entityData: [],
  repCreativeData: [],
  toggleGroupSelection: () => {},
  saveMessagingGroup: () => {},
  toggleDefaultAdIdSelection: () => {},
  formData: '',
  handleFormData: () => {},
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

export default CompanySelection;
