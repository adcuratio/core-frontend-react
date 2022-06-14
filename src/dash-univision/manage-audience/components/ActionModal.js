import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import CustomButton from '../../../components/CustomButton';
import RadioButton from '../../../components/RadioButton';

const ActionModal = (props) => {
  const { showModal, closeModal, modalData, onHandleConfirm, actionData } = props;
  const { selectedValue, reasons, onChangeReason } = actionData;

  const renderDeclineBody = () => (
    <div className="mt10 mb10">
      {reasons.map((reason) => (
        <div className="mb10" key={reason.id}>
          <RadioButton
            label={reason.reason}
            isChecked={selectedValue?.id === reason.id}
            value={reason.id}
            onChangeFunction={(e) => onChangeReason(e, reason)}
          />
        </div>
      ))}
      <div>
        <RadioButton
          label={'Other'}
          isChecked={selectedValue?.id === 4}
          onChangeFunction={(e) => onChangeReason(e, { id: 4, reason: '' })}
          value={3}
        ></RadioButton>
        <div className="mt10">
          {selectedValue?.id === 4 ? (
            <input
              type="text"
              name="customDeclineCode"
              onChange={(e) => onChangeReason(e, { id: 4, reason: e.target.value })}
              value={selectedValue?.reason || ''}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modalData.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt10 mb10">{`Are you sure you want to decline this segment/audience?`}</div>
        {renderDeclineBody()}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize"
          type="secondary"
          buttonText="Decline"
          handleButtonClick={(e) => onHandleConfirm(e, modalData.id)}
        />
        <CustomButton type="secondary" buttonText={'Cancel'} buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ActionModal.PropTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  modalData: PropTypes.object,
  onHandleConfirm: PropTypes.func,
  actionData: PropTypes.object,
};
ActionModal.propTypes = {
  showModal: () => false,
  closeModal: () => {},
  modalData: () => {},
  onHandleConfirm: () => {},
  actionData: () => {},
};

export default ActionModal;
