import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../components/CustomButton';

const TableContainerMain = (props) => {
  const { networkLogsTableTitles, viewPlan, filteredTraffickingPlansData } = props;

  return (
    <div>
      <table className="table table-striped table-wrapper wrapped-table table-elem-center table-heavyborder">
        <thead>
          <tr>
            {networkLogsTableTitles?.map((heading) => (
              <th key={heading.id}>{heading.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTraffickingPlansData?.map((rowData) => (
            <tr key={rowData.id}>
              <td>{rowData.dateString}</td>
              <td>{rowData.network_name}</td>
              <td>{rowData.file_name}</td>
              <td>{`${rowData.created} ET`}</td>
              <td>
                <CustomButton
                  buttonText="View"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => viewPlan(rowData)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!filteredTraffickingPlansData.length && (
        <div key="no_data_found" className="text-center-imp">
          No logs has been uploaded in this month.
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
  viewPlan: PropTypes.func,
};

TableContainerMain.defaultProps = {
  traffickingPlansData: [],
  networkLogsTableTitles: [],
  filteredTraffickingPlansData: [],
  uiStore: {},
  viewPlan: () => {},
};

export default TableContainerMain;
