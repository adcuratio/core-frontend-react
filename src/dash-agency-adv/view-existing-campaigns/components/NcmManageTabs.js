import React from 'react';
import PropTypes from 'prop-types';

const NcmManageTabs = (props) => {
  const {
    onTabChange,
    activeTab,
    tradeData,
    ncmManageTradeTabs,
    isAgencyAdminUser,
    // isUnivisionNetworkAdminUser,
    // show,
  } = props;

  const getNcmTradesTabHeader = () => {
    if (ncmManageTradeTabs && ncmManageTradeTabs) {
      const tabHeaderComp = [];
      ncmManageTradeTabs.forEach((tab) => {
        let tabLength = 0;
        if (tab?.id === 'active') {
          tabLength = tradeData.tableProgressTradesData?.length;
        } else if (tab.id === 'paused') {
          tabLength = tradeData.tablePausedTradesData?.length;
        } else if (tab.id === 'completed') {
          tabLength = tradeData.tableCompletedTradesData?.length;
        } else if (tab.id === 'pendingDistributorApproval') {
          tabLength = tradeData.tablePendingTradesData?.length;
        } else if (tab.id === 'pendingAgencyApproval' && isAgencyAdminUser) {
          tab.heading = 'Requiring your approval';
          tabLength = tradeData.tableAgencyApprovalTradesData?.length;
        } else if (tab.id === 'pendingAgencyApproval' && !isAgencyAdminUser) {
          tab.heading = 'Pending Agency approval';
          tabLength = tradeData.tableAgencyApprovalTradesData?.length;
        } else if (tab.id === 'pendingAdvApproval' && isAgencyAdminUser) {
          tab.heading = 'Pending Advertiser approval';
          tabLength = tradeData.tableAdvertiserApprovalTradesData?.length;
        } else if (tab.id === 'pendingAdvApproval' && !isAgencyAdminUser) {
          tab.heading = 'Requiring your approval';
          tabLength = tradeData.tableAdvertiserApprovalTradesData?.length;
        } else if (tab.id === 'pendingProcessing') {
          tabLength = tradeData.tablePendingProcessingTradesData?.length;
        } else if (tab.id === 'declined') {
          tabLength = tradeData.tableDeclinedTradesData?.length;
        }
        tabHeaderComp.push(
          <li key={tab.id} role="presentation" className={activeTab && activeTab.id === tab.id ? 'active' : ''}>
            <a
              href=""
              role="tab"
              data-toggle="tab"
              className="hightlighted-trade-tab cursor-pointer"
              onClick={() => onTabChange(tab)}
            >
              {tab.heading}&nbsp;({tabLength || 0})
            </a>
          </li>
        );
      });
      return tabHeaderComp;
    }
    return null;
  };
  return (
    <ul className="nav nav-tabs mt30" role="tablist">
      {getNcmTradesTabHeader()}
    </ul>
  );
};

NcmManageTabs.propTypes = {
  onTabChange: PropTypes.func,
  activeTab: PropTypes.object,
  tradeData: PropTypes.object,
  ncmManageTradeTabs: PropTypes.array,
  isAgencyAdminUser: PropTypes.bool,
  isUnivisionNetworkAdminUser: PropTypes.bool,
  show: PropTypes.bool,
};

NcmManageTabs.defaultProps = {
  onTabChange: () => {},
  activeTab: {},
  tradeData: {},
  ncmManageTradeTabs: [],
  show: false,
};
export default NcmManageTabs;
