import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

import { PageTitle } from '../../../components/Typography';
import CustomButton from '../../../components/CustomButton';
import ReactPickyFilter from '../../../components/ReactPickyFilter';
import SearchBox from '../../../components/SearchBox';

export const Search = styled.div`
  @media only screen and (max-width: 1440px) {
    width: 18vw;
    display: flex;
  }
`;

const MessagingGroupHeader = (props) => {
  const {
    advFilterAllData,
    advFilterSelectedData,
    brandFilterAllData,
    brandFilterSelectedData,
    applyFilter,
    handleDefineMessagingGroup,
    onPageRefresh,
    handleSearchTextChange,
    searchValue,
    isReadonly,
  } = props;

  return (
    <>
      <Row>
        <PageTitle className="mt5 ml10">Messaging Groups</PageTitle>
      </Row>
      <Row>
        <div className="flex-container2 mt10">
          <Col>
            <div className="flex-container1">
              <ReactPickyFilter
                allOptions={advFilterAllData}
                selectedData={advFilterSelectedData}
                onFilterChange={applyFilter}
                id="adv_filter"
                selectAllText="Select All Advertisers"
                allSelectedPlaceholder="All Advertisers"
              />

              <ReactPickyFilter
                allOptions={brandFilterAllData}
                selectedData={brandFilterSelectedData}
                onFilterChange={applyFilter}
                id="brand_filter"
                selectAllText="Select All Brands"
                allSelectedPlaceholder="All Brands"
              />
              <Search className="ml10">
                <SearchBox searchValue={searchValue} handleSearchTextChange={handleSearchTextChange} />
              </Search>
            </div>
          </Col>
          <Col>
            <div className="flex-container6">
              <CustomButton
                type="primary"
                buttonClassName="ml10"
                buttonText="Define Messaging Group"
                handleButtonClick={() => handleDefineMessagingGroup()}
                isDisabled={isReadonly}
              />

              <CustomButton
                type="primary"
                buttonText="Refresh"
                buttonClassName="m10 mr15"
                handleButtonClick={() => onPageRefresh()}
              />
            </div>
          </Col>
        </div>
      </Row>
    </>
  );
};

MessagingGroupHeader.propTypes = {
  advFilterAllData: PropTypes.array,
  advFilterSelectedData: PropTypes.array,
  applyFilter: PropTypes.func,
  brandFilterAllData: PropTypes.array,
  brandFilterSelectedData: PropTypes.array,
  handleDefineMessagingGroup: PropTypes.func,
  onPageRefresh: PropTypes.func,
  handleSearchTextChange: PropTypes.func,
  searchValue: PropTypes.string,
  isReadonly: PropTypes.bool,
};

MessagingGroupHeader.defaultProps = {
  handleDefineMessagingGroup: () => {},
  advFilterAllData: [],
  advFilterSelectedData: [],
  brandFilterAllData: [],
  brandFilterSelectedData: [],
  applyFilter: () => {},
  onPageRefresh: () => {},
  handleSearchTextChange: () => {},
  searchValue: '',
};

export default MessagingGroupHeader;
