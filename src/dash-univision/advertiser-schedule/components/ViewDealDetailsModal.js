import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

import { formatNumber } from './../../../common/utils';

import { ViewDealDetailsTableHeadings } from '../JsonData';

const ViewDealDetailsModal = (props) => {
  const { showModal, closeModal, ediInfoData, ediInfoMetadata, ediInfoChangePage } = props;

  const getTableHeader = () => {
    if (ViewDealDetailsTableHeadings && ViewDealDetailsTableHeadings.length) {
      const tableHeaderComp = [];
      ViewDealDetailsTableHeadings.forEach((title) => {
        tableHeaderComp.push(<th key={title.id}>{title.name}</th>);
      });
      return tableHeaderComp;
    }
    return null;
  };

  const getTableBody = () => {
    if (ediInfoData && ediInfoData.length) {
      const tableContentComp = [];
      ediInfoData.forEach((data) => {
        tableContentComp.push(
          <tr key={`table_content_${data.id}`}>
            <td>{data.channel_name}</td>
            <td>{formatNumber(data.estimated_impressions)}</td>
            <td>{data.show_name}</td>
            <td>{data.flighting_dates || 'N/A'}</td>
            <td>{`$${data.unit_cost}`}</td>
            <td>{`$${data.cpm}`}</td>
            <td>{data.adspot_date}</td>
            <td>{`${data.duration}sec`}</td>
          </tr>
        );
      });
      return tableContentComp;
    }
    return (
      <div className="text-center" key={`view_deal_no-df`}>
        No data found.
      </div>
    );
  };

  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>View Deal Details</Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup-box-scroll">
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>
            <tr>{getTableHeader()}</tr>
          </thead>
          <tbody>{getTableBody()}</tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        {ediInfoData?.length && ediInfoMetadata && (
          <p className="float-left">
            <span>
              Page {ediInfoMetadata.currentPage} of {ediInfoMetadata.totalPages}
            </span>
          </p>
        )}
        {ediInfoMetadata && ediInfoMetadata.prevUrl && (
          <CustomButton
            type="secondary"
            buttonText="Previous"
            handleButtonClick={() => ediInfoChangePage(ediInfoMetadata.prevUrl)}
          />
        )}
        {ediInfoMetadata && ediInfoMetadata.nextUrl && (
          <CustomButton
            type="secondary"
            buttonText="Next"
            handleButtonClick={() => ediInfoChangePage(ediInfoMetadata.nextUrl)}
          />
        )}
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ViewDealDetailsModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  ediInfoData: PropTypes.array,
  ediInfoMetadata: PropTypes.object,
  ediInfoChangePage: PropTypes.func,
};

ViewDealDetailsModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  ediInfoData: [],
  ediInfoMetadata: {},
  ediInfoChangePage: () => {},
};

export default ViewDealDetailsModal;
