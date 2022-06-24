import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "react-bootstrap";
import styled from "styled-components";

import CustomButton from "../../../components/CustomButton";

import { formatNumber } from "../../../common/utils";

const Accordion = styled.div`
  .collapsible-table {
    padding: 0px !important;
  }
  .manage-campaign-accordion-container {
    display: flex;
    flex-direction: column;
  }
  .ncm-campaign-summary {
    width: calc(34vw - 11px);
    border-left: 1px solid #ccc !important;
  }

  .ncm-manage-accordion-content {
    background: #ddd;
    position: inherit;
    padding: 10px;
    cursor: default;
  }

  .ncm-manage-campaign-heading {
    font-size: 18px;
    color: #243643 !important;
    padding: 10px 0px;
    font-weight: bold;
    float: left;
    margin-right: 200px;
  }

  .ncm-manage-accordion-block {
    position: relative;
    width: calc(100vw - 242px);
  }

  .mn-accordion-body-wrapper {
    font-size: 0.9em;
  }

  .mn-creative-grid-layout {
    display: grid;
    grid-template-columns: ${(props) =>
      props.columnList
        .map(() => `${100 / props.columnList.length}% `)
        .join("")};
    margin-bottom: 5px;
    justify-content: space-evenly;
    margin-left: 7px;
  }

  .mn-accordion-summary-value {
    padding: 8px 10px;
    font-size: 24px;
    color: #eea32c;
  }

  .mn-accordion-border {
    border: solid #ccc 1px;
    margin-bottom: 20px;
  }
  .mn-accordion-font {
    font-size: 13px !important;
  }
`;

const NcmManageAccordion = (props) => {
  const {
    activeAccordion,
    orderReplacementInfo,
    accordionHeader,
    getVideoUrlForAccordion,
    isLoadingAccordion,
    activeTab,
    activeReportData,
    activeAccordionHeader,
    handleModalAction,
    toggle,
    setToggleGraph,
    downloadCampaignReport,
  } = props;

  const getAccordionHeader = () =>
    accordionHeader?.map((header) => (
      <p className="bold text-center" key={`HeaderAccordion${header.id}`}>
        {header.name}
      </p>
    ));

  const getAccordionBody = () => {
    const body = orderReplacementInfo?.map((r) => (
      <span
        className="mn-accordion-body-wrapper mn-creative-grid-layout mb10 text-center"
        key={`accId${r.id}`}
      >
        <p className="mn-accordion-font">{r?.ad_name || "NA"}</p>
        <p className="mn-accordion-font">{r.identifier}</p>
        <p className="mn-accordion-font">{`${r?.adid_meta_file_upload[0]?.duration} sec`}</p>
        <p className="mn-accordion-font" style={{ textTransform: "none" }}>
          {r.default_asset_id}
        </p>
        <p>
          {r?.adid_meta_file_upload[0]?.s3_thumbnail_url ? (
            <label
              className="video-thumbnail video-thumbnail-small"
              onClick={(e) => getVideoUrlForAccordion(r, e)}
            >
              <img
                className="creative-thumb-small"
                src={r?.adid_meta_file_upload[0]?.s3_thumbnail_url}
              />
            </label>
          ) : (
            "Not Available"
          )}
        </p>
      </span>
    ));
    return body;
  };

  const getActiveAccordionHeader = () =>
    activeAccordionHeader?.map((header) => (
      <p className="bold text-center" key={`HeaderAccordion${header.id}`}>
        {header.name}
      </p>
    ));

  const getActiveAccordionBody = () => {
    const body = activeReportData?.map((r) => (
      <span
        className="mn-accordion-body-wrapper mn-creative-grid-layout mb10 text-center"
        key={`accId${r.id}`}
      >
        <p>{r.segment_name}</p>
        <p>{r.segment_data_provider}</p>
        <p>{formatNumber(r.target_size)}</p>
        <p>{r.avg_pacing ?? "N/A"}</p>
        <p>{formatNumber(r.total_impressions)}</p>
        <p>{formatNumber(r.target_impressions)}</p>
        <p>
          <div>
            {r.status_indication === 0 && (
              <i
                className="glyphicon glyphicon-play mr10"
                style={{
                  color: "#FFE900",
                  transform: "rotate(90deg)",
                  fontSize: "16px",
                }}
              />
            )}
            {r.status_indication === 1 && (
              <i
                className="glyphicon glyphicon-play"
                style={{
                  color: "green",
                  transform: "rotate(270deg)",
                  fontSize: "16px",
                }}
              />
            )}
          </div>
        </p>
        <p>
          <CustomButton
            buttonText="Details"
            buttonClassName="tradebtn"
            handleButtonClick={() => handleModalAction("details", r)}
          />
        </p>
        <p>
          <CustomButton
            buttonText="Graph"
            buttonClassName="tradebtn"
            handleButtonClick={() => {
              handleModalAction("graph", r);
              setToggleGraph(!toggle);
            }}
          />
        </p>
        <p>
          <CustomButton
            buttonText="Download"
            buttonClassName="tradebtn"
            handleButtonClick={() => downloadCampaignReport(r)}
          />
        </p>
      </span>
    ));
    return body;
  };

  return (
    <Accordion
      className="manage-campaign-accordion-container"
      columnList={
        activeTab.id === "active" ? activeAccordionHeader : accordionHeader
      }
    >
      <Collapse in={activeAccordion ? true : false} appear={true}>
        <div className="ncm-manage-accordion-block ncm-manage-accordion-content">
          {isLoadingAccordion && (
            <p className="text-center">
              <strong>Loading...</strong>
            </p>
          )}
          {!isLoadingAccordion &&
          activeTab.id !== "active" &&
          orderReplacementInfo?.length ? (
            <div>
              <p className="dish-select-campaign-heading text-center capitalize mb10">
                Order Details
              </p>
              <>
                <div className="mn-creative-grid-layout mb15-imp">
                  {getAccordionHeader()}
                </div>
                {getAccordionBody()}
              </>
            </div>
          ) : (
            <>
              {!isLoadingAccordion && activeTab.id !== "active" && (
                <div className="text-center">
                  <p>No Data Found.</p>
                </div>
              )}
            </>
          )}
          {!isLoadingAccordion &&
          activeTab.id === "active" &&
          activeReportData?.length ? (
            <div>
              <p className="dish-select-campaign-heading text-center capitalize mb10">
                Order Report Details
              </p>
              <>
                <div className="mn-creative-grid-layout mb15-imp">
                  {getActiveAccordionHeader()}
                </div>
                {getActiveAccordionBody()}
              </>
            </div>
          ) : (
            <>
              {!isLoadingAccordion && activeTab.id === "active" && (
                <div className="text-center">
                  <p>No Data Found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </Collapse>
    </Accordion>
  );
};

NcmManageAccordion.propTypes = {
  activeAccordion: PropTypes.bool,
  orderDetailData: PropTypes.any,
  orderReplacementInfo: PropTypes.array,
  uiStore: PropTypes.any,
  isLoadingAccordion: PropTypes.bool,
  accordionHeader: PropTypes.array,
  getVideoUrlForAccordion: PropTypes.func,
  isLoading: PropTypes.bool,
  activeTab: PropTypes.object,
  activeReportData: PropTypes.array,
  activeAccordionHeader: PropTypes.array,
  handleModalAction: PropTypes.func,
  toggle: PropTypes.bool,
  setToggleGraph: PropTypes.func,
  downloadCampaignReport: PropTypes.func,
};

export default NcmManageAccordion;
