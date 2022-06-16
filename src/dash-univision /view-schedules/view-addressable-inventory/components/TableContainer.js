import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../../components/CustomButton';
// import { formatNumber } from '../../../../common/utils';

const TableContainerMain = (props) => {
  const { networkLogsTableTitles, filteredTraffickingPlansData, viewDetails } = props;

  const toHHMMSS = (seconds) => {
    let m = 0;
    let s = 0;
    m = Math.floor(seconds / 60);
    s = seconds - m * 60;
    return `${m}m ${s}sec`;
  };

  return (
    <div>
      <table className="table table-striped table-wrapper wrapped-table table-elem-center table-heavyborder">
        <thead>
          <tr>
            {networkLogsTableTitles?.map((heading) => (
              <th key={heading.id} colSpan={heading.colSpan}>
                {heading.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTraffickingPlansData?.map((rowData) => (
            <tr key={rowData.id}>
              <td>{rowData.dateString}</td>
              <td>{rowData.network_name}</td>
              {/* <td>
                <div className="">
                  {formatNumber(rowData.total_units)}
                  {rowData.total_units !== 0 && (
                    <CustomButton
                      buttonText="View All"
                      buttonClassName="tradebtn ml15"
                      handleButtonClick={() => viewDetails('total_units', rowData)}
                    />
                  )}
                </div>
              </td> */}
              <td colSpan="2">
                <div className="">
                  {rowData.total_buyback !== null ? toHHMMSS(rowData.total_buyback) : '-'}
                  {rowData.total_buyback && (
                    <CustomButton
                      buttonText="View BB"
                      buttonClassName="tradebtn ml15"
                      handleButtonClick={() => viewDetails('total_buyback', rowData)}
                    />
                  )}
                </div>
              </td>
              <td colSpan="2">
                <div className="">
                  {rowData.total_promo !== null ? toHHMMSS(rowData.total_promo) : '-'}
                  {rowData.total_promo !== null ? (
                    <CustomButton
                      buttonText="View TP"
                      buttonClassName="tradebtn ml15"
                      handleButtonClick={() => viewDetails('total_tp', rowData)}
                    />
                  ) : null}
                </div>
              </td>
              <td>{`${rowData.created} ET`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filteredTraffickingPlansData.length && (
        <div key="no_data_found" className="text-center-imp">
          No data available for the selected month
        </div>
      )}
    </div>
  );
};

TableContainerMain.propTypes = {
  traffickingPlansData: PropTypes.array,
  networkLogsTableTitles: PropTypes.array,
  filteredTraffickingPlansData: PropTypes.array,
  uiStore: PropTypes.object,
  viewDetails: PropTypes.func,
};

TableContainerMain.defaultProps = {
  traffickingPlansData: [],
  networkLogsTableTitles: [],
  filteredTraffickingPlansData: [],
  uiStore: {},
  viewPlan: () => {},
};

export default TableContainerMain;
