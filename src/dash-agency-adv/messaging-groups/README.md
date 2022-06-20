# Introduction

A Messaging Group is a combination of predefined Segments and a Creative. A Creative can be assigned to one or more Segments. Similarly, a segment can be assigned to one or more creatives.

**Route url path** - _'/dash/messaging-groups'_ and _'/dash/define-messaging-groups'_

**Portal used** - Agency Portal and Advertiser Portal

## List of APIs used

- **_'/advertiser/get_messaging_group/'_**
- **_'/advertiser/segment/'_**
- **_'/pilot/get_ftp_creative_files/'_**
- **_'/advertiser/get_company_list/'_**
- **_'/advertiser/adc_group/'_**
- **_'/advertiser/adid_meta/'_**

# List of components used

- ReactLoader
- CreativesAdPreviewModal
- MessagingGroupTable
- MessagingGroupHeader
- ViewSegmentsModal
- DeleteMessagingGroup
- CustomButton
- FilterJSONText
- ReactPickyFilter

# List of Libraries used

- react
- react-bootstrap
- prop-types
- mobx-react
- react-icons

# UI Flow

In the dashboard when user clicks on _Audience Segments_ -> _Messaging Groups_ it takes the user to messaging groups page. It pings **_'/advertiser/get_messaging_group/'_** API to load the page.

- In the Messaging Groups page, there is a header at the top of the page where user can select an advertiser/brand for which messaging group details should be displayed inside a table. And also user can create a messaging group using _Define messaging group_ button.

Inside the table, columns are as follows:

1. **Advertiser -** In this field it displays the advertiser for which the messaging group is created.
2. **Brand -** In this field it displays the brand for which the messaging group is created.
3. **Sub-brand -** In this field it displays the sub-brand for which the messaging group is created.
4. **Messaging Group Name -** In this field it displays the created messaging group's name.
5. **Segments included -** In this field a button **View** where user can see the segment(s) from which the messaging group is created.
6. **Household Count** In this field it displays the total household count of the selected segments from which the messaging group is created.
7. **Creative Name** In this field it displays the creative name for which the messaging group is created.
8. **ISCI** In this field it displays the identifier for which the messaging group is created.
9. **Creative -** In this field it displays the creative from which the messaging group is created.
10. **Action -** This field includes two buttons **Edit** and **Delete** where user can edit already created messaging groups using _Edit_ or delete messaging groups using _Delete_.

## Messaging Group Creation

When user clicks on **Define messaging groups** button it pings **'advertiser/get_company_list'** where it routes to _Messaging Group creation_ page and has to select an advertiser for which the user wants to create a messaging group.

When the user clicks on _Next_ button it takes the user to the next page where it displays the advertiser/brands/sub-brands corresponding to the advertiser selected. After selecting the advertiser/brand/sub-brand for which user has to create a messaging group and after clicking on _Create new Messaging Group_ button it pings to **'/advertiser/adc_group/'** and **'/advertiser/adid_meta/'** API, it takes the user to the next page where user has to select segment(s) and a creative for creating a messaging group.

On clicking the _Save messaging group_ button it pings **_*/advertiser/segment/*_** API and saves messaging group successfully which will be displayed in the first page of the messaging groups.

## Edit Messaging Group

User can also edit the messaging groups as mentioned in the table content. Here user need to select **Edit** action so that it pings **'/advertiser/adc_group/'** and **'/advertiser/adid_meta/'** API and where the user can add/remove the selected segments and also can changes the selected adid for the messaging group.

On clicking the _Save messaging group_ button it pings **_*/advertiser/segment/*_** API and edits messaging group successfully and the updated changes will be displayed in the first page of the messaging groups.

## Module Owner

**Primary Owner** - Yaswanth

**Secondary Owner** - Deepak Mittal
