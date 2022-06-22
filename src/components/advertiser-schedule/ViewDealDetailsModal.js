import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../CustomButton';

import { formatNumber } from '../../common/utils';

const ViewDealDetailsModal = (props) => {
  const {
    showModal,
    closeModal,
    ediInfoData,
    ediInfoMetadata,
    ediInfoChangePage,
    viewDealDetailsTableHeadings,
    selectedEdiData,
  } = props;

  const dealScrollViewRef = useRef(null);

  useEffect(() => {
    // Moving scroll position to top if previous/ next button is clicked
    if (dealScrollViewRef?.current) {
      dealScrollViewRef.current.scrollTop = 0;
    }
  }, [ediInfoData]);

  const getTableHeader = () => {
    if (viewDealDetailsTableHeadings && viewDealDetailsTableHeadings.length) {
      const tableHeaderComp = [];
      viewDealDetailsTableHeadings?.forEach((title) => {
        tableHeaderComp.push(<th key={title.id}>{title.name}</th>);
      });
      return tableHeaderComp;
    }
    return null;
  };

  const getTableBody = () => {
    if (ediInfoData && ediInfoData.length) {
      const tableContentComp = [];
      ediInfoData?.forEach((data) => {
        tableContentComp.push(
          <tr key={`table_content_${data.id}`}>
            <td className="bold">{data.adspot_id}</td>
            <td>{data.channel_name}</td>
            <td>{data.day_part_name || 'N/A'}</td>
            <td>{formatNumber(data.estimated_impressions)}</td>
            <td>{data.show_name}</td>
            <td>{data.flighting_dates || 'N/A'}</td>
            <td>{data.adspot_date}</td>
            <td>{`${data.duration}sec`}</td>
          </tr>
        );
      });
      return tableContentComp;
    }
    return (
      <tr>
        <td colSpan={viewDealDetailsTableHeadings.length} className="text-align-center-imp">
          No data found
        </td>
      </tr>
    );
  };

  return (
    <Modal show={showModal} onHide={closeModal} dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>
          View Deal Details{' '}
          {selectedEdiData.deal_name ? (
            <>
              for <span className="capitalize">{selectedEdiData.deal_name}</span>
            </>
          ) : (
            ''
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="popup-box-scroll" ref={dealScrollViewRef}>
          <table className="table table-striped table-wrapper mt10 wrapped-table">
            <thead>
              <tr>{getTableHeader()}</tr>
            </thead>
            <tbody>{getTableBody()}</tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {ediInfoData?.length && ediInfoMetadata ? (
          <p className="float-left">
            <span>
              Page {ediInfoMetadata.currentPage} of {ediInfoMetadata.totalPages}
            </span>
          </p>
        ) : null}
        {ediInfoMetadata && ediInfoMetadata.prevUrl ? (
          <CustomButton
            type="secondary"
            buttonText="Previous"
            handleButtonClick={() => ediInfoChangePage(ediInfoMetadata.prevUrl)}
          />
        ) : null}
        {ediInfoMetadata && ediInfoMetadata.nextUrl ? (
          <CustomButton
            buttonClassName="ml10"
            type="secondary"
            buttonText="Next"
            handleButtonClick={() => ediInfoChangePage(ediInfoMetadata.nextUrl)}
          />
        ) : null}
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
  viewDealDetailsTableHeadings: PropTypes.array,
  selectedEdiData: PropTypes.object,
};

ViewDealDetailsModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  ediInfoData: [],
  ediInfoMetadata: {},
  ediInfoChangePage: () => {},
  viewDealDetailsTableHeadings: [],
  selectedEdiData: {},
};

export default ViewDealDetailsModal;
