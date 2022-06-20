# Introduction

## Summary

Account management is a module where user can create individual admin users and can see the details about the list of users available.

## Route url path

- **'/dash/agency/manage-advertisers/'**
- **'/dash/agency/manage-users/'**
- **'/dash/agency-brand-subbrand/'**

## Portal used

- Agency & Advertiser Admin Portal

# List of APIs used

- **'/agency/get_agency_list/'**
- **'/agency/sub_agency/'**
- **'/advertiser/get_company_list/?include_campaign=true'**
- **'/advertiser/get_company_list/?include_campaign=true&include_adid=true'**
- **'/advertiser/get_company_list/?include_campaign=true&include_adid=true'**
- **'/advertiser/create_brand/'**
- **'/advertiser/edit_brand/'**
- **'/advertiser/create_sub_brand/'**
- **'/advertiser/edit_sub_brand/'**
- **'/agency/segment_hierarchy/'**
- **'/agency/get_agency_list/'**
- **'/advertiser/get_company_list/?include_campaign=true'**
- **'/agency/company/'**
- **'/agency/get_agency_list/'**
- **'/advertiser/get_company_list/?include_campaign=true'**
- **'/advertiser/get_user_list/?user_type=AdvertiserAdmin'**
- **'/agency/get_agency_list/'**
- **'/advertiser/get_company_list/?include_campaign=true'**
- **'/advertiser/get_user_list/?user_type=AgencyRep'**

# List of components used

- CustomButton
- ReactLoader
- TabContainer
- BrandsSubbrandsData
- SubAgencyModal
- AddAdvertiserModal
- AgencyRepModal
- Header
- ValidationErrorMessage
- FormLabel
- BrandModal
- SubbrandModal
- SearchBox

# List of Libraries used

- react
- prop-types
- styled-components
- mobx-react
- react-bootstrap
- react-icons
- mobx

# UI flow

In **Agency Portal**, User can see **Advertisers**, **Users** under Account Management.
In **Advertiser Portal**, User can see **Brands and Sub-Brands** under Account Management.

## Agency Portal - Account Management - Advertisers

In **Advertisers** page, user can see three tabs **Sub-Agencies**(Default tab), **Advertisers**, **Brands**.

**Sub-Agencies**:

Once this tab is clicked, **'/agency/get_agency_list/'** api will be called to get all subagencies. Data will be displayed in the table. User can add new sub agency by clicking **Add-SubAgency** in the right corner.

Table contains:

1. **Name**
2. **Action** - User can edit the name of already created subagency by clicking edit button in this column

**Advertisers**:

Once this tab is clicked, page will be loaded by calling **'/agency/segment_hierarchy/'** **'/agency/get_agency_list/'** **'/advertiser/get_company_list/?include_campaign=true'** APIs

Data will be displayed in the table. User can add new advertiser by clicking **Add Advertiser** in the right corner. User needs to select Sub Agency, Industry, Sub Industry and fill name to create new advertiser.

Table contains:

1. **Name**
2. **Industry**
3. **Sub-Industry**
4. **Brands**

**Brands**:

Once this tab is clicked, page will be loaded by calling **'/advertiser/get_company_list/?include_campaign=true'**, **'/advertiser/get_company_list/?include_campaign=true&include_adid=true'**

Data will be displayed in the table. User can add new brand by clicking **Add Brand** that will ping **'/advertiser/create_brand/'** API and new Sub Brand by clicking **Add Sub Brand** that will ping **'/advertiser/create_sub_brand/'** API. Buttons will present in the right corner of the page. User needs to select an advertiser to create new brand and needs to select advertiser, brand to create new sub brand.

Table contains:

1. **Advertiser**
2. **Brand**
3. **Sub-Brand**

User can even edit brand and sub brand that is already created. **'/advertiser/edit_brand/'** API will be pinged while editing brand and **'/advertiser/edit_sub_brand/'** API will be pinged while editing sub brand.

## Agency Portal - Account Management - Users

In **Advertisers** page, user can see two tabs **Agency Representative**(Default tab), **Advertiser Admin**.

**Agency Representative**:

Once this tab is clicked, **'/agency/get_agency_list/'**, **'/advertiser/get_company_list/?include_campaign=true'**, **'/advertiser/get_user_list/?user_type=AgencyRep'** apis will be called and page will be loaded. Data will be displayed in the table. User can add new agency representative by clicking **Add Agency Representative** button in the right corner.

User needs to fill following details to create new agency rep:

1. First name
2. Last name
3. Phone
4. Email
5. Sub-Agency
6. Advertiser
7. Password
8. Access Control

Table contains:

1. **First Name**
2. **Last Name**
3. **Email**
4. **Phone**
5. **Action** - User can edit the details(except email id) of already created agency representative by clicking edit button in this column

**Advertiser Admin**:

Once this tab is clicked, **'/agency/get_agency_list/'**, **'/advertiser/get_company_list/?include_campaign=true'**, **'/advertiser/get_user_list/?user_type=AdvertiserAdmin'** apis will be called and page will be loaded. Data will be displayed in the table. User can add new advertiser admin by clicking **Add Advertiser Admin** button in the right corner.

User needs to fill following details to create new agency rep:

1. First name
2. Last name
3. Phone
4. Email
5. Sub-Agency
6. Advertiser
7. Password
8. Access Control

Table contains:

1. **First Name**
2. **Last Name**
3. **Email**
4. **Phone**
5. **Action** - User can edit the details (except email) of already created advertiser admin by clicking edit button in this column

## Advertiser Portal - Brands and Subbrands

**Brands** content will be loaded in **Brands and Sub brands** page.

# Module Owners

- Vidhya
- Sripriya
