import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-bootstrap';
import styled from 'styled-components';

const StyledAccordion = styled.div`
  text-transform: none !important;

  .dish-table-accordion-container {
    display: flex;
    flex-direction: column;
  }

  .dish-accordion-content {
    background: #ddd;
    position: inherit;
    padding: 10px;
    cursor: default;
  }

  .dish-select-campaign-heading {
    font-size: 18px;
    color: #243643 !important;
    padding: 10px 0px;
    font-weight: bold;
  }

  .dish-accordion-block {
    position: relative;
  }

  .accordian-body-wrapper {
    font-size: 0.9em;
  }

  .dish-disable-capitalization {
    text-transform: inherit !important;
  }

  .overflow-break-word {
    overflow-wrap: break-word;
  }

  .creative-grid-layout {
    display: grid;
    grid-template-columns: ${(props) => props.columnList.map(() => `${100 / props.columnList.length}% `).join('')};
  }

  .accordian-body-wrapper p {
    font-size: 12px;
  }
`;

const TableAccordion = (props) => {
  const {
    activeAccordion,
    accordianContent,
    getVideoUrlForAccordion,
    isLoadingAccordion,
    accrodionHeaderList,
    isVizioAccordion,
    selectedOrder,
  } = props;

  const getAccordionHeader = () =>
    accrodionHeaderList.map((header) => (
      <p className="bold pb10" key={header.id}>
        {header.name}
      </p>
    ));

  const getAccordionBody = (segments = []) => {
    const body = segments?.map((segment) => (
      <div className="accordian-body-wrapper creative-grid-layout mb10" key={`row${segment.id}`}>
        <p>{segment.ad_names || 'NA'}</p>
        <p className="no-text-transform">{segment.identifiers || '-'}</p>
        <p className="no-text-transform">{segment.asset_id || '-'}</p>
        {isVizioAccordion ? <p className="no-text-transform">{segment.ratio || '-'}</p> : null}
        <div>
          {segment.s3_thumbnail_url ? (
            <div className="video-thumbnail video-thumbnail-small" onClick={() => getVideoUrlForAccordion(segment)}>
              <img className="creative-thumb-small" src={segment.s3_thumbnail_url} />
            </div>
          ) : (
            <p>Not Available</p>
          )}
        </div>
        <p>{segment.confirmed}</p>
        {Object.prototype.hasOwnProperty.call(segment, 'confirmed_at') ? <p>{segment.confirmed_at}</p> : null}
        {Object.prototype.hasOwnProperty.call(segment, 'approved_at') ? <p>{segment.approved_at}</p> : null}
      </div>
    ));
    return body;
  };

  return (
    <StyledAccordion key="block" className="dish-table-accordion-container" columnList={accrodionHeaderList}>
      <Collapse in={activeAccordion ? true : false} appear={true}>
        <div className="dish-accordion-block">
          <div className="dish-accordion-content">
            {isLoadingAccordion && (
              <p className="text-center">
                <strong>Loading...</strong>
              </p>
            )}
            {!isLoadingAccordion && (
              <div>
                <p className="dish-select-campaign-heading text-center capitalize mb10">
                  {selectedOrder.order_name || ''} Order Details
                </p>
                {accordianContent?.length > 0 ? (
                  <>
                    <div className="creative-grid-layout">{getAccordionHeader()}</div>
                    {getAccordionBody(accordianContent)}
                  </>
                ) : (
                  <div className="text-center">
                    <p>No Orders</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Collapse>
    </StyledAccordion>
  );
};

TableAccordion.propTypes = {
  activeAccordion: PropTypes.bool,
  accordianContent: PropTypes.array,
  getVideoUrlForAccordion: PropTypes.func,
  isLoadingAccordion: PropTypes.bool,
  accrodionHeaderList: PropTypes.array,
  isVizioAccordion: PropTypes.bool,
  selectedOrder: PropTypes.object,
};

TableAccordion.defaultProps = {
  activeAccordion: false,
  accordianContent: [],
  getVideoUrlForAccordion: () => {},
  isLoadingAccordion: false,
  accrodionHeaderList: [],
  isVizioAccordion: false,
  selectedOrder: {},
};

export default TableAccordion;
