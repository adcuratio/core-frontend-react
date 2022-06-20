import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip, OverlayTrigger, Popover } from 'react-bootstrap';

import CustomButton from '../../../components/CustomButton';

import { processUTCtoEST } from '../../../common/utils';

import NcmManageAccordion from './NcmManageAccordion';

const TradeComponent = styled.table`
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
    declineTradesTableTitle,
    handleTableButtonAction,
    toggle,
    isLoading,
    activeAccordion,
    orderDetailData,
    orderReplacementInfo,
    accordionHeader,
    getVideoUrl,
    getVideoUrlForAccordion,
    getViewTrades,
    isLoadingAccordion,
  } = props;

  const [isTooltipShown, setIsTooltipShown] = useState(true);

  const renderTableHeadings = () => {
    let tableTitles = [];
    // getting table titles based on tab
    if (activeTab?.id === 'active' || activeTab?.id === 'completed') {
      tableTitles = activeTradesTableTitle;
    } else if (
      activeTab?.id === 'paused' ||
      activeTab?.id === 'pendingAgencyApproval' ||
      activeTab?.id === 'pendingAdvApproval' ||
      activeTab?.id === 'pendingProcessing'
    ) {
      tableTitles = pausedTradesTableTitle;
    } else if (activeTab?.id === 'pendingDistributorApproval') {
      tableTitles = pendingDistributorTradesTableTitle;
    } else if (activeTab?.id === 'declined') {
      tableTitles = declineTradesTableTitle;
    }
    // rendering table titles
    if (tableTitles?.length) {
      const tableHeaders = [];
      tableTitles.forEach((title) => {
        tableHeaders.push(
          <th className="mn-font text-align-center-imp" key={`${activeTab.id}${title.id}`}>
            {title.heading}
          </th>
        );
      });
      return tableHeaders;
    }
    return null;
  };

  const tooltip = <Tooltip id="tooltip">Click to view more details</Tooltip>;

  const getPlacement = (res_index) => {
    const isTop = searchDataList.length - res_index < 2 && searchDataList.length !== 1;
    return isTop ? 'top' : 'bottom';
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
      onClick={() => toggle(a.id)}
      onMouseEnter={() => !isTooltipShown && setIsTooltipShown(true)}
    >
      <td className="mn-font text-align-center-imp">{a.order_identifier || '---'}</td>
      {activeTab?.id === 'declined' && <td className="mn-font text-align-center-imp">{a.adv_company_name || '---'}</td>}
      <td className="mn-font text-align-center-imp">{a.name || '---'}</td>

      {activeTab?.id === 'paused' ||
      activeTab?.id === 'pendingDistributorApproval' ||
      activeTab?.id === 'pendingAgencyApproval' ||
      activeTab?.id === 'pendingAdvApproval' ||
      activeTab?.id === 'pendingProcessing' ||
      activeTab?.id === 'declined' ? (
        <>
          <td className="mn-font text-align-center-imp">
            {a.updated_by.first_name && a.updated_by.last_name
              ? `${a.updated_by.first_name} ${a.updated_by.last_name}`
              : '---'}
          </td>
          <td className="mn-font text-align-center-imp">
            {a.modified ? `${processUTCtoEST(a.modified).toLocaleString('en-US')} ` + `ET` : '---'}
          </td>
        </>
      ) : null}
      {activeTab?.id === 'active' || activeTab?.id === 'completed' ? (
        <>
          <td className="mn-font  text-align-center-imp">{(a.ad_id && a.ad_id.identifier) || '---'}</td>
          <td className="mn-font  text-align-center-imp">{a?.messaging_group || '---'}</td>
        </>
      ) : null}
      {activeTab?.id === 'declined' ? <td>{a.comment || '---'}</td> : null}
      <td className="mn-font  text-align-center-imp">{(a.ad_id && a.ad_id.identifier) || '---'}</td>
      <td className="mn-font  text-align-center-imp">
        {a?.ad_id && a.ad_id?.s3_thumbnail_url ? (
          <div
            className="video-thumbnail video-thumbnail-small  text-align-center-imp"
            onClick={(e) => getVideoUrl(a, e)}
          >
            <img
              className="creative-thumb-small"
              src={a.ad_id.s3_thumbnail_url}
              onMouseEnter={() => setIsTooltipShown(false)}
              onMouseLeave={() => setIsTooltipShown(false)}
            />
          </div>
        ) : (
          'Not Available'
        )}
      </td>

      {activeTab?.id === 'pendingDistributorApproval' ? (
        <td className="mn-font text-align-center-imp">
          {a?.trade_operator?.length
            ? a.trade_operator.map((d) => (
                <p key={d.operator_name} className="bold">
                  {d.operator_name}
                  <OverlayTrigger
                    container={this}
                    rootClose
                    placement="right"
                    overlay={
                      <Popover className="popover-creatives" id={`${d.operator_name}_popover`}>
                        {d.status === 0
                          ? 'Approved'
                          : d.status === 1
                          ? 'Processing'
                          : d.status === 2
                          ? 'Campaign Completed'
                          : d.status === 3
                          ? 'Pending Precheck'
                          : d.status === 4
                          ? 'Pending Approval'
                          : d.status === 5
                          ? 'Declined'
                          : ''}
                      </Popover>
                    }
                  >
                    <i
                      className="glyphicon glyphicon-info-sign ml10"
                      aria-hidden="true"
                      onMouseEnter={() => setIsTooltipShown(false)}
                      onMouseLeave={() => setIsTooltipShown(false)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </OverlayTrigger>
                </p>
              ))
            : '---'}
        </td>
      ) : null}
      <td className="mn-trade-button-alignment  text-align-center-imp">
        {activeTab?.id === 'active' && (
          <ExtendedCustomBtn
            buttonText="Pause"
            buttonClassName="tradebtn mn-trade-btn"
            handleButtonClick={(e) => handleTableButtonAction('active', a, e)}
          />
        )}
        {activeTab?.id === 'paused' && (
          <ExtendedCustomBtn
            buttonText="Activate"
            buttonClassName="tradebtn mn-trade-btn"
            handleButtonClick={(e) => handleTableButtonAction('paused', a, e)}
          />
        )}
        {((!props.isAgencyAdminUser && activeTab.id === 'pendingAdvApproval') ||
          (props.isAgencyAdminUser && activeTab?.id === 'pendingAgencyApproval')) && (
          <>
            <ExtendedCustomBtn
              buttonText="Approve"
              buttonClassName="tradebtn mn-trade-btn"
              handleButtonClick={(e) => handleTableButtonAction('approve', a, e)}
            />
            <ExtendedCustomBtn
              buttonText="Decline"
              buttonClassName="tradebtn mn-trade-btn"
              handleButtonClick={(e) => handleTableButtonAction('decline', a, e)}
            />
          </>
        )}

        <ExtendedCustomBtn
          buttonText="View"
          buttonClassName="tradebtn mn-trade-btn"
          handleButtonClick={(e) => getViewTrades(a, e)}
        />
      </td>
    </tr>
  );

  const renderTableBody = () => {
    if (searchDataList && searchDataList.length) {
      const tableContent = [];
      searchDataList.forEach((a, res_index) => {
        const isActiveAccordion = a.id && activeAccordion === a.id;
        const disableOverlay = isActiveAccordion || !isTooltipShown;
        tableContent.push(
          <React.Fragment key={`MainTable${a.id}`}>
            {disableOverlay ? (
              tableRow(a)
            ) : (
              <OverlayTrigger overlay={tooltip} delayShow={1000} placement={getPlacement(res_index)}>
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
                activeTab?.id === 'declined'
                  ? declineTradesTableTitle.length
                  : activeTab?.id === 'active' || activeTab?.id === 'completed'
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
    <TradeComponent key="TableDataTrade" className="table table-striped table-wrapper mt10 wrapped-table">
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
};

NcmManageTable.defaultProps = {
  searchDataList: [],
  isAgencyAdminUser: false,
  activeTab: {},
  activeTradesTableTitle: [],
  pausedTradesTableTitle: [],
  declineTradesTableTitle: [],
  pendingDistributorTradesTableTitle: [],
  getVideoUrl: () => {},
  handleTableButtonAction: () => {},
};

export default NcmManageTable;
