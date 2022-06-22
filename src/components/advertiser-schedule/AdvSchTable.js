import React from 'react';
import PropTypes from 'prop-types';
import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs';

import { processUTCtoEST } from '../../common/utils';

import CustomButton from '../CustomButton';

const AdvSchTable = (props) => {
  const {
    EdiTableData,
    isAgencyAdminUser,
    activeTab,
    handleTableButtonAction,
    ediTableTitles,
    sortingDeals,
    isLoading,
    hideResolveButton,
    isReadonly,
  } = props;

  const renderTableHeader = () => {
    if (ediTableTitles && ediTableTitles.length) {
      const tableHeaderComp = [];
      ediTableTitles?.forEach((title) => {
        if (title.name === 'Status' && isReadonly) return;
        if (title.id === 'adv_sch_status' && activeTab?.id === 'approved') {
          tableHeaderComp.push(
            <th key={title.id}>
              <span className="mr10">Approved By</span>
            </th>
          );
        } else if (title.id === 'adv_sch_status' && activeTab?.id === 'declined') {
          tableHeaderComp.push(
            <React.Fragment key="adv-decline-status">
              <th key={`decline-${title.id}`}>
                <span className="mr10">Declined By</span>
              </th>
              <th key={`reason-${title.id}`}>
                <span className="mr10">Reason</span>
              </th>
            </React.Fragment>
          );
        } else {
          tableHeaderComp.push(
            <th
              key={title.id}
              className={title.isApplySorting ? 'cursor-pointer' : ''}
              onClick={() => sortingDeals(title, !title.sortingType)}
            >
              <span className="mr10">{title.name}</span>
              {title.isApplySorting ? (
                <span>
                  {title.sortingType === false && <BsFillCaretDownFill />}
                  {title.sortingType && <BsFillCaretUpFill />}
                </span>
              ) : null}
            </th>
          );
        }
      });
      return tableHeaderComp;
    }
    return null;
  };

  const renderTableContent = () => {
    if (EdiTableData && EdiTableData.length) {
      const tableContentComp = [];
      EdiTableData?.forEach((edi) => {
        const brandArray = [];
        if (edi.deal_data && edi.deal_data.brand && edi.deal_data.brand.length) {
          edi.deal_data.brand.map((b) => b.brand__display_name && brandArray.push(b.brand__display_name));
        }

        const subbrandArray = [];
        if (edi.deal_data && edi.deal_data.sub_brand && edi.deal_data.sub_brand.length) {
          edi.deal_data.sub_brand.map(
            (sb) => sb.sub_brand__display_name && subbrandArray.push(sb.sub_brand__display_name)
          );
        }

        let userName = '-';
        let comment = '-';
        if (activeTab?.id === 'approved') {
          if (edi?.state_list?.approved && edi?.state_list?.approved.length) {
            userName = `${edi.state_list.approved[0].first_name} ${edi.state_list.approved[0].last_name}`;
          }
        }
        if (activeTab?.id === 'declined') {
          if (edi?.state_list?.declined && edi?.state_list?.declined.length) {
            userName = `${edi.state_list.declined[0].first_name} ${edi.state_list.declined[0].last_name}`;
            comment = edi.state_list.declined[0]?.comment ? edi.state_list.declined[0].comment : '-';
          }
        }

        tableContentComp.push(
          <tr key={edi.id}>
            <td>{edi.edi_filename}</td>
            <td>
              {edi.deal_data && edi.deal_data.advertiser_display_name ? edi.deal_data.advertiser_display_name : '---'}
            </td>
            <td>{brandArray.join(', ') || '---'}</td>
            <td>{subbrandArray.join(', ') || '---'}</td>
            <td>{edi.deal_data && edi.deal_data.networks ? edi.deal_data.networks.join(', ') : '---'}</td>
            <td>{edi?.modified ? `${processUTCtoEST(edi.modified)} ET` : '---'}</td>
            {((isAgencyAdminUser && activeTab.id === 'pending_agency_approval') ||
              (!isAgencyAdminUser && activeTab.id === 'pending_advertiser_approval')) &&
              !isReadonly && (
                <td>
                  <CustomButton
                    buttonText="Approve"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('approve', edi)}
                  />
                  <CustomButton
                    buttonText="Decline"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => handleTableButtonAction('decline', edi)}
                  />
                </td>
              )}

            {((isAgencyAdminUser && activeTab.id === 'pending_advertiser_approval') ||
              (!isAgencyAdminUser && activeTab.id === 'pending_agency_approval')) && <td>Pending approval</td>}

            {(activeTab?.id === 'approved' || activeTab?.id === 'declined') && <td>{userName}</td>}
            {activeTab?.id === 'declined' && <td>{comment}</td>}
            {activeTab?.id === 'incorrect' && (
              <td>
                <CustomButton
                  buttonText="Deal errors"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('deal_errors', edi)}
                />
              </td>
            )}
            {activeTab?.id === 'pending_processing' && <td>Pending Processing</td>}
            {activeTab?.id === 'processed' && <td>Processed</td>}

            <td>
              {activeTab?.id !== 'incorrect' && activeTab?.id !== 'pending_processing' && (
                <CustomButton
                  buttonText="View"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('view', edi)}
                />
              )}
              <CustomButton
                buttonText="Download"
                buttonClassName="tradebtn"
                handleButtonClick={() => handleTableButtonAction('download', edi)}
              />
              {!hideResolveButton && activeTab?.id === 'incorrect' && edi.is_resolve ? (
                <CustomButton
                  buttonText="Resolve"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => handleTableButtonAction('resolve', edi)}
                />
              ) : null}
            </td>
          </tr>
        );
      });
      return tableContentComp;
    }
    return (
      <>
        {!isLoading ? (
          <tr>
            <td
              colSpan={isReadonly ? ediTableTitles.length - 1 : ediTableTitles.length}
              className="text-align-center-imp bg-main"
            >
              No deals available.
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

AdvSchTable.propTypes = {
  EdiTableData: PropTypes.array,
  isAgencyAdminUser: PropTypes.bool,
  activeTab: PropTypes.object,
  handleTableButtonAction: PropTypes.func,
  ediTableTitles: PropTypes.array,
  sortingDeals: PropTypes.func,
  hideResolveButton: PropTypes.bool,
  isLoading: PropTypes.bool,
  isReadonly: PropTypes.bool,
};

AdvSchTable.defaultProps = {
  EdiTableData: [],
  isAgencyAdminUser: false,
  activeTab: {},
  handleTableButtonAction: () => {},
  ediTableTitles: [],
  sortingDeals: () => {},
  hideResolveButton: false,
  isLoading: false,
};

export default AdvSchTable;
