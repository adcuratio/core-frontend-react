# Documentation for Segment module

## Summary

In this module, agency or advertiser admin can create a group of entities(group of people to whom they want to target for a particular advertisement) to whom a particular ad can be targeted. Admin can see the available or previously created group(segments) and can also create a new group for a particular company/brand or associated sub-brand. Previously we have data provider as epsilon only, but niow we have two options to choose the data sets. One is Epsilon data which contains Adcuratio quick filter and Adcuratio Complete filters. The other one is Adcuratio experian Filters.

## Portal Name

- Agency
- Advertiser

**Route URL Path** - _'/segments'_

## API Used

- **_'/advertiser/get_company_list/'_**
- **_'/advertiser/archive_segment?is_archived/'_**
- **_'/advertiser/get_vehicle_filters/?vehicle_make'_**
- **_'/filter_template/'_**
- **_'/advertiser/get_vehicle_filters/'_**
- **_'/advertiser/archive_segment/'_**
- **_'/advertiser/adc_group/'_**

## Components Used

- Segment
  - Tree
  - Loader
  - ArchivedSegmentModal
  - SegmentInfoCard
  - CustomButton
  - ReactLoader
  - CreateNewSegment
    - CreateNewSegmentHeader
    - SegmentFilterTabs
      - QuckFilterContent
        - SegmentCategoryTabs
        - FilterContainer
        - AvailableCategoriesModal
          - ArrayCheckboxContainer
      - CompleteFilterContent
      - ExperianFilterContent
        - ExperianCategoryTabs
        - ExperianSubCategoryTabs
        - ExperisnFilters
    - SegmentSummary
      - QuickFilterSummary
      - CompleteFilterSummary (Includes Experian Filter Summary)

## List of Libraries

- prop-types
- react-bootstrap
- styled-components
- mobx-react
- rc-slider

## UI Flow

1. User selects the company from drop down.
2. A tree showing selected company's brand and subrand is visible on the left side of screen. User can select different brands and sub brands to see the segments that have been created on the right side of screen in card format.
3. User can click on each card to see the details of the segment.

First page:

As the page loads first it ping to **_'/advertiser/get_company_list/'_** to get all the compaines details for and attached the first company as default for tree on the left side. Then it pings to **_'/advertiser/archive_segment?is_archived/'_** to get all the segments whether archived or not for selected company.
You can select different brand sub brand or advertiser to get all the respective segments on the right side of the screen.
you can see all the archived segments hitting the button view archived segments while hitting the api **_'/advertiser/archive_segment?is_archived/'_**.

The dropdown provides the company slection for agency login which is by default hidden for advertiser admin. selecting this will hit **_'/advertiser/adc_group/'_** api to get al the related segments and company data.

Second Page:

segment creation:

Segment creation uses first **_'/filter_template/'_** api to get all the lite filters group and complete filters and experian filters data before
as the component finish loading. selection and editing by user are mentioned in folloing steps.After adding name and description for the segment if user hit save, **_'/advertiser/adc_group/'_** POST method along with segment information has been sent to backend for segment creation.

1. User can create segment using this tab.
2. Two Filters have been provided at the top level in card format from which user can pick.
   - Adcuratio Audience Filters
   - Adcuratio Complete Audience Filters
   - Adcuratio Experian Filters
3. user can select from available categories from a popup modal to select the desired categories.
4. In a particular category, user can select multiple filters to take the required filters and can select his/her own values for segment through dropdowns, radios and combo filters.
5. User can provide segment name and description on the right side of summary part where each value which is selected by the user is shown before segment creation.
6. On save button, the segment call will be given to api with payloads having user selected data like filters, company id, isWanted(the fields that have been selected are wanted fields) and a response will be provided to user according to success or failure of segment creation.
7. User will be redirected to First page where he/she can see the segment he/she created.

## Navigation flow

The navigation from segment landing page to create new segment has been revised.

Previously It was toggling effect for create new segment page inside the segment landing page. Now with the new release we are creating a separate route for create new segment. As some data should be passed from segment landing page to create new segment, the $state parameter of angularjs has been used in it. Corresponding new functions and paramters have been updated inside route.js and navigationService.js files.

## Module Owners

**Primary Owner** - Deepak Sharma

**Secondary Owner** - Deepak Mittal
