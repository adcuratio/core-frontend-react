import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

import AdvSchHeader from '../../../components/advertiser-schedule/AdvSchHeader';
import AdvSchTable from '../../../components/advertiser-schedule/AdvSchTable';
import DealErrors from '../../../components/advertiser-schedule/DealErrorsModal';
import ConfirmStatusModal from '../../../components/advertiser-schedule/ConfirmStatusModal';
import ViewDealDetailsModal from '../../../components/advertiser-schedule/ViewDealDetailsModal';
import ReactLoader from '../../../components/ReactLoader';
import TabContainer from '../../../components/TabContainer';
import SearchBox from '../../../components/SearchBox';

import withStore from '../../../hocs/WithStore';

import UploadNewDeal from '../../../components/advertiser-schedule/containers/UploadNewDealModal';

import { ViewDealDetailsTableHeadings } from '../JsonData';

import {
  showAckErrorMessage,
  showAckMessage,
  applySorting,
  processUTCtoEST,
  applySearch,
  formatText,
} from '../../../common/utils';

const AdvertiserSchedule = inject(
  'authStore',
  'advSchStore',
  'uiStore'
)(
  observer((props) => {
    const { authStore, navigationService, advSchStore, uiStore, $state, $stateParams } = props;
    const [dealsData, setDealsData] = useState({
      pendingAgencyDeals: [],
      pendingAdvertiserDeals: [],
      approvedDeals: [],
      declinedDeals: [],
      incorrectDeals: [],
      pendingProcessingDeals: [],
    });
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState(null);
    const [isAgencyAdminUser] = useState(authStore.isAgencyAdminUser());
    const AdvSchTabTitles = [
      {
        id: 'pending_agency_approval',
        name: 'Pending Agency Approval',
        count: dealsData.pendingAgencyDeals.length,
      },
      {
        id: 'pending_advertiser_approval',
        name: 'Pending Advertiser Approval',
        count: dealsData.pendingAdvertiserDeals.length,
      },
      {
        id: 'approved',
        name: 'Approved',
        count: dealsData.approvedDeals.length,
      },
      {
        id: 'declined',
        name: 'Declined',
        count: dealsData.declinedDeals.length,
      },
      {
        id: 'incorrect',
        name: 'Incorrect',
        count: dealsData.incorrectDeals.length,
      },
      {
        id: 'pending_processing',
        name: 'Pending Processing',
        count: dealsData.pendingProcessingDeals.length,
      },
    ];
    const [activeTab, setActiveTab] = useState(AdvSchTabTitles[0]);
    const [EdiTable, setEdiTable] = useState([]);
    const [EdiTableConstant, setEdiTableConstant] = useState([]);
    const [EdiTableData, setEdiTableData] = useState([]);
    const [sortedEdiTableData, setSortedEdiTableData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [ediTableTitles, setEdiTableTitles] = useState([
      {
        id: 'adv_sch_deal_id',
        name: 'Deal ID',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'edi_filename',
        applyFilter: true,
      },
      {
        id: 'adv_sch_ad_name',
        name: 'Advertiser name',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'advertiser_display_name',
        applyFilter: true,
      },
      {
        id: 'adv_sch_brand',
        name: 'Brand',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'brand',
        applyFilter: true,
      },
      {
        id: 'adv_sch_sub_brand',
        name: 'Sub-Brand',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'sub_brand',
        applyFilter: true,
      },
      {
        id: 'adv_sch_network',
        name: 'Network',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'network',
        applyFilter: true,
      },
      {
        id: 'adv_sch_last_modified',
        name: 'Last modified',
        sortingType: null,
        isApplySorting: true,
        dataProp: 'date_modified',
        applyFilter: true,
      },
      {
        id: 'adv_sch_status',
        name: 'Status',
        isApplySorting: false,
        dataProp: 'modified_by',
        applyFilter: true,
      },
      {
        id: 'adv_sch_view_or_download',
        name: 'Action',
        isApplySorting: false,
        applyFilter: false,
      },
    ]);
    const [ediInfoData, setediInfoData] = useState([]);
    const [ediInfoMetadata, setediInfoMetadata] = useState({});
    const [advFilterAllData, setAdvFilterAllData] = useState([]);
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]);
    const [brandFilterAllData, setBrandFilterAllData] = useState([]);
    const [brandFilterSelectedData, setBrandFilterSelectedData] = useState([]);
    const [selectedEdiData, setSelectedEdiData] = useState({});
    const [activeSortTableTitles, setActiveSortTableTitles] = useState([ediTableTitles[0], true]);

    useEffect(() => {
      const { tab } = $stateParams;
      if (tab) {
        // setting default active tab. It may be either incorrect tab/first tab
        const tabIndex = [...AdvSchTabTitles].find((advTab) => advTab.id === tab);
        if (tabIndex !== -1) setActiveTab(tabIndex);
      }
      getListingData();
    }, []);

    useEffect(() => {
      if (EdiTable && EdiTable.length) {
        const pendingAgencyDeals = [];
        const pendingAdvertiserDeals = [];
        const approvedDeals = [];
        const declinedDeals = [];
        const incorrectDeals = [];
        const pendingProcessingDeals = [];
        EdiTable.forEach((dealObj) => {
          if (dealObj.deal_data) {
            // Parsing data
            dealObj.advertiser = dealObj.deal_data.advertiser_display_name;
            if (dealObj.deal_data.brand && dealObj.deal_data.brand.length) {
              dealObj.brand = dealObj.deal_data.brand.map((a) => a.brand__display_name);
            }
            if (dealObj.deal_data.sub_brand && dealObj.deal_data.sub_brand.length) {
              dealObj.sub_brand = dealObj.deal_data.sub_brand.map((a) => a.sub_brand__display_name);
            }
            dealObj.network = dealObj.deal_data?.networks[0];
            if (dealObj.deal_data.status === 0) {
              dealObj.modified_by = `${dealObj.state_list?.approved[0]?.first_name} ${dealObj.state_list?.approved[0]?.last_name}`;
            }
            if (dealObj.deal_data.status === 1) {
              dealObj.modified_by = `${dealObj.state_list?.declined[0]?.first_name} ${dealObj.state_list?.declined[0]?.last_name}`;
            }
          }
          if (dealObj.is_parsed === false) {
            pendingProcessingDeals.push(dealObj);
          } else if (dealObj.is_correct === false) {
            incorrectDeals.push(dealObj);
          } else if (dealObj.is_parsed === true && dealObj.is_correct === true) {
            switch (dealObj.deal_data.status) {
              case 0:
                approvedDeals.push(dealObj);
                break;
              case 1:
                declinedDeals.push(dealObj);
                break;
              case 2:
                pendingAgencyDeals.push(dealObj);
                break;
              case 3:
                pendingAdvertiserDeals.push(dealObj);
                break;
              default:
                break;
            }
          }
        });
        const dealsDataCpy = {
          pendingAgencyDeals,
          pendingAdvertiserDeals,
          approvedDeals,
          declinedDeals,
          incorrectDeals,
          pendingProcessingDeals,
        };
        setDealsData(dealsDataCpy);
        switchToTab(dealsDataCpy);
      } else {
        const dealsDataCpy = {
          pendingAgencyDeals: [],
          pendingAdvertiserDeals: [],
          approvedDeals: [],
          declinedDeals: [],
          incorrectDeals: [],
          pendingProcessingDeals: [],
        };
        setDealsData(dealsDataCpy);
        switchToTab(dealsDataCpy);
      }
    }, [EdiTable]);

    const getListingData = () => {
      advSchStore.getEDI().then(
        (res) => {
          if (res && res.status === 200) {
            const EdiTableCpy = res.data.results.map((a) => ({
              ...a,
              date_modified: a.modified ? `${processUTCtoEST(a.modified)} ET` : '---',
            }));
            setEdiTableConstant(EdiTableCpy);

            // filtering
            setEdiTable(EdiTableCpy);
            const advData = [];
            EdiTableCpy.forEach((a) => {
              if (a.deal_data && a.deal_data.advertiser_display_name) {
                advData.push(a.deal_data.advertiser_display_name);
              } else {
                advData.push('with no advertiser');
              }
            });
            const advFilterdDataCpy = [...new Set(advData)];
            setAdvFilterAllData(advFilterdDataCpy);
            setAdvFilterSelectedData(advFilterdDataCpy);
            onSetBrandData(EdiTableCpy);
          } else {
            showAckErrorMessage({ message: res?.data?.message ?? 'Something went wrong while fetching Deals!' });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Something went wrong while fetching Deals!!' });
        }
      );
    };

    const switchToTab = (dealsDataCpy = dealsData, tabData = activeTab) => {
      if (tabData && dealsDataCpy) {
        let EdiTableDataCpy;
        if (tabData.id === 'pending_agency_approval') {
          EdiTableDataCpy = dealsDataCpy.pendingAgencyDeals;
        } else if (tabData.id === 'pending_advertiser_approval') {
          EdiTableDataCpy = dealsDataCpy.pendingAdvertiserDeals;
        } else if (tabData.id === 'approved') {
          EdiTableDataCpy = dealsDataCpy.approvedDeals;
        } else if (tabData.id === 'declined') {
          EdiTableDataCpy = dealsDataCpy.declinedDeals;
        } else if (tabData.id === 'incorrect') {
          EdiTableDataCpy = dealsDataCpy.incorrectDeals;
        } else if (tabData.id === 'pending_processing') {
          EdiTableDataCpy = dealsDataCpy.pendingProcessingDeals;
        }
        setEdiTableData(EdiTableDataCpy);
        if (EdiTableDataCpy && EdiTableDataCpy.length) {
          sortingDeals(activeSortTableTitles[0], activeSortTableTitles[1], EdiTableDataCpy);
        } else {
          setSortedEdiTableData(EdiTableDataCpy);
        }
      }
    };

    const onFilterAdvData = (filteredData) => {
      // Filtering advertiser data
      const modifiedData = EdiTableConstant.filter((a) => {
        if (
          a.deal_data &&
          a.deal_data.advertiser_display_name &&
          filteredData.includes(a.deal_data.advertiser_display_name)
        ) {
          return true;
        } else if (
          !(a.deal_data && a.deal_data.advertiser_display_name) &&
          filteredData.includes('with no advertiser')
        ) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onSetBrandData = (modifiedData) => {
      // filtering brand data while doing advertiser filter
      const brandData = [];
      modifiedData.forEach((data) => {
        if (data.deal_data && data.deal_data.brand && data.deal_data.brand.length) {
          data.deal_data.brand.forEach((bdata) => {
            if (bdata && bdata.brand__display_name) {
              brandData.push(bdata.brand__display_name);
            }
          });
        } else {
          brandData.push('with no brand');
        }
      });
      setBrandFilterAllData([...new Set(brandData)]);
      setBrandFilterSelectedData([...new Set(brandData)]);
    };

    const applyFilter = (filteredData, id) => {
      if (searchValue) {
        setSearchValue('');
      }
      if (id === 'adv_filter') {
        setAdvFilterSelectedData(filteredData);
        const modifiedData = onFilterAdvData(filteredData);
        setEdiTable(modifiedData);
        onSetBrandData(modifiedData);
      } else if (id === 'brand_filter') {
        setBrandFilterSelectedData(filteredData);
        const filteredAdvData = onFilterAdvData(advFilterAllData);
        const modifiedData = [];
        filteredAdvData.forEach((data) => {
          if (data?.deal_data?.brand?.length) {
            let count = 0;
            data.deal_data.brand.forEach((bd) => {
              if (filteredData.includes(bd.brand__display_name)) {
                count = count + 1;
              }
            });
            if (count !== 0) {
              modifiedData.push(data);
            }
          } else if (filteredData.includes('with no brand')) {
            modifiedData.push(data);
          }
        });
        sortingDeals(activeSortTableTitles[0], activeSortTableTitles[1], modifiedData);
        setEdiTable(modifiedData);
      }
    };

    const sortingDeals = (activeTitleData, value, sortedEdiTableDataCpy = sortedEdiTableData) => {
      if (!activeTitleData.isApplySorting) {
        return;
      }
      setActiveSortTableTitles([activeTitleData, value]);
      const ediTableTitlesCpy = JSON.parse(JSON.stringify(ediTableTitles));
      // Finding active sorting column
      const index = ediTableTitlesCpy.findIndex((d) => d.id === activeTitleData.id);
      if (index !== -1) {
        ediTableTitlesCpy[index].sortingType = value;
        ediTableTitlesCpy.forEach((d, dIndex) => {
          if (index !== dIndex) {
            d.sortingType = null;
          }
        });
        setEdiTableTitles(ediTableTitlesCpy);
        const sortedData = applySorting(
          ediTableTitlesCpy[index].sortingType,
          activeTitleData.id,
          sortedEdiTableDataCpy
        );
        setSortedEdiTableData(sortedData);
      }
    };

    const onTabChange = (tab) => {
      if (searchValue) {
        setSearchValue('');
      }
      setActiveTab(tab);
      switchToTab(dealsData, tab);
    };

    const OnOpenCalenderView = () => {
      navigationService.goToAggEDICalendar();
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const onEdiFileDownload = (mdata) => {
      // Showing loader for newly downloading file and not showing loader for already downloaded file.
      // If we try to redownload already downloaded file, it will take micro seconds to redownload
      uiStore.isLoading = mdata?.isDownloaded ? false : true;
      if (!mdata.isDownloaded) {
        const updatedData = EdiTable.map((a) => ({ ...a, isDownloaded: a.id === mdata.id ? true : a?.isDownloaded }));
        setEdiTable(updatedData);
      }
    };

    const handleTableButtonAction = (buttonType, mData) => {
      if (buttonType === 'download') {
        if (mData.s3_file_url) {
          onEdiFileDownload(mData);
          axios.get(mData.s3_file_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/xml;charset=utf-8;' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `${mData.edi_filename}.xml`;
              downloadLink.click();
              uiStore.isLoading = false;
            },
            () => {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: 'Error in downloading the file.' });
            }
          );
        } else showAckErrorMessage({ message: 'No file found on server.' });
      } else if (buttonType === 'view') {
        viewEdi(mData);
      } else if (buttonType === 'resolve') {
        $state.go('dash.advResolve', { dealId: mData.edi_filename, errorId: mData.id });
      } else {
        onSetActiveModal(buttonType);
        setModalData(mData);
      }
    };

    const processEdiInfo = (data, setTotalPage) => {
      setediInfoData(data.results);
      // Setting pagination data
      const ediInfoMetadataCpy = JSON.parse(JSON.stringify(ediInfoMetadata));
      ediInfoMetadataCpy.nextUrl = data.next;
      ediInfoMetadataCpy.prevUrl = data.previous;
      if (setTotalPage) {
        ediInfoMetadataCpy.totalPages = Math.ceil(data.count / data.results.length);
      }
      ediInfoMetadataCpy.currentPage = data.next
        ? Math.ceil(new URL(data.next).searchParams.get('page') - 1)
        : ediInfoMetadataCpy.totalPages;
      setediInfoMetadata(ediInfoMetadataCpy);
    };

    const viewEdi = (edi) => {
      advSchStore.getEDIInfo(edi.id).then(
        (res) => {
          if (res && res.status === 200) {
            setSelectedEdiData(edi);
            processEdiInfo(res.data, true);
            onSetActiveModal('view');
          } else {
            showAckErrorMessage({ message: res?.data?.message ?? 'Something went wrong with the deal details!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const ediInfoChangePage = (newUrl) => {
      if (!newUrl) {
        return;
      }
      // on pagination change
      advSchStore.getEDIPage(newUrl).then(
        (res) => {
          if (res && res.status === 200) {
            processEdiInfo(res.data);
          }
        },
        () => {}
      );
    };
    const handleInputChange = (e) => {
      setNameValue(e.target.value);
    };
    const confirmEDIStatus = (e) => {
      e.preventDefault();
      const payload = { deal_id: modalData.deal_data.deal_id };
      if (activeModal === 'approve') {
        setActiveModal('');
        payload.status = isAgencyAdminUser ? 3 : 0;
      } else if (activeModal === 'decline') {
        if (!formatText(nameValue)) {
          showAckErrorMessage({
            message: 'Decline message should not be empty',
          });
          return;
        }
        payload.status = 1;
        payload.comment = formatText(nameValue);
      }
      advSchStore.changeEDIApproval(payload).then(
        (res) => {
          if (res && res.status === 200) {
            const EdiTableCpy = JSON.parse(JSON.stringify(EdiTable));
            const index = EdiTableCpy.findIndex((edi) => edi.id === modalData.id);
            if (index !== -1) {
              EdiTableCpy[index].deal_data.status = payload.status;
              if (activeModal === 'approve') {
                EdiTableCpy[index].state_list.approved[0] = res.data;
              } else {
                EdiTableCpy[index].state_list.declined[0] = res.data;
              }
            }
            setEdiTable(EdiTableCpy);
            showAckMessage({
              message: activeModal === 'approve' ? 'Approved successfully.' : 'Declined successfully.',
            });
            setActiveModal('');
          }
        },
        () => {}
      );
    };

    const handleSearchTextChange = (value) => {
      setSearchValue(value);
      let list;
      if (activeTab.id === 'pending_agency_approval') {
        const pendingAgencyApprovalCpy = JSON.parse(JSON.stringify(dealsData?.pendingAgencyDeals));
        list = applySearch(value, pendingAgencyApprovalCpy, ediTableTitles);
      } else if (activeTab.id === 'pending_advertiser_approval') {
        const pendingAdvApprovalCpy = JSON.parse(JSON.stringify(dealsData?.pendingAdvertiserDeals));
        list = applySearch(value, pendingAdvApprovalCpy, ediTableTitles);
      } else if (activeTab.id === 'approved') {
        const approvedDealsCpy = JSON.parse(JSON.stringify(dealsData?.approvedDeals));
        list = applySearch(value, approvedDealsCpy, ediTableTitles);
      } else if (activeTab.id === 'declined') {
        const declinedDealsCpy = JSON.parse(JSON.stringify(dealsData?.declinedDeals));
        list = applySearch(value, declinedDealsCpy, ediTableTitles);
      } else if (activeTab.id === 'incorrect') {
        const incorrectDealsCpy = JSON.parse(JSON.stringify(dealsData?.incorrectDeals));
        list = applySearch(value, incorrectDealsCpy, ediTableTitles);
      } else if (activeTab.id === 'pending_processing') {
        const pendingProcessingDealsCpy = JSON.parse(JSON.stringify(dealsData?.pendingProcessingDeals));
        list = applySearch(value, pendingProcessingDealsCpy, ediTableTitles);
      }
      sortingDeals(activeSortTableTitles[0], activeSortTableTitles[1], list);
    };

    const onPageRefresh = () => {
      if (searchValue) {
        setSearchValue('');
      }
      getListingData();
    };

    return (
      <div>
        <div className="main-content-wrapper">
          <AdvSchHeader
            onUploadNewDeal={() => onSetActiveModal('upload_new_deal')}
            OnOpenCalenderView={OnOpenCalenderView}
            EdiTableData={EdiTableData}
            advFilterAllData={advFilterAllData}
            advFilterSelectedData={advFilterSelectedData}
            brandFilterAllData={brandFilterAllData}
            brandFilterSelectedData={brandFilterSelectedData}
            applyFilter={applyFilter}
            onPageRefresh={onPageRefresh}
            isReadonly={authStore.userObj?.read_only}
          />
          <div className="flex-container6">
            <TabContainer
              onTabChange={onTabChange}
              activeTab={activeTab}
              dealsData={dealsData}
              tabList={AdvSchTabTitles}
              showCount={true}
            />
            <div className="ml-auto-imp mt5">
              <SearchBox handleSearchTextChange={handleSearchTextChange} searchValue={searchValue} />
            </div>
          </div>

          <AdvSchTable
            EdiTableData={sortedEdiTableData}
            isAgencyAdminUser={isAgencyAdminUser}
            activeTab={activeTab}
            handleTableButtonAction={handleTableButtonAction}
            ediTableTitles={ediTableTitles}
            sortingDeals={sortingDeals}
            isLoading={uiStore.isLoading}
            isReadonly={authStore.userObj?.read_only}
          />
          <UploadNewDeal
            showModal={activeModal === 'upload_new_deal'}
            closeModal={() => onSetActiveModal('')}
            getListingData={getListingData}
          />

          <DealErrors
            showModal={activeModal === 'deal_errors'}
            closeModal={() => onSetActiveModal('')}
            errorModalData={modalData}
          />
          <ViewDealDetailsModal
            showModal={activeModal === 'view'}
            closeModal={() => onSetActiveModal('')}
            ediInfoData={ediInfoData}
            ediInfoMetadata={ediInfoMetadata}
            ediInfoChangePage={ediInfoChangePage}
            viewDealDetailsTableHeadings={ViewDealDetailsTableHeadings}
            selectedEdiData={selectedEdiData}
          />
          <ConfirmStatusModal
            showModal={activeModal === 'approve' || activeModal === 'decline'}
            closeModal={() => onSetActiveModal('')}
            modalData={{
              actionType: activeModal,
              handleInputAction: handleInputChange,
            }}
            confirmEDIStatus={confirmEDIStatus}
          />
          <ReactLoader isLoading={uiStore.isLoading} />
        </div>
      </div>
    );
  })
);

AdvertiserSchedule.propTypes = {
  navigationService: PropTypes.object,
};

export default withStore(AdvertiserSchedule);
