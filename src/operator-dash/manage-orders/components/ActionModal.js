import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';
import RadioButton from '../../../components/RadioButton';

const ActionModal = (props) => {
  const { isModalActive, closeModal, actionData, onHandleConfirm, order } = props;
  const { actionType, selectedValue, reasons, onChangeReason } = actionData;

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
          isChecked={selectedValue?.id === 3}
          onChangeFunction={(e) => onChangeReason(e, { id: 3, reason: '' })}
          value={3}
        ></RadioButton>
        <div className="mt10">
          {selectedValue?.id === 3 ? (
            <input
              type="text"
              name="customDeclineCode"
              onChange={(e) => onChangeReason(e, { id: 3, reason: e.target.value })}
              value={selectedValue?.reason || ''}
            />
          ) : (
            <input disabled type="text" value="" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Modal show={isModalActive} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="capitalize">{`${actionType}`}</span>
          <span className="capitalize ml5">{order?.order_name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt10 mb10">{`Are you sure you want to ${actionType} this campaign?`}</div>
        {actionType === 'decline' && renderDeclineBody()}
      </Modal.Body>
      <Modal.Footer>
        <CustomButton
          buttonClassName="capitalize"
          type="secondary"
          buttonText={`${actionType}`}
          handleButtonClick={onHandleConfirm}
        />
        <CustomButton type="secondary" buttonText={'Cancel'} buttonClassName="ml10" handleButtonClick={closeModal} />
      </Modal.Footer>
    </Modal>
  );
};

ActionModal.propTypes = {
  isModalActive: PropTypes.bool,
  closeModal: PropTypes.func,
  onHandleConfirm: () => PropTypes.func,
  actionData: PropTypes.object,
  order: PropTypes.object,
};

ActionModal.propTypes = {
  isModalActive: () => false,
  closeModal: () => {},
  onHandleConfirm: () => {},
  actionData: () => {},
  order: () => {},
};

export default ActionModal;
