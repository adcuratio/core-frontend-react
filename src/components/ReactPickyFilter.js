import React from "react";
import PropTypes from "prop-types";
import { Picky } from "react-picky";
import styled from "styled-components";

import "react-picky/dist/picky.css";

export const PickyWrapper = styled.div`
  width: 18vw;
  margin-left: 10px;
  .picky__dropdown .option.selected,
  .picky__dropdown li.selected {
    background-color: #fff !important;
  }
`;

const ReactPickyFilter = (props) => {
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
        includeSelectAll={true}
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

ReactPickyFilter.propTypes = {
  onFilterChange: PropTypes.func,
  allOptions: PropTypes.array,
  selectedData: PropTypes.array,
  selectAllText: PropTypes.string,
  allSelectedPlaceholder: PropTypes.string,
  id: PropTypes.string.isRequired,
  placeholderText: PropTypes.string,
};

ReactPickyFilter.defaultProps = {
  onFilterChange: () => {},
  allOptions: [],
  selectedData: [],
  selectAllText: "Select All Data",
  allSelectedPlaceholder: "All Data",
};

export default ReactPickyFilter;
