import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

import { formatNumber } from '../../../common/utils';

const OrderlineActionModal = (props) => {
  const {
    isModalActive,
    closeModal,
    actionData,
    order,
    tableColumns,
    orderLines,
    orderType,
    sasoTableColumns,
    handleOrderlineStatus,
  } = props;
  const { actionType } = actionData;
  const renderTableHeader = () => {
    if (['Aggregation', 'MASO'].includes(orderType)) {
      const tableColumn = tableColumns?.map((column, index) => (
        <th key={index} className="table-heading">
          {column.title}
        </th>
      ));
      return tableColumn;
    } else if (['SASO'].includes(orderType)) {
      const sasoTableColumn = sasoTableColumns?.map((column, index) => (
        <th key={index} className="table-heading">
          {column.title}
        </th>
      ));
      return sasoTableColumn;
    }
  };

  const renderTableBody = () => {
    if (['Aggregation', 'MASO'].includes(orderType)) {
      const tableBody = !orderLines?.length ? (
        <tr>
          {
            <td colSpan={tableColumns?.length} className="bg-white">
              <p className="text-center mt40">No data found</p>
            </td>
          }
        </tr>
      ) : (
        orderLines?.map((item, index) => (
          <tr key={`tr${index}`}>
            <td>{order.advertiser_name || '---'}</td>
            <td style={{ textTransform: 'none' }}>{item.ad_id || '---'}</td>
            <td style={{ textTransform: 'lowercase' }}>{item.attr_code || '---'}</td>
            <td>{item?.desired_impressions ? formatNumber(item.desired_impressions) || '---' : '---'}</td>
            <td>{item.priority || '---'}</td>
            <td>{item.cpm || '---'}</td>
            <td>{item.segment_name || '---'}</td>
            <td>{item.data_provider || '---'}</td>
            <td>{item.audience_size ? formatNumber(item.audience_size) || '---' : '---'}</td>
            <td>{item.freq_cap_map_viewing?.count || '---'}</td>
            <td>
              {item.separations
                ? item.separations > 1
                  ? `${item.separations} Minutes`
                  : `${item.separations} Minute`
                : '---'}
            </td>
            <td>{item.activation_time}</td>
            <td>{item.deactivation_time}</td>
            <td>{item.orderline_id || '---'}</td>
            <td>
              {item.status === 'Canceled' ? (
                <p className="text-warning">{item.status}</p>
              ) : item.orderline_id === null ? (
                <>
                  {' '}
                  <CustomButton
                    buttonClassName="tradebtn capitalize"
                    buttonText="Approve"
                    handleButtonClick={(e) => handleOrderlineStatus(e, item.sales_id, 'orderlineApprove')}
                  />
                  <CustomButton
                    buttonClassName="tradebtn"
                    buttonText="Decline"
                    handleButtonClick={(e) => handleOrderlineStatus(e, item.sales_id, 'orderlineDecline')}
                  />
                </>
              ) : (
                <p className="text-success">{item.status}</p>
              )}
            </td>
          </tr>
        ))
      );
      return tableBody;
    } else {
      const tableBody = !orderLines?.length ? (
        <tr>
          {
            <td colSpan={sasoTableColumns?.length} className="bg-white">
              <p className="text-center mt40">No data found</p>
            </td>
          }
        </tr>
      ) : (
        orderLines?.map((item, index) => (
          <tr key={`tr${index}`}>
            <td>{order.advertiser_name || '---'}</td>
            <td style={{ textTransform: 'none' }}>{item.ad_ids || '---'}</td>
            <td>{item.sales_ids || '---'}</td>
            <td style={{ textTransform: 'lowercase' }}>{item.attr_code || '---'}</td>
            <td>{item.activation_time}</td>
            <td>{item.deactivation_time}</td>
            <td>{item.orderline_id || '---'}</td>
            <td>
              {item.status === 'Canceled' ? (
                <p className="text-warning">{item.status}</p>
              ) : item.orderline_id === null ? (
                <>
                  {' '}
                  <CustomButton
                    buttonClassName="tradebtn capitalize"
                    buttonText="Approve"
                    handleButtonClick={(e) => handleOrderlineStatus(e, item.sales_id, 'orderlineApprove')}
                  />
                  <CustomButton
                    buttonClassName="tradebtn"
                    buttonText="Decline"
                    handleButtonClick={(e) => handleOrderlineStatus(e, item.sales_id, 'orderlineDecline')}
                  />
                </>
              ) : (
                <p className="text-success">{item.status}</p>
              )}
            </td>
          </tr>
        ))
      );
      return tableBody;
    }
  };

  return (
    <Modal show={isModalActive} onHide={closeModal} dialogClassName="modal-98w">
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">{order.order_name}</span>
          <span className="capitalize ml5">{`${actionType}`?.split('_')?.join(' ')}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

OrderlineActionModal.propTypes = {
  isModalActive: PropTypes.bool,
  closeModal: PropTypes.func,
  handleOrderlineStatus: () => PropTypes.func,
  actionData: PropTypes.object,
  tableColumns: PropTypes.array,
  orderLines: PropTypes.array,
  order: PropTypes.object,
  orderType: PropTypes.string,
  sasoTableColumns: PropTypes.array,
  onConfirmOrdeline: PropTypes.func,
};

OrderlineActionModal.propTypes = {
  isModalActive: () => false,
  closeModal: () => {},
  handleOrderlineStatus: () => {},
  actionData: () => {},
  order: () => {},
};

export default OrderlineActionModal;
