import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatNumber } from '../../../../common/utils';

import CustomButton from '../../../../components/CustomButton';
import { PageTitle } from '../../../../components/Typography';
import { MainContent, PageHeader } from '../../../../components/PageLayout';

const TableWrapper = styled.div`
  height: 78vh;
  overflow: auto;
  width: 100%;
`;

const TableContainer = (props) => {
  const {
    postCampaignDayPartTitles,
    postCampaignNetworkList,
    downloadDaypartReport,
    id,
    setId,
    nextPageUrl,
    handlePagination,
    isLoading,
    backButton,
  } = props;

  const handleScroll = (e) => {
    if (e.target.id === 'table_wrapper_top') {
      const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
      if (bottom && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  };

  // Function to map the header list and apply sort
  const renderTableHeader = () => {
    if (postCampaignDayPartTitles?.length) {
      const headerComp = [];
      postCampaignDayPartTitles.forEach((title) => {
        headerComp.push(<th key={title.id}>{title.name}</th>);
      });
      return headerComp;
    }
    return null;
  };

  // Function to show the table content
  const renderTableContent = () => {
    if (postCampaignNetworkList?.length) {
      const tableContentComp = [];
      postCampaignNetworkList?.forEach((data, index) => {
        tableContentComp.push(
          <tr key={index}>
            <td>{data.advertiser_name ?? 'N/A'}</td>
            <td>{data.campaign_name ?? 'N/A'}</td>
            <td>{data.upstream_id ?? 'N/A'}</td>
            <td>{data.campaign_start_date?.split('/')?.join('-') ?? 'N/A'}</td>
            <td>{data.campaign_end_date?.split('/')?.join('-') ?? 'N/A'}</td>
            <td>{data.tv_market ?? 'N/A'}</td>
            <td>{data.market ?? 'N/A'}</td>
            <td>{formatNumber(data.impressions) ?? 'N/A'}</td>
          </tr>
        );
      });
      return tableContentComp;
    }
    return null;
  };

  return (
    <MainContent>
      {id === 'daypart_report' ? (
        <PageHeader>
          <PageTitle>Post Campaign By DMA</PageTitle>
        </PageHeader>
      ) : null}
      {(id === 'daypart_report' && postCampaignNetworkList?.length) || postCampaignNetworkList?.length ? (
        <div className="pull-right mb10">
          <CustomButton buttonText="Download" type="primary" handleButtonClick={() => downloadDaypartReport()} />
        </div>
      ) : null}

      <div className="pull-right mb10" style={{ marginRight: '10px' }}>
        <CustomButton
          buttonText="Back"
          type="primary"
          handleButtonClick={() => {
            setId('');
            backButton();
          }}
        />
      </div>

      <TableWrapper id="table_wrapper_top" onScroll={(e) => handleScroll(e)}>
        <table id="table_top" className="table table-striped table-wrapper wrapped-table table-heavyborder">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
        {!postCampaignNetworkList.length && (
          <div key="no_data_found" className="text-center-imp">
            No data available.
          </div>
        )}
      </TableWrapper>
    </MainContent>
  );
};

TableContainer.propTypes = {
  postCampaignDayPartTitles: PropTypes.array,
  postCampaignNetworkList: PropTypes.array,
  downloadDaypartReport: PropTypes.func,
  id: PropTypes.string,
  setId: PropTypes.func,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  isLoading: PropTypes.bool,
  backButton: PropTypes.func,
};

TableContainer.defaultProps = {
  postCampaignDayPartTitles: [],
  postCampaignNetworkList: [],
  id: '',
  setId: () => {},
  backButton: () => {},
};

export default TableContainer;
