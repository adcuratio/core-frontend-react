import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import withStore from '../../../hocs/WithStore';
import { showAckErrorMessage } from '../../../common/utils';
import ReactLoader from '../../../components/ReactLoader';
import CreativesAdPreviewModal from '../../../components/CreativesAdPreviewModal';

import CreativesTable from '../../../components/network-creatives/creatives-manage/CreativesTable';
import CreativesHeader from '../../../components/network-creatives/creatives-manage/CreativesHeader';
import UploadCreativesModal from '../../../components/network-creatives/creatives-manage/UploadCreativesModal';

import { tableHeaderList } from './JsonData';

const NetworkManageCreatives = inject(
  'networkStore',
  'creativesStore',
  'uiStore'
)(
  observer((props) => {
    const { uiStore, networkStore, creativesStore } = props;
    const [creativesListingData, setCreativesListingData] = useState([]);
    const [deliveryVendorChoices, setDeliveryVendorChoices] = useState([]);
    const [creativeModalData, setCreativeModalData] = useState();
    const [activeModal, setActiveModal] = useState('');
    const tableHeadings = tableHeaderList;
    const [nextPageUrl, setNextPageUrl] = useState('');
    const tableRef = useRef(null);
    const [channelList, setChannelList] = useState([]);

    // No processing of response for manage creatives.
    const processCreatives = (response) => response.data?.data?.results;

    const getCreatives = (url) => {
      networkStore.getCreatives(url).then(
        (res) => {
          if (res && res.status === 200) {
            if (res.data && res.data?.success) {
              setNextPageUrl(res.data?.data?.next);
              setDeliveryVendorChoices(res.data?.delivery_vendor_choices);

              const processedCreatives = processCreatives(res);
              uiStore.isLoading = false;
              let concatenatedArray;
              if (url) {
                const creativesListingDataCpy = JSON.parse(JSON.stringify(creativesListingData));
                const processedCreativesCpy = JSON.parse(JSON.stringify(processedCreatives));
                concatenatedArray = [...creativesListingDataCpy, ...processedCreativesCpy];
              } else {
                concatenatedArray = JSON.parse(JSON.stringify(processedCreatives));
                scrollToTop();
              }
              setCreativesListingData(concatenatedArray);
            } else showAckErrorMessage({ message: res.data?.message });
          } else {
            showAckErrorMessage({ message: "Can't fetch creatives list." });
          }
        },
        () => {
          showAckErrorMessage({ message: 'something went wrong with creatives list.' });
        }
      );
    };

    useEffect(() => {
      getCreatives();
    }, []);

    const handlePagination = () => {
      getCreatives(nextPageUrl);
    };

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    // Function to get video url
    const getVideoUrl = (adid) => {
      if (adid && adid.adid_meta_file_upload?.[0]?.id) {
        creativesStore.getWatermarkedVideoUrl(adid.adid_meta_file_upload[0].id).then(
          (res) => {
            if (res.data) {
              if (res.data.success && res.data.data) {
                setActiveModal('preview');
                setCreativeModalData(res.data.data);
              } else showAckErrorMessage({ message: res.data?.message });
            } else showAckErrorMessage({ message: 'Creative data is not found.' });
          },
          () => {
            showAckErrorMessage({ message: 'Cannot get video file data for the creative.' });
          }
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
    };

    // Getting available channels list for Upload creatives modal.
    const getChannelData = () => {
      networkStore.getAllChannels().then(
        (res) => {
          if (res && res.status === 200) {
            if (res.data?.success) {
              // Channel data is already filtered by backend based on network.
              setChannelList(res.data.channel_groups[0]);
              // Finally - Show Upload creatives modal.
              setActiveModal('upload_creatives');
            } else showAckErrorMessage({ message: res.data?.message });
          } else showAckErrorMessage();
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    // Getting company data for upload creatives modal.
    const getCompanyData = () => {
      networkStore.getAllCompanies().then(
        (res) => {
          if (res && res.status === 200 && res.data) {
            // API call 2 -  Populating channel data
            getChannelData();
          } else showAckErrorMessage({ message: 'No data available.' });
        },
        () => {
          showAckErrorMessage({ message: 'No advertiser data available. Internal error.' });
        }
      );
    };

    // Function to show upload creatives modal
    const showUploadCreativesModal = () => {
      // API call 1 -  Populating company data
      getCompanyData();
    };

    // Function to set the modal action.
    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    // Function to close the creatives video modal.
    const closeCreativesModalData = () => {
      if (creativeModalData) {
        setCreativeModalData('');
      }
      onSetActiveModal('');
    };

    // Function for refreshing the creatives page
    const onPageRefresh = () => {
      getCreatives();
    };

    // Function to close the upload creatives modal.
    const onCloseUploadCreativeModal = () => {
      closeCreativesModalData();
    };

    return (
      <div className="main-content-wrapper">
        <CreativesHeader showUploadCreativesModal={showUploadCreativesModal} onPageRefresh={onPageRefresh} />
        <UploadCreativesModal
          showModal={activeModal === 'upload_creatives'}
          closeModal={onCloseUploadCreativeModal}
          deliveryVendorChoices={deliveryVendorChoices}
          getAllCreatives={getCreatives}
          channelList={channelList}
          setChannelList={setChannelList}
        />
        <CreativesAdPreviewModal
          showModal={activeModal === 'preview'}
          closeModal={closeCreativesModalData}
          creativeModalData={creativeModalData}
        />
        <CreativesTable
          tableData={creativesListingData}
          tableHeadings={tableHeadings}
          getVideoUrl={getVideoUrl}
          isLoading={uiStore.isLoading}
          nextPageUrl={nextPageUrl}
          handlePagination={handlePagination}
          tableRef={tableRef}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </div>
    );
  })
);

NetworkManageCreatives.propTypes = {
  networkStore: PropTypes.object,
  uiStore: PropTypes.object,
};
export default withStore(NetworkManageCreatives);
