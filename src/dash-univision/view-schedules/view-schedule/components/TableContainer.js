import React from 'react';
import PropTypes from 'prop-types';

const TableContainerMain = (props) => {
  const { networkLogsTableTitles, filteredTraffickingPlansData } = props;

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
