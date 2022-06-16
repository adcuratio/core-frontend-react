import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CustomButton from '../../../../components/CustomButton';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { processUTCtoEST } from '../../../../common/utils';
import ConfirmModal from './ConfirmModal';
//import PreviewModal from './PreviewModal';

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
  height: 78vh;
  overflow: auto;
`;
// const DownloadIcon = styled.a`
//   color: black;
//   cursor: pointer;
//   font-size: 25px;

//   &:hover {
//     color: navy;
//     cursor: pointer;
//     font-size: 1.7vw;
//   }
// `;

const CreativesTable = (props) => {
  const {
    tableData,
    tableHeadings,
    isLoading,
    getVideoUrl,
    nextPageUrl,
    handlePagination,
    tableRef,
    onNetworkAssociate,
    onChannelAssociate,
    showApproveDataModal,
    isSuperDash,
    isAgAdvDash,
    //downloadFile,
    getAllCreatives,
  } = props;

  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState('');

  // useEffect(() => {
  //   if (tableData && tableData.length) {
  //     const wrapperElem = document.getElementById('table_wrapper_top');
  //     const mainElem = document.getElementById('table_top');
  //     if (wrapperElem.clientHeight > mainElem.clientHeight && !isLoading && nextPageUrl) {
  //       handlePagination();
  //     }
  //   }
  // }, [tableData]);

  const handleScroll = (e) => {
    if (e.target.id === 'table_wrapper_top') {
      const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
      if (bottom && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  };
  // const fetchData = (id) => { to hide watermark column remove comment if used
  //   downloadFile(id);
  // };

  const handleModalAction = (id) => {
    setModal(true);
    setModalData(id);
  };
  const ad_type = ['Ad Variant', 'Filler', 'UCI Underlying Linear'];

  return (
    <TableWrapper id="table_wrapper_top" onScroll={(e) => handleScroll(e)} ref={tableRef}>
      <table id="table_top" className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
        <thead>
          <tr>
            {tableHeadings?.map((heading) => (
              <th key={heading.id} {...(heading.colSpan && { colSpan: heading.colSpan })}>
                <span className="mr10" colSpan={heading.colSpan}>
                  {heading.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((a) => (
            <tr key={a?.adid_meta_file_upload?.[0]?.id}>
              <td>
                <ThumbnailWrapper className="video-thumbnail video-thumbnail-big" onClick={() => getVideoUrl(a)}>
                  <ThumbnailImage src={a.adid_meta_file_upload?.[0]?.s3_thumbnail_url} />
                </ThumbnailWrapper>
              </td>
              <td>{a?.adid_meta_file_upload?.[0]?.company_name || '---'}</td>
              <td>
                {[null, 3].includes(a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.ad_type)
                  ? '---'
                  : ad_type[a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.ad_type]}
              </td>

              {isSuperDash ? <td>{a?.adid_meta_file_upload?.[0]?.agency_name || '---'}</td> : null}
              <td>
                {!(isSuperDash || isAgAdvDash)
                  ? a?.adid_meta_file_upload?.[0]?.creative_name
                  : a?.adid_meta_file_upload?.[0]?.ad_name}
              </td>
              <td className="no-text-transform">{a?.adid_meta_file_upload?.[0]?.identifier}</td>
              <td>{a?.adid_meta_file_upload?.[0]?.delivery_vendor}</td>
              <td>{a?.adid_meta_file_upload?.[0]?.actual_duration.toString() ?? '0'} sec</td>
              {isSuperDash ? (
                <>
                  <td colSpan={2}>
                    {a?.adid_meta_file_upload?.[0]?.associated_networks?.length
                      ? a.adid_meta_file_upload?.[0]?.associated_networks.map((d) => (
                          <p className="mr5" key={d.id}>
                            {d.name}
                            <OverlayTrigger
                              container={this}
                              trigger={['hover', 'focus']}
                              rootClose
                              placement="left"
                              overlay={
                                <Popover id="popover-positioned-scrolling-bottom">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className="col-md-3 font-weight-bold">Name</th>
                                        <th className="col-md-3 font-weight-bold">Created At</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className="col-md-3">{d?.name ?? '-'}</td>
                                        <td className="col-md-3">{processUTCtoEST(d?.created ?? '-')} ET</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </Popover>
                              }
                            >
                              <i className="glyphicon glyphicon-info-sign cursor-pointer ml5" aria-hidden="true" />
                            </OverlayTrigger>
                          </p>
                        ))
                      : 'No Association'}
                  </td>
                  <td colSpan={2}>
                    {a?.adid_meta_file_upload?.[0]?.associated_channel_groups?.length
                      ? Object.values(a.adid_meta_file_upload?.[0]?.associated_channel_groups[0].channel_groups)?.map(
                          (d) =>
                            d.map((c, index) => (
                              <p className="mr5" key={index}>
                                {Object.values(c).join(', ')}
                              </p>
                            ))
                        )
                      : 'No Association'}
                  </td>
                  <td>
                    <CustomButton
                      buttonText={
                        a?.adid_meta_file_upload?.[0]?.associated_networks?.length ? 'Edit Network' : 'Add Network'
                      }
                      handleButtonClick={() => onNetworkAssociate(a)}
                      buttonClassName="tradebtn"
                    />
                  </td>
                  <td>
                    <CustomButton
                      buttonText="Add Channel"
                      handleButtonClick={() => onChannelAssociate(a)}
                      buttonClassName="tradebtn"
                    />
                  </td>
                </>
              ) : isAgAdvDash ? (
                <td>
                  {a?.approvalData ? (
                    <div>
                      <p> Approved for </p>
                      <p>
                        {a.approvalData.map((d, dIndex) => (
                          <span key={d.network_name}>
                            <span className="bold">{d.network_name}</span>
                            <span>
                              {d.dayparts}
                              {dIndex === a.approvalData.length - 1 ? (
                                <i
                                  className="glyphicon glyphicon-info-sign cursor-pointer ml5 mb5"
                                  onClick={() => showApproveDataModal(a)}
                                  aria-hidden="true"
                                />
                              ) : null}
                            </span>
                          </span>
                        ))}
                      </p>
                    </div>
                  ) : (
                    <p>N/A</p>
                  )}
                </td>
              ) : null}
              {/* <td>
                {[1, 2].includes(a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.status) ? (
                  'Confirmed'
                ) : a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.ad_type !== 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', width: '65px' }}>
                    <CustomButton
                      buttonText="Confirm"
                      buttonClassName="tradebtn"
                      handleButtonClick={() =>
                        handleModalAction(a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.id)
                      }
                    />
                  </div>
                ) : (
                  'N/A'
                )}
              </td> */}
              {/* <td colSpan={2}>
                <div className="flex-container2" style={{ marginRight: '40%' }}>
                  {ad_type[a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.ad_type] === 'Ad Variant' ? (
                    <>
                      <DownloadIcon
                        isDisabled={true}
                        className="height-auto-imp glyphicon glyphicon-download ml10 disabled-button"
                        onClick={null}
                      ></DownloadIcon>
                      <CustomButton
                        style={{ marginLeft: '10px' }}
                        className="disabled-button tradebtn"
                        buttonText="View"
                      />
                    </>
                  ) : (
                    <>
                      <DownloadIcon
                        disabled
                        className="height-auto-imp glyphicon glyphicon-download ml10"
                        onClick={() => fetchData(a?.adid_meta_file_upload?.[0]?.creative_watermark?.[0]?.id)}
                      ></DownloadIcon>
                      <PreviewModal id={a?.adid_meta_file_upload?.[0]?.creative_watermark?.[0]?.id} />
                    </>
                  )}
                </div>
              </td> */}

              {/* <td>
                <div>
                  {a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.status === 0 && (
                    <div style={{ color: '#CC5500' }}>Pending Watermark</div>
                  )}
                  {a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.status === 1 && (
                    <div style={{ color: '#F9C70C', fontSize: '16px' }}>Pending fingerprint</div>
                  )}
                  {a?.adid_meta_file_upload?.[0]?.univision_creative?.[0]?.status === 2 && (
                    <div style={{ color: '#006400' }}>Ready to serve</div>
                  )}
                  {a?.adid_meta_file_upload?.[0]?.univision_creative.length === 0 && (
                    <div style={{ color: '#8b0000' }}>NA</div>
                  )}
                </div>
              </td> */}

              <td>
                {!a?.adid_meta_file_upload?.[0]?.is_received?.[0]?.first_name
                  ? 'Pending Approval'
                  : `Confirmed by ${a?.adid_meta_file_upload?.[0]?.is_received?.[0]?.first_name}
              ${a?.adid_meta_file_upload?.[0]?.is_received?.[0]?.last_name}
             at ${processUTCtoEST(a?.adid_meta_file_upload?.[0].is_received?.[0]?.created)} ET`}
              </td>
            </tr>
          ))}
          {!(tableData && tableData.length) && !isLoading ? (
            <tr key="no_data_found">
              <td colSpan={tableHeadings.length} className="text-center-imp">
                No data available.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      {modal === true ? (
        <ConfirmModal
          modalData={modalData}
          setModal={setModal}
          getAllCreatives={getAllCreatives}
          handleModalAction={handleModalAction}
        />
      ) : undefined}
    </TableWrapper>
  );
};

CreativesTable.propTypes = {
  tableData: PropTypes.array,
  tableHeadings: PropTypes.array,
  isLoading: PropTypes.bool,
  getVideoUrl: PropTypes.func,
  nextPageUrl: PropTypes.string,
  handlePagination: PropTypes.func,
  tableRef: PropTypes.object,
  onNetworkAssociate: PropTypes.func,
  onChannelAssociate: PropTypes.func,
  showApproveDataModal: PropTypes.func,
  isSuperDash: PropTypes.bool,
  isAgAdvDash: PropTypes.bool,
  downloadFile: PropTypes.func,
  getAllCreatives: PropTypes.func,
};

CreativesTable.defaultProps = {
  tableData: [],
  tableHeadings: [],
  isLoading: PropTypes.bool,
  nextPageUrl: '',
  handlePagination: () => {},
  tableRef: {},
  onNetworkAssociate: () => {},
  onChannelAssociate: () => {},
  showApproveDataModal: () => {},
  isSuperDash: false,
  isAgAdvDash: false,
};

export default CreativesTable;
