import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import styled from 'styled-components';

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
    grid-template-columns: ${(props) => props.columnList.map(() => `${100 / props.columnList.length}% `).join('')};
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
    orderDetailData,
    orderReplacementInfo,
    accordionHeader,
    getVideoUrlForAccordion,
    isLoadingAccordion,
  } = props;

  const getAccordionHeader = () =>
    accordionHeader?.map((header) => (
      <p className="bold text-center" key={`HeaderAccordion${header.id}`}>
        {header.name}
      </p>
    ));

  const getAccordionBody = () => {
    const body = orderReplacementInfo?.map((a) =>
      a.segments?.map((r) => (
        <span className="mn-accordion-body-wrapper mn-creative-grid-layout mb10 text-center" key={`accId${r.id}`}>
          <p className="mn-accordion-font">{r.name}</p>
          <p className="mn-accordion-font">{r.ratio}</p>
          <p className="mn-accordion-font">{r?.frequency_cap?.frequency_cap ?? 'N/A'}</p>
          <p className="mn-accordion-font">
            {r?.frequency_cap?.min_threshold ? `${parseFloat(r?.frequency_cap?.min_threshold).toFixed(3)} %` : 'N/A'}
          </p>
          <p className="mn-accordion-font">
            {[0, 1, 2, 3].includes(r?.frequency_cap?.frequency_cap_period) ? (
              <>
                {r?.frequency_cap?.frequency_cap_period === 0 ? 'Day' : null}
                {r?.frequency_cap?.frequency_cap_period === 1 ? 'Week' : null}
                {r?.frequency_cap?.frequency_cap_period === 2 ? 'Month' : null}
                {r?.frequency_cap?.frequency_cap_period === 3 ? 'Campaign' : null}
              </>
            ) : (
              'N/A'
            )}
          </p>
          <p className="mn-accordion-font">{r.default_adid?.ad_name || 'NA'}</p>
          <p className="mn-accordion-font">{r.default_adid?.identifier}</p>
          <p>
            {r?.default_adid?.adid_meta_file_upload[0]?.s3_thumbnail_url ? (
              <label className="video-thumbnail video-thumbnail-small" onClick={(e) => getVideoUrlForAccordion(r, e)}>
                <img
                  className="creative-thumb-small"
                  src={r?.default_adid?.adid_meta_file_upload[0]?.s3_thumbnail_url}
                />
              </label>
            ) : (
              'Not Available'
            )}
          </p>
        </span>
      ))
    );
    return body;
  };

  const segData = orderReplacementInfo?.map((a) => a.segments);

  return (
    <Accordion className="manage-campaign-accordion-container" columnList={accordionHeader}>
      <Collapse in={activeAccordion ? true : false} appear={true}>
        <div className="ncm-manage-accordion-block ncm-manage-accordion-content">
          {isLoadingAccordion && (
            <p className="text-center">
              <strong>Loading...</strong>
            </p>
          )}
          {!isLoadingAccordion && segData?.length > 0 && orderDetailData?.pending_adspots ? (
            <>
              <div className="flex-container5 mn-accordion-border">
                <div className=" accordion-summary-wrapper manage-tiles-wrapper flex-container1">
                  <h1 className="ncm-manage-campaign-heading text-center capitalize mb10 total-campaign">
                    Pending Ad Spots :
                  </h1>
                  <div className="mn-accordion-summary-value">{orderDetailData?.pending_adspots}</div>
                </div>
                <div className="accordion-summary-wrapper manage-tiles-wrapper flex-container1 ncm-campaign-summary">
                  <h1 className="ncm-manage-campaign-heading text-center capitalize mb10 total-campaign">
                    Completed Ad Spots :
                  </h1>
                  <div className="mn-accordion-summary-value">{orderDetailData?.completed_adspots}</div>
                </div>
              </div>

              <>
                <div className="mn-creative-grid-layout mb15-imp">{getAccordionHeader()}</div>
                {getAccordionBody()}
              </>
            </>
          ) : (
            <>
              {!isLoadingAccordion && (
                <div className="text-center">
                  <p>No Orders</p>
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
};

export default NcmManageAccordion;
