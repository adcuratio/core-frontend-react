import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import CustomButton from '../../../CustomButton';

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
    selectedTab,
    nextPageUrl,
    handlePagination,
    tableRef,
  } = props;

  const getPlacement = (res_index) => (creativesFilteredData.length - res_index <= 2 ? 'top' : 'bottom');

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
                <span className="mr10">{heading.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {creativesFilteredData?.map((res, res_index) => (
            <tr key={res.id}>
              <td>
                <ThumbnailWrapper
                  className="video-thumbnail video-thumbnail-big"
                  onClick={() => handleModalAction('viewCreative', res)}
                >
                  <ThumbnailImage src={res.adid_meta_file_upload[0]?.s3_thumbnail_url} />
                </ThumbnailWrapper>
              </td>
              <td>{res.adid_meta_file_upload[0]?.company_name || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.brand_name || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.sub_brand_name || '---'}</td>
              <td className="bold">{res.adid_meta_file_upload[0]?.ad_name || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.identifier || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.agency_name || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.agency_name || '---'}</td>
              <td>{res.adid_meta_file_upload[0]?.delivery_vendor || '---'}</td>
              <td>{`${res.actual_duration} sec` || '---'}</td>
              {selectedTab.id === 'nt_cr_pending' && (
                <td colSpan={2}>
                  <CustomButton
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleModalAction('approve', res)}
                    buttonText="Approve"
                  ></CustomButton>
                  <CustomButton
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleModalAction('decline', res)}
                    buttonText="Decline"
                  ></CustomButton>
                </td>
              )}
              {selectedTab.id === 'nt_cr_approved' && (
                <td>
                  {res.approvedChannelsAndDayparts?.map((cdpData, index) => (
                    <div key={`nt_cr_dp_${index}`} className="mb10">
                      {cdpData.channelName}
                      <OverlayTrigger
                        container={this}
                        trigger={['hover', 'focus']}
                        rootClose
                        placement={getPlacement(res_index)}
                        overlay={
                          <Popover id={`nt_cr_dp_ov_${res_index}_${index}`} className="popover-creatives">
                            <div className="row">
                              <div className="col-md-12">
                                <span className="font-weight-bold">Dayparts approved</span>
                                <div className="pt5">
                                  <span className="white-space-pre-line">{cdpData.dayparts}</span>
                                </div>
                              </div>
                            </div>
                          </Popover>
                        }
                      >
                        <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                      </OverlayTrigger>
                    </div>
                  ))}

                  <CustomButton
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleModalAction('edit', res)}
                    buttonText="Edit"
                  ></CustomButton>
                </td>
              )}

              {selectedTab.id === 'nt_cr_declined' && (
                <>
                  <td colSpan={2}>
                    <div>
                      {res.declineComment} &nbsp;
                      <OverlayTrigger
                        container={this}
                        trigger={['hover', 'focus']}
                        rootClose
                        placement={getPlacement(res_index)}
                        overlay={
                          <Popover id="popover-positioned-scrolling-bottom" className="popover-creatives">
                            <div className="row">
                              <div className="col-md-6 font-weight-bold">Declined At</div>
                              <div className="col-md-6 font-weight-bold">Declined By</div>
                              <div className="clearfix">
                                <div className="col-md-6">{res.declinedAt}</div>
                                <div className="col-md-6">{res.declinedBy}</div>
                              </div>
                            </div>
                          </Popover>
                        }
                      >
                        <i className="glyphicon glyphicon-info-sign" aria-hidden="true" />
                      </OverlayTrigger>
                    </div>
                  </td>
                  <td>
                    <CustomButton
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleModalAction('approve', res)}
                      buttonText="Approve"
                    ></CustomButton>
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
  searchValue: PropTypes.string,
  sortGroup: PropTypes.func,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  tableRef: PropTypes.object,
};

NetworkCreativesTableContainer.defaultProps = {
  handleModalAction: () => {},
  searchValue: '',
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
};

export default NetworkCreativesTableContainer;
