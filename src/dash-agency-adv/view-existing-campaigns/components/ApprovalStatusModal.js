import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';

const DeclineReasons = styled.div`
  .mn-decline-reason-txt-box {
    width: 188px !important;
    margin-left: 10px;
  }
`;

const PausedModalInfoSign = styled.div`
  .mn-pause-modal-info-icon {
    color: rgb(159, 159, 159);
    font-size: 13px;
    font-family: 'opensans';
    font-weight: 400;
    line-height: 20px;
  }

  .mn-info-sign-margin {
    margin: 0px 4px 1px 3px;
  }
`;

const StyledMargin = styled.div`
  margin-top: 5px !important;
`;

const ApprovalStatusModal = (props) => {
  const { showModal, closeModal, activeModal, setActiveTrade, confirmTradeApproval, pauseCustomTrade } = props;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        {activeModal === 'approve' && <span>Approve</span>}
        {activeModal === 'decline' && <span>Decline</span>}
        {activeModal === 'active' && <span>Pause</span>}
        {activeModal === 'paused' && <span>Activate</span>}
      </Modal.Header>
      <Modal.Body>
        <span>
          Are you sure you want to &nbsp;
          {activeModal === 'approve' && <span>approve</span>}
          {activeModal === 'decline' && <span>decline</span>}
          {activeModal === 'active' && <span>pause</span>}
          {activeModal === 'paused' && <span>activate</span>}
          &nbsp; this campaign? &nbsp;
          <br />
        </span>
        <PausedModalInfoSign mt20>
          {activeModal === 'paused' ? (
            <StyledMargin>
              <span className="mn-pause-modal-info-icon">
                <i className="fa fa-info-circle mn-info-sign-margin " />
                It may take up to 72 hours to pause a campaign. If there are units scheduled over the next 72 hours you
                will be responsible for the cost of their execution. If urgent, please contact Adcuratio for special
                allowances to in-flight orders.
              </span>
            </StyledMargin>
          ) : null}
        </PausedModalInfoSign>
        <br />
        {activeModal === 'decline' ? (
          <DeclineReasons>
            <div>
              <span>Enter Decline Reason:</span>
              <input
                className="mn-decline-reason-txt-box"
                name="declineCode"
                onChange={(e) => setActiveTrade(e.target.value)}
                type="text"
              ></input>
            </div>
          </DeclineReasons>
        ) : (
          ''
        )}
      </Modal.Body>
      <Modal.Footer>
        {activeModal === 'approve' || activeModal === 'decline' ? (
          <CustomButton
            type="secondary"
            buttonText={activeModal === 'approve' ? 'Approve' : activeModal === 'decline' ? 'Decline' : ''}
            handleButtonClick={confirmTradeApproval}
          />
        ) : (
          ''
        )}
        {activeModal === 'active' || activeModal === 'paused' ? (
          <CustomButton
            type="secondary"
            buttonText={activeModal === 'active' ? 'Pause' : activeModal === 'paused' ? 'Activate' : ''}
            handleButtonClick={pauseCustomTrade}
          />
        ) : (
          ''
        )}
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ApprovalStatusModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  activeModal: PropTypes.string.isRequired,
  confirmTradeApproval: PropTypes.func,
  pauseCustomTrade: PropTypes.func,
  declineCodes: PropTypes.array,
  setActiveTrade: PropTypes.any,
  activeTrade: PropTypes.any,
};

ApprovalStatusModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  confirmTradeApproval: () => {},
  pauseCustomTrade: () => {},
};

export default ApprovalStatusModal;
