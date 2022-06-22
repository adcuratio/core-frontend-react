import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import { showAckErrorMessage, applySearch } from '../../common/utils';
import ReactLoader from '../../components/ReactLoader';
import withStore from '../../hocs/WithStore';
import ReactPickyFilter from '../../components/ReactPickyFilter';
import SearchBox from '../../components/SearchBox';

import ManageCampaignTagTable from './components/ManageCampaignTagTable';
import AddAttributeAction from './containers/AddAttributeAction';
import ConfirmTag from './containers/ConfirmTag';
import DeclineTag from './containers/DeclineTag';
import { manageSegmentTagTitles } from './components/JsonData';

const ManageCampaignTags = inject(
  'operatorStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { operatorStore, uiStore, authStore } = props;
    const [campaignTagsList, setCampaignTagsList] = useState([]); // To list the array of segment tag table data.
    const [filteredCampaignTags, setFilteredCampaignTags] = useState([]); // To list the array of filtered data.
    const [advFilterAllData, setAdvFilterAllData] = useState([]); // To show  array of advertisers data.
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]); // To show the selected/filtered advertisers.
    const [brandFilterAllData, setBrandFilterAllData] = useState([]); // To show array of brands data.
    const [brandFilterSelectedData, setBrandFilterSelectedData] = useState([]); // To show the selected/filtered brands data.
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState('');
    const [searchValue, setSearchValue] = useState('');

    // Function for API calling of the main landing page of manage campaign tag.
    const getAllCampaignTags = () => {
      operatorStore.getAllCampaignTags().then((res) => {
        if (res.status === 200 && res?.data.success) {
          const TagListingData = res.data.data;
          setCampaignTagsList(TagListingData);
          TagListingData.map((tagObj) => {
            if (tagObj?.trades?.length) {
              tagObj.advertiser = tagObj.trades.map((a) => a.advertiser);
              tagObj.brand = tagObj.trades.map((a) => a.brand);
              tagObj.sub_brand = tagObj.trades.map((a) => a.sub_brand);
              tagObj.order_name = tagObj.trades.map((a) => a.order_name);
            }
            return tagObj;
          });
          //filtering
          const advertiserData = [];
          TagListingData.forEach((a) => {
            if (a.trades?.length && a.trades[0].advertiser) {
              advertiserData.push(a.trades[0].advertiser);
            } else {
              advertiserData.push('with no advertisers');
            }
          });
          const advFilterdDataCpy = [...new Set(advertiserData)];
          setAdvFilterAllData(advFilterdDataCpy);
          setAdvFilterSelectedData(advFilterdDataCpy);
          onSetBrandData(TagListingData);
          setFilteredCampaignTags(TagListingData);
        } else {
          showAckErrorMessage({ message: 'Unable to fetch the campaign tags' });
        }
        () => {
          showAckErrorMessage({
            message: 'error occurred',
          });
        };
      });
    };

    const onFilterAdvData = (filteredData) => {
      const modifiedData = campaignTagsList.filter((a) => {
        if (a.trades?.length && a.trades[0].advertiser && filteredData.includes(a.trades[0].advertiser)) {
          return true;
        } else if (!a.trades?.length && filteredData.includes('with no advertisers')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    //handling response for adding attribute id
    const onResponseChange = (data) => {
      const campaignTagsListCpy = JSON.parse(JSON.stringify(campaignTagsList)); // Deep copy of the object.
      const filteredCampaignTagsCpy = JSON.parse(JSON.stringify(filteredCampaignTags)); // Deep copy of the object.
      const activeIndex1 = campaignTagsListCpy.findIndex((d) => d.id === data.id);
      const activeIndex2 = filteredCampaignTagsCpy.findIndex((d) => d.id === data.id);
      if (activeIndex1 !== -1) {
        campaignTagsListCpy[activeIndex1] = data;
        setCampaignTagsList(campaignTagsListCpy);
      }
      if (activeIndex2 !== -1) {
        filteredCampaignTagsCpy[activeIndex2] = data;
        setFilteredCampaignTags(filteredCampaignTagsCpy);
      }
    };

    const onFilterBrandData = (filteredData) => {
      const filteredAdvertiserData = onFilterAdvData(advFilterSelectedData);
      const modifiedData = [];
      filteredAdvertiserData.forEach((b) => {
        if (b.trades?.length && b.trades[0].brand) {
          if (filteredData.includes(b.trades[0].brand)) {
            modifiedData.push(b);
          }
        } else if (filteredData.includes('with no brands')) {
          modifiedData.push(b);
        }
      });
      return modifiedData;
    };

    const onSetBrandData = (modifiedData) => {
      const brandData = [];
      modifiedData.forEach((data) => {
        if (data?.trades?.length && data?.trades[0]?.brand) {
          brandData.push(data?.trades[0]?.brand);
        } else {
          brandData.push('with no brands');
        }
      });
      setBrandFilterAllData([...new Set(brandData)]);
      setBrandFilterSelectedData([...new Set(brandData)]);
    };

    const applyFilter = (filteredData, id) => {
      if (searchValue) {
        setSearchValue(''); // Clear search value
      }

      if (id === 'adv_filter') {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        setFilteredCampaignTags(modifiedData);
        onSetBrandData(modifiedData);
      } else if (id === 'brand_filter') {
        setBrandFilterSelectedData(filteredData);
        const modifiedData = onFilterBrandData(filteredData);
        setFilteredCampaignTags(modifiedData);
      }
    };

    // Add attribute id modal action
    const handleAddAttributeIdAction = (mdata) => {
      setActiveModal('add_attribute_id_modal');
      setModalData(mdata);
    };
    // Confirm button modal action
    const handleConfirmationAction = (res) => {
      setActiveModal('confirmation_modal');
      setModalData(res);
    };
    // Decline button modal action
    const handleDeclineAction = (res) => {
      setActiveModal('decline_modal');
      setModalData(res);
    };

    //search function
    const handleSearchTextChange = (value) => {
      setSearchValue(value);
      const brandFilteredDataCpy = onFilterBrandData(brandFilterSelectedData);
      const list = applySearch(value, brandFilteredDataCpy, manageSegmentTagTitles);
      setFilteredCampaignTags(list);
    };

    useEffect(() => {
      getAllCampaignTags();
    }, []);

    return (
      <MainContent>
        <PageHeader>
          <div className="flex-container2">
            <PageTitle>Manage Campaign Tags</PageTitle>
            <div className="flex-container1 ">
              <ReactPickyFilter
                allOptions={advFilterAllData}
                selectedData={advFilterSelectedData}
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
              <div className="ml10">
                <SearchBox handleSearchTextChange={handleSearchTextChange} searchValue={searchValue}></SearchBox>
              </div>
            </div>
          </div>
        </PageHeader>
        <ManageCampaignTagTable
          manageSegmentTagTitles={manageSegmentTagTitles}
          isLoading={uiStore.isLoading}
          campaignTagsList={filteredCampaignTags}
          handleAddAttributeIdAction={handleAddAttributeIdAction}
          handleConfirmationAction={handleConfirmationAction}
          handleDeclineAction={handleDeclineAction}
          authStore={authStore}
        />
        {activeModal === 'add_attribute_id_modal' ? (
          <AddAttributeAction
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getAllCampaignTags}
          />
        ) : null}
        {activeModal === 'confirmation_modal' ? (
          <ConfirmTag
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getAllCampaignTags}
          />
        ) : null}
        {activeModal === 'decline_modal' ? (
          <DeclineTag
            closeModal={() => setActiveModal('')}
            modalData={modalData}
            handleOnSuccessResponse={onResponseChange}
            getAllCampaignTags={getAllCampaignTags}
          />
        ) : null}

        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

ManageCampaignTags.propTypes = {
  navigationService: PropTypes.object,
  operatorStore: PropTypes.object,
  uiStore: PropTypes.object,
  authStore: PropTypes.object,
};
export default withStore(ManageCampaignTags);
