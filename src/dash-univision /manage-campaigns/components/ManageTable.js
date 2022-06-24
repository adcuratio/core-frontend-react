import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

import CustomButton from "../../../components/CustomButton";

import NcmManageAccordion from "./ManageAccordion";
import { processUTCtoEST } from "../../../common/utils";

import moment from "moment";

export const TradeComponent = styled.table`
  .mn-trade-button-alignment {
    display: flex;
    flex: 1.5;
    word-break: break-word;
    font-size: 13px;
    color: #000;
    align-items: center;
    justify-content: center;
    width: auto !important;
  }
  .mn-accordion-table-cell {
    padding: 0px !important;
    height: 0px !important;
    border: none !important;
  }
  .mn-trade-btn {
    min-width: 54px !important;
    font-size: 11px !important;
  }
  .mn-font {
    font-size: 13px !important;
  }
`;

const NcmManageTable = (props) => {
  const {
    searchDataList,
    activeTab,
    activeTradesTableTitle,
    pausedTradesTableTitle,
    pendingDistributorTradesTableTitle,
    pendingUCITradesTableTitle,
    declineTradesTableTitle,
    toggle,
    isLoading,
    activeAccordion,
    orderDetailData,
    orderReplacementInfo,
    accordionHeader,
    getVideoUrlForAccordion,
    isLoadingAccordion,
    activeReportData,
    activeAccordionHeader,
    handleModalAction,
    toggleGraph,
    setToggleGraph,
    downloadCampaignReport,
    goToAggOrderDetails,
    goToAggAddTarget,
    toggleOrderCancelModal,
    toggleApproveModal,
    authStore,
    completedTradesTableTitle,
  } = props;

  const [isTooltipShown, setIsTooltipShown] = useState(true);
  const [sortedSearchDataList, setSortedSearchDataList] = useState([]);

  const renderTableHeadings = () => {
    let tableTitles = [];
    // getting table titles based on tab
    if (activeTab?.id === "active") {
      tableTitles = activeTradesTableTitle;
    } else if (activeTab?.id === "cancelled") {
      tableTitles = pausedTradesTableTitle;
    } else if (activeTab?.id === "pendingDistributorApproval") {
      tableTitles = pendingDistributorTradesTableTitle;
    } else if (activeTab?.id === "pendingUCIApproval") {
      tableTitles = pendingUCITradesTableTitle;
    } else if (activeTab?.id === "completed") {
      tableTitles = completedTradesTableTitle;
    }
    // rendering table titles
    if (tableTitles?.length) {
      const tableHeaders = [];
      tableTitles.forEach((title) => {
        tableHeaders.push(
          <th
            className="mn-font text-align-center-imp"
            key={`${activeTab.id}${title.id}`}
          >
            {title.heading}
          </th>
        );
      });
      return tableHeaders;
    }
    return null;
  };

  const sortByCancelledDate = () => {
    const searchDataListCopy = [...searchDataList];
    searchDataListCopy?.sort((a, b) => {
      const value1 = a.canceled;
      const value2 = b.canceled;
      if (value1 > value2) {
        return -1;
      }
      if (value1 < value2) {
        return 1;
      }
      return 0;
    });
    setSortedSearchDataList(searchDataListCopy);
  };

  useEffect(() => {
    if (activeTab?.id === "cancelled") {
      sortByCancelledDate();
    } else {
      setSortedSearchDataList(searchDataList);
    }
  }, [searchDataList]);

  const tooltip = <Tooltip id="tooltip">Click to view more details</Tooltip>;

  const getPlacement = (res_index) => {
    const isTop =
      searchDataList.length - res_index < 2 && searchDataList.length !== 1;
    return isTop ? "top" : "bottom";
  };

  const ExtendedCustomBtn = (props) => (
    <CustomButton
      onMouseEnter={() => setIsTooltipShown(false)}
      onMouseLeave={() => setIsTooltipShown(true)}
      {...props}
    />
  );

  const tableRow = (a) => (
    <tr
      className="wrapped-table"
      role="button"
      onClick={() => toggle(a)}
      onMouseEnter={() => !isTooltipShown && setIsTooltipShown(true)}
    >
      <td className="mn-font text-align-center-imp">
        {a.order_identifier || "---"}
      </td>
      <td className="mn-font text-align-center-imp">
        {a.adv_company_name || "---"}
      </td>
      <td className="mn-font text-align-center-imp">{a.name || "---"}</td>
      {/* {activeTab.id === 'active' && <td className="mn-font text-align-center-imp">{a.desired_impressions || '---'}</td>} */}
      <td className="mn-font text-align-center-imp">{a.start_date || "---"}</td>
      <td className="mn-font text-align-center-imp">{a.end_date || "---"}</td>

      <td className="mn-font text-align-center-imp">
        {`${a?.created_by?.first_name} ${a?.created_by?.last_name}` || "---"}
        <div>{`${moment(a?.created)
          .tz("America/New_York")
          .format("YYYY-MM-DD")}`}</div>
        <div>{`${moment(a?.created)
          .tz("America/New_York")
          .format("HH:mm:ss")} EST`}</div>
      </td>

      {activeTab.id === "cancelled" && (
        <td className="mn-font text-align-center-imp">
          {`${a?.canceled_by?.first_name} ${a?.canceled_by?.last_name}` ||
            "---"}
          <div>{`${moment(a?.canceled)
            .tz("America/New_York")
            .format("YYYY-MM-DD")}`}</div>
          <div>{`${moment(a?.canceled)
            .tz("America/New_York")
            .format("HH:mm:ss")} EST`}</div>
        </td>
      )}

      {(activeTab.id === "pendingDistributorApproval" ||
        activeTab.id === "pendingUCIApproval") && (
        <td className="mn-font text-align-center-imp">{a.creative_count}</td>
      )}

      {activeTab.id !== "pendingUCIApproval" && (
        <td className="mn-font text-align-center-imp">
          {a?.uci_approved
            ? `Confirmed by ${a?.uci_approved?.first_name} ${
                a?.uci_approved?.last_name
              } at ${processUTCtoEST(a.uci_approved.approved_at)} ET`
            : "N/A"}
          <br />
          {a?.orderline_uci_approval ? null : (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="standard-campaign-tooltip">
                  Some orderlines have not been approved
                </Tooltip>
              }
            >
              <i
                className="glyphicon glyphicon-info-sign"
                aria-hidden="true"
                style={{ color: "red", fontSize: "18px" }}
              />
            </OverlayTrigger>
          )}
        </td>
      )}
      <td className="mn-font text-align-center-imp">
        {/* {(activeTab.id === 'pendingDistributorApproval' || activeTab.id === 'active') && (
          <ExtendedCustomBtn
            buttonText="Edit"
            buttonClassName="tradebtn mn-trade-btn"
            handleButtonClick={() =>
              editCampaign(a, activeTab.id === 'pendingDistributorApproval' ? 'pending' : 'active')
            }
          />
        )} */}
        <ExtendedCustomBtn
          buttonText="Details"
          buttonClassName="tradebtn mn-trade-btn ml5"
          handleButtonClick={(e) => goToAggOrderDetails(a, e, activeTab?.id)}
        />
        {activeTab.id !== "cancelled" &&
          activeTab.id !== "completed" &&
          activeTab.id !== "pendingUCIApproval" && ( //need to change this
            <ExtendedCustomBtn
              buttonText="Add"
              buttonClassName="tradebtn mn-trade-btn ml5"
              handleButtonClick={(e) => goToAggAddTarget(a, e)}
            />
          )}
        {activeTab.id !== "cancelled" &&
          activeTab.id !== "completed" &&
          activeTab.id !== "pendingUCIApproval" && (
            <ExtendedCustomBtn
              buttonText="Cancel"
              buttonClassName="tradebtn mn-trade-btn ml5"
              handleButtonClick={(e) => toggleOrderCancelModal(a, e)}
            />
          )}
      </td>
      {activeTab.id === "pendingUCIApproval" &&
        (a?.created_by?.id !==
        authStore.getUser()?.related_data?.network_admin_id ? (
          <td className="mn-font text-align-center-imp">
            <ExtendedCustomBtn
              buttonText="Approve"
              buttonClassName="tradebtn mn-trade-btn ml5"
              handleButtonClick={(e) => toggleApproveModal(a, e)}
            />
            <ExtendedCustomBtn
              buttonText="Decline"
              buttonClassName="tradebtn mn-trade-btn ml5"
              handleButtonClick={(e) => toggleOrderCancelModal(a, e)}
            />
          </td>
        ) : (
          <td>Pending approval</td>
        ))}
      {activeTab?.id === "completed" && (
        <td>
          <ExtendedCustomBtn
            buttonText="Pacing Graph"
            buttonClassName="tradebtn mn-trade-btn ml25"
            handleButtonClick={() => {
              handleModalAction("report", a);
              setToggleGraph(!toggleGraph);
            }}
          />
        </td>
      )}
      {activeTab?.id === "completed" && (
        <td>
          <ExtendedCustomBtn
            buttonText=" Network Report"
            buttonClassName="tradebtn mn-trade-btn ml25"
            handleButtonClick={() => {
              handleModalAction("network_report", a);
              setToggleGraph(!toggleGraph);
            }}
          />
          <ExtendedCustomBtn
            buttonText=" Daypart Report"
            buttonClassName="tradebtn mn-trade-btn ml25"
            handleButtonClick={() => {
              handleModalAction("daypart_report", a);
              setToggleGraph(!toggleGraph);
            }}
          />
        </td>
      )}
    </tr>
  );

  const renderTableBody = () => {
    if (searchDataList && searchDataList.length) {
      const tableContent = [];
      sortedSearchDataList.forEach((a, res_index) => {
        const isActiveAccordion = a.id && activeAccordion === a.id;
        const disableOverlay = isActiveAccordion || !isTooltipShown;
        tableContent.push(
          <React.Fragment key={`MainTable${a.id}`}>
            {disableOverlay ? (
              tableRow(a)
            ) : (
              <OverlayTrigger
                overlay={tooltip}
                delayShow={1000}
                placement={getPlacement(res_index)}
              >
                {tableRow(a)}
              </OverlayTrigger>
            )}
            {a.id && activeAccordion === a.id ? (
              <tr key={`ncmManageAcc${a.id}`}>
                <td className="mn-accordion-table-cell">
                  <NcmManageAccordion
                    activeAccordion={activeAccordion === a.id}
                    accordionHeader={accordionHeader}
                    orderDetailData={orderDetailData}
                    orderReplacementInfo={orderReplacementInfo}
                    getVideoUrlForAccordion={getVideoUrlForAccordion}
                    isLoadingAccordion={isLoadingAccordion}
                    activeReportData={activeReportData}
                    activeTab={activeTab}
                    activeAccordionHeader={activeAccordionHeader}
                    handleModalAction={handleModalAction}
                    toggle={toggleGraph}
                    setToggleGraph={setToggleGraph}
                    downloadCampaignReport={downloadCampaignReport}
                  />
                </td>
              </tr>
            ) : null}
          </React.Fragment>
        );
      });
      return tableContent;
    }

    return (
      <>
        {!(searchDataList && searchDataList.length) && !isLoading ? (
          <tr>
            <td
              colSpan={
                activeTab?.id === "declined"
                  ? declineTradesTableTitle.length
                  : activeTab?.id === "active" || activeTab?.id === "completed"
                  ? activeTradesTableTitle.length
                  : pausedTradesTableTitle.length
              }
            >
              <p className="text-center">No Orders</p>
            </td>
          </tr>
        ) : null}
      </>
    );
  };

  return (
    <TradeComponent
      key="TableDataTrade"
      className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder"
    >
      <thead>
        <tr>{renderTableHeadings()}</tr>
      </thead>
      <tbody>{renderTableBody()}</tbody>
    </TradeComponent>
  );
};

NcmManageTable.propTypes = {
  searchDataList: PropTypes.array,
  isAgencyAdminUser: PropTypes.bool,
  activeTab: PropTypes.object,
  activeTradesTableTitle: PropTypes.array,
  pausedTradesTableTitle: PropTypes.array,
  pendingDistributorTradesTableTitle: PropTypes.array,
  pendingUCITradesTableTitle: PropTypes.array,
  declineTradesTableTitle: PropTypes.array,
  getVideoUrl: PropTypes.func,
  handleTableButtonAction: PropTypes.func,
  toggle: PropTypes.func,
  open: PropTypes.bool,
  activeAccordion: PropTypes.any,
  setActiveAccordion: PropTypes.func,
  orderDetailData: PropTypes.any,
  orderReplacementInfo: PropTypes.array,
  accordionHeader: PropTypes.array,
  getVideoUrlForAccordion: PropTypes.func,
  getViewTrades: PropTypes.func,
  isLoadingAccordion: PropTypes.bool,
  isLoading: PropTypes.bool,
  activeReportData: PropTypes.array,
  activeAccordionHeader: PropTypes.array,
  handleModalAction: PropTypes.func,
  toggleGraph: PropTypes.bool,
  setToggleGraph: PropTypes.func,
  downloadCampaignReport: PropTypes.func,
  editCampaign: PropTypes.func,
  goToAggOrderDetails: PropTypes.func,
  goToAggAddTarget: PropTypes.func,
  toggleOrderCancelModal: PropTypes.func,
  toggleApproveModal: PropTypes.func,
  authStore: PropTypes.object,
  completedTradesTableTitle: PropTypes.array,
};

NcmManageTable.defaultProps = {
  searchDataList: [],
  isAgencyAdminUser: false,
  activeTab: {},
  activeTradesTableTitle: [],
  pausedTradesTableTitle: [],
  declineTradesTableTitle: [],
  pendingDistributorTradesTableTitle: [],
  pendingUCITradesTableTitle: [],
  getVideoUrl: () => {},
  handleTableButtonAction: () => {},
  goToAggOrderDetails: () => {},
  goToAggAddTarget: () => {},
  toggleApproveModal: () => {},
  completedTradesTableTitle: [],
};

export default NcmManageTable;
