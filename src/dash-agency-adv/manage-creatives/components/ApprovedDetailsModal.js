import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ApprovedDetailsModal = (props) => {
  const { showModal, closeModal, creativeData } = props;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>Network Approval Details</Modal.Header>
      <Modal.Body>
        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>
            <tr>
              <th>Network name</th>
              <th>Approved at</th>
              <th>Approved by</th>
            </tr>
          </thead>
          <tbody>
            {creativeData?.approvalModalInfo?.map((d, dIndex) => (
              <tr key={`${d.network_name}_${dIndex}`}>
                <td>{d.network_name || '-'}</td>
                <td>{d.last_modified ? `${d.last_modified} ET` : '-'}</td>
                <td>{d.user_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

ApprovedDetailsModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  creativeData: PropTypes.object,
};

ApprovedDetailsModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  creativeData: {},
};

export default ApprovedDetailsModal;
