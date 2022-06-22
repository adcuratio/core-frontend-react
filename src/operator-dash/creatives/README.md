# Introduction

- Users can view details of a creative and confirm that a creative has been received and encoded & moved To ads-out folder
- Route: **_/dash/operator-admin/creatives_**
- Portal: **Operator Admin**

# List of APIs used in this module

- **_'/pilot/get_creative_files/'_**
- **_'/pilot/recieve_creatives/'_**
- **_'/pilot/encode_creative/'_**

# List of components used

- CustomButton
- ReactLoader
- ReactPickyFilter
- SearchBox
- CreativesAdPreviewModal
- ConfirmCreative
- ManageCreativesTableContainer

# List of Libraries used

- react
- mobx-react
- prop-types
- react-bootstrap
- styled-components
- lodash
- react-icons/bs

# UI flow for Operator Creatives

In the dashboard of Operator admin, when the user clicks on Manager Creatives it takes the user to the Manage Creatives page. It pings **_'/pilot/get_creative_files/'_** API to load the page.

The contents of the Table consists of:

1. **Creative**
2. **Advertiser**
3. **Brand**
4. **Sub-Brand**
5. **Creative Name**
6. **ISCI Code**
7. **Asset ID**
8. **Digital Delivery Vendor**
9. **Duration**
10. **Creative Received? -** This contains a _Confirm_ button. After confirming the creative here, we can confirm it in the next two columns. It pings **_'/pilot/recieve_creatives/'_** API when the creative is confirmed.

11. **Encoded And Moved To Ads-Out Folder? -** After confirming the creatives in **Creative Reacieved** column, the _Confim_ button in this column will be enabled and can be confirmed here. It pings **_'/pilot/encode_creative/'_** API when the creative is confirmed.

# Module Owners

- Dhruv Rathi
- Rashmi
