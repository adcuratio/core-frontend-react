import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import styled from 'styled-components';

import withStore from '../../../hocs/WithStore';

import CustomButton from '../../../components/CustomButton';
import ReactLoader from '../../../components/ReactLoader';

import { showAckErrorMessage, showAckMessage, validateName } from '../../../common/utils';

import CompanySelection from './CompanySelection';

const NextBtn = styled.div`
  .msg-grp-next-btn {
    margin: auto;
    margin-top: 20px;
    display: block;
    min-width: 100px;
  }
`;

const SelectWrapper = styled.div`
  width: 200px;
  margin: auto;
  overflow: hidden;

  .transparent {
    background-color: transparent;
    border: none;
  }
`;

const DefineMessagingGroup = inject(
  'messagingGroupStore',
  'uiStore'
)(
  observer((props) => {
    const { messagingGroupStore, uiStore, navigationService, $stateParams } = props;
    const { activeSegment: editMsgGrpData, editState } = $stateParams;
    const [companiesData, setCompaniesData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(0);
    const [entityTreeLevelData, setEntityTreeLevelData] = useState({});
    const [toggleNext, setToggleNext] = useState(editState ? true : false);
    const [entityData, setEntityData] = useState([]);
    const [formData, setFormData] = useState('');
    const [entityDetails, setEntityDetails] = useState({ id: '', type: '' });
    const [dataProvider, setDataProvider] = useState('epsilon');

    const [repCreativeData, setRepCreativeData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const tableRef = useRef(null);

    useEffect(() => {
      messagingGroupStore.getAllCompanies(true).then(
        (res) => {
          if (res && res?.success && res?.data) {
            setCompaniesData(res?.data);
          } else {
            showAckErrorMessage({ message: 'Failed to load Advertisers' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    }, []);

    //on edit messaging group
    useEffect(() => {
      if (editMsgGrpData) {
        onEditSelectEntity();
        setFormData(editMsgGrpData?.name);
      }
    }, [editState]);

    const handleEntitySelection = (e) => {
      const currentCompanydata = companiesData.find((c) => c.company.id === parseInt(e.target.value));
      setEntityTreeLevelData(toJS(currentCompanydata));
      setSelectedCompany(e.target.value);
    };

    const onEditSelectEntity = () => {
      const entityId = editMsgGrpData[`${editMsgGrpData?.entity_type}_info`]?.id;
      onSelectEntity({ id: entityId }, editMsgGrpData.entity_type);
    };

    const onSelectEntity = (id, type = null) => {
      let entityId = '';
      let entityType = '';

      if ((!type && !Object.prototype.hasOwnProperty.call(id, 'parent')) || type === 'company') {
        entityId = id.id;
        entityType = 'company';
      } else if ((!type && !id.parent) || type === 'brand') {
        entityId = id.id;
        entityType = 'brand';
      } else {
        entityId = id.id;
        entityType = 'sub_brand';
      }

      setEntityDetails({ id: entityId, type: entityType });

      messagingGroupStore.getAllGroupsByEntity(entityId, entityType).then(
        (res) => {
          if (res && res?.success && res?.data) {
            if (editMsgGrpData) {
              res?.data?.forEach((data) => {
                const isSelected = editMsgGrpData?.segments?.find((segment) => segment === data.id);
                data.isSelected = !!isSelected;
              });
            } else if (!editMsgGrpData) {
              res?.data?.forEach((data) => {
                data.isChecked = false;
              });
            }
            setEntityData(res?.data);
          } else {
            showAckErrorMessage();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );

      const queryObj = { entityId: null, entityType: null };
      queryObj.entityId = entityId;
      queryObj.entityType = entityType;

      getRepCreatives(queryObj);
    };

    // Processing of response for replacement creatives.
    const processCreatives = (res) => {
      const creatives = res.data?.data?.results;
      if (!editMsgGrpData) {
        creatives.forEach((creative) => {
          creative.isSelected = false;
        });
      } else if (editMsgGrpData) {
        creatives.forEach((creative) => {
          const isSelectedCreative = creative.id === editMsgGrpData?.default_adid.id;
          creative.isSelected = !!isSelectedCreative;
        });
      }
      return creatives;
    };

    const getRepCreatives = (queryObj) => {
      // Pagination call to set repCreative data.
      messagingGroupStore.getAdidMetaData(queryObj).then(
        (res) => {
          if (res && res.status === 200) {
            if (res.data && res.data?.success) {
              setNextPageUrl(res.data?.data?.next);

              const processedCreatives = processCreatives(res);
              let concatenatedArray;

              if (queryObj?.url) {
                const repCreativeDataCpy = JSON.parse(JSON.stringify(repCreativeData));
                const processedCreativesCpy = JSON.parse(JSON.stringify(processedCreatives));
                concatenatedArray = [...repCreativeDataCpy, ...processedCreativesCpy];
              } else {
                concatenatedArray = JSON.parse(JSON.stringify(processedCreatives));
                scrollToTop();
              }
              setRepCreativeData(concatenatedArray);
            } else showAckErrorMessage({ message: res?.data?.message });
          } else showAckErrorMessage({ message: "Can't fetch creatives list." });
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handlePagination = () => {
      const queryObj = { url: null };
      queryObj.url = nextPageUrl;
      getRepCreatives(queryObj);
    };

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    const handleFormData = (value) => {
      setFormData(value);
    };

    const selectedSegments = entityData
      ?.filter((c) => c?.isSelected && c.data_provider === dataProvider)
      .map((c) => c?.id);

    const availableSegments = entityData
      ?.filter((c) => !c?.isSelected && c?.individual_count !== 0 && c.data_provider === dataProvider && c.processed)
      .map((c) => c?.id);

    const uniqueDataProvider = [...new Set(entityData.map((a) => a.data_provider))];

    const toggleDataProvider = (e) => {
      setDataProvider(e.target.value);
    };

    const saveMessagingGroup = () => {
      if (!formData.trim() || formData.trim() === '') {
        showAckErrorMessage({ message: 'Please fill out the name for the group.' });
        return;
      }

      if (!validateName(formData.trim())) {
        showAckErrorMessage({ message: 'Name must start with an alphabet!' });
        return;
      }

      if (formData.length > 250) {
        showAckErrorMessage({ message: 'Provided name should not be more than 250 characters.' });
        return;
      }
      const selectedGroups = selectedGroupIds();
      if (!selectedGroups?.length) {
        showAckErrorMessage({ message: 'Please select a segment for this group.' });
        return;
      }
      const selectedCreative = repCreativeData?.filter((c) => c?.isSelected)[0]?.id;
      if (!selectedCreative) {
        showAckErrorMessage({ message: 'Please select a replacement creative for this group.' });
        return;
      }

      if (editState === 'edit') {
        editSegment();
      } else {
        if (!validateName(formData.trim())) {
          showAckErrorMessage({ message: 'Name must start with an alphabet!' });
          return;
        } else {
          createSegment();
        }
      }
    };

    const editSegment = () => {
      const selectedGroups = selectedGroupIds();
      const selectedCreative = repCreativeData?.filter((c) => c?.isSelected)[0]?.id;

      const payload = {
        adid_choice: 0,
        groups: selectedGroups,
        name: formData.trim(),
        default_adid: selectedCreative,
        id: editMsgGrpData?.id,
        company_id: editMsgGrpData?.company,
      };

      messagingGroupStore.editMessagingGroup(payload).then(
        (res) => {
          if (res && res?.status === 200 && res?.data) {
            if (res?.data?.success) {
              navigationService.goToMsgGrps();
              showAckMessage({
                message: res?.data?.message ? res?.data?.message : 'Messaging Group edited successfully.',
              });
            } else if (!res?.data?.success) {
              if (res?.data?.message) {
                showAckErrorMessage({ message: res?.data?.message });
              } else {
                showAckErrorMessage();
              }
            }
          } else {
            showAckErrorMessage();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const createSegment = () => {
      const { id: entityId, type: entityType } = entityDetails;
      const selectedGroups = selectedGroupIds();
      const selectedCreative = repCreativeData?.filter((c) => c?.isSelected)[0]?.id;

      const payload = {
        adid_choice: 0,
        groups: selectedGroups,
        is_parent: false,
        name: formData.trim(),
        default_adid: selectedCreative,
      };

      if (entityType === 'company') {
        payload.company_id = entityId;
      } else if (entityType === 'brand') {
        payload.brand_id = entityId;
      } else if (entityType === 'sub_brand') {
        payload.sub_brand_id = entityId;
      }

      messagingGroupStore.saveMessagingGroup(payload).then(
        (res) => {
          if (res && res?.status === 200 && res?.data) {
            if (res?.data?.success) {
              navigationService.goToMsgGrps();
              showAckMessage({
                message: res?.data?.message ? res?.data?.message : 'Messaging Group created successfully.',
              });
            } else if (!res?.data?.success) {
              if (res?.data?.message) {
                showAckErrorMessage({ message: res?.data?.message });
              } else {
                showAckErrorMessage();
              }
            }
          } else {
            showAckErrorMessage({ message: 'Something went wrong while creating a messaging group.' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleSubmit = () => {
      if (selectedCompany) {
        setToggleNext(!toggleNext);
      } else {
        showAckErrorMessage({ message: 'Please select the Advertiser.' });
      }
    };

    const toggleGroupSelection = (e, group) => {
      const target = e.target;
      if (target.id === 'overlay-trigger') {
        return;
      }
      const index = entityData?.findIndex((entity) => group.id === entity.id);
      const entityDataCpy = [...entityData];
      entityDataCpy[index].isSelected = !entityDataCpy[index].isSelected;
      setEntityData(entityDataCpy);
    };

    const selectedGroupIds = () => {
      const groupIds = [];
      entityData.forEach((group) => {
        group.data_provider === dataProvider && group.isSelected && groupIds.push(group.id);
      });
      return groupIds;
    };

    const toggleDefaultAdIdSelection = (adId) => {
      const repCreativeDataCpy = repCreativeData?.map((data) => ({ ...data, isSelected: adId.id === data.id }));
      setRepCreativeData(repCreativeDataCpy);
    };

    return (
      <div className="mt15 mb15">
        {toggleNext ? (
          <CompanySelection
            entityTreeLevelData={entityTreeLevelData}
            selectedCompany={selectedCompany}
            onSelectEntity={onSelectEntity}
            entityData={entityData}
            repCreativeData={repCreativeData}
            toggleGroupSelection={toggleGroupSelection}
            saveMessagingGroup={saveMessagingGroup}
            toggleDefaultAdIdSelection={toggleDefaultAdIdSelection}
            formData={formData}
            handleFormData={handleFormData}
            availableSegments={availableSegments}
            selectedSegments={selectedSegments}
            isEdit={editState === 'edit'}
            editMsgGrpData={editMsgGrpData}
            entityDetails={entityDetails}
            toggleDataProvider={toggleDataProvider}
            dataProvider={dataProvider}
            uniqueDataProvider={uniqueDataProvider}
            nextPageUrl={nextPageUrl}
            handlePagination={handlePagination}
            tableRef={tableRef}
          />
        ) : (
          <>
            <SelectWrapper>
              <select
                className="capitalize transparent"
                value={selectedCompany}
                onChange={(e) => handleEntitySelection(e)}
              >
                <option value="0" disabled>
                  {companiesData?.length > 0 ? 'Select Advertiser' : 'Loading advertiser'}
                </option>
                {companiesData?.length > 0 &&
                  companiesData?.map((c) => (
                    <option key={c.company.id} value={c.company.id}>
                      {c.company.name}
                    </option>
                  ))}
              </select>
            </SelectWrapper>

            <NextBtn>
              <CustomButton
                buttonText="Next"
                type="primary"
                buttonClassName="msg-grp-next-btn"
                handleButtonClick={() => handleSubmit()}
              />
            </NextBtn>
          </>
        )}
        <ReactLoader isLoading={uiStore.isLoading} />
      </div>
    );
  })
);

DefineMessagingGroup.propTypes = {
  messagingGroupStore: PropTypes.array,
  companyStore: PropTypes.object,
  uiStore: PropTypes.object,
  navigationService: PropTypes.object,
  $stateParams: PropTypes.object,
};

export default withStore(DefineMessagingGroup);
