import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover, Modal } from 'react-bootstrap';

import { formatNumber } from '../../../common/utils';

import { getFilterJSONText } from '../../../segments/components/FilterJSONText';

import CustomButton from '../../../components/CustomButton';

const ViewSegmentsModal = (props) => {
  const { showModal, closeModal, placement, subSegment } = props;

  const msgName = subSegment.map((c) => c.name);

  // Function to show the segments list on view segments modal
  const renderSegments = () => (
    <>
      {subSegment.map((a) => (
        <div key={a.id}>
          {Object.values(a.groups_meta).map((b) => (
            <div key={b.id} className="card group-card-seg">
              <div className="card-description">
                <div className="card-title mb4">{b.name}</div>
                <div className="segment-count bold capitalize">Data Provider: {b.data_provider}</div>
                <div className="segment-count">Household Count: {formatNumber(b.household_count)}</div>
                <div>
                  <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement={placement}
                    overlay={
                      <Popover
                        id="popover-positioned-scrolling-left"
                        className="segments-card-json-tooltip"
                        title={b.name}
                      >
                        <div className="mb10">Description: {b.description}</div>
                        <div className="mb10">{getFilterJSONText(b.filter_json)}</div>
                      </Popover>
                    }
                  >
                    <div>
                      <CustomButton type="button_blue" buttonText="Know more" />
                    </div>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );

  // Return the segments list on view segments modal
  return (
    <div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Selected Segments for {msgName} </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderSegments()}</Modal.Body>
        <Modal.Footer>
          <CustomButton type="secondary" buttonText="Cancel" handleButtonClick={closeModal} />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

ViewSegmentsModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  messagingGroupData: PropTypes.array,
  placement: PropTypes.any,
  subSegment: PropTypes.array,
};

ViewSegmentsModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  messagingGroupData: [],
  placement: 'left',
  subSegment: [],
};

export default ViewSegmentsModal;
