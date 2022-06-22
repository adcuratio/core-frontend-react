import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import CustomButton from '../../../components/CustomButton';

const InventoryModal = (props) => {
  const { isModalActive, closeModal, tableColumns, inventoryList, order, orderInfoMetadata, orderInventoryChangePage } =
    props;

  const renderTableHeader = () => {
    const tableHeader = tableColumns?.map((column, index) => <th key={`th${index}`}>{column.title}</th>);
    return tableHeader;
  };

  const dealScrollViewRef = useRef(null);

  useEffect(() => {
    // Moving scroll position to top if previous/ next button is clicked
    if (dealScrollViewRef?.current) {
      dealScrollViewRef.current.scrollTop = 0;
    }
  }, [inventoryList]);

  const renderTableBody = () => {
    const tableBody = !inventoryList?.length ? (
      <tr>
        {
          <td colSpan={14} className="bg-white">
            <p className="text-center mt40">No spots scheduled for now.</p>
          </td>
        }
      </tr>
    ) : (
      inventoryList?.map((item, index) => (
        <tr key={`tr${index}`}>
          {Object.entries(item).map(([key, value]) => (
            <td key={`td${index}${key}`}>{value}</td>
          ))}
        </tr>
      ))
    );
    return tableBody;
  };
  return (
    <Modal show={isModalActive} onHide={closeModal} dialogClassName="modal-98w">
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="f-20">
            Inventory details{' '}
            {order.order_name ? (
              <span>
                of <span className="capitalize">{order.order_name}</span>
              </span>
            ) : null}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="popup-box-scroll">
        <div className="popup-box-scroll" ref={dealScrollViewRef}>
          <table className="table table-striped table-wrapper mt10 wrapped-table">
            <thead>
              <tr>{renderTableHeader()}</tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {inventoryList?.length && orderInfoMetadata ? (
          <p className="float-left">
            <span>
              Page {orderInfoMetadata.currentPage} of {orderInfoMetadata.totalPages}
            </span>
          </p>
        ) : null}
        {orderInfoMetadata && orderInfoMetadata.prevUrl ? (
          <CustomButton
            type="primary"
            buttonText="Previous"
            buttonClassName="ml10"
            handleButtonClick={() => orderInventoryChangePage(orderInfoMetadata.prevUrl)}
          />
        ) : null}
        {orderInfoMetadata && orderInfoMetadata.nextUrl ? (
          <CustomButton
            buttonClassName="ml10"
            type="primary"
            buttonText="Next"
            handleButtonClick={() => orderInventoryChangePage(orderInfoMetadata.nextUrl)}
          />
        ) : null}
        <CustomButton type="secondary" buttonClassName="ml10" buttonText="Close" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

InventoryModal.propTypes = {
  isModalActive: PropTypes.bool,
  closeModal: PropTypes.func,
  tableColumns: PropTypes.array,
  inventoryList: PropTypes.array,
  order: PropTypes.object,
  orderInfoMetadata: PropTypes.object,
  orderInventoryChangePage: PropTypes.func,
};

InventoryModal.defaultProps = {
  isModalActive: false,
  closeModal: () => {},
  tableColumns: [],
  inventoryList: [],
  order: {},
  orderInfoMetadata: {},
  orderInventoryChangePage: () => {},
};

export default InventoryModal;
