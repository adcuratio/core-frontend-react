import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

import CustomButton from '../../../components/CustomButton';
import { processUTCtoEST } from '../../../common/utils';

const StyledIcon = styled.span`
  .segment-tag-icon {
    width: 20px !important;
  }
`;

const ManageDishAudienceTable = (props) => {
  const {
    tableHeaderList,
    activeTab,
    manageAudiences,
    handleAddAttributeIdAction,
    handleConfirmationAction,
    authStore,
    isLoading,
    showEditCountModal,
    handleDeclineAction,
    showApproveDeclineModal,
    showDeclineModal,
    handleDishCountAction,
  } = props;

  return (
    <>
      <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
        <thead>
          <tr>
            {tableHeaderList.map((title) => (
              <th key={title.id}>
                <span className="mr10">{title.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {manageAudiences?.map((a) => (
            <tr key={a.id}>
              <td>{a.company_name ? a.company_name : '-'}</td>
              <td>
                {a?.data_provider === 'audience_request_form'
                  ? 'Custom Audience'
                  : a?.data_provider === 'live_ramp'
                  ? 'LiveRamp'
                  : a?.data_provider.split('_').join(' ')}
              </td>
              <td>{a.name ? a.name : 'N/A'}</td>
              <td>{a.description ? a.description : 'N/A'}</td>
              {/* <td>
                Created By{' '}
                {a.created
                  ? `${a.tag_file?.created_by_data?.first_name} ${
                      a.tag_file?.created_by_data?.last_name
                    } ${processUTCtoEST(a.created)} ET`
                  : 'N/A'}
              </td> */}
              {(activeTab.id === 'active' || activeTab.id === 'declined' || activeTab.id === 'archive') && (
                <td>{a.household_count ? a.household_count.toLocaleString() : 'N/A'}</td>
              )}
              {activeTab.id === 'pending processing' && (
                <td>{a.household_count && a.household_count !== 0 ? a.household_count.toLocaleString() : 'N/A'}</td>
              )}
              {activeTab.id === 'pending approval' && (
                <td>
                  {a.household_count && a.household_count !== 0 ? a.household_count.toLocaleString() : 'N/A'}
                  {a.data_provider === 'live_ramp' ? (a.tag_file?.attribute_id ? '' : null) : ''}
                </td>
              )}
              {activeTab.id === 'pending approval' && (
                <td>
                  {a.tag_file?.row_count ? a.tag_file?.row_count.toLocaleString() : 'N/A'}{' '}
                  {a.tag_file?.attribute_id ? (
                    ''
                  ) : (
                    <FaEdit
                      className="cursor-pointer"
                      style={{ marginLeft: '10px' }}
                      size={14}
                      color="grey"
                      onClick={() => {
                        showEditCountModal(a.id);
                      }}
                    />
                  )}
                </td>
              )}
              {activeTab.id === 'pending approval' && (
                <td>
                  Created By{' '}
                  {a.created
                    ? `${a.tag_file?.created_by_data?.first_name} ${
                        a.tag_file?.created_by_data?.last_name
                      } ${processUTCtoEST(a.created)} ET`
                    : 'N/A'}
                </td>
              )}

              {activeTab.id === 'pending approval' && <td>{a.tag_file?.attribute_id ?? 'N/A'}</td>}
              {activeTab.id === 'pending approval' && (
                <td>
                  {a.univision_status?.is_received === true && a.univision_status !== null
                    ? `Confirmed by ${a.univision_status?.first_name} ${
                        a.univision_status?.last_name
                      } at ${processUTCtoEST(a.univision_status?.acknowledged_at)} ET`
                    : 'Pending Univision Approval'}
                </td>
              )}

              {(activeTab.id === 'active' || activeTab.id === 'archive') && (
                <td>{a.tag_file?.row_count ? a.tag_file?.row_count.toLocaleString() : 'N/A'}</td>
              )}
              {activeTab.id === 'archive' && (
                <td>
                  Created By{' '}
                  {a.created
                    ? `${a.tag_file?.created_by_data?.first_name} ${
                        a.tag_file?.created_by_data?.last_name
                      } ${processUTCtoEST(a.created)} ET`
                    : 'N/A'}
                </td>
              )}

              {activeTab.id === 'active' && (
                <td>
                  Created By{' '}
                  {a.created
                    ? `${a.tag_file?.created_by_data?.first_name} ${
                        a.tag_file?.created_by_data?.last_name
                      } ${processUTCtoEST(a.created)} ET`
                    : 'N/A'}
                </td>
              )}

              {activeTab.id === 'active' && (
                <td>
                  {a.tag_file?.attribute_id ? (
                    <StyledIcon>
                      {a.tag_file?.attribute_id}
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Popover id="popover-basic" title="Entered by">
                            {a.tag_file?.attribute_entered_at &&
                              a.tag_file?.attribute_entered_by?.first_name.charAt(0).toUpperCase() +
                                a.tag_file?.attribute_entered_by?.first_name.slice(1)}{' '}
                            {a.tag_file?.attribute_entered_at &&
                              a.tag_file?.attribute_entered_by?.last_name.charAt(0).toUpperCase() +
                                a.tag_file?.attribute_entered_by?.last_name.slice(1)}{' '}
                            {a.tag_file?.attribute_entered_at
                              ? `at ${processUTCtoEST(a.tag_file?.attribute_entered_at)} ET`
                              : 'Not Available'}
                          </Popover>
                        }
                      >
                        <span className="segment-tag-icon ml5">
                          <i className="fa fa-user" aria-hidden="true" />
                        </span>
                      </OverlayTrigger>
                    </StyledIcon>
                  ) : (
                    'NA'
                  )}
                </td>
              )}
              {activeTab.id === 'pending processing' &&
                (a.tag_file?.row_count ? (
                  <td>
                    {a.tag_file?.row_count.toLocaleString()}
                    <FaEdit
                      className="cursor-pointer"
                      style={{ marginLeft: '10px' }}
                      size={14}
                      color="grey"
                      onClick={() => {
                        showEditCountModal(a.id);
                      }}
                    />
                  </td>
                ) : (
                  // <td>N/A</td>
                  <td>
                    <CustomButton
                      buttonText="Add"
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleDishCountAction(a)}
                    />
                  </td>
                ))}
              {activeTab.id === 'pending processing' && (
                <td>
                  {a.tag_file?.attribute_id ? (
                    <StyledIcon>
                      {a.tag_file?.attribute_id}
                      <OverlayTrigger
                        placement="right"
                        overlay={
                          <Popover id="popover-basic" title="Entered by">
                            {a.tag_file?.attribute_entered_at &&
                              a.tag_file?.attribute_entered_by?.first_name.charAt(0).toUpperCase() +
                                a.tag_file?.attribute_entered_by?.first_name.slice(1)}{' '}
                            {a.tag_file?.attribute_entered_at &&
                              a.tag_file?.attribute_entered_by?.last_name.charAt(0).toUpperCase() +
                                a.tag_file?.attribute_entered_by?.last_name.slice(1)}{' '}
                            {a.tag_file?.attribute_entered_at
                              ? `at ${processUTCtoEST(a.tag_file?.attribute_entered_at)} ET`
                              : 'Not Available'}
                          </Popover>
                        }
                      >
                        <span className="segment-tag-icon ml5">
                          <i className="fa fa-user" aria-hidden="true" />
                        </span>
                      </OverlayTrigger>
                    </StyledIcon>
                  ) : (
                    <CustomButton
                      buttonText="Add"
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleAddAttributeIdAction(a.tag_file?.id)}
                    />
                  )}
                </td>
              )}
              {activeTab.id === 'pending processing' && (
                <td>
                  Created By{' '}
                  {a.created
                    ? `${a.tag_file?.created_by_data?.first_name} ${
                        a.tag_file?.created_by_data?.last_name
                      } ${processUTCtoEST(a.created)} ET`
                    : 'N/A'}
                </td>
              )}
              {activeTab.id === 'pending processing' && (
                <td>
                  {!a.tag_file?.attribute_id && !a.tag_file?.is_received?.length && !a.tag_file?.row_count ? (
                    <span>Attribute ID and Dish count are not set</span>
                  ) : !a.tag_file?.attribute_id && !a.tag_file?.is_received?.length ? (
                    <span>Attribute ID not set</span>
                  ) : !a.tag_file?.row_count ? (
                    <span>Dish Count not set</span>
                  ) : null}

                  {a.tag_file?.is_received?.length > 0 && a.tag_file?.is_received[0]?.is_received ? (
                    <p>
                      {a.tag_file?.is_received?.map((a) =>
                        a.acknowledged_at
                          ? `Confirmed by ${a.first_name} ${a.last_name} at ${processUTCtoEST(a.acknowledged_at)} ET`
                          : 'N/A'
                      )}
                    </p>
                  ) : null}
                  {!a.tag_file?.attribute_id &&
                  a.tag_file?.is_received?.length > 0 &&
                  !a.tag_file?.is_received[0]?.is_received ? (
                    <p>
                      Declined by{' '}
                      {a.tag_file?.is_received?.map(
                        (b) => `${b.first_name} ${b.last_name} at ${processUTCtoEST(b.acknowledged_at)} ET`
                      )}
                    </p>
                  ) : null}

                  {!(a.tag_file?.is_received?.length > 0 && a.tag_file?.is_received[0]?.is_received) &&
                  a.tag_file?.attribute_id &&
                  a.tag_file?.row_count &&
                  a.tag_file?.attribute_entered_by?.id === authStore.getUser().related_data.operator_admin_id ? (
                    <p>Pending Confirmation</p>
                  ) : null}
                  {(!a.tag_file?.is_received?.length || !a.tag_file?.is_received[0]?.is_received) &&
                  a.tag_file?.attribute_id &&
                  a.tag_file?.row_count &&
                  a.tag_file?.attribute_entered_by &&
                  a.tag_file?.attribute_entered_by?.id !== authStore.getUser().related_data.operator_admin_id ? (
                    <CustomButton
                      buttonText="Confirm"
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleConfirmationAction(a.tag_file?.id)}
                    />
                  ) : null}
                  {(!a.tag_file?.is_received?.length || !a.tag_file?.is_received[0]?.is_received) &&
                  a.tag_file?.attribute_id &&
                  a.tag_file?.row_count &&
                  a.tag_file?.attribute_entered_by &&
                  a.tag_file?.attribute_entered_by?.id !== authStore.getUser().related_data.operator_admin_id ? (
                    <CustomButton
                      buttonText="Decline"
                      buttonClassName="tradebtn"
                      handleButtonClick={() => handleDeclineAction(a.tag_file?.id)}
                    />
                  ) : null}
                </td>
              )}

              {activeTab.id === 'pending approval' && (
                <td>
                  {a.operator_approval === null ? (
                    <>
                      <CustomButton
                        buttonText="Approve"
                        buttonClassName="tradebtn"
                        handleButtonClick={() => showApproveDeclineModal(a)}
                      />
                      <CustomButton
                        buttonText="Decline"
                        buttonClassName="tradebtn"
                        handleButtonClick={() => showDeclineModal(a)}
                      />
                    </>
                  ) : (
                    `Audience approved by ${a.operator_approval?.first_name} ${
                      a.operator_approval?.last_name
                    } at ${processUTCtoEST(a.operator_approval?.approved_at)} ET`
                  )}
                </td>
              )}

              {activeTab.id === 'active' && (
                <td>
                  {' '}
                  {a.univision_status?.is_received === true && a.univision_status !== null
                    ? `Approved by ${a.univision_status?.first_name} ${
                        a.univision_status?.last_name
                      } at ${processUTCtoEST(a.univision_status?.acknowledged_at)} ET`
                    : 'N/A'}
                </td>
              )}
              {activeTab.id === 'active' && (
                <td>
                  {a.operator_approval !== null
                    ? `Approved by ${a.operator_approval?.first_name} ${
                        a.operator_approval?.last_name
                      } at ${processUTCtoEST(a.operator_approval?.approved_at)} ET`
                    : 'N/A'}
                </td>
              )}

              {activeTab.id === 'active' && (
                <td>
                  {!a.tag_file?.attribute_id && !a.tag_file?.is_received?.length ? (
                    <span>Attribute ID not set</span>
                  ) : null}
                  {a.tag_file?.is_received?.length > 0 && a.tag_file?.is_received[0]?.is_received ? (
                    <p>
                      {a.tag_file?.is_received?.map((a) =>
                        a.acknowledged_at
                          ? `Confirmed by ${a.first_name} ${a.last_name} at ${processUTCtoEST(a.acknowledged_at)} ET`
                          : 'N/A'
                      )}
                    </p>
                  ) : null}
                  {!a.tag_file?.attribute_id &&
                  a.tag_file?.is_received?.length > 0 &&
                  !a.tag_file?.is_received[0]?.is_received ? (
                    <p>
                      Declined by{' '}
                      {a.tag_file?.is_received?.map(
                        (b) => `${b.first_name} ${b.last_name} at ${processUTCtoEST(b.acknowledged_at)} ET`
                      )}
                    </p>
                  ) : null}

                  {!(a.tag_file?.is_received?.length > 0 && a.tag_file?.is_received[0]?.is_received) &&
                  a.tag_file?.attribute_id &&
                  a.tag_file?.attribute_entered_by?.id === authStore.getUser().related_data.operator_admin_id ? (
                    <p>Pending Confirmation</p>
                  ) : null}
                  <div className="flex-container1">
                    {(!a.tag_file?.is_received?.length || !a.tag_file?.is_received[0]?.is_received) &&
                    a.tag_file?.attribute_id &&
                    a.tag_file?.attribute_entered_by &&
                    a.tag_file?.attribute_entered_by?.id !== authStore.getUser().related_data?.operator_admin_id ? (
                      <CustomButton
                        buttonText="Confirm"
                        buttonClassName="tradebtn"
                        handleButtonClick={() => handleConfirmationAction(a.tag_file?.id)}
                      />
                    ) : null}
                  </div>
                </td>
              )}

              {activeTab.id === 'declined' && (
                <td>{a.tag_file?.row_count ? a.tag_file?.row_count.toLocaleString() : 'N/A'}</td>
              )}
              {activeTab.id === 'declined' && (
                <td>
                  Created By{' '}
                  {a.created
                    ? `${a.tag_file?.created_by_data?.first_name} ${
                        a.tag_file?.created_by_data?.last_name
                      } ${processUTCtoEST(a.created)} ET`
                    : 'N/A'}
                </td>
              )}

              {activeTab.id === 'declined' && (
                <td>
                  {a.decline_info
                    ? `Declined By ${a.decline_info?.first_name} ${a.decline_info?.last_name} at ${processUTCtoEST(
                        a.decline_info?.declined_at
                      )} ET`
                    : 'N/A'}
                </td>
              )}
              {activeTab.id === 'declined' && <td>{a.decline_info?.reason || 'N/A'}</td>}
            </tr>
          ))}
          {!(manageAudiences && manageAudiences?.length) && !isLoading ? (
            <tr>
              <td className="bg-main" colSpan={tableHeaderList.length}>
                <p className="text-center">No data found</p>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </>
  );
};

ManageDishAudienceTable.propTypes = {
  activeTab: PropTypes.object,
  tableHeaderList: PropTypes.array,
  manageAudiences: PropTypes.array,
  handleAddAttributeIdAction: PropTypes.func,
  handleConfirmationAction: PropTypes.func,
  authStore: PropTypes.object,
  isLoading: PropTypes.bool,
  handleDishCountAction: PropTypes.func,
  showEditCountModal: PropTypes.func,
  showEditLiveRampCountModal: PropTypes.func,
  handleLiveRampCountAction: PropTypes.func,
  handleDeclineAction: PropTypes.func,
  showApproveDeclineModal: PropTypes.func,
  showDeclineModal: PropTypes.func,
};

export default ManageDishAudienceTable;
