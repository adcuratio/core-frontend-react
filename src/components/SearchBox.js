import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

export const SearchBoxWrapper = styled.div`
  width: 285px;
  border: 1px solid black;
  display: flex;
`;

export const SearchBoxInput = styled.input`
  width: 88% !important;
  border: none !important;
  border-right: 1px solid #b4b8bb !important;
`;

export const SearchButton = styled.button`
  width: 13% !important;
  border: none;
  background-color: #fff;
  padding: 0;
`;

export const RemoveIcon = styled.i`
  font-size: 15px;
`;

const SearchBox = (props) => {
  const {
    searchValue,
    handleSearchTextChange,
    cssClassName,
    onEnter,
    onClear,
  } = props;

  const onClearInputValue = () => {
    handleSearchTextChange("");
    onClear("");
  };

  return (
    <SearchBoxWrapper className={cssClassName}>
      <SearchBoxInput
        type="text"
        className="search-box"
        value={searchValue}
        onChange={(e) => handleSearchTextChange(e.target.value)}
        onKeyUp={(event) => {
          if (event.keyCode === 13) {
            event.preventDefault();
            onEnter(event.target.value);
          }
        }}
        autocomplete="off"
      />
      <SearchButton type="submit" onClick={onClearInputValue}>
        <RemoveIcon className="fa fa-times"></RemoveIcon>
      </SearchButton>
    </SearchBoxWrapper>
  );
};

SearchBox.propTypes = {
  searchValue: PropTypes.string,
  handleSearchTextChange: PropTypes.func,
  cssClassName: PropTypes.string,
  onEnter: PropTypes.func,
  onClear: PropTypes.func,
};

SearchBox.defaultProps = {
  searchValue: "",
  handleSearchTextChange: () => {},
  cssClassName: "",
  onEnter: () => {},
  onClear: () => {},
};

export default SearchBox;
