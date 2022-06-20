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
  height: 78vh;
  overflow: auto;
`;

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
    showEditHouseIdModal,
  } = props;

  useEffect(() => {
    if (tableData && tableData.length) {
      const wrapperElem = document.getElementById('table_wrapper_top');
      const mainElem = document.getElementById('table_top');
      if (wrapperElem.clientHeight > mainElem.clientHeight && !isLoading && nextPageUrl) {
        handlePagination();
      }
    }
  }, [tableData]);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop < e.target.clientHeight + 40;
    if (bottom && !isLoading && nextPageUrl) {
      handlePagination();
    }
  };

  return (
    <TableWrapper id="table_wrapper_top" onScroll={(e) => handleScroll(e)} ref={tableRef}>
      <table id="table_top" className="table table-striped table-wrapper mt10 wrapped-table">
        <thead>
          <tr>
            {tableHeadings?.map((heading) => (
              <th key={heading.id} {...(heading.colSpan && { colSpan: heading.colSpan })}>
                <span className="mr10">{heading.name}</span>
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
              <td>{a?.adid_meta_file_upload?.[0]?.brand_name || '---'}</td>
              <td>{a?.adid_meta_file_upload?.[0]?.sub_brand_name || '---'}</td>
              {isSuperDash ? <td>{a?.adid_meta_file_upload?.[0]?.agency_name || '---'}</td> : null}
              <td>
                {!(isSuperDash || isAgAdvDash)
                  ? a?.adid_meta_file_upload?.[0]?.creative_name
                  : a?.adid_meta_file_upload?.[0]?.ad_name}
              </td>
              <td className="no-text-transform">{a?.adid_meta_file_upload?.[0]?.identifier}</td>
              <td>{a?.adid_meta_file_upload?.[0]?.delivery_vendor}</td>
              <td>
                {a?.house_id && a?.house_id !== '-' ? (
                  a?.house_id
                ) : (
                  <div>
                    {'N/A'}
                    {
                      <FaEdit
                        className="cursor-pointer"
                        style={{ marginLeft: '10px' }}
                        size={14}
                        color="grey"
                        onClick={() => {
                          showEditHouseIdModal(a);
                        }}
                      />
                    }
                  </div>
                )}
              </td>
              <td>{a?.adid_meta_file_upload?.[0]?.actual_duration.toString() ?? '0'} sec</td>
              {isSuperDash ? (
                <>
                  <td colSpan={2}>
                    {a?.adid_meta_file_upload?.[0]?.associated_networks?.length
                      ? a.adid_meta_file_upload?.[0]?.associated_networks.map((d) => (
                          <p className="mr5" key={d.id}>
                            {d.name}
                            {/* Commented info icon for super admin manage creatives table network associated column data */}
                            {/* <OverlayTrigger
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
                            </OverlayTrigger> */}
                          </p>
                        ))
                      : 'No Association'}
                  </td>
                  <td colSpan={2}>
                    {a?.adid_meta_file_upload?.[0]?.associated_channel_groups?.[0]?.channel_groups &&
                    Object.entries(a?.adid_meta_file_upload?.[0]?.associated_channel_groups?.[0]?.channel_groups).length
                      ? Object.values(
                          a.adid_meta_file_upload?.[0]?.associated_channel_groups?.[0]?.channel_groups
                        )?.map((d) =>
                          d.map((c, index) => (
                            <p className="mr5" key={index}>
                              {Object?.values(Object?.entries(c)?.[0]?.[1])?.join(', ')}
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
                    ></CustomButton>
                  </td>
                  <td>
                    <CustomButton
                      buttonText="Add Channel"
                      handleButtonClick={() => onChannelAssociate(a)}
                      buttonClassName="tradebtn"
                    ></CustomButton>
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
              ) : (
                <td>
                  {a?.adid_meta_file_upload?.[0]?.channels && a?.adid_meta_file_upload?.[0]?.channels.length
                    ? a.adid_meta_file_upload[0].channels?.map((cdata, ind) => (
                        <div key={ind}>
                          {ind !== a.adid_meta_file_upload[0].channels.length - 1
                            ? `${cdata.display_name},`
                            : cdata.display_name}
                        </div>
                      ))
                    : 'N/A'}
                </td>
              )}
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
  showEditHouseIdModal: PropTypes.func,
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
  showEditHouseIdModal: () => {},
};

export default CreativesTable;
