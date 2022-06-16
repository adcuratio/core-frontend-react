import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SelectWrapper = styled.div`
  border-radius: 0px !important;
  border-width: 0px;
`;

export const customStyles = {
  control: (styles) => ({ ...styles, backgroundColor: 'white', borderRadius: 0, height: '20px' }),
  valueContainer: (styles) => ({
    ...styles,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  }),
};

const ReactSelectFilter = (props) => {
  const { onHandleChange, allData, selectedData } = props;

  return (
    <SelectWrapper>
      <Select
        styles={customStyles}
        value={selectedData ? allData.filter((data) => selectedData?.includes(data.id)) : []}
        isMulti
        name="colors"
        options={allData}
        className="basic-multi-select"
        placeholder="Select Show Name"
        onChange={onHandleChange}
      />
    </SelectWrapper>
  );
};

ReactSelectFilter.propTypes = {
  onHandleChange: PropTypes.func,
  selectedData: PropTypes.array,
  allData: PropTypes.array,
};

export default ReactSelectFilter;
