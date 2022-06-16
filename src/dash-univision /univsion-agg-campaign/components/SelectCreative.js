import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  .css-b62m3t-container {
    width: 200px;
    border-radius: 0px !important;
    border-width: 0px;
    z-index: 2;
  }
`;

const SelectCreative = inject('aggCampaignStore')(
  observer((props) => {
    const { id, assetIndex, onChange, field, type, addCreativeData, value, creativesListData, aggCampaignStore } =
      props;

    const [defaultOptions, setDefaultOptions] = useState([]);

    useEffect(() => {
      if (field?.targeting_data?.[id]?.creative_selection_type === 'adid') {
        const tempOptions = [];
        if (type === 'name') {
          creativesListData?.forEach((data) => {
            tempOptions.push({
              value: data?.ad_name,
              label: data?.ad_name,
            });
          });
        } else {
          creativesListData?.forEach((data) => {
            tempOptions.push({
              value: data?.identifier,
              label: data?.identifier,
            });
          });
        }
        setDefaultOptions(tempOptions);
      } else {
        const tempOptions = [];
        creativesListData?.forEach((data) => {
          data?.duration.toString() === field?.targeting_data[id]?.duration &&
            tempOptions.push({
              value: data?.ad_name,
              label: data?.ad_name,
            });
        });
        setDefaultOptions(tempOptions);
      }
    }, [creativesListData]);

    const loadOptions = (value, callback) => {
      setTimeout(() => {
        if (value.length > 0) {
          aggCampaignStore
            .getCreativesData(field.adv_company, 'Aggregation', field?.targeting_data[id]?.duration, value)
            .then((res) => {
              if (res?.data?.data?.results.length > 0) {
                addCreativeData(res?.data?.data?.results);
                const tempArray = [];
                if (type === 'name') {
                  res?.data?.data?.results?.forEach((element) => {
                    tempArray.push({
                      label: `${element.ad_name}`,
                      value: `${element.ad_name}`,
                    });
                  });
                } else {
                  res?.data?.data?.results?.forEach((element) => {
                    tempArray.push({
                      label: `${element.identifier}`,
                      value: `${element.identifier}`,
                    });
                  });
                }

                callback(tempArray);
              } else {
                callback([]);
              }
            });
        }
      }, 500);
    };

    return (
      <>
        <SelectWrapper>
          <AsyncSelect
            defaultOptions={defaultOptions}
            loadOptions={loadOptions}
            value={value}
            isClearable
            placeholder="Search Creative..."
            onChange={(e) => onChange(e, field?.targeting_data?.[id]?.creative_selection_type, type, id, assetIndex)}
          />
        </SelectWrapper>
      </>
    );
  })
);

SelectCreative.propTypes = {
  id: PropTypes.any,
  assetIndex: PropTypes.any,
  onChange: PropTypes.func,
  field: PropTypes.object,
  addCreativeData: PropTypes.func,
  value: PropTypes.object,
};

export default SelectCreative;
