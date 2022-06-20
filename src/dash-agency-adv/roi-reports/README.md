# ROI Reports

## Table of Contents

1. [Introduction](#introduction)
1. [List of APIs Used](#list-of-apis-used)
1. [List of Components Used](#list-of-components-used)
1. [List of Libraries Used](#list-of-libraries-used)
1. [UI Flow](#ui-flow)
1. [Module Owner](#module-owner)

## Introduction

### Summary

In the Sidebar, when the user clicks on _ROI Reports_ it takes the user to the the page where user can see Reports with filters.

There are basically two sections

1. **Select audience filter for the report**
2. **Reports**

**1. Select audience filter for the report:**
This is the same as the **create new segment** module.
In the first place, the User will have to select filters. After that, he will have to update the reports by clicking the button **Update Report** and the updated report will be displayed there.

**2. Reports:**
Using [tableau](https://www.tableau.com/), We are showing tableau embedded UI (Custom Views). This view is controlled by Tableau Admin/Backend Team. In this report, We have multiple feature like refresh, share, and download reports. Reports will get updated automatically after update filters.

### Route URL Path

- {base_url}/dash/roi-reports

### Portal Used

- Agency
- Advertiser

## List of APIs Used

- **_'/advertiser/get_vehicle_filters/'_**
- **_'/advertiser/get_company_list/'_**
- **_'/roi_reports/'_**

## List of Components Used

- AuthOkta - Check okta cookies is avaiable or not
- CreateNewSegmentHeader
- SegmentSummary
- QuickFilterContent
- Reports

## List of Libraries Used

- [mobx-react](https://mobx.js.org/react-integration.html)
- [@okta/okta-auth-js](https://www.okta.com/)
- [tableau](https://www.tableau.com/) - It is a scripting file that is being used via CDN.

## UI Flow

The functionality starts from _'SegmentFilter'_ component.

1. To see the reports first we need (okta)[https://www.okta.com/] session token after that we register for okta browser cookies. for this process we are using **AuthOkta** Component. After setting okta cookies, okta redirects to the current URL ie the page will get reload.

2. the Second view is Filters. It is basically an accordion that can be expanded and collapsed. For Accordion React Bootstrap [Panel](https://react-bootstrap-v3.netlify.app/components/panel/) is being used. This contains several common components for different - different views(like filter category tabs, input fields, and filter summary). After component mount(useEffect) we are fetching the required filters from this **_/advertiser/get_vehicle_filters/_**. On every action like filter category change, Filter selection there are different-different functions is being used.

3. Segment Report component is for Reports. It is using a Tableau embed visualization container ([viz](https://help.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api_sample_basic_embed.htm)) to show customize the view. When a user updates the filter then the report UI gets automatically refresh. This is the autorefresh method that is provided by tableau viz. Logics behind this feature is, We have state **_filterJson_**. It will be updated after clicking on the **_Update Report_** button. This component has useEffect(React hook) that will update the report along with refresh the view.

## Module Owner

- [Deepak Mittal](https://github.com/adcuratio/core-frontend/pulls/DeepakM02)
- [Yaswanth Somala](https://github.com/yaswanthsomala)
