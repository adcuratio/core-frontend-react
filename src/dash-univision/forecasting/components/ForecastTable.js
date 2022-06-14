import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomButton from '../../../components/CustomButton';

const ForecastTable = (props) => {
  const {
    forecastTableTitles,
    forecastTableData,
    handleTableButtonAction,
    activeTab,
    isLoading,
    nextPageUrl,
    handlePagination,
    tableRef,
  } = props;

  useEffect(() => {
    if (forecastTableData && forecastTableData.length) {
      const wrapperElem = document.getElementById('forecast-table-wrapper-top');
      const mainElem = document.getElementById('forecast-table-top');
      if (wrapperElem.clientHeight > mainElem.clientHeight && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  }, [forecastTableData]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
    if (bottom && !isLoading && nextPageUrl) {
      handlePagination();
    }
  };

  const renderTableHeader = () => {
    if (forecastTableTitles && forecastTableTitles?.length) {
      const tableHeaderComp = [];
      forecastTableTitles?.forEach((title) => {
        tableHeaderComp.push(
          <th key={title?.id}>
            <span className="mr10">{title?.name}</span>
          </th>
        );
      });
      return tableHeaderComp;
    }
    return null;
  };

  const renderTableContent = () => {
    if (forecastTableData && forecastTableData.length) {
      const tableContentComp = [];
      forecastTableData?.forEach((forecast) => {
        tableContentComp.push(
          <tr key={forecast?.id}>
            <td>{forecast?.name}</td>
            <td>{forecast?.advertiser}</td>
            <td>{forecast?.data_source}</td>
            <td>{forecast?.segment_name}</td>
            <td>{forecast?.dish_count.toLocaleString()}</td>
            <td>{forecast?.order_type}</td>
            <td>{forecast?.forecasted_impressions?.toLocaleString() || `Pending`}</td>
            <td>
              <CustomButton
                buttonText="Details"
                buttonClassName="tradebtn"
                handleButtonClick={() => handleTableButtonAction('details', forecast)}
              />
              {activeTab?.status === 1 && (
                <CustomButton
                  buttonText="Archive"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('archive', forecast)}
                />
              )}
            </td>
          </tr>
        );
      });

      !tableContentComp.length &&
        tableContentComp.push(
          <tr key="forecast-null-data">
            <td colSpan={forecastTableTitles.length} className="text-align-center-imp bg-main">
              No data available.
            </td>
          </tr>
        );

      return tableContentComp;
    }
    return (
      <>
        {isLoading ? (
          <tr>
            <td colSpan={forecastTableTitles.length} className="text-align-center-imp bg-main">
              Loading...
            </td>
          </tr>
        ) : (
          <tr key="forecast-null-data">
            <td colSpan={forecastTableTitles.length} className="text-align-center-imp bg-main">
              No data available.
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <>
      <div
        id="forecast-table-wrapper-top"
        style={{ height: '78vh', overflow: 'auto' }}
        onScroll={(e) => handleScroll(e)}
        ref={tableRef}
      >
        <table
          id="forecast-table-top"
          className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder"
        >
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
      </div>
    </>
  );
};

ForecastTable.propTypes = {
  forecastTableTitles: PropTypes.array,
  forecastTableData: PropTypes.array,
  handleTableButtonAction: PropTypes.func,
  activeTab: PropTypes.object,
  isLoading: PropTypes.bool,
  tableRef: PropTypes.object,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
};

ForecastTable.defaultProps = {
  forecastTableTitles: [],
  forecastTableData: [],
  handleTableButtonAction: () => {},
  activeTab: {},
  isLoading: false,
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default ForecastTable;
