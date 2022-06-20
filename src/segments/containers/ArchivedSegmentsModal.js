import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import SegmentInfoCard from './../components/SegmentInfoCard';

import CustomButton from '../../components/CustomButton';
import { showAckMessage, showAckErrorMessage } from '../../common/utils';

//to see all the archived segments for the selected node
const ArchivedSegmentsModal = inject('segmentStore')(
  observer((props) => {
    const { showModal, toggleModal, segmentStore, getSegmentFilterJson, isLoading, getArchivedSegments } = props;
    const archivedSegments = segmentStore.archivedSegments;

    const goToNextPage = () => {
      segmentStore.getAllArchivedSegmentsPage(archivedSegments.next);
    };
    const goToPreviousPage = () => {
      segmentStore.getAllArchivedSegmentsPage(archivedSegments.previous);
    };
    const handleUnarchiveButton = (seg) => {
      segmentStore.unarchiveSegments(seg).then((res) => {
        if (res.status) {
          getArchivedSegments();
          showAckMessage({ message: 'Segment successfully unarchived.' });
        } else showAckErrorMessage({ message: res.message || '' });
      });
    };

    return (
      <Modal show={showModal} onHide={toggleModal} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Archived Segments</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {archivedSegments && archivedSegments?.results?.length ? (
            <div className="card-wrapper group-wrapper-table archived-segment-card-wrapper">
              {archivedSegments?.results.map((segment) => (
                <SegmentInfoCard
                  key={segment.id}
                  type="unarchive"
                  placement="left"
                  segmentData={segment}
                  handleButtonFunc={handleUnarchiveButton}
                  filterJSONText={getSegmentFilterJson(segment.filter_json)}
                />
              ))}
            </div>
          ) : (
            !isLoading && <h2 className="text-align-center">No data found.</h2>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="text-center">
            <CustomButton
              type="primary"
              buttonText="Previous"
              buttonClassName={
                !archivedSegments.previous ? 'disabled-button block-pointer bold pull-left' : 'pull-left'
              }
              handleButtonClick={goToPreviousPage}
            />
            {archivedSegments && archivedSegments?.results?.length ? (
              <span>
                Page {archivedSegments.next ? archivedSegments.next.split('=')[3] - 1 : archivedSegments.totalPages} of{' '}
                {archivedSegments.totalPages}
              </span>
            ) : null}
            <CustomButton
              type="primary"
              buttonText="Next"
              buttonClassName={!archivedSegments.next ? 'disabled-button block-pointer bold pull-right' : 'pull-right'}
              handleButtonClick={goToNextPage}
            />
          </div>
        </Modal.Footer>
      </Modal>
    );
  })
);

ArchivedSegmentsModal.propTypes = {
  showModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  getSegmentFilterJson: PropTypes.func,
  showAckMessage: PropTypes.func,
  showAckErrorMessage: PropTypes.func,
  placementforTooltip: PropTypes.any,
  isLoading: PropTypes.bool,
};

ArchivedSegmentsModal.defaultProps = {
  showModal: false,
  toggleModal: () => {},
  getSegmentFilterJson: () => {},
  getArchivedSegments: () => {},
};

export default ArchivedSegmentsModal;
