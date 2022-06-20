import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';

import withStore from '../../hocs/WithStore';
import { showAckErrorMessage, processUTCtoEST } from '../../common/utils';
import ReactLoader from '../../components/ReactLoader';
import CreativesAdPreviewModal from '../../components/CreativesAdPreviewModal';
import EditHouseIdModal from '../../components/EditHouseIdModal';

import CreativesTable from '../../components/network-creatives/creatives-manage/CreativesTable';
import CreativesHeader from './components/CreativesHeader';
import UploadCreativesModal from './components/UploadCreativesModal';
import ApprovedDetailsModal from './components/ApprovedDetailsModal';

import { tableHeaderList } from './JsonData';

const CreativesLandingpage = inject(
  'creativesStore',
  'networkStore',
  'companyStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { uiStore, creativesStore, networkStore, companyStore, authStore } = props;
    const [creativesListingData, setCreativesListingData] = useState([]);
    const [deliveryVendorChoices, setDeliveryVendorChoices] = useState([]);
    const [previewModalData, setPreviewModalData] = useState();
    const [approveModalData, setApproveModalData] = useState();
    const [houseIdModalData, setHouseIdModalData] = useState({});
    const [activeModal, setActiveModal] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState('');
    const tableRef = useRef(null);
    const tableHeadings = tableHeaderList;

    const getMaxDate = (data) =>
      data.reduce((max, currentValue) =>
        new Date(max.modified) > new Date(currentValue.modified) ? max : currentValue
      );

    // Processing response for manage creatives.
    const processCreatives = (response) => {
      const processed_response = response?.data?.data?.results?.map((data) => {
        const crCpy = JSON.parse(JSON.stringify(data));
        const approvedInfo = crCpy?.adid_meta_file_upload?.[0]?.status_list
          ? Object.values(crCpy.adid_meta_file_upload[0].status_list).filter(
              (allSt) => allSt?.channel_daypart_approved_list?.length > 0
            )
          : [];
        if (approvedInfo?.length) {
          const approvalModalInfo = [];
          //Making an array of networks approved
          crCpy.approvalData = approvedInfo.map((st) => {
            const channelsList = [];
            const _approvalData = [];
            st.channel_daypart_approved_list?.forEach((channel) => {
              const channelInfo = Object.values(channel)[0];
              const lastDayPartInfo = channelInfo[channelInfo.length - 1];
              channelsList.push(lastDayPartInfo);
              _approvalData.push(lastDayPartInfo.channel_name);
            });
            const latestUpdatedChannel = getMaxDate(channelsList);
            approvalModalInfo.push({
              network_name: st.network_name,
              last_modified: processUTCtoEST(latestUpdatedChannel.modified),
              user_naEditHouseIdModalme: `${latestUpdatedChannel.first_name} ${latestUpdatedChannel.last_name}`,
            });
            return {
              network_name: st.network_name,
              dayparts: `(${[...new Set(_approvalData)].join(', ')})`,
            };
          });
          crCpy.approvalModalInfo = approvalModalInfo;
        }

        return crCpy;
      });

      return processed_response;
    };

    const getAllCreatives = (url) => {
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
            showAckErrorMessage({ message: "Can't fetch Creatives list." });
          }
        },
        () => {
          showAckErrorMessage({ message: 'something went wrong with creatives list.' });
        }
      );
    };

    const handlePagination = () => {
      getAllCreatives(nextPageUrl);
    };

    const scrollToTop = () => {
      if (tableRef?.current) {
        tableRef.current.scrollTop = 0;
      }
    };

    // Function for refreshing the creatives page
    const onPageRefresh = () => {
      getAllCreatives();
    };

    // Function to close any active modal.
    const closeActiveModal = () => {
      if (approveModalData || previewModalData || houseIdModalData) {
        // Clear any modal data.
        setApproveModalData({});
        setPreviewModalData('');
        setHouseIdModalData({});
      }
      // Hide active modal.
      setActiveModal('');
    };

    useEffect(() => {
      getAllCreatives();
    }, []);

    //Function to display modal containing approved networks.
    const showApproveDataModal = (data) => {
      setApproveModalData(data);
      setActiveModal('approval_data');
    };

    // Function to get video url and display preview modal.
    const getVideoUrl = (adid) => {
      if (adid && adid.adid_meta_file_upload?.[0]?.id) {
        creativesStore.getVideoUrl(adid.adid_meta_file_upload[0].id).then(
          (res) => {
            if (res.data) {
              if (res.data.success && res.data.data) {
                setActiveModal('preview');
                setPreviewModalData(res.data.data);
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

    //API call for company data of upload creatives module.
    const getAllCompanies = () => {
      companyStore.getAllCompanies().then(
        (res) => {
          if (res && res.status === 200 && res.data) {
            setActiveModal('upload_creatives');
          } else {
            showAckErrorMessage({ message: res?.data?.message ?? 'Something went wrong with Upload Creatives!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const showEditHouseIdModal = (data) => {
      setHouseIdModalData(data);
      setActiveModal('edit_houe_id');
    };

    return (
      <div className="main-content-wrapper">
        <CreativesHeader
          getAllCompanies={getAllCompanies}
          onPageRefresh={onPageRefresh}
          isReadonly={authStore.userObj?.read_only}
        />
        <UploadCreativesModal
          showModal={activeModal === 'upload_creatives'}
          closeModal={closeActiveModal}
          deliveryVendorChoices={deliveryVendorChoices}
          getAllCreatives={getAllCreatives}
          isLoading={uiStore.isLoading}
        />
        <CreativesAdPreviewModal
          showModal={activeModal === 'preview'}
          closeModal={closeActiveModal}
          creativeModalData={previewModalData}
        />
        <CreativesTable
          tableData={creativesListingData}
          tableHeadings={tableHeadings}
          getVideoUrl={getVideoUrl}
          isLoading={uiStore.isLoading}
          nextPageUrl={nextPageUrl}
          handlePagination={handlePagination}
          tableRef={tableRef}
          showApproveDataModal={showApproveDataModal}
          isAgAdvDash={true}
          showEditHouseIdModal={showEditHouseIdModal}
        />
        <ApprovedDetailsModal
          showModal={activeModal === 'approval_data'}
          closeModal={closeActiveModal}
          creativeData={approveModalData}
        />
        <EditHouseIdModal
          showModal={activeModal === 'edit_houe_id'}
          houseIdData={houseIdModalData}
          handleToggleModal={closeActiveModal}
          getAllCreatives={getAllCreatives}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </div>
    );
  })
);

CreativesLandingpage.propTypes = {
  creativesStore: PropTypes.object,
  uiStore: PropTypes.object,
  creativesVideoStore: PropTypes.object,
  companyStore: PropTypes.object,
  authStore: PropTypes.object,
};
export default withStore(CreativesLandingpage);
