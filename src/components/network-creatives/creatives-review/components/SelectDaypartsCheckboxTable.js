import React from 'react';
import PropTypes from 'prop-types';

import CheckBox from '../../../CheckBox';

const SelectDaypartsCheckboxTable = (props) => {
  const {
    activeNetworkData,
    setActiveNetworkData,
    NetworkNameSpan,
    getDaypartInfo,
    addButtonClassName,
    createApprovalAction,
    TableButton,
  } = props;

  const handleDaypartCheckboxChange = (index) => {
    const _activeNetworkData = JSON.parse(JSON.stringify(activeNetworkData));
    _activeNetworkData.data.dayparts[index].isSelected = !_activeNetworkData.data.dayparts[index].isSelected;
    setActiveNetworkData(_activeNetworkData);
  };

  return activeNetworkData.data && activeNetworkData.data.id ? (
    <>
      {activeNetworkData.data.dayparts.length ? (
        <div>
          <div>
            <p className="fs15 mb10">
              For the network <NetworkNameSpan>{activeNetworkData.data.display_name}</NetworkNameSpan>, select the
              dayparts you want to approve
            </p>
          </div>
          <div className="flex-container2">
            <div className="flex-container1 fw-wrap">
              {activeNetworkData.data.dayparts.map((daypart, index) => (
                <CheckBox
                  isChecked={daypart.isSelected}
                  onChangeFunction={() => handleDaypartCheckboxChange(index)}
                  label={`${daypart.name} (${getDaypartInfo(daypart)})`}
                  key={`add_daypart_${index}`}
                ></CheckBox>
              ))}
            </div>
            <TableButton
              disabled={addButtonClassName(activeNetworkData.data)}
              className={addButtonClassName(activeNetworkData.data) ? 'disabled-button block-pointer' : ''}
              onClick={() => createApprovalAction('add')}
            >
              Add
            </TableButton>
          </div>
        </div>
      ) : (
        <p>No dayparts available for the selected network</p>
      )}
    </>
  ) : null;
};

SelectDaypartsCheckboxTable.propTypes = {
  activeNetworkData: PropTypes.object,
  NetworkNameSpan: PropTypes.object,
  setActiveNetworkData: PropTypes.func,
  getDaypartInfo: PropTypes.func,
  addButtonClassName: PropTypes.func,
  createApprovalAction: PropTypes.func,
  TableButton: PropTypes.object,
};

export default SelectDaypartsCheckboxTable;
