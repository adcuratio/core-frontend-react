/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';

import CustomButton from '../../../components/CustomButton';
import { formatNumber, processUTCtoEST } from '../../../common/utils';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const AudienceTable = (props) => {
  const {
    audienceTableTitles,
    audienceTableData,
    handleTableButtonAction,
    activeTab,
    isLoading,
    advFilterSelectedData,
  } = props;

  const renderTableHeader = () => {
    if (audienceTableTitles && audienceTableTitles.length) {
      const tableHeaderComp = [];
      audienceTableTitles?.forEach((title) => {
        if (activeTab.status === 0 && title.id !== 'status' && title.id !== 'rejection-date' && title.id !== 'reason') {
          tableHeaderComp.push(
            <th key={title?.id}>
              <span className="mr10"> {title?.name} </span>
            </th>
          );
        } else if (
          (activeTab.status === 2 || activeTab.status === 3) &&
          title.id !== 'status' &&
          title.id !== 'rejection-date' &&
          title.id !== 'reason' &&
          title.id !== 'approved-by-dish' &&
          title.id !== 'network-approved'
        ) {
          tableHeaderComp.push(
            <th key={title?.id}>
              <span className="mr10"> {title?.name} </span>
            </th>
          );
        } else if (
          activeTab.status === 1 &&
          title.id !== 'actions' &&
          title.id !== 'rejection-date' &&
          title.id !== 'reason' &&
          title.id !== 'status' &&
          title.id !== 'approved-by-dish' &&
          title.id !== 'network-approved'
        ) {
          tableHeaderComp.push(
            <th key={title?.id}>
              <span className="mr10"> {title?.name} </span>
            </th>
          );
        } else if (
          activeTab.status === 4 &&
          title.id !== 'actions' &&
          title.id !== 'status' &&
          title.id !== 'approved-by-dish' &&
          title.id !== 'network-approved'
        ) {
          tableHeaderComp.push(
            <th key={title?.id}>
              <span className="mr10"> {title?.name} </span>
            </th>
          );
        }
      });
      return tableHeaderComp;
    }
    return null;
  };

  const renderTableContent = () => {
    if (audienceTableData && audienceTableData.length) {
      const tableContentComp = [];
      audienceTableData?.forEach((audience) => {
        if (activeTab.status === 0) {
          tableContentComp.push(
            <tr key={audience?.id}>
              <td>{audience?.company_name}</td>
              <td>
                {audience?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : audience?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : audience?.data_provider === 'first_party'
                  ? 'UCI First Party'
                  : audience?.data_provider.split('_').join(' ')}
              </td>
              <td>{audience?.name}</td>
              <td>
                <div className="flex">
                  <span className="text-length">{audience?.description || 'N/A'}</span>
                  <span>
                    {
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Popover id="popover-positioned-scrolling-bottom" style={{ width: 'auto', fontSize: '14px' }}>
                            <div className="row">{audience?.description}</div>
                          </Popover>
                        }
                      >
                        <i className="glyphicon glyphicon-info-sign" aria-hidden="true" />
                      </OverlayTrigger>
                    }
                  </span>
                </div>
              </td>
              <td>
                {audience?.household_count && audience?.household_count !== 0
                  ? formatNumber(audience?.household_count)
                  : 'N/A'}
              </td>
              <td>
                {audience?.tag_file?.row_count && audience?.tag_file?.row_count !== 0
                  ? formatNumber(audience?.tag_file?.row_count)
                  : 'N/A'}
              </td>
              <td>
                Created By{' '}
                {audience.created
                  ? `${audience.tag_file?.created_by_data?.first_name} ${
                      audience.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(audience.created)} ET`
                  : 'N/A'}
              </td>
              {activeTab.status === 0 && (
                <td>
                  {audience?.operator_approval
                    ? `Approved by ${audience?.operator_approval?.first_name} ${
                        audience?.operator_approval?.last_name
                      } at ${processUTCtoEST(audience?.operator_approval?.approved_at)} ET`
                    : `N/A`}
                </td>
              )}
              {activeTab.status === 0 && (
                <td>
                  {audience?.univision_status !== null
                    ? `Approved by ${audience?.univision_status?.first_name} ${
                        audience?.univision_status?.last_name
                      } at ${processUTCtoEST(audience?.univision_status?.acknowledged_at)} ET`
                    : 'N/A'}
                </td>
              )}
              <td>
                {audience?.data_provider !== 'live_ramp' ? (
                  <CustomButton
                    buttonText="View Details"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('view', audience)}
                  />
                ) : null}

                {activeTab.id === 'archive' ? (
                  <CustomButton
                    buttonText="Unarchive"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('unarchive', audience)}
                  />
                ) : (
                  <CustomButton
                    buttonText="Archive"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('archive', audience)}
                  />
                )}
              </td>
            </tr>
          );
        } else if (activeTab.status === 2) {
          tableContentComp.push(
            <tr key={audience?.id}>
              <td>{audience?.company_name}</td>
              <td>
                {audience?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : audience?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : audience?.data_provider === 'first_party'
                  ? 'UCI First Party'
                  : audience?.data_provider.split('_').join(' ')}
              </td>
              <td>{audience?.name}</td>
              <td>
                <span className="text-length">{audience?.description || 'N/A'}</span>
              </td>
              <td>
                {audience?.household_count && audience?.household_count !== 0
                  ? formatNumber(audience?.household_count)
                  : 'N/A'}
              </td>
              <td>
                {audience?.tag_file?.row_count && audience?.tag_file?.row_count !== 0
                  ? formatNumber(audience?.tag_file?.row_count)
                  : 'N/A'}
              </td>
              <td>
                Created By{' '}
                {audience.created
                  ? `${audience.tag_file?.created_by_data?.first_name} ${
                      audience.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(audience.created)} ET`
                  : 'N/A'}
              </td>
              <td>
                {audience?.data_provider !== 'live_ramp' ? (
                  <CustomButton
                    buttonText="View Details"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('view', audience)}
                  />
                ) : null}

                {activeTab.id === 'archive' ? (
                  <CustomButton
                    buttonText="Unarchive"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('unarchive', audience)}
                  />
                ) : (
                  <CustomButton
                    buttonText="Archive"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('archive', audience)}
                  />
                )}
              </td>
            </tr>
          );
        } else if (activeTab.status === 1) {
          tableContentComp.push(
            <tr key={audience?.id}>
              <td>{audience?.company_name}</td>
              <td>
                {audience?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : audience?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : audience?.data_provider === 'first_party'
                  ? 'UCI First Party'
                  : audience?.data_provider.split('_').join(' ')}
              </td>
              <td>{audience?.name}</td>
              <td>
                <span className="text-length">{audience?.description || 'N/A'}</span>
              </td>
              <td>
                {audience?.household_count && audience?.household_count !== 0
                  ? formatNumber(audience?.household_count)
                  : 'N/A'}
              </td>
              <td>
                {' '}
                {audience?.tag_file?.row_count && audience?.tag_file?.row_count !== 0
                  ? formatNumber(audience?.tag_file?.row_count)
                  : 'N/A'}
              </td>
              <td>
                Created By{' '}
                {audience.created
                  ? `${audience.tag_file?.created_by_data?.first_name} ${
                      audience.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(audience.created)} ET`
                  : 'N/A'}
              </td>
            </tr>
          );
        } else if (activeTab.status === 3) {
          tableContentComp.push(
            <tr key={audience?.id}>
              <td>{audience?.company_name}</td>
              <td>
                {audience?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : audience?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : audience?.data_provider === 'first_party'
                  ? 'UCI First Party'
                  : audience?.data_provider.split('_').join(' ')}
              </td>
              <td>{audience?.name}</td>
              <td>
                <span className="text-length">{audience?.description || 'N/A'}</span>
              </td>
              <td>
                {audience?.household_count && audience?.household_count !== 0
                  ? audience?.data_provider === 'audience_request_form'
                    ? 'N/A'
                    : formatNumber(audience?.household_count)
                  : 'N/A'}
              </td>
              <td>
                {audience?.tag_file?.row_count && audience?.tag_file?.row_count !== 0
                  ? formatNumber(audience?.tag_file?.row_count)
                  : 'N/A'}
              </td>
              <td>
                Created By{' '}
                {audience.created
                  ? `${audience.tag_file?.created_by_data?.first_name} ${
                      audience.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(audience.created)} ET`
                  : 'N/A'}
              </td>
              <td>
                <CustomButton
                  buttonText="Approve"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('confirm', audience)}
                />
                {/* Check in Operation */}
                <CustomButton
                  buttonText="Decline"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('decline', audience)}
                />
              </td>
            </tr>
          );
        } else if (activeTab.status === 4) {
          tableContentComp.push(
            <tr key={audience?.id}>
              <td>{audience?.company_name}</td>
              <td>
                {audience?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : audience?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : audience?.data_provider === 'first_party'
                  ? 'UCI First Party'
                  : audience?.data_provider.split('_').join('')}
              </td>
              <td>{audience?.name}</td>
              <td>
                <span className="text-length">{audience?.description || 'N/A'}</span>{' '}
              </td>
              <td>
                {audience?.household_count && audience?.household_count !== 0
                  ? formatNumber(audience?.household_count)
                  : 'N/A'}
              </td>
              <td>
                {audience?.tag_file?.row_count && audience?.tag_file?.row_count !== 0
                  ? formatNumber(audience?.tag_file?.row_count)
                  : 'N/A'}
              </td>
              <td>
                Created By{' '}
                {audience.created
                  ? `${audience.tag_file?.created_by_data?.first_name} ${
                      audience.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(audience.created)} ET`
                  : 'N/A'}
              </td>
              <td>
                {audience.decline_info
                  ? `Declined By ${audience.decline_info?.first_name} ${
                      audience.decline_info?.last_name
                    } at ${processUTCtoEST(audience.decline_info?.declined_at)} ET`
                  : 'N/A'}
              </td>
              {/* Check in Response */}
              <td>{audience.decline_info?.reason || 'N/A'}</td>
            </tr>
          );
        }
      });
      return tableContentComp;
    }
    return (
      <>
        {!isLoading ? (
          advFilterSelectedData.length ? (
            <tr>
              <td
                colSpan={
                  activeTab.status === 0 || activeTab.status === 1
                    ? audienceTableTitles.length - 7
                    : audienceTableTitles.length - 7
                }
                className="text-align-center-imp bg-main"
              >
                No data Available.
              </td>
            </tr>
          ) : (
            <tr>
              <td
                colSpan={
                  activeTab.status === 0 || activeTab.status === 1
                    ? audienceTableTitles.length - 7
                    : audienceTableTitles.length - 7
                }
                className="text-align-center-imp bg-main"
              >
                Please select the advertiser for details.
              </td>
            </tr>
          )
        ) : null}
      </>
    );
  };

  return (
    <>
      <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableContent()}</tbody>
      </table>
    </>
  );
};

AudienceTable.propTypes = {
  audienceTableTitles: PropTypes.array,
  audienceTableData: PropTypes.array,
  handleTableButtonAction: PropTypes.func,
  activeTab: PropTypes.object,
  isLoading: PropTypes.bool,
  advFilterSelectedData: PropTypes.array,
};

AudienceTable.defaultProps = {
  audienceTableTitles: [],
  audienceTableData: [],
  handleTableButtonAction: () => {},
  activeTab: {},
  isLoading: false,
  advFilterSelectedData: [],
};

export default AudienceTable;
