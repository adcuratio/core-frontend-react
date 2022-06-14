import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  .css-b62m3t-container {
    width: 200px;
    border-radius: 0px !important;
    border-width: 0px;
  }
`;

const CreativeSelector = inject('aggCampaignStore')(
  observer((props) => {
    const {
      orderType,
      selectorValueType,
      adCpySelectedDuration,
      selectedCompanyId,
      creative,
      onChangeCreative,
      aggCampaignStore,
    } = props;

    const creativesListData = toJS(aggCampaignStore.creativesListData);

    const adidDefaultOptions = [];
    const adCpyDefaultOptions = [];

    if (orderType === 'adid') {
      creativesListData?.forEach((element) => {
        adidDefaultOptions.push({
          label:
            selectorValueType === 'name'
              ? element?.ad_name
              : selectorValueType === 'identifier'
              ? element?.identifier
              : 'N/A',
          value: element?.id,
          name: element?.ad_name,
          adid: element?.id,
          identifier: element.identifier,
          duration: element?.duration,
          meta_id: element?.adid_meta_file_upload?.[0]?.id,
        });
      });
    } else if (orderType === 'ad_copy_rotation') {
      creativesListData?.forEach((element) => {
        element?.duration === adCpySelectedDuration &&
          adCpyDefaultOptions.push({
            label: element?.ad_name,
            value: element?.id,
            name: element?.ad_name,
            adid: element?.id,
            identifier: element.identifier,
            duration: element?.duration,
            meta_id: element?.adid_meta_file_upload?.[0]?.id,
          });
      });
    }

    const loadOptions = (searchStr, callback) => {
      if (searchStr.length > 0) {
        aggCampaignStore
          .getCreativesOptions(selectedCompanyId, 'Aggregation', adCpySelectedDuration, searchStr)
          .then((res) => {
            if (res?.data?.data?.results?.length > 0) {
              // addCreativeData(res?.data?.data?.results);
              const loadedOptionsArr = [];
              if (orderType === 'adid' && selectorValueType === 'identifier') {
                res?.data?.data?.results?.forEach((element) => {
                  loadedOptionsArr.push({
                    label: element?.identifier,
                    value: element?.id,
                    name: element?.ad_name,
                    adid: element?.id,
                    identifier: element?.identifier,
                    duration: element?.duration,
                    meta_id: element?.adid_meta_file_upload?.[0]?.id,
                  });
                });
              } else {
                res?.data?.data?.results?.forEach((element) => {
                  loadedOptionsArr.push({
                    label: element?.ad_name,
                    value: element?.id,
                    name: element?.ad_name,
                    adid: element?.id,
                    identifier: element?.identifier,
                    duration: element?.duration,
                    meta_id: element?.adid_meta_file_upload?.[0]?.id,
                  });
                });
              }
              callback(loadedOptionsArr);
            } else {
              callback([]);
            }
          });
      }
    };

    return (
      <SelectWrapper>
        <AsyncSelect
          styles={{
            menu: (provided) => ({ ...provided, zIndex: 9999 }),
          }}
          defaultOptions={orderType === 'adid' ? adidDefaultOptions : adCpyDefaultOptions}
          loadOptions={loadOptions}
          value={creative}
          isClearable
          placeholder="Search Creative..."
          onChange={(creativeObj) => onChangeCreative(creativeObj)}
        />
      </SelectWrapper>
    );
  })
);

CreativeSelector.propTypes = {
  orderType: PropTypes.string,
  selectorValueType: PropTypes.string,
  adCpySelectedDuration: PropTypes.number,
  selectedCompanyId: PropTypes.any,
  creative: PropTypes.object,
  onChangeCreative: PropTypes.func,
};

export default withStore(CreativeSelector);
