import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { FaEdit } from 'react-icons/fa';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { toJS } from 'mobx';

import withStore from '../../../hocs/WithStore';

import Header from '../components/Header';

import BrandModal from './BrandModal';
import SubbrandModal from './SubbrandModal';

import ReactLoader from '../../../components/ReactLoader';

import { applySearch, showAckErrorMessage, applySorting } from '../../../common/utils';

import { AdvertiserTabData } from '../JsonData';

import { AddBrand, AddSubBrand, EditBrand, EditSubBrand } from '../constants/ModalConstants';

import '../index.css';

const BrandsSubbrandsData = inject(
  'accountManagementStore',
  'uiStore',
  'authStore'
)(
  observer((props) => {
    const { accountManagementStore, uiStore, authStore } = props;
    const [agencyAdminBrands, setAgencyAdminBrands] = useState([]);
    const [agencyAdminFilteredBrands, setAgencyAdminFilteredBrands] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [modalData, setModalData] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [BrandSubbrandCols, setBrandSubbrandCols] = useState([
      {
        id: 'acc_man_br_advertiser',
        name: 'Advertiser',
        applyFilter: true,
        dataProp: 'company_name',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_br_brand',
        name: 'Brand',
        applyFilter: true,
        dataProp: 'name',
        sortingType: null,
        isApplySorting: true,
      },
      {
        id: 'acc_man_br_subbrands',
        name: 'Sub-Brands',
        applyFilter: true,
        dataProp: 'sub_brands',
        sortingType: null,
        isApplySorting: false,
      },
    ]);

    useEffect(() => {
      initCalls();
    }, []);

    const initCalls = () => {
      getAllBrandsAPI();
      getAllCompaniesAPI();
    };

    const getAllBrandsAPI = () => {
      accountManagementStore.getAllBrands().then(
        (response) => {
          if (response.success) {
            setAgencyAdminBrands(toJS(accountManagementStore.brandsList));
            sortUserData(BrandSubbrandCols[0], true, toJS(accountManagementStore.brandsList), '');
          } else {
            showAckErrorMessage({ message: response?.data?.message ?? 'Unable to Fetch Brands!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAllCompaniesAPI = () => {
      accountManagementStore.getAllCompanies(true).then(
        (response) => {
          if (!response.success) {
            showAckErrorMessage({ message: response?.data?.message ?? 'Unable to fetch Brands!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const sortUserData = (
      activeTitleData,
      value,
      sortedDataCpy = JSON.parse(JSON.stringify(agencyAdminBrands)),
      sValue = searchValue
    ) => {
      if (activeTitleData.isApplySorting) {
        const headerListCpy = JSON.parse(JSON.stringify(BrandSubbrandCols));

        const index = headerListCpy.findIndex((d) => d.id === activeTitleData.id);
        if (index !== -1) {
          headerListCpy[index].sortingType = value;
          headerListCpy.forEach((d, dIndex) => {
            if (index !== dIndex) {
              d.sortingType = null;
            }
          });
          setBrandSubbrandCols(headerListCpy);
          const sortedData = applySorting(headerListCpy[index].sortingType, activeTitleData.id, sortedDataCpy);
          // searchCode
          const list = applySearch(sValue, sortedData, BrandSubbrandCols);
          setAgencyAdminFilteredBrands(list);
        }
      }
    };

    const getTableHeader = () => {
      if (BrandSubbrandCols && BrandSubbrandCols.length) {
        const headerComp = [];
        BrandSubbrandCols.forEach((data) => {
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

    //  -----Edit Brand Function-----
    // const onEditBrand = (data, type) => {
    //   setModalData(data);
    //   setActiveModal(type);
    // };

    const onUpdateSubbrand = (mData, index, type) => {
      mData.active_sub_brand = {
        index,
        id: mData.sub_brands_with_ids[index].id,
        name: mData.sub_brands_with_ids[index].name,
      };
      setModalData(mData);
      setActiveModal(type);
    };

    const getTableContent = () => {
      const contentComp = [];
      if (agencyAdminFilteredBrands && agencyAdminFilteredBrands.length) {
        agencyAdminFilteredBrands.forEach((data) => {
          contentComp.push(
            <tr key={data.id}>
              <td>{data.company_name ? data.company_name : '-'}</td>
              <td>
                <div className="flex">
                  <p className="bold mr10 word-break-break-word">
                    {data.name ? data.name : '-'}
                    {/* ---Edit Brand Icon--- */}
                    {/* {!authStore.userObj?.read_only && (
                      <FaEdit
                        className="cursor-pointer ml5"
                        size={16}
                        color="grey"
                        onClick={() => onEditBrand(data, EditBrand)}
                      />
                    )} */}
                  </p>
                </div>
              </td>
              <td>
                {data.sub_brands?.length
                  ? data.sub_brands?.map((subbrand, subbrandIndex) => (
                      <div className="flex" key={`subbrand_${subbrandIndex}`}>
                        <p className="mr10 word-break-break-word">
                          {subbrand}
                          {!authStore.userObj?.read_only && (
                            <FaEdit
                              className="cursor-pointer ml5"
                              size={16}
                              color="grey"
                              onClick={() => onUpdateSubbrand(data, subbrandIndex, EditSubBrand)}
                            />
                          )}
                        </p>
                      </div>
                    ))
                  : '-'}
              </td>
            </tr>
          );
        });
      } else if (!uiStore.isLoading) {
        contentComp.push(
          <tr key="no_data_found" className="bg-main-imp">
            <td colSpan={BrandSubbrandCols.length} className="text-center-imp">
              No data found
            </td>
          </tr>
        );
      }
      return contentComp;
    };

    const handleSearchTextChange = (value) => {
      setSearchValue(value);
      const agencyAdminBrandsCpy = JSON.parse(JSON.stringify(agencyAdminBrands));
      const curIndex = BrandSubbrandCols.findIndex((d) => d.sortingType !== null);
      if (curIndex !== -1) {
        sortUserData(BrandSubbrandCols[curIndex], BrandSubbrandCols[curIndex].sortingType, agencyAdminBrandsCpy, value);
      }
    };

    const handleHeaderButtonClick = (id) => {
      setActiveModal(id);
    };

    const handleDataUpdateOnSuccess = () => {
      setSearchValue('');
      initCalls();
      setModalData({});
    };

    return (
      <>
        <Header
          activeTab={AdvertiserTabData[2]}
          headingName={AdvertiserTabData[2].headingName}
          handleSearchTextChange={handleSearchTextChange}
          searchValue={searchValue}
          handleButtonAction={handleHeaderButtonClick}
          isReadonly={authStore.userObj?.read_only}
        />
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>{getTableHeader()}</thead>
          <tbody>{getTableContent()}</tbody>
        </table>
        {activeModal === EditBrand || activeModal === AddBrand ? (
          <BrandModal
            showModal={true}
            closeModal={() => setActiveModal(null)}
            modalData={modalData}
            handleDataUpdateOnSuccess={handleDataUpdateOnSuccess}
            mode={activeModal === EditBrand ? 'edit' : 'add'}
          />
        ) : null}
        {activeModal === EditSubBrand || activeModal === AddSubBrand ? (
          <SubbrandModal
            showModal={true}
            closeModal={() => setActiveModal(null)}
            modalData={modalData}
            handleDataUpdateOnSuccess={handleDataUpdateOnSuccess}
            mode={activeModal === EditSubBrand ? 'edit' : 'add'}
          />
        ) : null}
        <ReactLoader isLoading={uiStore.isLoading} />
      </>
    );
  })
);

export default withStore(BrandsSubbrandsData);
