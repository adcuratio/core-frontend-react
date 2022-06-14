import React from 'react';
import PropTypes from 'prop-types';
import { Picky } from 'react-picky';
import styled from 'styled-components';

import 'react-picky/dist/picky.css';

export const PickyWrapper = styled.div`
  width: 200px;
  height: 30px;
  .picky__dropdown .option.selected,
  .picky__dropdown li.selected {
    background-color: #fff !important;
  }
`;

const AggPickyFilter = (props) => {
  const {
    onFilterChange,
    allOptions,
    selectedData,
    selectAllText,
    allSelectedPlaceholder,
    id,
    placeholderText,
    ...rest
  } = props;

  return (
    <PickyWrapper className="rct">
      <Picky
        id={id}
        options={allOptions}
        value={selectedData}
        multiple={true}
        includeSelectAll={false}
        onChange={(data) => onFilterChange(data, id)}
        selectAllText={selectAllText}
        allSelectedPlaceholder={allSelectedPlaceholder}
        numberDisplayed={0}
        disabled={allOptions?.length === 0}
        placeholder={placeholderText}
        {...rest}
      />
    </PickyWrapper>
  );
};

AggPickyFilter.propTypes = {
  onFilterChange: PropTypes.func,
  allOptions: PropTypes.array,
  selectedData: PropTypes.array,
  selectAllText: PropTypes.string,
  allSelectedPlaceholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholderText: PropTypes.string,
};

AggPickyFilter.defaultProps = {
  onFilterChange: () => {},
  allOptions: [],
  selectedData: [],
  selectAllText: 'Select All Data',
  allSelectedPlaceholder: 'All Data',
};

export default AggPickyFilter;
