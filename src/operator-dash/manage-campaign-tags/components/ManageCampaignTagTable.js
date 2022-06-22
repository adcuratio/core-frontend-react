import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';

import CustomButton from '../../../components/CustomButton';
import withStore from '../../../hocs/WithStore';
import { processUTCtoEST, formatNumber } from '../../../common/utils';

const StyledIcon = styled.span`
  .segment-tag-icon {
    width: 20px !important;
  }
`;

const ManageCampaignTagTable = (props) => {
  const {
    manageSegmentTagTitles,
    campaignTagsList,
    isLoading,
    handleAddAttributeIdAction,
    handleConfirmationAction,
    handleDeclineAction,
    authStore,
  } = props;
  return (
    <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
      <thead>
        <tr>
          {manageSegmentTagTitles.map((title) => (
            <th key={title.id}>
              <span className="mr10">{title.name}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {campaignTagsList?.map((tagData) => (
          <tr key={tagData.id}>
            <td>{tagData.trades && tagData.trades.length > 0 ? tagData.trades[0].advertiser || '---' : '---'}</td>
            <td>{tagData.trades && tagData.trades.length > 0 ? tagData.trades[0].brand || '---' : '---'}</td>
            <td>{tagData.data_provider}</td>
            {/* <td>{tagData.trades && tagData.trades.length > 0 ? tagData.trades[0].sub_brand || '---' : '---'}</td> */}
            <td>{tagData.order_type}</td>
            <td className="no-text-transform">{tagData.dish_filename || '---'}</td>
            <td>
              {tagData.trades && tagData.trades.length > 0
                ? tagData.trades.map((o) => o.order_name || '---').join(',')
                : '---'}
            </td>
            <td>
              {tagData.attribute_id ? (
                <StyledIcon>
                  {tagData.attribute_id}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Popover id="popover-basic" title="Entered by">
                        {tagData.attribute_entered_at &&
                          tagData.attribute_entered_by.first_name.charAt(0).toUpperCase() +
                            tagData.attribute_entered_by.first_name.slice(1)}{' '}
                        {tagData.attribute_entered_at &&
                          tagData.attribute_entered_by.last_name.charAt(0).toUpperCase() +
                            tagData.attribute_entered_by.last_name.slice(1)}{' '}
                        {tagData.attribute_entered_at
                          ? `at ${processUTCtoEST(tagData.attribute_entered_at)} ET`
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
                  handleButtonClick={() => handleAddAttributeIdAction(tagData)}
                />
              )}
            </td>
            <td>{formatNumber(tagData.row_count) || '---'}</td>
            <td>
              {!tagData.attribute_id && !tagData.is_received?.length ? <span>Attribute ID not set</span> : null}
              {tagData.is_received?.length > 0 && tagData.is_received[0]?.is_received ? (
                <p>
                  {tagData.is_received?.map((a) =>
                    a.acknowledged_at
                      ? `Confirmed by ${a.first_name} ${a.last_name} at ${processUTCtoEST(a.acknowledged_at)} ET`
                      : 'N/A'
                  )}
                </p>
              ) : null}
              {!tagData.attribute_id && tagData.is_received?.length > 0 && !tagData.is_received[0]?.is_received ? (
                <p>
                  Declined by{' '}
                  {tagData.is_received?.map(
                    (b) => `${b.first_name} ${b.last_name} at ${processUTCtoEST(b.acknowledged_at)} ET`
                  )}
                </p>
              ) : null}

              {!(tagData.is_received?.length > 0 && tagData.is_received[0]?.is_received) &&
              tagData.attribute_id &&
              tagData.attribute_entered_by?.id === authStore.getUser().related_data.operator_admin_id ? (
                <p>Pending Confirmation</p>
              ) : null}
              <div className="flex-container1">
                {(!tagData.is_received?.length || !tagData.is_received[0]?.is_received) &&
                tagData.attribute_id &&
                tagData.attribute_entered_by &&
                tagData.attribute_entered_by.id !== authStore.getUser().related_data.operator_admin_id ? (
                  <CustomButton
                    buttonText="Confirm"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleConfirmationAction(tagData)}
                  />
                ) : null}
                {(!tagData.is_received?.length || !tagData.is_received[0]?.is_received) &&
                tagData.attribute_id &&
                tagData.attribute_entered_by &&
                tagData.attribute_entered_by.id !== authStore.getUser().related_data.operator_admin_id ? (
                  <CustomButton
                    buttonText="Decline"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleDeclineAction(tagData)}
                  />
                ) : null}
              </div>
            </td>
          </tr>
        ))}
        {!(campaignTagsList && campaignTagsList.length) && !isLoading ? (
          <tr>
            <td colSpan={manageSegmentTagTitles.length} className="text-align-center-imp">
              No segment tags found.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};
ManageCampaignTagTable.propTypes = {
  manageSegmentTagTitles: PropTypes.array,
  campaignTagsList: PropTypes.array,
  isLoading: PropTypes.bool,
  handleAddAttributeIdAction: PropTypes.func,
  handleConfirmationAction: PropTypes.func,
  handleDeclineAction: PropTypes.func,
  sortCampaignTags: PropTypes.func,
  authStore: PropTypes.object,
};

export default withStore(ManageCampaignTagTable);
