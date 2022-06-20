# Documentation for View Existing Campaigns

## Introduction

In this module Agency admins and Advertiser admins can view the created campaigns.

**Route URL Path** : _'/dash/ncm-manage'_

**Portal Name** : Agency, Advertiser.

## List of APIs used in this module

- **_'/advertiser/get_company_list/'_**
- **_'/pilot/get_order/'_**
- **_'/advertiser/approve_trade/'_**
- **_/ncm/order_detail/?trade_id=_**
- **_'/advertiser/pause_trade/'_**
- **_'/advertiser/get_company_list/'_**
- **_'/pilot/get_order/'_**
- **_'/ncm/order_summary/'_**
- **_'/pilot/get_ftp_creative_files/'_**

## List of components used in this module

- CustomButton
- ReactLoader
- ReactPickyFilter
- SearchBox
- CreativeAdPreviewModal
- NcmManageTabs
- NcmManageTable
- ViewTradesModal
- ApprovalStatusModal
- NcmManageSummary

## List of libraries used in this module

- react
- prop-types
- mobx-react
- styled-components
- luxon

## UI Flow

When the user clicks on _Home_ page in the dashboard and clicks on _View Existing Campaigns_ it takes the user to Manage NCM Campaigns page. It pings **_'/advertiser/get_company_list/'_**, **_'/pilot/get_order/'_** API to load the page.

The page contains the following tabs:

1. **Active**
2. **Paused**
3. **Completed**
4. **Pending Distributor Approval**
5. **Requiring Your Approval**
6. **Pending Advertiser Approval**/ **Pending Agency Approval**
7. **Pending Processing**
8. **Declined**

Table contents are :

(Note: Some are included/exclued based on their tabs.)

1. _Campaign ID_
2. _Campaign Name_
3. _Default Creative ISCI Code_
4. _Default messaging group_
5. _Declined By_
6. _Declined At_
7. _Declined Reason_
8. _Default Ad_
9. _Default Ad Preview_
10. _Action_

If we click on any of the rows it pings **_'/ncm/order_detail/?trade_id='_** API and opens an accordion where we can view order details of that particular trade.

The details are as follows:

- Pending Adspots
- Completed Adspots
- Segment
- Ratio
- Creative Name
- Creative ISCI
- Ad preview

### **Flow**:

Case 1. **If Advertiser creates a trade:**

- If an Advertiser user creates a trade then that will be shown in **Requiring Your Approval** tab of **Agency admin**.

- **Requiring Your Approval** tab contains _View_ _Approve_ and _Decline_ buttons under _Action_ column. If the user declines the trade, it will go to **Declined** tab. If the user approves the trade by clicking on the _Approve_ button then trade will move to _Pending Processing_ tab.

- **Pending Processing** tab contains _View_ button under _Action_ column where we can view order details displayed in a model. When the trade is in **Pending Processing** tab, Operator/Dish admin should add attribute Id if it's not there already and confirm it in _Manage Campaign Tags_ of Operator admin which further goes to _Pending Operator Approval_ tab of Operator admin under _Manage Orders_ dashboard. If Operator admin declines the trade, it will go to _Declined_ tab of Operator admin under _Manage Orders_ dashboard. If the trade gets approved then it will move to _Approved for execution_ tab of Operator admin and **Active** tab of _Agency_ admin.

- **Active** tab contains _Pause_ and _View_ buttons under _Action_ column. If user clicks on _Pause_ button then the trade will go to **Paused** tab.

- **Paused** tab contains _Activate_ and _View_ buttons under _Action_ column. If user clicks on _Activate_ button then the trade will go back to **Active** tab.

- After the trade reaches the end date, it will move from **Active** tab to **Completed** tab.

Case 2. **If Agency creates a trade:**

- If an Agency user creates a trade then that will be shown in **Requiring Your Approval** tab of **Advertiser admin**.

- **Requiring Your Approval** tab contains _View_ _Approve_ and _Decline_ buttons under _Action_ column. If the user declines the trade, it will go to **Declined** tab. If the user approves the trade by clicking on the _Approve_ button then trade will move to _Pending Processing_ tab.

- **Pending Processing** tab contains _View_ button under _Action_ column where we can view order details displayed in a model. When the trade is in **Pending Processing** tab, Operator/Dish admin should add attribute Id if it's not there already and confirm it in _Manage Campaign Tags_ of Operator admin which further goes to _Pending Operator Approval_ tab of Operator admin in the _MAnage Orders_ dashboard. If Operator admin declines the trade, it will go to _Declined_ tab of Operator admin under _Manage Orders_ dashboard. If the trade gets approved then it will move to _Approved for execution_ tab of Operator admin and **Active** tab of _Advertiser_ admin.

- **Active** tab contains _Pause_ and _View_ buttons under _Action_ column. If user clicks on _Pause_ button then the trade will go to **Paused** tab.

- **Paused** tab contains _Activate_ and _View_ buttons under _Action_ column. If user clicks on _Activate_ button then the trade will go back to **Active** tab.

- After the trade reaches the end date, it will move from **Active** tab to **Completed** tab.

## Key points in code flow:

_Trades will go to different tabs based on the trade status. Statuses are as follows:_

- If the trade status is 0, the trade goes to **Active** tab.

- If the trade status is 1, the trade goes to **In Progress** tab.

- If the trade status is 2, the trade goes to **Completed** tab.

- If the trade status is 3, the trade goes to **Paused** tab.

- If the trade status is 4, the trade goes to **Pending Distributor Approval** tab.

- If the trade status is 5, trade goes to **Declined** tab.

- If the trade status is 6 and if it is _Agency admin_ the trade goes to **Requiring your Approval** tab. Otherwise it goes to **Pending Agency Approval** tab of _Advertiser admin_.

- If the trade status is 7 and if it is _Agency admin_ the trade goes to **Pending Advertiser Approval** of Agency admin or if it is _Advertiser admin_, the trade goes to **Requiring your Approval** of the _Advertiser admin_.

- If the trade status is 8, the trade goes to **Pending Processing** tab.

_changeOrderStatus()_ of tradeAPIService has been used inside *changeOrderStatus() function *to call API based on condition when a trade has been approved or declined.

_pauseCustomTrade()_ of tradeAPIService has been used inside _pauseCustomTrade() function_ to call API based on condion when Paused or Activated a trade.

_getCustomTrades()_ of tradeAPIService has been used to call the API for building summary data for the chart.

## Module Owners

**Primary Owner** - Sripriya

**Secondary Owner** - Vidhya
