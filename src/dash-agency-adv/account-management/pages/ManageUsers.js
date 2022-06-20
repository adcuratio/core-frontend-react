import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

import withStore from '../../../hocs/WithStore';

import { AddAgencyRep, AddAdvertiserAdmin, EditAgencyRep, EditAdvertiserAdmin } from '../constants/ModalConstants';

import { MainContent } from '../../../components/PageLayout';
// import CustomButton from '../../../components/CustomButton';
import ReactLoader from '../../../components/ReactLoader';
import TabContainer from '../../../components/TabContainer';

import { applySearch, showAckErrorMessage, applySorting } from '../../../common/utils';

import Header from '../components/Header';

import AgencyRepModal from '../containers/AgencyRepModal';

import { UserTabData } from '../JsonData';

import '../index.css';

const ManageUsers = inject(
  'accountManagementStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { accountManagementStore, uiStore, authStore } = props;
    const [activeModal, setActiveModal] = useState('');
    const [activeTab, setActiveTab] = useState(UserTabData[0]);
    // const [modalData, setModalData] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [agencyRepList, setAgencyRepList] = useState(null);
    const [agencyRepFilteredData, setAgencyRepFilteredData] = useState(null);
    const [advAdminData, setAdvAdminData] = useState(null);
    const [advAdminFilteredData, setAdvAdminFilteredData] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [AgencyRepCols, setAgencyRepCols] = useState([
      {
        id: 'acc_man_rep_first_name',
        name: 'First Name',
        dataProp: 'first_name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_rep_last_name',
        name: 'Last Name',
        dataProp: 'last_name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_rep_email',
        name: 'Email',
        dataProp: 'email',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_rep_phone',
        name: 'Phone',
        dataProp: 'phone',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      // ---Action column in Agency---
      // {
      //   id: 'action',
      //   name: 'Action',
      //   applyFilter: false,
      //   isApplySorting: false,
      // },
    ]);
    const [AdvertiserAdminCols, setAdvertiserAdminCols] = useState([
      {
        id: 'acc_man_advadm_user_entity',
        name: 'Advertiser',
        dataProp: 'user_entity',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_advadm_first_name',
        name: 'First Name',
        dataProp: 'first_name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_advadm_last_name',
        name: 'Last Name',
        dataProp: 'last_name',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_advadm_email',
        name: 'Email',
        dataProp: 'email',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_advadm_phone',
        name: 'Phone',
        dataProp: 'phone',
        applyFilter: true,
        sortingType: null,
        isApplySorting: true,
      },
      // ---Action Column in Advertiser---
      // {
      //   id: 'action',
      //   name: 'Action',
      //   applyFilter: false,
      //   isApplySorting: false,
      // },
    ]);

    useEffect(() => {
      if (searchValue) {
        setSearchValue('');
      }
      if (!pageLoading) {
        setPageLoading(true);
      }
      getAllSubagencyAPI();
      getAllCompaniesAPI();
    }, [activeTab]);

    const getAllSubagencyAPI = () => {
      accountManagementStore.getAllSubAgencies().then(
        (response) => {
          if (!response.success) {
            showAckErrorMessage({ message: response?.data?.message ?? 'Cannot Fetch Data!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAllCompaniesAPI = () => {
      accountManagementStore.getAllCompanies().then(
        (response) => {
          if (response.success) {
            if (activeTab.id === 'agency_rep') {
              getAllAgencyRepAPI();
            } else {
              getAllAdvertiserAdminAPI();
            }
          } else {
            showAckErrorMessage({ message: response?.data?.message ?? 'Cannot Fetch Data!' });
            setPageLoading(false);
          }
        },
        () => {
          showAckErrorMessage();
          setPageLoading(false);
        }
      );
    };

    const getAllAgencyRepAPI = () => {
      accountManagementStore.getAllAgencyRep().then(
        (response) => {
          if (response.success) {
            const agencyRepDataCpy = JSON.parse(JSON.stringify(accountManagementStore.agencyRepData));
            const agencyListCpy = agencyRepDataCpy.map((agencyRep) => {
              agencyRep.companies_objs = [];
              agencyRep.companies.forEach((company) => {
                const companyDataIndex = accountManagementStore.companyList.findIndex((d) => d.id === company);
                if (companyDataIndex !== -1) {
                  agencyRep.companies_objs.push(accountManagementStore.companyList[companyDataIndex]);
                }
              });
              return agencyRep;
            });
            setAgencyRepList(agencyListCpy);
            sortUserData(AgencyRepCols[0], true, agencyListCpy);
            setPageLoading(false);
          } else {
            showAckErrorMessage({ message: response?.data?.message ?? 'Cannot fetch Agency Representative!' });
            setPageLoading(false);
          }
        },
        () => {
          showAckErrorMessage();
          setPageLoading(false);
        }
      );
    };

    const getAllAdvertiserAdminAPI = () => {
      accountManagementStore.getAllAdvertiserAdmin().then(
        (response) => {
          if (response.success) {
            setAdvAdminData(response.data);
            sortUserData(AdvertiserAdminCols[0], true, response.data);
            setPageLoading(false);
          } else {
            showAckErrorMessage({ message: response?.data?.message ?? 'Cannot fetch Advertier Admin!' });
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

    const handleHeaderButtonClick = (id) => {
      setActiveModal(id);
    };

    const getHeaderList = () => {
      let headerValues = [];
      if (activeTab.id === 'agency_rep') {
        const dataCpy = JSON.parse(JSON.stringify(AgencyRepCols));
        headerValues = dataCpy;
      } else if (activeTab.id === 'advertiser_admin') {
        const dataCpy = JSON.parse(JSON.stringify(AdvertiserAdminCols));
        headerValues = dataCpy;
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

    const sortUserData = (activeTitleData, value, sortedDataCpy) => {
      if (activeTitleData.isApplySorting) {
        if (!sortedDataCpy) {
          if (activeTab.id === 'agency_rep') {
            sortedDataCpy = agencyRepFilteredData;
          } else if (activeTab.id === 'advertiser_admin') {
            sortedDataCpy = advAdminFilteredData;
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
          if (activeTab.id === 'agency_rep') {
            setAgencyRepCols(headerListCpy);
            setAgencyRepFilteredData(sortedData);
          } else if (activeTab.id === 'advertiser_admin') {
            setAdvertiserAdminCols(headerListCpy);
            setAdvAdminFilteredData(sortedData);
          }
        }
      }
    };

    // ---Edit Function---
    // const onEditData = (data) => {
    //   if (activeTab.id === 'agency_rep') {
    //     setActiveModal(EditAgencyRep);
    //   } else {
    //     setActiveModal(EditAdvertiserAdmin);
    //   }
    //   setModalData(data);
    // };

    const getTableContent = () => {
      const contentComp = [];
      if (activeTab.id === 'agency_rep') {
        if (agencyRepFilteredData && agencyRepFilteredData.length) {
          agencyRepFilteredData.forEach((data) => {
            contentComp.push(
              <tr key={data.id}>
                <td className="bold">{data.first_name ? data.first_name : '-'}</td>
                <td>{data.last_name ? data.last_name : '-'}</td>
                <td className="text-lowercase-imp">{data.last_name ? data.email : '-'}</td>
                <td>{data.last_name ? data.phone : '-'}</td>
                {/* ---Edit Agency Button--- */}
                {/* {!authStore.userObj?.read_only && (
                  <td>
                    <CustomButton
                      buttonText="Edit"
                      buttonClassName="blue-button acc-management-edit-btn"
                      handleButtonClick={() => onEditData(data)}
                    />
                  </td>
                )} */}
              </tr>
            );
          });
        } else if (!pageLoading && !uiStore.isLoading) {
          contentComp.push(
            <tr key="no_data_found" className="bg-main-imp">
              <td
                colSpan={authStore.userObj?.read_only ? AgencyRepCols.length - 1 : AgencyRepCols.length}
                className="text-center-imp"
              >
                No data found
              </td>
            </tr>
          );
        }
      } else if (activeTab.id === 'advertiser_admin') {
        if (advAdminFilteredData && advAdminFilteredData.length) {
          advAdminFilteredData.forEach((data) => {
            contentComp.push(
              <tr key={data.id}>
                <td>{data.user_entity ? data.user_entity : '-'}</td>
                <td className="bold">{data.first_name ? data.first_name : '-'}</td>
                <td>{data.last_name ? data.last_name : '-'}</td>
                <td className="text-lowercase-imp">{data.last_name ? data.email : '-'}</td>
                <td>{data.last_name ? data.phone : '-'}</td>
                {/* ---Edit Advertiser Button--- */}
                {/* {!authStore.userObj?.read_only && (
                  <td>
                    <CustomButton
                      buttonText="Edit"
                      buttonClassName="blue-button acc-management-edit-btn"
                      handleButtonClick={() => onEditData(data)}
                    />
                  </td>
                )} */}
              </tr>
            );
          });
        } else if (!pageLoading && !uiStore.isLoading) {
          contentComp.push(
            <tr key="no_data_found" className="bg-main-imp">
              <td
                colSpan={authStore.userObj?.read_only ? AdvertiserAdminCols.length - 1 : AdvertiserAdminCols.length}
                className="text-center-imp"
              >
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
      if (activeTab.id === 'agency_rep') {
        const agencyRepListCpy = JSON.parse(JSON.stringify(agencyRepList));
        const list = applySearch(value, agencyRepListCpy, AgencyRepCols);
        const curIndex = AgencyRepCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(AgencyRepCols[curIndex], AgencyRepCols[curIndex].sortingType, list);
        }
      } else if (activeTab.id === 'advertiser_admin') {
        const advAdminDataCpy = JSON.parse(JSON.stringify(advAdminData));
        const list = applySearch(value, advAdminDataCpy, AdvertiserAdminCols);
        const curIndex = AdvertiserAdminCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(AdvertiserAdminCols[curIndex], AdvertiserAdminCols[curIndex].sortingType, list);
        }
      }
    };

    const dataUpdateOnSuccess = (data) => {
      // Updating latest data once response is success if user tries to add/edit data
      const agencyRepListCpy = JSON.parse(JSON.stringify(agencyRepList));
      const advAdminDataCpy = JSON.parse(JSON.stringify(advAdminData));

      if (activeModal === AddAgencyRep) {
        agencyRepListCpy.unshift(data);
        setAgencyRepList(agencyRepListCpy);
        const list = applySearch(searchValue, agencyRepListCpy, AgencyRepCols);
        setAgencyRepFilteredData(list);
      } else if (activeModal === EditAgencyRep) {
        const index1 = agencyRepListCpy.findIndex((d) => d.id === data.id);
        if (index1 !== -1) {
          agencyRepListCpy[index1] = data;
        }
        setAgencyRepList(agencyRepListCpy);
        const list = applySearch(searchValue, agencyRepListCpy, AgencyRepCols);
        const curIndex = AgencyRepCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(AgencyRepCols[curIndex], AgencyRepCols[curIndex].sortingType, list);
        }
      } else if (activeModal === AddAdvertiserAdmin) {
        advAdminDataCpy.unshift(data);
        setAdvAdminData(advAdminDataCpy);
        const list = applySearch(searchValue, advAdminDataCpy, AdvertiserAdminCols);
        setAdvAdminFilteredData(list);
      } else if (activeModal === EditAdvertiserAdmin) {
        const index1 = advAdminDataCpy.findIndex((d) => d.id === data.id);
        if (index1 !== -1) {
          advAdminDataCpy[index1] = data;
        }
        setAdvAdminData(advAdminDataCpy);
        const list = applySearch(searchValue, advAdminDataCpy, AdvertiserAdminCols);
        const curIndex = AdvertiserAdminCols.findIndex((d) => d.sortingType !== null);
        if (curIndex !== -1) {
          sortUserData(AdvertiserAdminCols[curIndex], AdvertiserAdminCols[curIndex].sortingType, list);
        }
      }
    };

    return (
      <MainContent>
        <div className="mt10">
          <TabContainer tabList={UserTabData} activeTab={activeTab} onTabChange={onTabChange} />
        </div>

        <Header
          activeTab={activeTab}
          headingName={activeTab.headingName}
          handleSearchTextChange={handleSearchTextChange}
          handleButtonAction={handleHeaderButtonClick}
          searchValue={searchValue}
          isReadonly={authStore.userObj?.read_only}
        />
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>{getTableHeader()}</thead>
          <tbody>{getTableContent()}</tbody>
        </table>
        {activeModal === AddAgencyRep ||
        activeModal === AddAdvertiserAdmin ||
        activeModal === EditAgencyRep ||
        activeModal === EditAdvertiserAdmin ? (
          <AgencyRepModal
            showModal={true}
            closeModal={() => setActiveModal('')}
            // modalData={modalData}
            activeModal={activeModal}
            dataUpdateOnSuccess={dataUpdateOnSuccess}
            {...props}
          />
        ) : null}
        <ReactLoader isLoading={uiStore.isLoading || pageLoading} />
      </MainContent>
    );
  })
);

export default withStore(ManageUsers);
