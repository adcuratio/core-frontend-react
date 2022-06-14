import React from 'react';
import PropTypes from 'prop-types';

const TableContainer = (props) => {
  const {
    selectedColumnOption,
    newAneLogJsonData,
    toggleTooltip,
    isTooltipShow,
    currentMouseLocation,
    handleColumnRemovalThroughTooltip,
    selectedPlanToView,
  } = props;

  return selectedColumnOption && selectedColumnOption.length ? (
    <table className="table table-striped table-wrapper mt10 text-align-center-imp table-layout-auto table-heavyborder">
      <thead>
        <tr>
          {newAneLogJsonData?.map((heading, id) => {
            if (heading.isSelected) {
              return (
                <th key={`${id}plan`} onMouseOver={() => toggleTooltip(heading, true)} onMouseLeave={toggleTooltip}>
                  {heading.name}
                  {isTooltipShow && currentMouseLocation === heading.id && (
                    <span onClick={() => handleColumnRemovalThroughTooltip(heading)}>
                      <i className="fa fa-minus-square ml5 cursor-pointer"></i>
                    </span>
                  )}
                </th>
              );
            }
            return null;
          })}
        </tr>
      </thead>
      <tbody>
        {selectedPlanToView.length ? (
          selectedPlanToView?.map((plan, idx) => (
            <tr key={`${idx} plan_data`}>
              {newAneLogJsonData?.map((heading, id) => {
                if (heading.isSelected) {
                  return <td key={`${id} plan_col`}>{plan[heading.dataProp]}</td>;
                }
                return null;
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={newAneLogJsonData?.filter((heading) => heading.isSelected).length}>
              <div key="no_data_found" className="text-fixed-position">
                No data found
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  ) : (
    <div key="no_col_selected" className="text-center-imp">
      No column selected
    </div>
  );
};

TableContainer.propTypes = {
  selectedColumnOption: PropTypes.array,
  newAneLogJsonData: PropTypes.array,
  toggleTooltip: PropTypes.func,
  isTooltipShow: PropTypes.bool,
  currentMouseLocation: PropTypes.string,
  handleColumnRemovalThroughTooltip: PropTypes.func,
  selectedPlanToView: PropTypes.array,
};

TableContainer.defaultProps = {
  selectedColumnOption: [],
  newAneLogJsonData: [],
  toggleTooltip: () => {},
  isTooltipShow: false,
  currentMouseLocation: '',
  handleColumnRemovalThroughTooltip: () => {},
  selectedPlanToView: [],
};

export default TableContainer;
