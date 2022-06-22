import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CustomButton from '../../../components/CustomButton';
import TableAccordion from './TableAccordion';
import styled from 'styled-components';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

const StyledTable = styled.table`
  .accordion-table-cell {
    padding: 0px !important;
    height: 0px !important;
  }
  thead > tr > th,
  tbody > tr > td {
    text-align: center;
  }

  .bg-none {
    background: none !important;
  }
`;

const ManageTable = (props) => {
  const {
    activeTab,
    tableHeaderList,
    orderCategorizedList,
    onToggle,
    onViewOrderlines,
    onViewInventory,
    onClickAction,
    activeAccordion,
    orderDetails,
    getVideoUrlForAccordion,
    isLoadingAccordion,
    isLoadingTable,
    accrodionHeaderList,
    isToolTip,
    isVizioDash,
    selectedOrder,
    onDownloadInventoryDetails,
  } = props;

  const [showTooltip, setShowTooltip] = useState(true);

  const tableHeader = () => (
    <tr>
      {tableHeaderList.map((header) => (
        <th key={`header${header.id}`}>{header.name}</th>
      ))}
    </tr>
  );

  // component exends mouse events
  // to show/hide tooltip
  const ExtendedButton = (props) => (
    <CustomButton onMouseEnter={() => setShowTooltip(false)} onMouseLeave={() => setShowTooltip(true)} {...props} />
  );

  const tooltip = (
    <Tooltip id="tooltip" style={{ marginTop: '0' }}>
      Click to view more details
    </Tooltip>
  );

  const getToolTipPlacement = (index) => (index === 0 ? 'bottom' : 'top');

  const handleRemoveBtnClick = (e) => e.stopPropagation();

  const tableRow = (order) => (
    <tr
      key={`order${order.id}`}
      className="cursor-pointer"
      onClick={() => {
        onToggle(order);
      }}
      onMouseEnter={() => !showTooltip && setShowTooltip(true)}
    >
      {(activeTab.id === 'approved' || activeTab.id === 'completed') && <td>{order.order_id || '---'}</td>}
      <td>{order.inventory_owner}</td>
      <td>{order.agency || '---'}</td>
      <td>{order.advertiser_name || '---'}</td>
      <td>{order.brand || '---'}</td>
      <td className="bold">{order.order_name || '---'}</td>
      <td>{order.number_of_creatives || '---'}</td>
      <td>{order.order_type || '---'}</td>
      {activeTab.id === 'pending' ? (
        <>
          {!isVizioDash && (
            <td>
              <ExtendedButton
                buttonText="View"
                buttonClassName="tradebtn"
                handleButtonClick={(e) => {
                  onViewOrderlines(e, order, false);
                }}
              />
            </td>
          )}
          <td>
            <ExtendedButton
              buttonText="Approve"
              buttonClassName="tradebtn"
              handleButtonClick={(e) => onClickAction(e, 'approve', order)}
            />
            <ExtendedButton
              buttonText="Decline"
              buttonClassName="tradebtn"
              handleButtonClick={(e) => onClickAction(e, 'decline', order)}
            />
          </td>
        </>
      ) : (activeTab.id === 'approved' || activeTab.id === 'completed') && !isVizioDash ? (
        <>
          <td>
            <div>
              <ExtendedButton
                buttonText="View"
                buttonClassName="tradebtn"
                handleButtonClick={(e) => {
                  onViewOrderlines(e, order, true);
                }}
              />
            </div>
            <div>
              {activeTab.id === 'approved' && activeTab.id !== 'completed' ? (
                order?.unapproved !== 0 ? (
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="standard-campaign-tooltip">
                        <div>
                          <span className="f12">{order?.unapproved} Order line is pending </span>
                        </div>
                      </Tooltip>
                    }
                  >
                    <i className="fa fa-exclamation-circle count-icon" />
                  </OverlayTrigger>
                ) : null
              ) : null}
            </div>
          </td>
          {order.order_type !== 'Aggregation' && (activeTab.id === 'approved' || activeTab.id === 'completed') ? (
            <td>
              <ExtendedButton
                buttonText="View"
                buttonClassName="tradebtn"
                handleButtonClick={(e) => onViewInventory(e, order)}
              />
              <ExtendedButton
                buttonText="Download"
                buttonClassName="tradebtn"
                handleButtonClick={(e) => onDownloadInventoryDetails(e, order)}
              />
            </td>
          ) : (
            <td>
              <p>N/A</p>
            </td>
          )}
        </>
      ) : activeTab.id === 'declined' ? (
        <>
          <td>{order.decline_comment}</td>

          {!isVizioDash && (
            <td>
              <ExtendedButton
                buttonText="View"
                buttonClassName="tradebtn"
                handleButtonClick={(e) => onViewOrderlines(e, order)}
              />
            </td>
          )}
        </>
      ) : activeTab.id === 'pending processing' ? (
        <>
          <td>{order.error}</td>
          <td>
            <ExtendedButton
              buttonText="Resubmit"
              buttonClassName={`tradebtn ${order.order_status === 6 ? 'disabled non-cursor' : 'active'}`}
              handleButtonClick={
                order.order_status === 7 ? (e) => onClickAction(e, 'resubmit', order) : (e) => handleRemoveBtnClick(e)
              }
            />
            <ExtendedButton
              buttonText="Decline"
              buttonClassName={`tradebtn ${order.order_status === 6 ? 'disabled non-cursor' : 'active'}`}
              handleButtonClick={
                order.order_status === 7 ? (e) => onClickAction(e, 'decline', order) : (e) => handleRemoveBtnClick(e)
              }
            />
          </td>
        </>
      ) : null}
    </tr>
  );

  const tableBody = () => {
    let oList = [];
    if (activeTab.id === 'pending') {
      oList = orderCategorizedList.pendingOrders;
    } else if (activeTab.id === 'approved') {
      oList = orderCategorizedList.activeOrders;
    } else if (activeTab.id === 'declined') {
      oList = orderCategorizedList.cancelledOrders;
    } else if (activeTab.id === 'completed') {
      oList = orderCategorizedList.completedOrders;
    } else if (activeTab.id === 'pending processing') {
      oList = orderCategorizedList.pendingProcessingOrders;
    }
    const tableComp = [];
    if (oList && oList.length) {
      oList.forEach((order, index) => {
        const isAccordionActive = order.id && activeAccordion === order.id;

        // disable overlay if any condition is true
        const disableOverlay = !showTooltip || isAccordionActive || !isToolTip;
        tableComp.push(
          <React.Fragment key={`table-row${order.id}`}>
            {disableOverlay ? (
              tableRow(order)
            ) : (
              <OverlayTrigger overlay={tooltip} delayShow={1000} placement={getToolTipPlacement(index)}>
                {tableRow(order)}
              </OverlayTrigger>
            )}
            {isAccordionActive ? (
              <tr key={`accordion${order.id}`}>
                <td colSpan={tableHeaderList.length} className="accordion-table-cell">
                  <TableAccordion
                    activeAccordion={activeAccordion === order.id}
                    accordianContent={orderDetails}
                    getVideoUrlForAccordion={getVideoUrlForAccordion}
                    isLoadingAccordion={isLoadingAccordion}
                    accrodionHeaderList={accrodionHeaderList}
                    isVizioAccordion={isVizioDash}
                    selectedOrder={selectedOrder}
                  />
                </td>
              </tr>
            ) : null}
          </React.Fragment>
        );
      });
    } else {
      tableComp.push(
        <tr key={`no_data${activeTab.id}`} className="bg-none">
          <td colSpan={tableHeaderList.length}>No {activeTab.id} orders.</td>
        </tr>
      );
    }
    return tableComp;
  };

  return (
    <StyledTable id="table_top" className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
      <thead>{tableHeader()}</thead>
      {!isLoadingTable ? <tbody>{tableBody()}</tbody> : null}
    </StyledTable>
  );
};

ManageTable.propTypes = {
  activeTab: PropTypes.object,
  tableHeaderList: PropTypes.array,
  orderCategorizedList: PropTypes.object,
  onToggle: PropTypes.func,
  onViewOrderlines: PropTypes.func,
  onViewInventory: PropTypes.func,
  onClickAction: PropTypes.func,
  orderDetails: PropTypes.object,
  isLoadingTable: PropTypes.bool,
  isToolTip: PropTypes.bool,
  activeAccordion: PropTypes.any,
  getVideoUrlForAccordion: PropTypes.func,
  isLoadingAccordion: PropTypes.bool,
  accrodionHeaderList: PropTypes.array,
  isVizioDash: PropTypes.bool,
  selectedOrder: PropTypes.object,
  onDownloadInventoryDetails: PropTypes.func,
};

ManageTable.defaultProps = {
  activeTab: {},
  tableHeaderList: [],
  orderCategorizedList: {},
  onToggle: () => {},
  onViewOrderlines: () => {},
  onViewInventory: () => {},
  onClickAction: () => {},
  orderDetails: {},
  isLoadingTable: false,
  isToolTip: true,
  activeAccordion: {},
  getVideoUrlForAccordion: () => {},
  isLoadingAccordion: false,
  accrodionHeaderList: [],
  isVizioDash: false,
  selectedOrder: {},
  onDownloadInventoryDetails: () => {},
};

export default ManageTable;
