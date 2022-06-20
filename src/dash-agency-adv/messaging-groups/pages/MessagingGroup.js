import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import withStore from '../../../hocs/WithStore';

import { showAckErrorMessage, applySorting, applySearch } from '../../../common/utils';

import ReactLoader from '../../../components/ReactLoader';
import CreativesAdPreviewModal from '../../../components/CreativesAdPreviewModal';

import MessagingGroupTable from '../components/MessagingGroupTable';
import MessagingGroupHeader from '../components/MessagingGroupHeader';
import ViewSegmentsModal from '../components/ViewSegmentsModal';
import DeleteMessagingGroup from '../containers/DeleteMessagingGroup';

import { msgTableTitles } from '../components/JsonData';

const MessagingGroupLanding = inject(
  'messagingGroupStore',
  'creativesVideoStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { messagingGroupStore, navigationService, uiStore, creativesVideoStore, authStore } = props;

    const [messagingGroupData, setMessagingGroupData] = useState([]); // Messaging group data to show in the table
    const [filterMsgGrpData, setFilterMsgGrpData] = useState([]); // Set sorted and filtered messaging group data to show in table

    const [advFilterAllData, setAdvFilterAllData] = useState([]); // Avertiser list to show in select Advertiser dropdown and update in table
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]); // Selected avertiser list to show in select Advertiser dropdown and update in table

    const [brandFilterAllData, setBrandFilterAllData] = useState([]); // Selected brand list to show in select brand dropdown and update in table
    const [brandFilterSelectedData, setBrandFilterSelectedData] = useState([]); // Selected brand list to show in select brand dropdown and update in table

    const [creativeModalData, setCreativeModalData] = useState(''); // Set the creative modal data to play the creative

    const [modalData, setModalData] = useState({}); // Set modalData to pick the messaging group element that is required

    const [searchValue, setSearchValue] = useState('');
    const [activeModal, setActiveModal] = useState('');
    const [msgGrpTableTitles, setMsgTableTitles] = useState(msgTableTitles);
    const [activeSortTitles, setActiveSortTitles] = useState([msgTableTitles[0], true]);

    // Function to call API to show messaging group data
    const getAllMessagingGroup = () => {
      messagingGroupStore.getAllMessagingGroup().then(
        (res) => {
          if (res && res.status === 200) {
            let results = [];
            if (res?.data?.success && res?.data?.data?.length) {
              results = res.data.data.map((data) => {
                const dCpy = JSON.parse(JSON.stringify(data));
                dCpy.creative_name = data.default_adid.ad_name;
                dCpy.isci_code = data.default_adid.identifier;
                return dCpy;
              });
            }

            const msgGrpTableContent = JSON.parse(JSON.stringify(results));
            setMessagingGroupData(msgGrpTableContent);
            const advData = [];
            msgGrpTableContent.forEach((a) => {
              if (a?.advertiser) {
                advData.push(a.advertiser);
              } else {
                advData.push('with no advertiser');
              }
            });
            const advFilterdDataCpy = [...new Set(advData)]; // Set advertiser array list
            setAdvFilterAllData(advFilterdDataCpy);
            setAdvFilterSelectedData(advFilterdDataCpy);
            onSetBrandData(msgGrpTableContent);
            if (msgGrpTableContent && msgGrpTableContent.length) {
              sortMessagingGroup(activeSortTitles[0], activeSortTitles[1], msgGrpTableContent);
            } else {
              setFilterMsgGrpData(msgGrpTableContent);
            }
          } else {
            showAckErrorMessage({
              message: res?.data?.message ?? 'Something went wrong while fetching Messaging Group!',
            });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    useEffect(() => {
      getAllMessagingGroup();
    }, []);

    // Function to refresh page on refreshing button
    const onPageRefresh = () => {
      getAllMessagingGroup();
      if (searchValue) {
        setSearchValue('');
      }
    };

    // Function to show the Advertiser list in dropdown
    const onFilterAdvData = (filteredData) => {
      const modifiedData = messagingGroupData.filter((a) => {
        if (a.advertiser && filteredData.includes(a.advertiser)) {
          return true;
        } else if (!a && a.advertiser && filteredData.includes('with no advertiser')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    // Function to show the Brand list in dropdown
    const onFilterBrandData = (filteredData) => {
      const filteredAdvertiserData = onFilterAdvData(advFilterSelectedData);
      const modifiedData = [];
      filteredAdvertiserData.forEach((b) => {
        if (b.brand) {
          if (filteredData.includes(b.brand)) {
            modifiedData.push(b);
          }
        } else if (filteredData.includes('with no brands')) {
          modifiedData.push(b);
        }
      });
      return modifiedData;
    };

    // Function to set brand list on advertiser filter list
    const onSetBrandData = (modifiedData) => {
      const brandData = [];
      modifiedData.forEach((b) => {
        if (b.brand) {
          brandData.push(b.brand);
        } else {
          brandData.push('with no brands');
        }
      });
      const brandFilteredDataCpy = [...new Set(brandData)];
      setBrandFilterAllData(brandFilteredDataCpy);
      setBrandFilterSelectedData(brandFilteredDataCpy);
    };

    // Function to apply picky filter
    const applyFilter = (filteredData, id) => {
      if (id === 'adv_filter') {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        onSetBrandData(modifiedData);
        handleSearchTextChange(searchValue, filteredData, id);
      } else if (id === 'brand_filter') {
        setBrandFilterSelectedData(filteredData);
        handleSearchTextChange(searchValue, filteredData, id);
      }
    };

    // Function to route Define messaging group
    const handleDefineMessagingGroup = () => {
      navigationService.goToDefineMessagingGrp();
    };

    // Function to call API for creative video url
    const getVideoUrl = (adid) => {
      if (adid) {
        creativesVideoStore.getVideoUrl(adid.default_adid.adid_meta_file_upload_id).then(
          (res) => {
            if (res && res.success && res.data) {
              setActiveModal('viewCreative');
              setCreativeModalData(res.data);
            } else {
              showAckErrorMessage({ message: 'No creative data available' });
            }
          },
          () => showAckErrorMessage({ message: 'Cannot get video file data for the creative.' })
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
    };

    // Function to handle modal actions
    const handleModalAction = (buttonType, mData) => {
      if (buttonType === 'deleteMsgGrp') {
        setModalData(mData);
      } else if (buttonType === 'viewSegments') {
        setModalData(mData);
      }
      onSetActiveModal(buttonType);
    };

    // Function to set active modal
    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    // Function to close creative modal and clear url
    const closeCreativesModalData = () => {
      if (creativeModalData) {
        setCreativeModalData('');
      }
      onSetActiveModal('');
    };

    // Function to define sorting
    const sortMessagingGroup = (activeTitleData, value, sortedMsgGrpTableDataCpy = filterMsgGrpData) => {
      setActiveSortTitles([activeTitleData, value]);
      const msgGrpTableContentCpy = JSON.parse(JSON.stringify(msgGrpTableTitles));
      const index = msgGrpTableContentCpy.findIndex((c) => c.id === activeTitleData.id && c.isApplySorting);
      if (index !== -1) {
        msgGrpTableContentCpy[index].sortingType = value;
        msgGrpTableContentCpy.forEach((c, cIndex) => {
          if (index !== cIndex) {
            c.sortingType = null;
          }
        });
        setMsgTableTitles(msgGrpTableContentCpy);
        const sortedData = applySorting(
          msgGrpTableContentCpy[index].sortingType,
          activeTitleData.id,
          sortedMsgGrpTableDataCpy
        );
        setFilterMsgGrpData(sortedData); // Sort list after filtering data
      }
    };

    const handleSearchTextChange = (value, data = null, id) => {
      setSearchValue(value);
      let list = [];
      if (id === 'adv_filter') {
        list = onFilterAdvData(data);
      } else {
        list = onFilterBrandData(data || brandFilterSelectedData);
      }
      list = applySearch(value, list, msgGrpTableTitles);
      sortMessagingGroup(activeSortTitles[0], activeSortTitles[1], list);
    };

    // Filter wanted messaging group id
    const subSegment = messagingGroupData.filter((c) => c.id === modalData);

    // Function to route edit messaging group
    const editMessagingGroup = (subSegment) => {
      navigationService.goToDefineMessagingGrp({
        isDeepLink: true,
        editState: 'edit',
        activeSegment: subSegment,
      });
    };

    return (
      <div className="main-content-wrapper">
        <div className="mt5">
          <MessagingGroupHeader
            handleDefineMessagingGroup={handleDefineMessagingGroup}
            advFilterAllData={advFilterAllData}
            advFilterSelectedData={advFilterSelectedData}
            brandFilterAllData={brandFilterAllData}
            brandFilterSelectedData={brandFilterSelectedData}
            applyFilter={applyFilter}
            onPageRefresh={onPageRefresh}
            handleSearchTextChange={handleSearchTextChange}
            searchValue={searchValue}
            isReadonly={authStore.userObj?.read_only}
          />
        </div>
        <div>
          <MessagingGroupTable
            messagingGroupData={filterMsgGrpData}
            handleModalAction={handleModalAction}
            sortMessagingGroup={sortMessagingGroup}
            msgTableTitles={msgGrpTableTitles}
            editMessagingGroup={editMessagingGroup}
            subSegment={subSegment}
            getVideoUrl={getVideoUrl}
            isLoading={uiStore.isLoading}
            isReadonly={authStore.userObj?.read_only}
          />
        </div>
        <ViewSegmentsModal
          showModal={activeModal === 'viewSegments'}
          closeModal={() => onSetActiveModal('')}
          subSegment={subSegment}
        />
        <CreativesAdPreviewModal
          showModal={activeModal === 'viewCreative'}
          closeModal={closeCreativesModalData}
          creativeModalData={creativeModalData}
        />
        <DeleteMessagingGroup
          showModal={activeModal === 'deleteMsgGrp'}
          closeModal={() => onSetActiveModal('')}
          modalData={modalData}
          getAllMessagingGroup={getAllMessagingGroup}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </div>
    );
  })
);

MessagingGroupLanding.propTypes = {
  navigationService: PropTypes.object,
  messagingGroupStore: PropTypes.array,
  uiStore: PropTypes.object,
  creativesVideoStore: PropTypes.object,
  authStore: PropTypes.object,
};

export default withStore(MessagingGroupLanding);
