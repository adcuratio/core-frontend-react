import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, Col, Row } from 'react-bootstrap';
import { toJS } from 'mobx';
import ReactPickyFilter from '../../ReactPickyFilter';
import styled from 'styled-components';

const PickyWidth = styled.div`
  .gqttXH {
    width: 17vw;
    margin-left: 0px;
  }
`;

const CreativeForm = (props) => {
  const {
    networkStore,
    deliveryVendorChoices,
    networkChoices,
    adChoices,
    channelList,
    uploadCreativesData,
    setUploadCreativesData,
    companyData,
    isSecondDropDown,
    networkSelectedData,
    applyNetworkMultiselect,
    isFoxDash,
  } = props;

  // Function for setting the advertiser dropdown,corresponding brand/sub-brand tree, ADID input,creative name input, uploading the video file and selecting the vendors.
  const handleCreativeDataChange = (e, id) => {
    const uploadCreativesDataCpy = { ...uploadCreativesData };

    if (id === 'advertiser_selection') {
      const currentCompanydata = networkStore.companies.find((c) => c.company.id.toString() === e.target.value);
      uploadCreativesDataCpy.selectedCompany = e.target.value;
      uploadCreativesDataCpy.isciEntity = toJS(currentCompanydata).company;
    } else if (id === 'ad_id') {
      uploadCreativesDataCpy.isciIdentifier = e.target.value;
    } else if (id === 'isci_creative') {
      uploadCreativesDataCpy.isciCreative = e.target.value;
    } else if (id === 'file_data') {
      uploadCreativesDataCpy.fileData = e.target;
    } else if (id === 'select_delivery_vendor') {
      uploadCreativesDataCpy.selectedDeliveryVendorOption = e.target.value;
    } else if (id === 'select_ad_choice') {
      uploadCreativesDataCpy.selectedAdOption = e.target.value;
    } else if (id === 'select_network_choice') {
      uploadCreativesDataCpy.selectedNetworkOption = e.target.value;
    } else if (id === 'free_form_text') {
      uploadCreativesDataCpy.deliveryVendorFreeText = e.target.value;
    } else if (id === 'select_channels') {
      const selectedNetworks = e.target.value;
      uploadCreativesDataCpy.selectedChannels = selectedNetworks.split(',');
    } else if (id === 'house_id') {
      uploadCreativesDataCpy.houseId = e.target.value;
    }
    setUploadCreativesData(uploadCreativesDataCpy);
  };

  // const applyMultiselect = ( filteredData, id ) => {
  //   if(id === 'network_multiselect'){
  //     setUploadCreativesData(...uploadCreativesData, selectedNetworkOption = filteredData);
  //     console.log(uploadCreativesData);
  //   }
  // }

  // Function for setting the delivery vendor data.
  const getVendorOptionsComp = (deliveryVendorChoices) => {
    const optionsComp = [];
    if (deliveryVendorChoices && deliveryVendorChoices.length) {
      deliveryVendorChoices?.forEach((data) => {
        for (const key in data) {
          optionsComp.push(
            <option key={`delivery_choice_${key}`} value={key}>
              {data[key]}
            </option>
          );
        }
      });
    }
    return optionsComp;
  };

  return (
    <Row>
      <Col sm={6}>
        <div>
          <select
            value={uploadCreativesData.selectedCompany}
            onChange={(e) => handleCreativeDataChange(e, 'advertiser_selection')}
          >
            <option value="0" disabled>
              Select an Advertiser
            </option>
            {companyData?.map((c) => (
              <option key={c.company.id} value={c.company.id}>
                {c.company.name}
              </option>
            ))}
          </select>

          {/* {companyLeveldata && (
            <Tree
              onSelect={(e) => handleCreativeDataChange(e, 'isci_tree')}
              treeData={companyLeveldata}
              style={{ height: '260px', overflowY: 'auto' }}
            />
          )} */}
        </div>
      </Col>
      <Col sm={6}>
        <div>
          Ad-ID/ISCI:
          <FormControl
            type="text"
            value={uploadCreativesData.isciIdentifier}
            placeholder="Enter Ad-ID/ISCI"
            onChange={(e) => handleCreativeDataChange(e, 'ad_id')}
          />
        </div>
        <div className="mt10">
          Creative Name:
          <FormControl
            type="text"
            value={uploadCreativesData.isciCreative}
            placeholder="Enter Creative name"
            onChange={(e) => handleCreativeDataChange(e, 'isci_creative')}
          />
        </div>
        <div className="mt10">
          Select file:
          <label>
            <input
              type="file"
              accept=".mxf,.mp4"
              onChange={(e) => handleCreativeDataChange(e, 'file_data')}
              value={
                uploadCreativesData.fileData && uploadCreativesData.fileData.value
                  ? uploadCreativesData.fileData.value
                  : ''
              }
            />
          </label>
          <p className="mb10 mt5">
            <span className="icon-color">*</span>
            Upto 1GB file can be Uploaded
          </p>
        </div>
        {isSecondDropDown && (
          <div className="mt10">
            <select
              value={uploadCreativesData.selectedAdOption}
              onChange={(e) => handleCreativeDataChange(e, 'select_ad_choice')}
            >
              <option value="" disabled>
                Select Ad Type
              </option>
              {adChoices.map((ad, i) => (
                <option key={i} value={i}>
                  {ad[i]}
                </option>
              ))}
            </select>
          </div>
        )}
        {deliveryVendorChoices && deliveryVendorChoices.length > 0 && (
          <div className="mt10">
            <select
              value={uploadCreativesData.selectedDeliveryVendorOption}
              onChange={(e) => handleCreativeDataChange(e, 'select_delivery_vendor')}
            >
              <option value="" disabled>
                Select Delivery Vendor
              </option>
              {getVendorOptionsComp(deliveryVendorChoices)}
              <option value="other">Other</option>
            </select>
          </div>
        )}
        {isSecondDropDown && (
          <div className="mt10">
            <PickyWidth>
              <ReactPickyFilter
                allOptions={networkChoices}
                selectedData={
                  // uploadCreativesData.selectedNetworkOption
                  networkSelectedData
                }
                onFilterChange={
                  applyNetworkMultiselect
                  // applyMultiselect
                }
                id="network_multiselect"
                selectAllText="Select All Networks"
                allSelectedPlaceholder="All Networks"
                placeholderText="Select Networks"
              />
            </PickyWidth>
            {/* <select
              value={uploadCreativesData.selectedNetworkOption}
              onChange={(e) => handleCreativeDataChange(e, 'select_network_choice')}
            >
              <option value="" disabled>
                Select Network Feed
              </option>
              {networkChoices?.forEach((ad, key) => (
                <option key={key} value={ad}>
                  {key}
                </option>
              ))}
            </select> */}
          </div>
        )}
        {uploadCreativesData.selectedDeliveryVendorOption === 'other' && (
          <>
            <FormControl
              className="mt10"
              type="text"
              value={uploadCreativesData.deliveryVendorFreeText}
              onChange={(e) => handleCreativeDataChange(e, 'free_form_text')}
              placeholder="Enter free form text"
            />
          </>
        )}
        {/* {isSecondDropDown &&  ( */}
        {channelList && channelList.length ? (
          <div className="mt10">
            Network:
            <div>
              <select
                value={uploadCreativesData.selectedChannels}
                onChange={(e) => handleCreativeDataChange(e, 'select_channels')}
              >
                <option value="" disabled>
                  Select Networks
                </option>
                {channelList?.map((channel, index) => (
                  <option
                    key={`li_${index}`}
                    value={Object.values(Object.values(channel)?.[0])}
                    style={{ cursor: 'pointer' }}
                    title={`${Object.keys(channel)} networks are ${Object.values(Object.values(channel)?.[0])}`}
                  >
                    {Object.keys(channel)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          !isSecondDropDown && <div className="mt10">No channels present.</div>
        )}
        {isFoxDash && (
          <div className="mt10">
            <span className="flex-container1">
              House ID (<p style={{ fontWeight: 'bold', fontSize: '13px' }}> Optional</p>):
            </span>
            <FormControl
              type="text"
              value={uploadCreativesData.houseId}
              placeholder="Enter House Id"
              onChange={(e) => handleCreativeDataChange(e, 'house_id')}
            />
          </div>
        )}
      </Col>
    </Row>
  );
};
CreativeForm.propTypes = {
  networkStore: PropTypes.object,
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  getAllCreatives: PropTypes.func,
  channelList: PropTypes.array,
  deliveryVendorChoices: PropTypes.array,
  setChannelList: PropTypes.func,
  uploadCreativesData: PropTypes.object,
  setUploadCreativesData: PropTypes.func,
  isSecondDropDown: PropTypes.bool,
  companyData: PropTypes.array,
  adChoices: PropTypes.array,
  networkChoices: PropTypes.array,
  networkSelectedData: PropTypes.array,
  applyNetworkMultiselect: PropTypes.func,
  isFoxDash: PropTypes.bool,
};

CreativeForm.defaultProps = {
  // getAllCreatives: () => {},
  deliveryVendorChoices: [],
};

export default CreativeForm;
