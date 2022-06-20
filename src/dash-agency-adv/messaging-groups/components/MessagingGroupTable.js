import React from 'react';
import PropTypes from 'prop-types';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import { formatNumber } from '../../../common/utils';

import CustomButton from '../../../components/CustomButton';

const MessagingGroupTable = (props) => {
  const {
    handleModalAction,
    messagingGroupData,
    msgTableTitles,
    sortMessagingGroup,
    editMessagingGroup,
    getVideoUrl,
    isLoading,
    isReadonly,
  } = props;

  // Function to map the header list and apply sort
  const renderTableHeader = () => {
    if (msgTableTitles && msgTableTitles.length) {
      const tableHeaderComp = [];
      msgTableTitles.forEach((title) => {
        if (title.name === 'Action' && isReadonly) return;
        tableHeaderComp.push(
          <th key={title.id} onClick={() => sortMessagingGroup(title, !title.sortingType)}>
            {title.isApplySorting ? <span className="cursor-pointer">{title.name}</span> : <span>{title.name}</span>}
            {title.isApplySorting ? (
              <span className="cursor-pointer ml5">
                {title.sortingType === false && <BsFillCaretDownFill />}
                {title.sortingType && <BsFillCaretUpFill />}
              </span>
            ) : null}
          </th>
        );
      });
      return tableHeaderComp;
    }
    return null;
  };

  // Function to show the table content
  const renderTableContent = () => {
    if (messagingGroupData && messagingGroupData.length) {
      const tableContentComp = [];
      messagingGroupData?.forEach((data) => {
        tableContentComp.push(
          <tr key={data.id}>
            <td>{data.advertiser}</td>
            <td>{data.brand || '---'}</td>
            <td>{data.sub_brand || '---'}</td>
            <td className="bold">{data.name}</td>
            <td>
              <button
                type="button"
                className="form-button tradebtn"
                onClick={() => handleModalAction('viewSegments', data.id)}
              >
                View
              </button>
            </td>
            <td>
              <div className="flex">
                {data.is_last_processed === true && formatNumber(data.wanted_household_count)}
                {data.is_last_processed === false && 'Not processed'}
                <div className="ml5">
                  {data.is_last_processed === false && (
                    <OverlayTrigger
                      placement="left"
                      overlay={<Popover id="popover-positioned-scrolling-left">Processing...</Popover>}
                    >
                      <div>
                        <i className="fa fa-exclamation-circle count-icon" />
                      </div>
                    </OverlayTrigger>
                  )}
                </div>
                <div className="ml5">
                  {data.is_last_processed === true && data.selectable === false && (
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Popover id="popover-positioned-scrolling-left">
                          Messaging group can not be used in campaign. Household count should be greater than the
                          threshold(
                          {data.threshold_value})
                        </Popover>
                      }
                    >
                      <div>
                        <i className="fa fa-exclamation-circle count-icon" />
                      </div>
                    </OverlayTrigger>
                  )}
                </div>
              </div>
            </td>
            <td>{data.default_adid.ad_name}</td>
            <td className="no-text-transform">{data.default_adid.identifier}</td>
            <td>
              {data.default_adid.s3_thumbnail_url ? (
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Popover id="popover-positioned-scrolling-left" className="no-text-transform">
                      ISCI Code : {data.default_adid.identifier}
                    </Popover>
                  }
                >
                  <div className="video-thumbnail video-thumbnail-medium" onClick={() => getVideoUrl(data)}>
                    <img className="creative-thumb-medium" src={data.default_adid.s3_thumbnail_url} />
                  </div>
                </OverlayTrigger>
              ) : (
                'Not Available'
              )}
            </td>
            {isReadonly ? null : (
              <td>
                <CustomButton
                  buttonText="Edit"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => editMessagingGroup(data)}
                />
                <CustomButton
                  buttonText="Delete"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleModalAction('deleteMsgGrp', data)}
                />
              </td>
            )}
          </tr>
        );
      });
      return tableContentComp;
    }
    return (
      <>
        {!(messagingGroupData && messagingGroupData.length) && !isLoading ? (
          <tr>
            <td colSpan={isReadonly ? 9 : 10}>
              <p className="text-center">No data found.</p>
            </td>
          </tr>
        ) : null}
      </>
    );
  };

  return (
    <table className="table table-striped table-wrapper mt10 wrapped-table">
      <thead>
        <tr>{renderTableHeader()}</tr>
      </thead>
      <tbody>{renderTableContent()}</tbody>
    </table>
  );
};

MessagingGroupTable.propTypes = {
  navigationService: PropTypes.object,
  messagingGroupData: PropTypes.array,
  handleModalAction: PropTypes.func,
  getVideoUrl: PropTypes.func,
  msgTableTitles: PropTypes.array,
  sortMessagingGroup: PropTypes.func,
  editMessagingGroup: PropTypes.func,
  isLoading: PropTypes.bool,
  isReadonly: PropTypes.bool,
};

MessagingGroupTable.defaultProps = {
  messagingGroupData: [],
  viewCreativeThumbnail: () => {},
  handleModalAction: [],
  getVideoUrl: () => {},
  isLoading: PropTypes.bool,
};

export default MessagingGroupTable;
