# Introduction

## Summary

Deal contains information about campaign adspots. It is a XML file of a specific format which can be uploaded from UI or dropping the file into SFTP server. Once done with the file upload, it will validate against some precheck scenarios & based on the precheck output the deal file will reflect in one of the following tabs i.e Pending Agency Approval, Pending Advertiser Approval, Approved, Declined, Incorrect, Pending Processing.

When a deal file uploads in the system, it creates an EdiFile object. On successful error-free processing of EdiFile, a Deal object is created.

## Route url path

- /dash/edi-list
- /dash/resolve-deal?dealId=&option=&errorId=&option=

## Portal used

- Agency Portal
- Advertiser Portal

# List of APIs used

- **_'/edi/edi_view/'_**
- **_'/edi/get_deal_info/?edi_id='_**
- **_'/edi/approve_deal/'_**
- **_'/advertiser/get_company_list/?include_campaign='_**
- **_'/edi/campaign_resolve_view/'_**
- **_'/advertiser/create_brand/'_**
- **_'/edi/get_aggregated_campaign_adspot/'_**

# List of components used

- AdvSchHeader
- AdvSchTable
- DealErrors
- ConfirmStatusModal
- ViewDealDetailsModal
- ReactLoader
- TabContainer
- SearchBox
- UploadNewDeal
- CustomButton
- ResolveDealModal
- AdSpotTable
- CheckBox
- RadioButton
- CustomDropDown
- LogsDealError
- ReactPickyFilter

# List of Libraries used

- react
- prop-types
- axios
- mobx-react
- react-bootstrap
- styled-components
- react-icons

# UI flow

In the dashboard when the user clicks on _Advertiser Schedule_ it takes the user to Deals page. It pings **_'/edi/edi_view/'_** API to load the page.

In the header there are two **dropdowns** to select **_Advertiser_** and **_Brand_** for the corresponding Advertiser. Based on the selected Advertiser and brand data will be displayed in each tab.

There are six tabs:

1. **Pending Agency Approval -** In this tab, agency can approve or decline deals using **Approve button** or **Decline button** respectively. And also it is possible to view or download deals using **View button** or **Download button**.

2. **Pending Advertiser Approval -** In this tab it shows the details of the deals which needs to be approved by advertiser.

3. **Approved -** In this tab it displays the details of deals which are approved by agency. User can view and download it using **View** and **Download** button.

4. **Declined -** In this tab it displays the details of deals which are declined by agency. User can view and download it using **View** and **Download** button.

5. **Incorrect -** In this tab it displays the incorrect deals. User can view the deal errors using **Deal error** button. User can download it using the **Download** button. User can also resolve incorrect deals (if specified brand/subbrand does not exist) by clicking **Resolve** button.

6. **Pending Processing -** It shows the deal details that are approved. The status of these deals will be 'Pending processing'. We can download these deals using **Download** button.

In each of these tabs, the table contents are as follows:

1. **Deal id**

2. **Advertiser name**

3. **Brand**

4. **Sub-Brand**

5. **Network**

6. **Last modified**

7. **Status**/**Approved by**/**Declined by** which includes **Approve** and **Decline** buttons under **Status**. Only Approved and Declined tab contains Approve and Decline buttons respectively.

8. **Action** which includes **View** and **Download** buttons.

When clicking **Resolve** button in the incorrect tab, it will navigate to Resolve Deal page. User can select the deal files, can select alternate brand/subbrand/create new brand if specified brand/subbrand does not exist. While clicking **Confirm** button, **_'/edi/campaign_resolve_view/'_** API will be called.

User Can upload deals using **Upload new EDI file** button which is in the top right corner of the page.After browsing the file and clicking on _Upload_ button, it pings **_'/edi/edi_view/'_** API.

Also it is possible to view the table in calendar view using **EDI calendar view** button which is next to _Upload new EDI file_ button.

# Module Owner

- Vidhya
- Yaswanth
