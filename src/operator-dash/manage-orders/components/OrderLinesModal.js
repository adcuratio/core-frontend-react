import React from 'react';
import PropTypes from 'prop-types';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import { formatNumber } from '../../../common/utils';

const OrderLinesModal = (props) => {
  const { isModalActive, closeModal, tableColumns, orderLines, order, orderType, sasoTableColumns } = props;

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
            <td style={{ textTransform: 'none' }}>{item?.ad_id?.[0] || '---'}</td>
            <td className="removeCapitalletter">{item.attr_code || '---'}</td>
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
            {item.error ? (
              <td>
                <OverlayTrigger
                  key={`overylay${index}`}
                  placement={'left'}
                  overlay={<Tooltip id={`tooltip-${index}`}>{item.error}</Tooltip>}
                >
                  <span className="error-indicator">
                    {item.status} <i className="fa fa-exclamation-circle"></i>
                  </span>
                </OverlayTrigger>
              </td>
            ) : (
              <td className="text-success">{item.status}</td>
            )}
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
            <td className="removeCapitalletter">{item.attr_code || '---'}</td>
            <td>{item.activation_time}</td>
            <td>{item.deactivation_time}</td>
            <td>{item.orderline_id || '---'}</td>
            {item.error ? (
              <td>
                <OverlayTrigger
                  key={`overylay${index}`}
                  placement={'left'}
                  overlay={<Tooltip id={`tooltip-${index}`}>{item.error}</Tooltip>}
                >
                  <span className="error-indicator">
                    {item.status} <i className="fa fa-exclamation-circle"></i>
                  </span>
                </OverlayTrigger>
              </td>
            ) : (
              <td className="text-success">{item.status}</td>
            )}
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
          <span className="f-20">
            Orderline details{' '}
            {order.order_name ? (
              <span>
                of <span className="capitalize">{order.order_name}</span>
              </span>
            ) : null}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="popup-box-scroll">
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton type="secondary" buttonText="Close" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

OrderLinesModal.propTypes = {
  isModalActive: PropTypes.bool,
  closeModal: PropTypes.func,
  tableColumns: PropTypes.array,
  orderLines: PropTypes.array,
  order: PropTypes.object,
  orderType: PropTypes.string,
  sasoTableColumns: PropTypes.array,
};

OrderLinesModal.defaultProps = {
  isModalActive: false,
  closeModal: () => {},
  tableColumns: [],
  orderLines: [],
  order: {},
  orderType: '',
  sasoTableColumns: [],
};

export default OrderLinesModal;
