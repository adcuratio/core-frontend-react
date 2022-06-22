import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Col, Row, FormControl } from 'react-bootstrap';
import CustomButton from '../../../components/CustomButton';
import { showAckErrorMessage, showAckMessage, formatText } from '../../../common/utils';

const DeclineActionModal = (props) => {
  const { modalData, closeModal, operatorStore, getAllCampaignTags, tabList } = props;
  const [declineReason, setDeclineReason] = useState('');
  const onDeclineAction = () => {
    if (!declineReason.length) {
      showAckErrorMessage({ message: ' Please describe the reason to decline' });
      return;
    }
    if (formatText(declineReason)) {
      const data = {
        audience_state: 4,
        reason: formatText(declineReason),
      };
      operatorStore.ApproveDeclineAction(data, modalData.id).then(
        (res) => {
          if (res.status === 200) {
            showAckMessage({ message: 'Declined successfully.' });
            getAllCampaignTags(tabList[3]);
            closeModal();
          } else {
            showAckErrorMessage();
          }
        },
        (error) => {
          if (error?.status === 400 && error?.data?.message) {
            showAckErrorMessage({ message: error.data.message });
          } else {
            showAckErrorMessage();
          }
        }
      );
    } else {
      showAckErrorMessage('Reason cannot be empty.Please provide a valide reason!');
    }
  };

  return (
    <Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">Decline Audience Segment</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt10 mb10">{`Are you sure want to decline this audience segment?`}</div>
        <div className="mt20">
          <Row className="flex-container1">
            <Col md={2} sm={2}>
              <p className="f12 bold">Reason: </p>
            </Col>
            <Col md={9} sm={9}>
              <FormControl
                type="text"
                value={declineReason}
                placeholder="Reason to Decline"
                onChange={(e) => setDeclineReason(e.target.value)}
              ></FormControl>
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize"
          type="primary"
          buttonText="Decline"
          handleButtonClick={() => onDeclineAction()}
        />
        <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

DeclineActionModal.PropTypes = {
  closeModal: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  modalData: PropTypes.object,
  operatorStore: PropTypes.object,
  tabList: PropTypes.array,
  getAudience: PropTypes.func,
};

DeclineActionModal.propTypes = {
  closeModal: () => {},
  operatorStore: () => {},
  getAllCampaignTags: () => {},
  modalData: () => {},
  tabList: [],
  getAudience: () => {},
};

export default DeclineActionModal;
