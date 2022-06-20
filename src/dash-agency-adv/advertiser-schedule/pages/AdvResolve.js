import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { MainContent, PageContent } from '../../../components/PageLayout';
import { StepPaneHeading } from '../../../components/Typography';
import ReactLoader from '../../../components/ReactLoader';
import CustomButton from '../../../components/CustomButton';
import ResolveDealModal from '../components/ResolveDealModal';
import AdSpotTable from '../components/AdSpotTable';

import withStore from '../../../hocs/WithStore';
import { showAckErrorMessage, showAckMessage, processName } from '../../../common/utils';

const AdvResolve = inject(
  'accountManagementStore',
  'uiStore',
  'advSchStore'
)(
  observer((props) => {
    const { accountManagementStore, uiStore, advSchStore, navigationService, $stateParams: params } = props;
    const { dealId, errorId } = params;

    const [showModal, setShowModal] = useState(false);
    const [dealData, setDealData] = useState({ adspot_list: [] });
    const [companyList, setCompanyList] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState({});
    const [selectedSubBrand, setSelectedSubBrand] = useState({});
    const [selectedOption, setSelectedOption] = useState('brand');

    // handle api response
    const handleError = (res) => {
      if (res.status === 200) {
        return true;
      } else {
        showAckErrorMessage({ message: res?.data?.message || null });
        return false;
      }
    };

    useEffect(() => {
      getDealFiles(dealId);
      getAllCompany();
    }, []);

    // get adspot list
    const getDealFiles = (dealId) => {
      advSchStore.resolveDeal(dealId).then(
        (res) => {
          const isValidData = Object.keys(res.data || {}).length > 0 && res.data.adspot_list?.length > 0;
          if (isValidData) {
            res.data.adspot_list.forEach((result) => {
              result.isSelected = false;
            });
            setDealData(res.data);
          } else if (res.data === 'Invalid Deal Number') {
            showAckErrorMessage({ message: res.data });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Something went wrong while getting Deals' });
        }
      );
    };

    const getAllCompany = () => {
      accountManagementStore.getAllBrands().then(
        (res) => {
          if (res && res.success) {
            res.data[0].company.brands.forEach((response) => {
              response.isSelected = false;
              response.flag = 0;
              response.sub_brands_with_ids.forEach((sub) => {
                sub.isSelected = false;
                return sub;
              });
            });
            setCompanyList(res.data || []);
          } else {
            showAckErrorMessage({ message: res.message || 'Unable to fetch brands' });
          }
        },
        () => {
          showAckErrorMessage({ message: 'Unable to fetch brands' });
        }
      );
    };

    const handleModelOpen = () => {
      const isSelected = dealData.adspot_list?.some((adSpot) => adSpot.isSelected);
      if (!isSelected) {
        showAckErrorMessage({ message: 'Please select at least one deal file before adding' });
        return;
      }
      setShowModal(!showModal);
    };

    // create a new brand
    // handle if brand already exits
    const createNewBrand = () => {
      const isBrandExist = companyList[0]?.company?.brands?.some(
        (brand) => processName(brand) === dealData.adspot_list[0].default_brand.toLowerCase()
      );

      if (isBrandExist === undefined) {
        showAckErrorMessage({
          message: `We can not process now. Please select options from dropdown`,
        });
        return;
      }

      if (isBrandExist) {
        showAckErrorMessage({
          message: `Brand name ${dealData.adspot_list[0].default_brand} already exist. you can choose ${dealData.adspot_list[0].default_brand} from dropdown and merge selected Ad Spots`,
        });
        return;
      }
      return true;
    };

    const handleFormChange = (id, type) => {
      const cpyCompany = [...companyList];
      if (type === 'brand') {
        const brandIndex = companyList[0].company.brands.findIndex((brand) => brand.id === id);
        if (brandIndex !== -1) {
          const selectedBrand = companyList[0].company.brands[brandIndex];
          cpyCompany[0].company.brands.forEach((brand, index) => {
            brand.isSelected = brandIndex === index || false;
          });
          setCompanyList(cpyCompany);
          setSelectedBrand(selectedBrand);
          if (selectedSubBrand?.id) {
            setSelectedSubBrand({});
          }
          return;
        }
      } else if (type === 'subBrand') {
        const brandIndex = companyList[0].company.brands.findIndex((brand) => brand.isSelected);
        const subIndex = cpyCompany[0].company.brands[brandIndex].sub_brands_with_ids.findIndex(
          (subObj) => subObj.id === id
        );
        if (subIndex !== -1) {
          const selectedSubBrand = cpyCompany[0].company.brands[brandIndex].sub_brands_with_ids[subIndex];
          cpyCompany[0].company.brands[brandIndex].sub_brands_with_ids.forEach((sub, index) => {
            sub.isSelected = index === subIndex || false;
          });
          setCompanyList(cpyCompany);
          setSelectedSubBrand(selectedSubBrand);
          return;
        }
      }
    };

    const resolveDealFile = (payload) => {
      advSchStore.resolveEdiFiles(payload).then(
        (res) => {
          if (handleError(res)) {
            showAckMessage({ message: res?.data?.message || 'Approved successfully' });
            setShowModal(!showModal);
            goBack();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    // validate all input field filled
    const isValid = () => {
      switch (selectedOption) {
        case 'brand':
          return selectedBrand.isSelected;
        case 'sub_brand':
          return selectedSubBrand?.id ? true : false;
        case 'new_brand':
          return true;
        default:
          return false;
      }
    };

    // Api Call on Create new brand
    const onCreateBrand = (payload) => {
      const createBrandPayload = {
        name: dealData.adspot_list[0].default_brand,
        company_id: companyList[0].company.id,
      };
      accountManagementStore.saveBrand(createBrandPayload).then(
        (res) => {
          if (res.success) {
            payload.entity_type = 'brand';
            payload.entity_id = res.data.id;
            resolveDealFile(payload);
          } else {
            showAckErrorMessage();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleApprove = () => {
      if (!isValid()) {
        showAckErrorMessage({ message: 'Select atleast option before approving' });
        return;
      }
      const deal_list = [];
      dealData.adspot_list.forEach((res) => {
        if (res.isSelected) {
          deal_list.push(res.adspot_id);
        }
      });

      const payload = {
        edifile_id: errorId,
        campaign_id: dealData.campaign_id,
        adspot_list: deal_list,
      };

      switch (selectedOption) {
        case 'brand':
          payload.entity_type = 'brand';
          payload.entity_id = selectedBrand.id;
          resolveDealFile(payload);
          break;
        case 'sub_brand':
          payload.entity_type = 'sub_brand';
          payload.entity_id = selectedSubBrand.id;
          resolveDealFile(payload);
          break;
        case 'new_brand':
          onCreateBrand(payload);
          break;
        default:
          return false;
      }
    };

    const onSelectDealFile = (adSpot) => {
      const adSpotIndex = dealData.adspot_list?.indexOf(adSpot);
      if (adSpotIndex !== -1) {
        const cpyResolve = { ...dealData };
        cpyResolve.adspot_list[adSpotIndex].isSelected = !cpyResolve.adspot_list[adSpotIndex].isSelected;
        setDealData(cpyResolve);
      }
    };

    const onHandleSelect = (type) => {
      // Call create new brand handler
      if (type === 'new_brand' && !createNewBrand()) {
        return null;
      }

      if (type) {
        setSelectedOption(type);
      }
    };

    const goBack = () => {
      navigationService.goToEdiTable({ tab: 'incorrect' });
    };

    const resetModalInputs = () => {
      setSelectedBrand({});
      setSelectedSubBrand({});
      setSelectedOption('brand');
    };

    const onCloseModal = () => {
      setShowModal(!showModal);
      resetModalInputs();
    };

    return (
      <MainContent>
        <PageContent className="popup-box-scroll">
          <StepPaneHeading>Resolve Deal files:</StepPaneHeading>
          {Object.keys(dealData).length !== 0 && (
            <AdSpotTable
              onSelectDealFile={onSelectDealFile}
              adSpotList={dealData.adspot_list || []}
              isLoading={uiStore.isLoading}
            />
          )}
        </PageContent>
        <div className="mt20 flex-container2">
          <CustomButton type="secondary" buttonText="Back" handleButtonClick={goBack} />
          {dealData?.adspot_list?.length > 0 ? (
            <CustomButton type="primary" buttonText="Submit" handleButtonClick={handleModelOpen} />
          ) : null}
        </div>
        <ReactLoader isLoading={uiStore.isLoading} />

        {showModal && (
          <ResolveDealModal
            showModal={showModal}
            closeModal={() => onCloseModal()}
            handleFormChange={handleFormChange}
            companyList={companyList}
            resolveData={dealData}
            selectedBrand={selectedBrand}
            selectedSubBrand={selectedSubBrand}
            handleApprove={handleApprove}
            selectedValue={selectedOption}
            onHandleSelect={onHandleSelect}
          />
        )}
      </MainContent>
    );
  })
);

AdvResolve.propTypes = {
  navigationService: PropTypes.object,
  $stateParams: PropTypes.object,
};

export default withStore(AdvResolve);
