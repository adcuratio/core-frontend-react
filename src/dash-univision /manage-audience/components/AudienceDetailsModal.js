import React from "react";
import PropTypes from "prop-types";
import { Modal, OverlayTrigger, Popover } from "react-bootstrap";

import { formatNumber, toTitleCase } from "../../../common/utils";
import CustomButton from "../../../components/CustomButton";
import { getFilterJSONText } from "../../../segments/components/FilterJSONText";

const AudienceDetailsModal = (props) => {
  const { showModal, closeModal, modalData, tooltipSelection } = props;

  return (
    <Modal
      autoFocus={false}
      show={showModal}
      onHide={closeModal}
      dialogClassName="modal-50w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Audience Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="super-card super-group-card-segs">
          <div className="card-description">
            <div className="card-title mb4">{modalData?.name}</div>
            <div className="segment-count bold">
              Data Provider: {toTitleCase(modalData?.data_provider)}
            </div>
            <div className="segment-count">
              Household Count: {formatNumber(modalData?.household_count)}
            </div>
            <div className="segment-count">
              Individual Count: {formatNumber(modalData?.individual_count)}
            </div>

            {/* <div className="segment-count">
              Adcuratio Footprint Individual Count:{' '}
              {modalData?.distributor_footprint_count?.adcuratio_footprint_indvi_count
                ? formatNumber(modalData?.distributor_footprint_count?.adcuratio_footprint_indvi_count)
                : 'N/A'}
            </div>
            <div className="segment-count">
              Adcuratio Footprint Household Count:{' '}
              {modalData?.distributor_footprint_count?.adcuratio_footprint_hh_count
                ? formatNumber(modalData.distributor_footprint_count.adcuratio_footprint_hh_count)
                : 'N/A'}
            </div> */}
            <div className="segment-count">
              Dish Household Count:{" "}
              {modalData?.distributor_footprint_count?.dish_hh_count
                ? formatNumber(
                    modalData.distributor_footprint_count.dish_hh_count
                  )
                : "N/A"}
            </div>
            <div className="segment-count">
              Dish Individual Count:{" "}
              {modalData?.distributor_footprint_count?.dish_individual_count
                ? formatNumber(
                    modalData.distributor_footprint_count.dish_individual_count
                  )
                : "N/A"}
            </div>
            <div className="segment-count">
              Dish Vizio Overlap Household Count:{" "}
              {modalData?.distributor_footprint_count?.dish_vizio_hh_overlap
                ? formatNumber(
                    modalData.distributor_footprint_count.dish_vizio_hh_overlap
                  )
                : "N/A"}
            </div>
            <div className="segment-count">
              Dish Vizio Overlap Individual Count:{" "}
              {modalData?.distributor_footprint_count?.dish_vizio_invidi_overlap
                ? formatNumber(
                    modalData.distributor_footprint_count
                      .dish_vizio_invidi_overlap
                  )
                : "N/A"}
            </div>
            <div className="segment-count">
              Vizio Household Count:{" "}
              {modalData?.distributor_footprint_count?.vizio_hh_count
                ? formatNumber(
                    modalData.distributor_footprint_count.vizio_hh_count
                  )
                : "N/A"}
            </div>
            <div className="segment-count">
              Vizio Individual Count:{" "}
              {modalData?.distributor_footprint_count?.vizio_individual_count
                ? formatNumber(
                    modalData.distributor_footprint_count.vizio_individual_count
                  )
                : "N/A"}
            </div>

            <div>
              <OverlayTrigger
                trigger="click"
                rootClose
                placement="right"
                overlay={
                  <Popover
                    id="popover-positioned-scrolling-left"
                    className="segments-card-json-tooltip"
                    title={modalData.name}
                  >
                    <div className="mb10">
                      Description: {modalData.description}
                    </div>
                    <div className="mb10">
                      {modalData?.filter_json &&
                        getFilterJSONText(modalData?.filter_json)}
                    </div>
                  </Popover>
                }
              >
                <div>
                  <CustomButton
                    buttonId={"overlay-trigger"}
                    type="button_blue"
                    buttonText="Know more"
                    buttonClassName="pull-right"
                    onClick={(e) => tooltipSelection(e)}
                  />
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <CustomButton
            buttonId="close-audience-modal"
            type="secondary"
            buttonText="Close"
            buttonClassName="ml10"
            handleButtonClick={closeModal}
          />
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

AudienceDetailsModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  modalData: PropTypes.object,
  tooltipSelection: PropTypes.func,
};

AudienceDetailsModal.defaultProps = {
  showModal: false,
  closeModal: () => {},
  modalData: {},
  tooltipSelection: () => {},
};

export default AudienceDetailsModal;
