import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaEdit } from 'react-icons/fa';

import CustomButton from '../../CustomButton';

const ThumbnailWrapper = styled.div`
  width: 100px;
  max-width: 100%;
  max-height: 100%;
`;

const ThumbnailImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const TableWrapper = styled.div`
  height: calc(80vh - 50px);
  overflow: auto;
`;

const NetworkCreativesTableContainer = (props) => {
  const {
    manageCreativesTableTitles,
    creativesFilteredData,
    isLoading,
    handleModalAction,
    handleDownloadAction,
    selectedTab,
    nextPageUrl,
    handlePagination,
    tableRef,
    type,
  } = props;

  useEffect(() => {
    if (creativesFilteredData && creativesFilteredData.length) {
      const wrapperElem = document.getElementById('table_wrapper_top');
      const mainElem = document.getElementById('table_top');
      if (wrapperElem.clientHeight > mainElem.clientHeight && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  }, [creativesFilteredData]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
    if (bottom && !isLoading && nextPageUrl) {
      handlePagination();
    }
  };

  return (
    <TableWrapper className="table-container" id="table_wrapper_top" onScroll={(e) => handleScroll(e)} ref={tableRef}>
      <table id="table_top" className="table table-striped table-wrapper mt10 wrapped-table">
        <thead>
          <tr>
            {manageCreativesTableTitles?.map((heading) => (
              <th key={`nc_headings_${heading.id}`} {...(heading.columnSpan && { colSpan: heading.columnSpan })}>
                <span className="break-word">{heading.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {creativesFilteredData?.map((res) => (
            <tr key={res.id}>
              <td>
                <ThumbnailWrapper
                  className="video-thumbnail video-thumbnail-small"
                  onClick={() => handleModalAction('viewCreative', res)}
                >
                  <ThumbnailImage src={res.s3_thumbnail_url} />
                </ThumbnailWrapper>
              </td>
              <td>{res.company_name || '---'}</td>
              <td>{res.brand_name || '---'}</td>
              <td>{res.sub_brand_name || '---'}</td>
              <td className="bold">{res.creative_name || '---'}</td>
              <td>{res.identifier || '---'}</td>
              <td>
                <div className="break-word">
                  {res.creative_watermark[0]?.watermark_id || '---'}
                  {type && selectedTab.id === 'nt_cr_pending' && (
                    <FaEdit
                      className="cursor-pointer ml5"
                      size={20}
                      color="grey"
                      onClick={() => handleModalAction('editWatermarkid', res)}
                    />
                  )}
                </div>
              </td>
              <td>{res.agency_name || '---'}</td>
              <td>{res.agency_name || '---'}</td>
              <td>{res.delivery_vendor || '---'}</td>
              <td>{`${res.actual_duration} sec` || '---'}</td>
              <td>
                {res?.channels && res?.channels.length
                  ? res.channels?.map((cdata, ind) => (
                      <div key={ind}>
                        {ind !== res.channels.length - 1 ? `${cdata.display_name},` : cdata.display_name}
                      </div>
                    ))
                  : 'N/A'}
              </td>

              {selectedTab.id === 'nt_cr_pending' && (
                <>
                  <td colSpan={2}>
                    <CustomButton
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleModalAction('qa_approve', res)}
                      buttonText="Confirm"
                    ></CustomButton>
                    <CustomButton
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleModalAction('qa_decline', res)}
                      buttonText="Decline"
                    ></CustomButton>
                  </td>
                  <td>
                    <CustomButton
                      buttonText="Watermark File"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'watermarkFile')}
                    />
                    <CustomButton
                      buttonText="Watermark Origin"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'WatermarkOrigin')}
                    />
                  </td>
                </>
              )}

              {selectedTab.id === 'nt_cr_approved' && (
                <>
                  <td>
                    {res.creative_watermark && res.creative_watermark.length
                      ? `${res.creative_watermark[0]?.first_name} ${res.creative_watermark[0]?.last_name}`
                      : '---'}
                  </td>
                  <td>
                    <CustomButton
                      buttonText="Watermark File"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'watermarkFile')}
                    />
                    <CustomButton
                      buttonText="Watermark Origin"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'WatermarkOrigin')}
                    />
                  </td>
                </>
              )}

              {selectedTab.id === 'nt_cr_declined' && (
                <>
                  <td>
                    {res.creative_watermark && res.creative_watermark.length
                      ? `${res.creative_watermark[0]?.first_name} ${res.creative_watermark[0]?.last_name}`
                      : '---'}
                  </td>
                  <td>
                    <CustomButton
                      buttonText="Watermark File"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'watermarkFile')}
                    />
                    <CustomButton
                      buttonText="Watermark Origin"
                      buttonClassName="tradebtn height-auto-imp"
                      handleButtonClick={() => handleDownloadAction(res, 'WatermarkOrigin')}
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
          {!(creativesFilteredData && creativesFilteredData.length) && !isLoading ? (
            <tr key="no_data_found">
              <td
                colSpan={manageCreativesTableTitles.reduce(
                  (acc, curr) => acc + (curr.columnSpan ? curr.columnSpan : 1),
                  0
                )}
                className="text-align-center-imp"
              >
                No data available.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </TableWrapper>
  );
};

NetworkCreativesTableContainer.propTypes = {
  manageCreativesTableTitles: PropTypes.array,
  creativesFilteredData: PropTypes.array,
  isLoading: PropTypes.bool,
  selectedTab: PropTypes.object,
  confirmCreative: PropTypes.func,
  creativePreview: PropTypes.func,
  handleModalAction: PropTypes.func,
  handleDownloadAction: PropTypes.func,
  searchValue: PropTypes.string,
  sortGroup: PropTypes.func,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  tableRef: PropTypes.object,
  type: PropTypes.bool,
};

NetworkCreativesTableContainer.defaultProps = {
  handleModalAction: () => {},
  handleDownloadAction: () => {},
  searchValue: '',
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default NetworkCreativesTableContainer;
