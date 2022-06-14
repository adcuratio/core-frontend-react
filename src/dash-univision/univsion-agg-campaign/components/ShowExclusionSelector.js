import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import withStore from '../../../hocs/WithStore';

const SelectWrapper = styled.div`
  border-radius: 0px !important;
  border-width: 0px;
`;

export const customStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white', borderRadius: 0, height: '30px' }),
  valueContainer: (styles) => ({
    ...styles,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  }),
};

const ShowExclusionSelector = inject('aggCampaignStore')(
  observer((props) => {
    const { selectedData, onChange, aggCampaignStore } = props;
    const showsList = toJS(aggCampaignStore?.showNameList);

    return (
      <SelectWrapper>
        <Select
          styles={customStyles}
          value={selectedData ? showsList?.filter((data) => selectedData?.includes(data?.id)) : []}
          isMulti
          name="colors"
          options={showsList}
          className="basic-multi-select"
          placeholder="Select Show Name"
          onChange={onChange}
        />
      </SelectWrapper>
    );
  })
);

ShowExclusionSelector.propTypes = {
  selectedData: PropTypes.array,
  onChange: PropTypes.func,
};

export default withStore(ShowExclusionSelector);
