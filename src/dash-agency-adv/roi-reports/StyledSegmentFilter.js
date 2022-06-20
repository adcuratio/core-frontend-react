import styled from 'styled-components';

const StyledWrapper = styled.div`
  -webkit-font-smoothing: antialiased;
  .segment-summary-content {
    height: 400px !important;
    overflow-y: auto !important;
  }

  .scrollable {
    // height: 350px !important;
    height: 430px !important;
    overflow-y: auto !important;
  }

  .create-new-seg-header {
    // margin-top: 15px;
    margin-top: 0px;
    border-bottom: none;
    padding-bottom: 0px;
  }

  //removed top bottom margin
  .quick-filter-summary {
    margin: 0px;
  }

  // remove horizontal issue
  .rc-slider {
    width: 98%;
  }

  .slider-shopper {
    margin-left: 32px;
  }

  .panel-title > a,
  .panel-title > a:hover {
    text-decoration: none;
  }
`;

export default StyledWrapper;
