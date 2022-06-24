import React from "react";
import PropTypes from "prop-types";
import { DropdownButton, MenuItem } from "react-bootstrap";

import ReactPickyFilter from "../../../components/ReactPickyFilter";
// import SearchBox from '../../../components/SearchBox';
import CustomButton from "../../../components/CustomButton";

const Header = (props) => {
  const {
    selectedMonth,
    monthDate,
    setMonth,
    networkFilterData,
    selectedNetworkFilterData,
    handleNetworkSelect,
    // handleSearch,
    // searchValue,
    // toggleModal,
    onPageRefresh,
  } = props;
  console.log(monthDate);
  return (
    <div className="flex-container2 mb20 mt20">
      <div className="flex-container1 dropdown-scrollable">
        <span>Select Month:</span>
        <DropdownButton
          title={selectedMonth || "select"}
          id="networkSelect"
          className="mt5"
        >
          {monthDate?.map((month, idx) => (
            <MenuItem
              key={`${idx} months`}
              onSelect={() => setMonth(month)}
              active={month === selectedMonth}
            >
              {month}
            </MenuItem>
          ))}
        </DropdownButton>
        <span className="ml10">Select Network:</span>
        <ReactPickyFilter
          allOptions={networkFilterData}
          selectedData={selectedNetworkFilterData}
          onFilterChange={handleNetworkSelect}
          id="network-select"
          selectAllText="Select All Networks"
          allSelectedPlaceholder="All Networks"
        />
      </div>
      <div className="flex-container1">
        {/* <SearchBox handleSearchTextChange={handleSearch} searchValue={searchValue} /> */}
        {/* <CustomButton type="primary" buttonText="Upload" handleButtonClick={toggleModal} buttonClassName="ml10" /> */}
        <CustomButton
          type="primary"
          buttonText="Refresh"
          handleButtonClick={onPageRefresh}
          buttonClassName="ml10"
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  selectedMonth: PropTypes.string,
  setMonth: PropTypes.func,
  monthDate: PropTypes.array,
  networkFilterData: PropTypes.array,
  selectedNetworkFilterData: PropTypes.array,
  handleNetworkSelect: PropTypes.func,
  handleSearch: PropTypes.func,
  searchValue: PropTypes.string,
  toggleModal: PropTypes.func,
  onPageRefresh: PropTypes.func,
};

Header.defaultProps = {
  selectedMonth: "",
  setMonth: () => {},
  monthDate: [],
  networkFilterData: [],
  selectedNetworkFilterData: [],
  handleNetworkSelect: () => {},
  handleSearch: () => {},
  searchValue: "",
  toggleModal: () => {},
  onPageRefresh: () => {},
};

export default Header;
