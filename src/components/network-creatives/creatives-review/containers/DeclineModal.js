import React, { useState } from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Modal } from "react-bootstrap";

//import withStore from '../../../../hocs/WithStore';

import CustomButton from "../../../CustomButton";

import { showAckErrorMessage } from "../../../../common/utils";
import RadioButton from "../../../RadioButton";

const DeclineModal = inject("networkStore")(
  observer((props) => {
    const {
      showModal,
      closeModal,
      networkStore,
      modalData,
      handleSuccessResponse,
      modalType,
      declineCodes,
      modalClass,
    } = props;

    const [selectedDeclineReason, setSelectedDeclineReason] = useState({
      data: {},
      customReason: "",
    });

    const declineCreative = () => {
      const data = {
        identifier: modalData?.adid_meta_file_upload?.[0]?.identifier,
        decline_code_id: selectedDeclineReason.data.id,
        decline_reason:
          selectedDeclineReason.data.id === 3
            ? selectedDeclineReason.customReason
            : selectedDeclineReason.data.reason,
      };

      networkStore.declineCreative(data).then(
        (res) => {
          if (res && res.status === 200) {
            if (res.data?.success) {
              handleSuccessResponse(modalType);
            } else
              showAckErrorMessage({
                message:
                  res.data?.message ?? "Something went wrong while Declining!",
              });
          } else
            showAckErrorMessage({
              message:
                res.data?.message ?? "Something went wrong while Declining!",
            });
        },
        () => showAckErrorMessage()
      );
    };

    const onReasonChange = (_obj) => {
      const _customReason = selectedDeclineReason.customReason;
      setSelectedDeclineReason({ data: _obj, customReason: _customReason });
    };

    return (
      <Modal show={showModal} onHide={closeModal} dialogClassName={modalClass}>
        <Modal.Header closeButton>
          <Modal.Title>{"Decline Creative"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
            <p className="mb10">
              Please select the reason for declining the creative
            </p>
            {
              <>
                {declineCodes.map((declineCode, index) => (
                  <RadioButton
                    key={index}
                    value={selectedDeclineReason.data}
                    isChecked={
                      selectedDeclineReason.data?.id === declineCode.id
                    }
                    onChangeFunction={() => onReasonChange(declineCode)}
                    label={declineCode.reason}
                  />
                ))}
                <RadioButton
                  value={selectedDeclineReason.data}
                  isChecked={selectedDeclineReason.data?.id === 3}
                  onChangeFunction={() => onReasonChange({ id: 3 })}
                  label="Other reason"
                />

                <input
                  type="text"
                  disabled={selectedDeclineReason.data?.id !== 3}
                  onChange={(e) => {
                    const _selectedDeclineReason = JSON.parse(
                      JSON.stringify(selectedDeclineReason)
                    );
                    _selectedDeclineReason.customReason = e.target.value.trim();
                    setSelectedDeclineReason(_selectedDeclineReason);
                  }}
                />
              </>
            }
          </>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton
            buttonClassName={
              selectedDeclineReason.data.id === undefined ||
              (selectedDeclineReason.data.id === 3 &&
                !selectedDeclineReason.customReason?.length)
                ? "disabled-button block-pointer mr10"
                : "mr10"
            }
            type="primary"
            buttonText="Decline"
            handleButtonClick={declineCreative}
          />
          <CustomButton
            type="secondary"
            buttonText="Cancel"
            handleButtonClick={closeModal}
          />
        </Modal.Footer>
      </Modal>
    );
  })
);

DeclineModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  handleSuccessResponse: PropTypes.func,
  modalType: PropTypes.string,
  modalData: PropTypes.object,
  declineCodes: PropTypes.array,
  modalClass: PropTypes.string,
};

export default DeclineModal;
