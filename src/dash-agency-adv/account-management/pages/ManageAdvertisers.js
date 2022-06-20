import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

import withStore from '../../../hocs/WithStore';

import Header from '../components/Header';

import BrandsSubbrandsData from '../containers/BrandsSubbrandsData';

import { AddSubagency, AddAdvertiser, EditSubagency } from '../constants/ModalConstants';

import SubAgencyModal from '../containers/SubAgencyModal';
import AddAdvertiserModal from '../containers/AddAdvertiserModal';

import { MainContent } from '../../../components/PageLayout';
import CustomButton from '../../../components/CustomButton';
import ReactLoader from '../../../components/ReactLoader';
import TabContainer from '../../../components/TabContainer';

import { applySearch, showAckErrorMessage, applySorting } from '../../../common/utils';

import { AdvertiserTabData } from '../JsonData';

import '../index.css';

const ManageAdvertisers = inject(
  'accountManagementStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { accountManagementStore, uiStore, authStore } = props;
    const [activeTab, setActiveTab] = useState(AdvertiserTabData[0]);
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [subAgencyData, setSubAgencyData] = useState([]);
    const [subAgencyFilteredData, setSubAgencyFilteredData] = useState([]);
    const [agencyAdminCompanies, setAgencyAdminCompanies] = useState([]);
    const [agencyAdminFilteredCompanies, setAgencyAdminFilteredCompanies] = useState([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [SubAgencyCols, setSubAgencyCols] = useState([
      {
        id: 'acc_man_subagency_name',
        name: 'Name',
        dataProp: 'name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'action',
        name: 'Action',
        applyFilter: false,
        isApplySorting: false,
      },
    ]);
    const [AdvertiserCols, setAdvertiserCols] = useState([
      {
        id: 'acc_man_adv_name',
        name: 'Name',
        dataProp: 'name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_adv_industry',
        name: 'Industry',
        dataProp: 'segment',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_adv_sub_industry',
        name: 'Sub-Industry',
        dataProp: 'subSegment',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_adv_brands',
        name: 'Brands',
        dataProp: 'brands',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
    ]);

    useEffect(() => {
      if (searchValue) {
        setSearchValue('');
      }
      if (activeTab.id === 'subagencies') {
        accountManagementStore.getAllSubAgencies().then(
          (response) => {
            if (response.success) {
              const list = accountManagementStore.getSubagenciesList(response.data);
              setSubAgencyData(list);
              sortUserData(SubAgencyCols[0], true, list);
            } else {
              showAckErrorMessage({ message: response?.data?.message ?? 'Unable to fetch Sub-Agencies!' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
      } else if (activeTab.id === 'advertisers') {
        if (!pageLoading) {
          setPageLoading(true);
        }
        accountManagementStore.getAllSubAgencies().then(
          (response) => {
            if (!response.success) {
              showAckErrorMessage({ message: response?.data?.message ?? 'Unable fetch Advertisers!' });
            }
          },
          () => {
            showAckErrorMessage();
          }
        );
        getAllSegmentsAPI();
      }
    }, [activeTab]);

    const sortUserData = (activeTitleData, value, sortedDataCpy) => {
      if (activeTitleData.isApplySorting) {
        if (!sortedDataCpy) {
          if (activeTab.id === 'subagencies') {
            sortedDataCpy = subAgencyFilteredData;
          } else if (activeTab.id === 'advertisers') {
            sortedDataCpy = agencyAdminFilteredCompanies;
          }
        }
        const headerListCpy = JSON.parse(JSON.stringify(getHeaderList()));
        const index = headerListCpy.findIndex((d) => d.id === activeTitleData.id);
        if (index !== -1) {
          headerListCpy[index].sortingType = value;
          headerListCpy.forEach((d, dIndex) => {
            if (index !== dIndex) {
              d.sortingType = null;
            }
          });
          const sortedData = applySorting(headerListCpy[index].sortingType, activeTitleData.id, sortedDataCpy);
          if (activeTab.id === 'subagencies') {
            setSubAgencyCols(headerListCpy);
            setSubAgencyFilteredData(sortedData);
          } else if (activeTab.id === 'advertisers') {
            setAdvertiserCols(headerListCpy);
            setAgencyAdminFilteredCompanies(sortedData);
          }
        }
      }
    };

    const getAllCompaniesAPI = () => {
      accountManagementStore.getAllCompanies().then(
        (response) => {
          if (response.success) {
            const agencyAdminCompaniesCpy = [];
            const companyList = accountManagementStore.companyList;
            if (companyList) {
              companyList.forEach((company) => {
                const companyCopy = JSON.parse(JSON.stringify(company));
                companyCopy.brands = company.brands.map((brand) => brand.name);
                companyCopy.campaigns = company.campaigns.map((campaign) => campaign.name);
                companyCopy.subSegment = '-';
                companyCopy.segment = '-';
                accountManagementStore.segmentsList.forEach((segment) => {
                  // finding active segment from the segment list
                  const activeSeg = segment.sub_segment.find((d) => d.id === companyCopy.sub_segment_sector);
                  if (activeSeg) {
                    companyCopy.subSegment = activeSeg.name;
                    companyCopy.segment = segment.name;
                  }
                });
                agencyAdminCompaniesCpy.push(companyCopy);
              });
              setAgencyAdminCompanies(agencyAdminCompaniesCpy);
              sortUserData(AdvertiserCols[0], true, agencyAdminCompaniesCpy);
              setPageLoading(false);
            }
          } else {
            showAckErrorMessage({ message: response?.message });
            setPageLoading(false);
          }
        },
        () => {
          showAckErrorMessage();
          setPageLoading(false);
        }
      );
    };

    const getAllSegmentsAPI = () => {
      accountManagementStore.getAllSegments().then(
        (response) => {
          if (response.success) {
            getAllCompaniesAPI();
          } else {
            showAckErrorMessage({ message: response?.message });
            setPageLoading(false);
          }
        },
        () => {
          showAckErrorMessage();
          setPageLoading(false);
        }
      );
    };

    const onTabChange = (selectedTab) => {
      setActiveTab(selectedTab);
    };

    const getHeaderList = () => {
      let headerValues = [];
      if (activeTab.id === 'subagencies') {
        headerValues = JSON.parse(JSON.stringify(SubAgencyCols));
      } else if (activeTab.id === 'advertisers') {
        headerValues = JSON.parse(JSON.stringify(AdvertiserCols));
      }
      return headerValues;
    };

    const getTableHeader = () => {
      const headerValues = getHeaderList();
      if (headerValues && headerValues.length) {
        const headerComp = [];
        headerValues.forEach((data) => {
          if (data.name === 'Action' && authStore.userObj?.read_only) return;
          headerComp.push(
            <th
              key={data.id}
              className={data.isApplySorting ? 'cursor-pointer' : ''}
              onClick={() => sortUserData(data, !data.sortingType)}
            >
              {data.name}
              {data.isApplySorting ? (
                <span className="ml5">
                  {data.sortingType === false && <BsFillCaretDownFill />}
                  {data.sortingType ? <BsFillCaretUpFill /> : null}
                </span>
              ) : null}
            </th>
          );
        });
        return <tr key="header">{headerComp}</tr>;
      }
      return null;
    };

    const onUpdateSubagency = (data, type) => {
      setModalData(data);
      setActiveModal(type);
    };

    const getTableContent = () => {
      const contentComp = [];
      if (activeTab.id === 'subagencies') {
        if (subAgencyFilteredData && subAgencyFilteredData.length) {
          subAgencyFilteredData.forEach((data) => {
            contentComp.push(
              <tr key={data.id}>
                <td className="bold">{data.name ? data.name : '-'}</td>
                {authStore.userObj?.read_only ? null : (
                  <td>
                    <CustomButton
                      buttonText="Edit"
                      buttonClassName="blue-button acc-management-edit-btn"
                      handleButtonClick={() => onUpdateSubagency(data, EditSubagency)}
                    />
                  </td>
                )}
              </tr>
            );
          });
        } else if (!pageLoading && !uiStore.isLoading) {
          contentComp.push(
            <tr key="no_data_found" className="bg-main-imp">
              <td
                colSpan={authStore.userObj?.read_only ? SubAgencyCols.length - 1 : SubAgencyCols.length}
                className="text-center-imp"
              >
                No data found
              </td>
            </tr>
          );
        }
      } else if (activeTab.id === 'advertisers') {
        if (agencyAdminFilteredCompanies && agencyAdminFilteredCompanies.length) {
          agencyAdminFilteredCompanies.forEach((data) => {
            contentComp.push(
              <tr key={data.id}>
                <td className="bold">{data.name ? data.name : '-'}</td>
                <td>{data.segment ? data.segment : '-'}</td>
                <td>{data.subSegment ? data.subSegment : '-'}</td>
                <td>{data.brands && data.brands.length ? data.brands.join(', ') : '-'}</td>
              </tr>
            );
          });
        } else if (!pageLoading && !uiStore.isLoading) {
          contentComp.push(
            <tr key="no_data_found" className="bg-main-imp">
              <td colSpan={AdvertiserCols.length} className="text-center-imp">
                No data found
              </td>
            </tr>
          );
        }
      }
      return contentComp;
    };

    const handleSearchTextChange = (value) => {
      setSearchValue(value);
      if (activeTab.id === 'subagencies') {
        const subAgencyDataCpy = JSON.parse(JSON.stringify(subAgencyData));
        const list = applySearch(value, subAgencyDataCpy, SubAgencyCols);
        const curIndex = SubAgencyCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(SubAgencyCols[curIndex], SubAgencyCols[curIndex].sortingType, list);
        }
      } else if (activeTab.id === 'advertisers') {
        const agencyAdminCompaniesCpy = JSON.parse(JSON.stringify(agencyAdminCompanies));
        const list = applySearch(value, agencyAdminCompaniesCpy, AdvertiserCols);
        const curIndex = AdvertiserCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(AdvertiserCols[curIndex], AdvertiserCols[curIndex].sortingType, list);
        }
      }
    };

    const handleSubAgencyDataChange = (value, id) => {
      const subAgencyDataCpy = JSON.parse(JSON.stringify(subAgencyData));
      if (activeModal === EditSubagency) {
        subAgencyDataCpy.forEach((d) => {
          if (d.id === modalData.id) {
            d.name = value;
          }
        });
        setModalData({});
      } else {
        subAgencyDataCpy.unshift({
          id,
          name: value,
        });
      }
      setSubAgencyData(subAgencyDataCpy);
      const list = applySearch(searchValue, subAgencyDataCpy, SubAgencyCols);
      const curIndex = SubAgencyCols.findIndex((d) => d.sortingType !== null);
      if (curIndex !== -1) {
        sortUserData(SubAgencyCols[curIndex], SubAgencyCols[curIndex].sortingType, list);
      }
    };

    const handleHeaderButtonClick = (id) => {
      setActiveModal(id);
    };

    const handleAdvertiserDataChange = (dataToSend) => {
      const dataToSendCpy = JSON.parse(JSON.stringify(dataToSend));
      const segmentsCpy = JSON.parse(JSON.stringify(toJS(accountManagementStore.segmentsList)));
      dataToSendCpy.segment = dataToSend.sub_agency_id;
      dataToSendCpy.brands = [];
      dataToSendCpy.segment = dataToSend.sub_agency_id;
      dataToSendCpy.subSegment = dataToSend.sub_segment_id;
      for (const id in segmentsCpy) {
        const subSegmentsList = segmentsCpy[id].sub_segment;
        for (const id_s in subSegmentsList) {
          if (subSegmentsList[id_s].id === dataToSend.sub_segment_id) {
            dataToSendCpy.subSegment = subSegmentsList[id_s].name;
            dataToSendCpy.segment = segmentsCpy[id].name;
          }
        }
      }
      const agencyAdminCompaniesCpy = JSON.parse(JSON.stringify(agencyAdminCompanies));
      agencyAdminCompaniesCpy.unshift(dataToSendCpy);
      setAgencyAdminCompanies(agencyAdminCompaniesCpy);
      const list = applySearch(searchValue, agencyAdminCompaniesCpy, AdvertiserCols);
      setAgencyAdminFilteredCompanies(list);
    };

    return (
      <>
        <MainContent>
          <div className="mt10">
            <TabContainer tabList={AdvertiserTabData} activeTab={activeTab} onTabChange={onTabChange} />
          </div>

          {activeTab.id === 'brands' ? (
            <BrandsSubbrandsData />
          ) : (
            <>
              <Header
                activeTab={activeTab}
                headingName={activeTab.headingName}
                handleSearchTextChange={handleSearchTextChange}
                searchValue={searchValue}
                handleButtonAction={handleHeaderButtonClick}
                isReadonly={authStore.userObj?.read_only}
              />
              <table className="table table-striped table-wrapper mt10 wrapped-table">
                <thead>{getTableHeader()}</thead>
                <tbody>{getTableContent()}</tbody>
              </table>
              {activeModal === EditSubagency || activeModal === AddSubagency ? (
                <SubAgencyModal
                  showModal={true}
                  closeModal={() => setActiveModal(null)}
                  activeModal={activeModal}
                  modalData={modalData}
                  handleSubAgencyDataChange={handleSubAgencyDataChange}
                />
              ) : null}
              {activeModal === AddAdvertiser ? (
                <AddAdvertiserModal
                  showModal={true}
                  closeModal={() => setActiveModal(null)}
                  subagencyList={toJS(accountManagementStore.subagencyList)}
                  segments={toJS(accountManagementStore.segmentsList)}
                  handleAdvertiserDataChange={handleAdvertiserDataChange}
                />
              ) : null}
            </>
          )}
          {activeTab.id !== 'brands' ? <ReactLoader isLoading={pageLoading || uiStore.isLoading} /> : null}
        </MainContent>
      </>
    );
  })
);

export default withStore(ManageAdvertisers);
