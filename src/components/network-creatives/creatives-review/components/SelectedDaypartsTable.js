import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';

import CheckBox from '../../../CheckBox';
import CustomButton from '../../../CustomButton';

const CrossButton = styled.div`
  font-size: 22px;
  cursor: pointer;
`;

const SelectedDaypartsTable = (props) => {
  const {
    selectedNetworkList,
    getDaypartInfo,
    createApprovalAction,
    editDaypartsData,
    editDaypartsDataCpy,
    NetworkNameSpan,
    closeEditAccordian,
    setEditDaypartsData,
    TableButton,
    addButtonClassName,
  } = props;

  const handleEditDaypartsDataChange = (index) => {
    const _editDaypartsData = JSON.parse(JSON.stringify(editDaypartsData));
    _editDaypartsData.dayparts[index].isSelected = !_editDaypartsData.dayparts[index].isSelected;
    setEditDaypartsData(_editDaypartsData);
  };

  return selectedNetworkList && selectedNetworkList.length ? (
    <>
      <table className="table table-wrapper mt10 wrapped-table">
        <thead>
          <tr>
            <th>Selected Network</th>
            <th colSpan={2}>Selected Dayparts</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedNetworkList.map((selectedNetwork, index) => (
            <React.Fragment key={`selected_network_${index}`}>
              <tr>
                <td>{selectedNetwork.display_name}</td>
                <td colSpan={2}>
                  {selectedNetwork.dayparts.map(
                    (daypart, daypart_index) =>
                      daypart.isSelected && (
                        <p key={`daypart_${daypart_index}`}>
                          * {daypart.name} ({getDaypartInfo(daypart)})
                        </p>
                      )
                  )}
                </td>
                <td>
                  <CustomButton
                    buttonClassName="tradebtn"
                    buttonText="Edit Dayparts"
                    handleButtonClick={() => {
                      createApprovalAction('edit', selectedNetwork);
                    }}
                  ></CustomButton>
                  {!selectedNetwork.isNonRemovable && (
                    <CustomButton
                      buttonClassName="tradebtn"
                      buttonText="Remove Network"
                      handleButtonClick={() => {
                        createApprovalAction('remove', selectedNetwork);
                      }}
                    ></CustomButton>
                  )}
                </td>
              </tr>
              {editDaypartsData && editDaypartsData.id && editDaypartsData.id === selectedNetwork.id && (
                <tr>
                  <td colSpan={4} className="bt-none-imp">
                    <div className="m10">
                      <div className="flex-container2">
                        <p className="fs15 mb10">
                          For the network <NetworkNameSpan>{editDaypartsData.display_name}</NetworkNameSpan>, select the
                          dayparts you want to approve
                        </p>
                        <CrossButton onClick={closeEditAccordian}>&times;</CrossButton>
                      </div>
                      <div className="flex-container1">
                        <div className="flex-container1 fw-wrap">
                          {editDaypartsData.dayparts.map((daypart, index) => (
                            <CheckBox
                              isChecked={daypart.isSelected}
                              onChangeFunction={() => handleEditDaypartsDataChange(index)}
                              label={`${daypart.name} (${getDaypartInfo(daypart)})`}
                              key={`edit_daypart_${index}`}
                              isDisabled={daypart.isTradeActive}
                            ></CheckBox>
                          ))}
                        </div>
                        <TableButton
                          className={
                            addButtonClassName(editDaypartsData) || _.isEqual(editDaypartsData, editDaypartsDataCpy)
                              ? 'disabled-button block-pointer'
                              : ''
                          }
                          disabled={
                            addButtonClassName(editDaypartsData) || _.isEqual(editDaypartsData, editDaypartsDataCpy)
                          }
                          onClick={() => createApprovalAction('add_edited_data')}
                        >
                          Edit
                        </TableButton>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  ) : null;
};

SelectedDaypartsTable.propTypes = {
  selectedNetworkList: PropTypes.array,
  getDaypartInfo: PropTypes.func,
  createApprovalAction: PropTypes.func,
  editDaypartsData: PropTypes.object,
  editDaypartsDataCpy: PropTypes.object,
  NetworkNameSpan: PropTypes.object,
  closeEditAccordian: PropTypes.func,
  setEditDaypartsData: PropTypes.func,
  TableButton: PropTypes.object,
  addButtonClassName: PropTypes.func,
};

export default SelectedDaypartsTable;
