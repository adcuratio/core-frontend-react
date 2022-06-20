# Introduction for Creatives

- Creatives are the video-clips which will vary from few milliseconds to seconds.User can upload creative for particular advertiser/brand/sub-brand and can view the creatives uploaded in the landing page with the information of the particular entity and delivery vendor which has uploaded the video.

**Route URL path**:
/dash/creatives

**Portal name**:
Agency and Advertiser Admin

## List of APIs used in this module

- **_'/pilot/get_creative_files/'_**
- **_'/pilot/upload_creative_files/'_**
- **_'/pilot/get_ftp_creative_files/'_**
- **'/pilot/get_ftp_creative_files/?item_id=itemId'**

## List of components used

- ReactLoader
- ReactPickyFilter
- UploadCreatives
- CustomButton
- SearchBar
- CreativesAdPreviewModal
- CreativesHeader
- UploadCreativesModal
- CreativesAdPreviewModal
- CreativesTable
- UploadCreatives

## List of libraries used

- styled-components
- mobx-react
- react
- prop-types
- luxon

## UI flow

- In the dashboard, when user clicks on _Creatives_, it will take the user to the creatives page. It pings **_'/pilot/get_creative_files/'_** API to load the page.

- In the creatives page, there is a header at the top of the page where user can select an advertiser for which creatives details should be displayed inside a table. And also user can search using search bar and table gets updated accordingly.

The table contains:

1. **Advertiser / Product**
2. **Brand**
3. **Sub-Brand**
4. **Creative Name**
5. **ISCI Code**
6. **Digital Delivery Vendor**
7. **Duration**
8. **Networks Approved**
9. **Creative Video**

- User can play creatives on clicking the video url/thumbnail **'/pilot/get_ftp_creative_files/?item_id=itemId'** API is called.

- User can see which network have approved particular creative on-clicking the info icon on the network approved column. A modal opens and displays the table with **Network Name**,**Approved At**,**Approved By** columns.

- User can also upload creatives using **Upload New Creative** button which is in top right corner of the page.

- When the user clicks **Upload New Creative** button a pop-up modal will be displayed which includes:

  1. **Select an advertiser -** User has to select an advertiser. After the user selects an advertiser a tree will be displayed which contains the corresponding brands for which user wants to upload creative.
  2. **Ad Identifier -** User has to input an ADID for the creative.
  3. **Creative Name -** User has to input a name for the creative
  4. **Select file -** User has to upload a creative file using _browse button_.
  5. **Submit button -** When the user gives all the required inputs and clicks on submit button it pings **_'/pilot/upload_creative_files/'_** API which saves the creative and displays it in the creatives page.

## Module Owners:

**Rashmi**
**Vidya**
