import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import ReactLoader from '../../components/ReactLoader';
import CreativesAdPreviewModal from '../../components/CreativesAdPreviewModal';
import ReactPickyFilter from '../../components/ReactPickyFilter';
import SearchBox from '../../components/SearchBox';

import withStore from '../../hocs/WithStore';

import { processUTCtoEST, showAckErrorMessage, applySearch } from '../../common/utils';

import ManageCreativesTableContainer from './components/ManageCreativesTableContainer';
import { manageCreativesTableTitles } from './components/JsonData';

import ConfirmCreative from './containers/ConfirmCreative';

const Creatives = inject(
  'uiStore',
  'creativesVideoStore',
  'operatorStore'
)(
  observer((props) => {
    const { uiStore, operatorStore, creativesVideoStore } = props;
    const [creativesData, setCreativesData] = useState([]);
    const [filteredCreativesData, setFilteredCreativesData] = useState([]);
    const [creativeModalData, setCreativeModalData] = useState('');
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [advertiserFilterAllData, setAdvertiserFilterAllData] = useState([]);
    const [advertiserFilterSelectedData, setAdvertiserFilterSelectedData] = useState([]);
    const [brandFilterAllData, setBrandFilterAllData] = useState([]);
    const [brandFilterSelectedData, setBrandFilterSelectedData] = useState([]);

    const [orderFilterAllData, setOrderFilterAllData] = useState([]);
    const [orderFilterSelectedData, setOrderFilterSelectedData] = useState([]);

    const [ownerFilterAllData, setOwnerFilterAllData] = useState([]);
    const [ownerFilterSelectedData, setOwnerFilterSelectedData] = useState([]);

    useEffect(() => {
      getAllManageCreatives();
    }, []);

    // GET creatives data from API and process the data
    const getAllManageCreatives = () => {
      operatorStore.getAllManageCreatives().then(
        (res) => {
          if (res && res.status === 200) {
            let results = [];
            if (res.data.success && res.data.data && res.data.data.length) {
              results = res.data.data.map((data) => {
                const dCpy = JSON.parse(JSON.stringify(data));
                dCpy.actual_duration = data.actual_duration.toString();
                dCpy.creative_received = data.is_received.length
                  ? `Confirmed by ${data.is_received[0].first_name} ${
                      data.is_received[0].last_name
                    } at ${processUTCtoEST(data.is_received[0].modified)} ET`
                  : ''; // Adding Confirmed by... ET string here for searchability
                dCpy.encoding_received = data?.is_encoded?.length
                  ? `Confirmed by ${data.is_encoded[0].first_name} ${data.is_encoded[0].last_name} at ${processUTCtoEST(
                      data.is_encoded[0].modified
                    )} ET` // Adding Confirmed by... ET string here for searchability
                  : '';
                return dCpy;
              });
            }

            const concatenatedArray = JSON.parse(JSON.stringify(results));
            setCreativesData(concatenatedArray);
            const advertiserData = [];
            const CreativesTableCpy = JSON.parse(JSON.stringify(results));
            // console.log(CreativesTableCpy, "uu")

            // Add names of all advertisers to array for picky
            CreativesTableCpy.forEach((a) => {
              if (a?.company_name) {
                advertiserData.push(a.company_name);
              } else {
                advertiserData.push('With no advertisers');
              }
            });
            const advFilteredDataCopy = [...new Set(advertiserData)]; // Removing repititive advertisers
            setAdvertiserFilterAllData(advFilteredDataCopy);
            setAdvertiserFilterSelectedData(advFilteredDataCopy);
            onSetBrandData(CreativesTableCpy); // Set all brands for picky
            onSetOrderData(CreativesTableCpy);
            onSetOwnerData(CreativesTableCpy);
            setFilteredCreativesData(CreativesTableCpy);
          } else {
            showAckErrorMessage();
          }
        },
        () => showAckErrorMessage({ message: 'something went wrong with creatives list.' })
      );
    };

    // GET video URL for clicked Ad for preview
    const getVideoUrl = (adid) => {
      if (adid) {
        creativesVideoStore.getVideoUrl(adid.id).then(
          (res) => {
            if (res && res.success && res.data) {
              setCreativeModalData(res.data);
              onSetActiveModal('viewCreative');
            } else showAckErrorMessage();
          },
          () => showAckErrorMessage({ message: 'Cannot get video file data for the creative.' })
        );
      } else {
        showAckErrorMessage({ message: 'No creative data available.' });
      }
    };

    // Open modal based on type of button
    const handleModalAction = (buttonType, mData) => {
      if (buttonType === 'viewCreative') {
        getVideoUrl(mData);
      } else if (buttonType === 'operatorAck' || buttonType === 'encoding') {
        setModalData(mData);
        onSetActiveModal(buttonType);
      }
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const handleSuccessResponse = () => {
      getAllManageCreatives();
    };

    // Return selected advertisers data based on advertisers selected in picky
    const onFilterAdvertiserData = (filteredData) => {
      const modifiedData = creativesData.filter((a) => {
        if (a.company_name && filteredData.includes(a.company_name)) {
          return true;
        } else if (!a.company_name && filteredData.includes('with no advertisers')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    // Return selected brands data based on brands selected in picky
    const onFilterBrandData = (filteredData) => {
      const filteredAdvertiserData = onFilterAdvertiserData(advertiserFilterSelectedData);
      const modifiedData = [];
      filteredAdvertiserData.forEach((b) => {
        if (b.brand_name) {
          if (filteredData.includes(b.brand_name)) {
            modifiedData.push(b);
          }
        } else if (filteredData.includes('with no brands')) {
          modifiedData.push(b);
        }
      });
      return modifiedData;
    };
    //  Return selected brands data based on brands selected in picky
    const onFilterOrderData = (filteredData) => {
      const filteredAdvertiserData = onFilterAdvertiserData(advertiserFilterSelectedData);
      const modifiedData = [];
      filteredAdvertiserData.forEach((o) => {
        if (o.order_type[0]) {
          if (filteredData.includes(o.order_type[0])) {
            modifiedData.push(o);
          }
        } else if (filteredData.includes('with no orders')) {
          modifiedData.push(o);
        }
      });
      return modifiedData;
    };

    const onFilterOwnerData = (filteredData) => {
      const filteredAdvertiserData = onFilterAdvertiserData(advertiserFilterSelectedData);
      const modifiedData = [];
      filteredAdvertiserData.forEach((i) => {
        if (i.inventory_owner) {
          if (filteredData.includes(i.inventory_owner)) {
            modifiedData.push(i);
          }
        } else if (filteredData.includes('with no owner')) {
          modifiedData.push(i);
        }
      });
      return modifiedData;
    };

    // generate list of all brands present in data
    const onSetBrandData = (modifiedData) => {
      const brandData = [];
      modifiedData.forEach((b) => {
        if (b && b.brand_name) {
          brandData.push(b.brand_name);
        } else {
          brandData.push('with no brands');
        }
      });
      const brandFilteredDataCpy = [...new Set(brandData)]; // To removed repeated brands
      setBrandFilterAllData(brandFilteredDataCpy);
      setBrandFilterSelectedData(brandFilteredDataCpy);
    };

    const onSetOwnerData = (modifiedData) => {
      const ownerData = [];
      modifiedData.forEach((item) => {
        if (item && item.inventory_owner) {
          ownerData.push(item.inventory_owner);
        } else {
          ownerData.push('with no owner');
        }
      });
      const ownerFilteredDataCpy = [...new Set(ownerData)];
      setOwnerFilterAllData(ownerFilteredDataCpy);
      setOwnerFilterSelectedData(ownerFilteredDataCpy);
    };
    // generate list of all order present in data
    const onSetOrderData = (modifiedData) => {
      const orderData = [];
      modifiedData.forEach((o) => {
        if (o && o.order_type[0]) {
          orderData.push(o.order_type[0]);
        } else {
          orderData.push('with no orders');
        }
      });
      const orderFilteredDataCpy = [...new Set(orderData)]; // To removed repeated brands
      setOrderFilterAllData(orderFilteredDataCpy);
      setOrderFilterSelectedData(orderFilteredDataCpy);
    };

    // Apply picky filter based on parameters like id (advertiser/brand) and filteredData (passed data)
    const applyFilter = (filteredData, id) => {
      if (searchValue) {
        setSearchValue(''); // Clear search value
      }

      if (id === 'adv_filter') {
        setAdvertiserFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvertiserData(filteredData); // Data filtered on basis of selected advertisers
        setFilteredCreativesData(modifiedData);
        onSetBrandData(modifiedData); // Set brand picky data on basis of selected advertisers data
        onSetOrderData(modifiedData);
        onSetOwnerData(modifiedData);
      } else if (id === 'brand_filter') {
        setBrandFilterSelectedData(filteredData);
        const modifiedData = onFilterBrandData(filteredData); // Data filtered on basis of selected brands
        setFilteredCreativesData(modifiedData);
        onSetOrderData(modifiedData);
        onSetOwnerData(modifiedData);
      } else if (id === 'order_filter') {
        setOrderFilterSelectedData(filteredData);
        const modifiedData = onFilterOrderData(filteredData); // Data filtered on basis of selected brands
        setFilteredCreativesData(modifiedData);
        onSetBrandData(modifiedData); // Set brand picky data on basis of selected advertisers data
        onSetOwnerData(modifiedData);
      } else if (id === 'owner_filter') {
        setOwnerFilterSelectedData(filteredData);
        const modifiedData = onFilterOwnerData(filteredData);
        setFilteredCreativesData(modifiedData);
        onSetBrandData(modifiedData);
        onSetOrderData(modifiedData);
      }
    };

    const handleSearchTextChange = (value) => {
      setSearchValue(value);
      const brandFilteredDataCpy = onFilterBrandData(brandFilterSelectedData);
      const list = applySearch(value, brandFilteredDataCpy, manageCreativesTableTitles);
      setFilteredCreativesData(list);
    };

    return (
      <>
        <MainContent>
          <PageHeader>
            <div className="flex-container2">
              <PageTitle>Manage Creatives</PageTitle>
              <div className="flex-container2" style={{ width: '80%' }}>
                <ReactPickyFilter
                  allOptions={advertiserFilterAllData}
                  selectedData={advertiserFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="adv_filter"
                  selectAllText="Select All Advertisers"
                  allSelectedPlaceholder="All Advertisers"
                />
                <ReactPickyFilter
                  allOptions={brandFilterAllData}
                  selectedData={brandFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="brand_filter"
                  selectAllText="Select All Brands"
                  allSelectedPlaceholder="All Brands"
                />
                <ReactPickyFilter
                  allOptions={orderFilterAllData}
                  selectedData={orderFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="order_filter"
                  selectAllText="Select All Order"
                  allSelectedPlaceholder="All Order"
                />
                <ReactPickyFilter
                  allOptions={ownerFilterAllData}
                  selectedData={ownerFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="owner_filter"
                  selectAllText="Select All Owner"
                  allSelectedPlaceholder="All Owner"
                />
                <div className="ml10">
                  <SearchBox searchValue={searchValue} handleSearchTextChange={handleSearchTextChange}></SearchBox>
                </div>
              </div>
            </div>
          </PageHeader>
          <ManageCreativesTableContainer
            filteredCreativesData={filteredCreativesData}
            manageCreativesTableTitles={manageCreativesTableTitles}
            handleModalAction={handleModalAction}
            isLoading={uiStore.isLoading}
            searchValue={searchValue}
          />
          <ConfirmCreative
            showModal={activeModal === 'operatorAck' || activeModal === 'encoding'}
            closeModal={() => onSetActiveModal('')}
            modalData={modalData}
            handleSuccessResponse={handleSuccessResponse}
            modalType={activeModal}
          />
          <CreativesAdPreviewModal
            showModal={activeModal === 'viewCreative'}
            closeModal={() => {
              onSetActiveModal('');
              setCreativeModalData('');
            }}
            creativeModalData={creativeModalData}
          />
          <ReactLoader isLoading={uiStore.isLoading} />
        </MainContent>
      </>
    );
  })
);

export default withStore(Creatives);
