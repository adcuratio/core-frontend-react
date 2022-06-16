import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

import UploadNewDeal from '../../components/advertiser-schedule/containers/UploadNewDealModal';
import withStore from '../../hocs/WithStore';

import ReactLoader from '../../components/ReactLoader';
import TabContainer from '../../components/TabContainer';
import AdvSchHeader from '../../components/advertiser-schedule/AdvSchHeader';
import AdvSchTable from '../../components/advertiser-schedule/AdvSchTable';
import DealErrors from '../../components/advertiser-schedule/DealErrorsModal';
import ViewDealDetailsModal from '../advertiser-schedule/components/ViewDealDetailsModal';

import { ViewDealDetailsTableHeadings } from './JsonData';

import { showAckErrorMessage, applySorting } from './../../common/utils';

const AdvertiserSchedule = inject(
  'advSchStore',
  'uiStore'
)(
  observer((props) => {
    const { auth, navigationService, advSchStore, uiStore } = props;
    const [dealsData, setDealsData] = useState({
      processedDeals: [],
      incorrectDeals: [],
      pendingProcessingDeals: [],
    });
    const [dealsDataLength, setDealsDataLength] = useState({
      processedDeals: 0,
      incorrectDeals: 0,
      pendingProcessingDeals: 0,
    });
    const AdvSchTabTitles = [
      {
        id: 'processed',
        name: 'Processed',
        count: dealsDataLength?.processedDeals,
      },
      {
        id: 'incorrect',
        name: 'Incorrect',
        count: dealsDataLength?.incorrectDeals,
      },
      {
        id: 'pending_processing',
        name: 'Pending Processing',
        count: dealsDataLength?.pendingProcessingDeals,
      },
    ];
    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState(null);
    const [isAgencyAdminUser] = useState(auth.isAgencyAdminUser());
    const [activeTab, setActiveTab] = useState(AdvSchTabTitles[0]);
    const [EdiTable, setEdiTable] = useState([]);
    const [EdiTableConstant, setEdiTableConstant] = useState([]);
    const [EdiTableData, setEdiTableData] = useState([]);
    const [sortedEdiTableData, setSortedEdiTableData] = useState([]);
    const [ediTableTitles, setEdiTableTitles] = useState([
      {
        id: 'adv_sch_deal_id',
        name: 'Deal ID',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_ad_name',
        name: 'Advertiser name',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_brand',
        name: 'Brand',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_sub_brand',
        name: 'Sub-Brand',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_network',
        name: 'Network',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_last_modified',
        name: 'Last modified',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'adv_sch_status',
        name: 'Status',
        isApplySorting: false,
      },
      {
        id: 'adv_sch_view_or_download',
        name: 'View/Download',
        isApplySorting: false,
      },
    ]);
    const [ediInfoData, setediInfoData] = useState([]);
    const [ediInfoMetadata, setediInfoMetadata] = useState({});
    const [advFilterAllData, setAdvFilterAllData] = useState([]);
    const [advFilterSelectedData, setAdvFilterSelectedData] = useState([]);
    const [brandFilterAllData, setBrandFilterAllData] = useState([]);
    const [brandFilterSelectedData, setBrandFilterSelectedData] = useState([]);

    useEffect(() => {
      getListingData();
    }, []);

    useEffect(() => {
      onEdiTableChange();
    }, [EdiTable]);

    const onEdiTableChange = () => {
      let dealsDataCpy;
      if (EdiTable && EdiTable.length) {
        dealsDataCpy = processDealsData(EdiTable);
      } else {
        dealsDataCpy = {
          pendingProcessingDeals: [],
          incorrectDeals: [],
          processedDeals: [],
        };
      }
      setDealsData(dealsDataCpy);
      switchToTab(dealsDataCpy);
      setDealsDataLength({
        processedDeals: dealsDataCpy.processedDeals.length,
        incorrectDeals: dealsDataCpy.incorrectDeals.length,
        pendingProcessingDeals: dealsDataCpy.pendingProcessingDeals.length,
      });
    };

    const processDealsData = (EdiTableCpy = EdiTable) => {
      const incorrectDeals = [];
      const pendingProcessingDeals = [];
      const processedDeals = [];
      EdiTableCpy.map((dealObj) => {
        if (dealObj.deal_data) {
          dealObj.advertiser = dealObj?.deal_data.advertiser_display_name;
          if (dealObj.deal_data.brand && dealObj.deal_data.brand.length)
            dealObj.brand = dealObj.deal_data.brand
              .filter((a) => a.brand__display_name)
              .map((a) => a?.brand__display_name);
          if (dealObj.deal_data.sub_brand && dealObj.deal_data.sub_brand.length)
            dealObj.sub_brand = dealObj.deal_data.sub_brand
              .filter((a) => a.sub_brand__display_name)
              .map((a) => a?.sub_brand__display_name);
          dealObj.network = dealObj?.deal_data?.networks[0];
        }
        if (dealObj.is_parsed === false) {
          pendingProcessingDeals.push(dealObj);
        } else if (dealObj.is_correct === false) {
          incorrectDeals.push(dealObj);
        } else if (dealObj.is_parsed === true && dealObj.is_correct === true) {
          processedDeals.push(dealObj);
        }
        return dealObj;
      });
      return {
        pendingProcessingDeals,
        incorrectDeals,
        processedDeals,
      };
    };

    const getListingData = () => {
      advSchStore.getEDI().then(
        (res) => {
          if (res && res.status === 200) {
            const EdiTableCpy = res.data.results;
            setEdiTableConstant(EdiTableCpy);

            // filtering
            setEdiTable(EdiTableCpy);
            const advData = [];
            EdiTableCpy.forEach((a) => {
              if (a.deal_data && a.deal_data.advertiser) {
                advData.push(a.deal_data.advertiser);
              } else {
                advData.push('with no advertiser');
              }
            });
            const advFilterdDataCpy = [...new Set(advData)];
            setAdvFilterAllData(advFilterdDataCpy);
            setAdvFilterSelectedData(advFilterdDataCpy);
            onSetBrandData(EdiTableCpy);
          } else {
            showAckErrorMessage({ message: 'Unable to Fetch Data!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const switchToTab = (dealsDataCpy = dealsData, tabData = activeTab) => {
      if (tabData && dealsDataCpy) {
        let EdiTableDataCpy;
        if (tabData.id === 'processed') {
          EdiTableDataCpy = dealsDataCpy.processedDeals;
        } else if (tabData.id === 'incorrect') {
          EdiTableDataCpy = dealsDataCpy.incorrectDeals;
        } else if (tabData.id === 'pending_processing') {
          EdiTableDataCpy = dealsDataCpy.pendingProcessingDeals;
        }
        setEdiTableData(EdiTableDataCpy);
        if (EdiTableDataCpy && EdiTableDataCpy.length) {
          sortMsgGroup(ediTableTitles[5], true, EdiTableDataCpy);
        } else {
          setSortedEdiTableData(EdiTableDataCpy);
        }
      }
    };

    const onFilterAdvData = (filteredData) => {
      const modifiedData = EdiTableConstant.filter((a) => {
        if (a.deal_data && a.deal_data.advertiser && filteredData.includes(a.deal_data.advertiser)) {
          return true;
        } else if (!(a.deal_data && a.deal_data.advertiser) && filteredData.includes('with no advertiser')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onSetBrandData = (modifiedData) => {
      const brandData = [];
      modifiedData.forEach((data) => {
        if (data.deal_data && data.deal_data.brand && data.deal_data.brand.length) {
          data.deal_data.brand.forEach((bdata) => {
            if (bdata && bdata.brand__name) {
              brandData.push(bdata.brand__name);
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
          if (data.deal_data && data.deal_data.brand && data.deal_data.brand.length) {
            let count = 0;
            data.deal_data.brand.forEach((bd) => {
              if (filteredData.includes(bd.brand__name)) {
                count = count + 1;
              }
            });
            if (count === data.deal_data.brand.length) {
              modifiedData.push(data);
            }
          } else if (filteredData.includes('with no brand')) {
            modifiedData.push(data);
          }
        });
        setEdiTable(modifiedData);
      }
    };

    const sortMsgGroup = (activeTitleData, value, sortedEdiTableDataCpy = sortedEdiTableData) => {
      const ediTableTitlesCpy = JSON.parse(JSON.stringify(ediTableTitles));
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
      setActiveTab(tab);
      switchToTab(dealsData, tab);
    };

    const OnOpenCalenderView = () => {
      navigationService.goToAggEDICalendar();
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const handleTableButtonAction = (buttonType, mData) => {
      if (buttonType === 'download') {
        if (mData.s3_file_url) {
          axios
            .get(mData.s3_file_url, {
              responseType: 'arraybuffer',
            })
            .then(
              (res) => {
                const blob = new Blob([res.data], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = `${mData.edi_filename}.xlsx`;
                downloadLink.click();
              },
              () => {
                showAckErrorMessage({ message: 'Error in downloading the file.' });
              }
            );
        } else showAckErrorMessage({ message: 'No file found on server.' });
      } else if (buttonType === 'view') {
        viewEdi(mData);
      } else {
        onSetActiveModal(buttonType);
        setModalData(mData);
      }
    };

    const processEdiInfo = (data, setTotalPage) => {
      setediInfoData(data.results);
      const ediInfoMetadataCpy = JSON.parse(JSON.stringify(ediInfoMetadata));
      ediInfoMetadataCpy.nextUrl = data.next;
      ediInfoMetadataCpy.prevUrl = data.previous;
      ediInfoMetadataCpy.currentPage = data.next
        ? Math.ceil(new URL(data.next).searchParams.get('page') - 1)
        : Math.ceil(data.count / 50);
      if (setTotalPage) {
        ediInfoMetadataCpy.totalPages = Math.ceil(data.count / data.results.length);
      }
      setediInfoMetadata(ediInfoMetadataCpy);
    };

    const viewEdi = (edi) => {
      advSchStore.getEDIInfo(edi.id).then(
        (res) => {
          if (res && res.status === 200) {
            processEdiInfo(res.data, true);
            onSetActiveModal('view');
          }
        },
        () => {}
      );
    };

    const ediInfoChangePage = (newUrl) => {
      if (!newUrl) {
        return;
      }
      advSchStore.getEDIPage(newUrl).then(
        (res) => {
          if (res && res.status === 200) {
            processEdiInfo(res.data);
          }
        },
        () => {}
      );
    };

    const onPageRefresh = () => {
      getListingData();
    };

    return (
      <div>
        <div className="main-content-wrapper">
          <AdvSchHeader
            OnOpenCalenderView={OnOpenCalenderView}
            EdiTableData={EdiTableData}
            advFilterAllData={advFilterAllData}
            advFilterSelectedData={advFilterSelectedData}
            brandFilterAllData={brandFilterAllData}
            brandFilterSelectedData={brandFilterSelectedData}
            applyFilter={applyFilter}
            onUploadNewDeal={() => onSetActiveModal('upload_new_deal')}
            onPageRefresh={onPageRefresh}
          />

          <TabContainer
            onTabChange={onTabChange}
            activeTab={activeTab}
            dealsData={dealsData}
            tabList={AdvSchTabTitles}
            showCount={true}
          />

          <AdvSchTable
            EdiTableData={sortedEdiTableData}
            isAgencyAdminUser={isAgencyAdminUser}
            activeTab={activeTab}
            handleTableButtonAction={handleTableButtonAction}
            ediTableTitles={ediTableTitles}
            sortMsgGroup={sortMsgGroup}
          />

          <UploadNewDeal
            showModal={activeModal === 'upload_new_deal'}
            closeModal={() => onSetActiveModal('')}
            getListingData={getListingData}
            isUnivisionDash={true}
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
          />
          <ReactLoader isLoading={uiStore.isLoading} />
        </div>
      </div>
    );
  })
);

AdvertiserSchedule.propTypes = {
  auth: PropTypes.any,
  navigationService: PropTypes.object,
};

export default withStore(AdvertiserSchedule);
