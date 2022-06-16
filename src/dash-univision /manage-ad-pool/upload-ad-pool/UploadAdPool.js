import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';
import { formatText, getEntityType, showAckErrorMessage, showAckMessage } from '../../../common/utils';

import { observer, inject } from 'mobx-react';
import CustomButton from '../../../components/CustomButton';
import ReactLoader from '../../../components/ReactLoader';
import CreativeForm from '../../../components/network-creatives/creatives-manage/CreativeForm';
import { MainContent, PageContent, PageHeader } from '../../../components/PageLayout';
import { PageTitle } from '../../../components/Typography';

const formInitialState = {
  selectedCompany: 0,
  isciEntity: '',
  isciIdentifier: '',
  isciCreative: '',
  fileData: null,
  selectedDeliveryVendorOption: '',
  selectedAdOption: '',
  selectedNetworkOption: [],
  deliveryVendorFreeText: '',

  // selectedChannels: [],
};
// const updatedF = Anyfunction("some data")(oldFunction)
const UploadAdPool = inject(
  'networkStore',
  'uiStore',
  'navigationService'
)(
  observer((props) => {
    const { networkStore, getAllCreatives, uiStore, navigationService } = props;

    const [deliveryVendorChoices, setDeliveryVendorChoices] = useState([]);
    const [networkChoices, setNetworkChoices] = useState([]);
    const [adChoices, setAdChoices] = useState([]);
    const [networkSelectedData, setNetworkSelectedData] = useState([]);
    const [uploadCreativesData, setUploadCreativesData] = useState(formInitialState);

    useEffect(() => {
      getCompanyData();
      // getDelivery();
    }, []);

    //Function for handling the submit button while uploading creatives.
    const handleISCISubmit = () => {
      const uploadCreativesCpy = { ...uploadCreativesData };
      let deliveryVendorVal = uploadCreativesCpy.selectedDeliveryVendorOption;
      if (uploadCreativesCpy.selectedDeliveryVendorOption === 'other') {
        deliveryVendorVal = formatText(uploadCreativesCpy.deliveryVendorFreeText);
      }

      if (
        formatText(uploadCreativesData.isciCreative) &&
        formatText(uploadCreativesData.isciIdentifier) &&
        uploadCreativesData.fileData &&
        uploadCreativesData.fileData.files[0] &&
        uploadCreativesData.isciEntity &&
        uploadCreativesData.isciEntity.id &&
        deliveryVendorVal
        // uploadCreativesData.selectedChannels.length
      ) {
        networkStore
          .uploadSaveCreative(
            formatText(uploadCreativesData.isciCreative),
            formatText(uploadCreativesData.isciIdentifier),
            uploadCreativesData.fileData.files[0],
            uploadCreativesData.isciEntity.id,
            getEntityType(uploadCreativesData.isciEntity),
            deliveryVendorVal,
            // uploadCreativesData.selectedChannels,
            uploadCreativesData.selectedNetworkOption,
            // networkSelectedData,
            uploadCreativesData.selectedAdOption
          )
          .then(
            (res) => {
              if (res?.success) {
                if (res?.data && res?.data?.is_exist) {
                  showAckErrorMessage({ message: 'ID already exists. Please try again with different Identifier.' });
                } else {
                  showAckMessage({
                    message: 'Upload successful.',
                  });
                  setUploadCreativesData(formInitialState);
                  // closeUploadModal();
                  getAllCreatives();
                }
              } else
                showAckErrorMessage({ message: res?.message ?? 'Something went wrong while Uploading Creative file!' });
            },
            () => {
              showAckErrorMessage();
            }
          );
      } else showAckErrorMessage({ message: 'Please select or fill all the required fields.' });
    };

    // Function to get all the companies data.
    const companyData = toJS(networkStore.companies);
    // Getting company data for upload creatives modal.
    const getCompanyData = () => {
      networkStore.getAllCompanies().then(
        (res) => {
          if (res && res?.status === 200 && res?.data) {
            // API call 2 -  Populating channel data
            // getChannelData();
            getDelivery();
          } else showAckErrorMessage({ message: 'No data available.' });
        },
        () => {
          showAckErrorMessage({ message: 'No advertiser data available. Internal error.' });
        }
      );
    };

    const getNetworkList = (networkChoice) => {
      const networkList = [];
      networkChoice?.map((ad, id) => networkList.push(ad[id]));
      setNetworkChoices(networkList);
      setNetworkSelectedData(networkList);
      setUploadCreativesData({ ...uploadCreativesData, selectedNetworkOption: networkList });
    };

    const applyNetworkMultiselect = (filteredData, id) => {
      if (id === 'network_multiselect') {
        setNetworkSelectedData(filteredData);
        setUploadCreativesData({ ...uploadCreativesData, selectedNetworkOption: filteredData });
      }
    };

    const getDelivery = (url) => {
      networkStore.getCreatives(url).then(
        (res) => {
          if (res && res?.status === 200) {
            if (res?.data && res?.data?.success) {
              //   setNextPageUrl(res.data?.data?.next);
              setDeliveryVendorChoices(res.data?.delivery_vendor_choices);
              getNetworkList(res.data?.network_choices);
              setAdChoices(res.data?.ad_choices);
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

    const cancelButton = () => {
      navigationService.goToManageAdPool();
    };

    return (
      <>
        <MainContent>
          <PageHeader>
            <PageTitle> Upload New Creatives</PageTitle>
          </PageHeader>
          <PageContent>
            <div style={{ width: '50%', marginTop: '50px', paddingLeft: '50px' }}>
              <CreativeForm
                {...props}
                uploadCreativesData={uploadCreativesData}
                companyData={companyData}
                setUploadCreativesData={setUploadCreativesData}
                deliveryVendorChoices={deliveryVendorChoices}
                networkChoices={networkChoices}
                adChoices={adChoices}
                isSecondDropDown={true}
                networkSelectedData={networkSelectedData}
                applyNetworkMultiselect={applyNetworkMultiselect}
              />
              <div className="flex-container6">
                <CustomButton
                  type="secondary"
                  buttonText="Cancel"
                  buttonClassName="mt10 mr10 ml-auto-imp"
                  handleButtonClick={cancelButton}
                ></CustomButton>
                <CustomButton
                  type="primary"
                  buttonText="Submit"
                  buttonClassName=" mt10"
                  handleButtonClick={handleISCISubmit}
                ></CustomButton>
              </div>
            </div>
          </PageContent>
        </MainContent>

        <ReactLoader isLoading={uiStore.isLoading} />
      </>
    );
  })
);

UploadAdPool.propTypes = {
  networkStore: PropTypes.object,
  // showModal: PropTypes.bool,
  // closeModal: PropTypes.func,
  getAllCreatives: PropTypes.func,
  channelList: PropTypes.array,
  deliveryVendorChoices: PropTypes.array,
  setChannelList: PropTypes.func,
};

UploadAdPool.defaultProps = {
  getAllCreatives: () => {},
  deliveryVendorChoices: [],
};

export default withStore(UploadAdPool);
