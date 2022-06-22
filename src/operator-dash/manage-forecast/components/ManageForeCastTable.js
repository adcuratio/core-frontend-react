import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../components/CustomButton';
import { processUTCtoEST } from '../../../common/utils';

const ManageForeCastTable = (props) => {
  const {
    manageForecastHeader,
    forecastData,
    activeTab,
    handleTableButtonAction,
    authStore,
    isLoading,
    nextPageUrl,
    handlePagination,
    tableRef,
  } = props;

  useEffect(() => {
    if (forecastData && forecastData.length) {
      const wrapperElem = document.getElementById('forecast-table-wrapper-top');
      const mainElem = document.getElementById('forecast-table-top');
      if (wrapperElem.clientHeight > mainElem.clientHeight && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  }, [forecastData]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
    if (bottom && !isLoading && nextPageUrl) {
      handlePagination();
    }
  };

  const renderTableContent = () => {
    if (forecastData && forecastData.length) {
      const tableContentComp = [];
      forecastData?.forEach((fdata) => {
        tableContentComp.push(
          <tr key={fdata.id}>
            <td>{fdata.advertiser || '---'}</td>
            <td>{fdata.data_source || '---'}</td>
            <td>{fdata.name || '---'}</td>
            <td>{fdata.segment_name}</td>
            <td>{fdata.dish_count?.toLocaleString()}</td>
            <td>{fdata.order_type}</td>
            <td>{fdata.forecasted_impressions?.toLocaleString() || 'NA'}</td>
            <td>
              {activeTab?.status === 0 ? (
                fdata.forecasted_impressions ? (
                  <div>
                    <p>
                      Entered By <br />
                      {fdata.impressions_entered_at &&
                        fdata.impressions_entered_by?.first_name.charAt(0).toUpperCase() +
                          fdata.impressions_entered_by?.first_name.slice(1)}{' '}
                      {fdata.impressions_entered_at &&
                        fdata.impressions_entered_by?.last_name.charAt(0).toUpperCase() +
                          fdata.impressions_entered_by?.last_name.slice(1)}{' '}
                      {fdata.impressions_entered_at
                        ? `at ${processUTCtoEST(fdata.impressions_entered_at)} ET`
                        : 'Not Available'}
                    </p>
                  </div>
                ) : (
                  <CustomButton
                    buttonText="Add"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('add_impressions', fdata)}
                  />
                )
              ) : fdata.forecasted_impressions ? (
                <div>
                  <p>
                    Entered By <br />
                    {fdata.impressions_entered_at &&
                      fdata.impressions_entered_by?.first_name.charAt(0).toUpperCase() +
                        fdata.impressions_entered_by?.first_name.slice(1)}{' '}
                    {fdata.impressions_entered_at &&
                      fdata.impressions_entered_by?.last_name.charAt(0).toUpperCase() +
                        fdata.impressions_entered_by?.last_name.slice(1)}{' '}
                    {fdata.impressions_entered_at
                      ? `at ${processUTCtoEST(fdata.impressions_entered_at)} ET`
                      : 'Not Available'}
                  </p>
                </div>
              ) : (
                '-'
              )}
            </td>
            <td>
              {activeTab.status === 0 &&
              fdata.forecasted_impressions &&
              fdata.impressions_entered_at &&
              fdata.impressions_entered_by?.id !== authStore.getUser()?.related_data?.operator_admin_id ? (
                <div>
                  <CustomButton
                    buttonText="Approve"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('approve', fdata)}
                  />
                  <CustomButton
                    buttonText="Decline"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('decline', fdata)}
                  />
                </div>
              ) : null}
              {activeTab.status === 0 &&
              fdata.forecasted_impressions &&
              fdata.impressions_entered_at &&
              fdata.impressions_entered_by?.id === authStore.getUser()?.related_data?.operator_admin_id
                ? 'Pending Confirmation'
                : null}
              {activeTab.status === 0 && !fdata.forecasted_impressions ? 'Forecast Impression is not set' : null}
              {activeTab.status !== 0
                ? `Approved by ${
                    fdata.approved_by?.first_name.charAt(0).toUpperCase() + fdata.approved_by?.first_name.slice(1)
                  } ${
                    fdata.approved_by?.last_name.charAt(0).toUpperCase() + fdata.approved_by?.last_name.slice(1)
                  } at ${processUTCtoEST(fdata.approved_at)}ET`
                : null}
            </td>
            <td>
              <CustomButton
                buttonText="Details"
                buttonClassName="tradebtn"
                handleButtonClick={() => handleTableButtonAction('forecast_details', fdata)}
              />
            </td>
          </tr>
        );
      });

      !tableContentComp.length &&
        tableContentComp.push(
          <tr>
            <td colSpan={manageForecastHeader.length} className="text-align-center-imp bg-main">
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
            <td colSpan={manageForecastHeader.length} className="text-align-center-imp bg-main">
              Loading...
            </td>
          </tr>
        ) : (
          <tr key="forecast-null-data">
            <td colSpan={manageForecastHeader.length} className="text-align-center-imp bg-main">
              No data available.
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div
      id="forecast-table-wrapper-top"
      style={{ height: '78vh', overflow: 'auto' }}
      onScroll={(e) => handleScroll(e)}
      ref={tableRef}
    >
      <table id="forecast-table-top" className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
        <thead>
          <tr>
            {manageForecastHeader.map((title) => (
              <th key={title.id}>
                <span className="mr10">{title.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderTableContent()}</tbody>
      </table>
    </div>
  );
};
ManageForeCastTable.propTypes = {
  manageForecastHeader: PropTypes.array,
  forecastData: PropTypes.array,
  activeTab: PropTypes.object,
  handleTableButtonAction: PropTypes.func,
  isLoading: PropTypes.bool,
  authStore: PropTypes.object,
  tableRef: PropTypes.object,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
};
ManageForeCastTable.defaultProps = {
  manageForecastHeader: [],
  forecastData: [],
  activeTab: {},
  handleTableButtonAction: () => {},
  authStore: {},
  isLoading: false,
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default ManageForeCastTable;
