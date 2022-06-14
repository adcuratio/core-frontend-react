import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

import CustomButton from '../../../../components/CustomButton';

import { formatNumber } from '../../../../common/utils';

const ViewDetails = (props) => {
  const { showModal, closeModal, viewDetailsList, viewDetailsTitles, getData, detailsData } = props;

  const renderTableHeader = () => {
    const tableHeader = viewDetailsTitles?.map((column) => <th key={`th${column.id}`}>{column.name}</th>);
    return tableHeader;
  };

  const renderTableBody = () => {
    const tableBody = !viewDetailsList?.length ? (
      <tr>
        {
          <td colSpan={14} className="bg-white">
            <p className="text-center mt40">No Data Found.</p>
          </td>
        }
      </tr>
    ) : (
      viewDetailsList?.map((item) => (
        <tr key={`tr${item.id}`}>
          <td>{item.campaign_name}</td>
          <td>{item.upstream_id}</td>
          <td>{item.creative_name ?? 'N/A'}</td>
          <td>{item.isci ?? 'N/A'}</td>
          <td>{item.date}</td>
          <td>{[0, null].includes(item.reach) ? 'N/A' : item?.reach && formatNumber(item.reach)}</td>
          <td>{item.reach_finalized ? 'True' : 'False'}</td>
          <td>{formatNumber(item.impressions)}</td>
          <td>{item.impressions_finalized ? 'True' : 'False'}</td>
        </tr>
      ))
    );
    return tableBody;
  };

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} dialogClassName="modal-75w">
        <Modal.Header closeButton>
          <Modal.Title id="modal">View Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table className="table-wrapper wrapped-table" responsive striped bordered={false}>
            <thead>
              <tr>{renderTableHeader()}</tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            isDisabled={!detailsData.previous}
            type="primary"
            buttonText="Prev"
            buttonClassName="mr10"
            handleButtonClick={() => getData(detailsData?.previous)}
          />
          <CustomButton
            isDisabled={!detailsData.next}
            type="primary"
            buttonText="Next"
            buttonClassName="mr10"
            handleButtonClick={() => getData(detailsData?.next)}
          />
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

ViewDetails.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  viewDetailsList: PropTypes.array,
  viewDetailsTitles: PropTypes.array,
  getData: PropTypes.func,
  detailsData: PropTypes.object,
};

export default ViewDetails;
