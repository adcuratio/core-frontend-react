# Introduction

## Summary

- Every segment tag file of manage campaign tags is a collection of the household id's that will be sent to INVIDI for upgrading the default ad that was supposed to be shown. Incase of intersections between the messaging groups’ households, the list of the households in the intersection gets split into multiple tag files (number of files being equal to the total number of messaging groups that have the intersection between them).

**Route URL path**:
/dash/operator-admin/segmentTagApproval

**Portal name**:
Distributor Admin

## List of APIs used in this module

- **_'/ncm/get_segment_tags/'_**
- **_'/ncm/add_attribute_id/'_**
- **_'/ncm/ack_segment_tag/'_**

## List of components used

- CustomButton
- AddAttributeModal
- ConfirmTagModal
- AddAttributeAction
- ConfirmTag
- DeclineTag
- ManageCampaignTagTable
- ReactPickyFilter
- SearchBox

## List of libraries used

- styled-components
- mobx-react
- react
- prop-types
- luxon

## UI flow

- In the dashboard of Operator admin, when the user clicks on Manager Campaign Tags it takes the user to the Manage Campaign Tags page. It pings **_'/ncm/get_segment_tags/'_** API to load the page.

- In the header there are two **dropdowns** to select **_Advertiser_** and **_Brand_** for the corresponding Advertiser. Based on the selected Advertiser and brand data will be displayed.

- When the _Agency/Advertiser_ admin approves a trade, it will be sent to Manage Campaign Tags. These trades' details are displayed in the table as follows:

1.  **Advertiser**
2.  **Default Brand**
3.  **Sub-Brand**
4.  **Adcuratio Tag Name**
5.  **Order Name**
6.  **Attribute ID**
7.  **Row Count**
8.  **Confirm Tagging Complete**

- User can add attribute Id if there is no attribute Id already, if he wants to confirm the trade using _Add_ button under _Attribute ID_ column. When the user clicks on Add it pings **_'/ncm/add_attribute_id/'_** API. If Attribute Id already exists, the user can click on confirm button under Confirm Tagging Complete column which pings **_'/ncm/ack_segment_tag/'_**.

- User can decline the segment tags on clicking the **Decline** button.

- After confirming the trades here, it will go to _Pending Approval_ tab of **Manage Orders**.

## Module Owners:

- Rashmi
- Deepak M
