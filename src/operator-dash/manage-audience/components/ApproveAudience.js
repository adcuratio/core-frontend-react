import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

import CustomButton from '../../../components/CustomButton';

import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

const ApproveDeclineAction = inject(
  'operatorStore',
  'uiStore'
)(
  observer((props) => {
    const { operatorStore, closeModal, getAllCampaignTags, modalData, tabList } = props;

    //Function for approve/decline the segment tag.
    const onApproveDeclineAction = () => {
      const data = {
        audience_state: 2,
      };
      operatorStore.ApproveDeclineAction(data, modalData.id).then(
        (res) => {
          if (res.status === 200) {
            showAckMessage({ message: 'Approved successfully.' });
            getAllCampaignTags(tabList[1]);
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
    };
    return (
      <div>
        <Modal show={true} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              <span className="f-20">Approve Audience Segment</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>Are you sure you want to approve the audience segment!</Modal.Body>
          <Modal.Footer>
            <CustomButton type="primary" buttonText="Submit" handleButtonClick={() => onApproveDeclineAction()} />
            <CustomButton type="secondary" buttonText="Close" buttonClassName="ml10" handleButtonClick={closeModal} />
          </Modal.Footer>
        </Modal>
      </div>
    );
  })
);

ApproveDeclineAction.propTypes = {
  operatorStore: PropTypes.object,
  closeModal: PropTypes.func,
  getAllCampaignTags: PropTypes.func,
  modalData: PropTypes.object,
  tabList: PropTypes.array,
  getAudience: PropTypes.func,
};

export default ApproveDeclineAction;
