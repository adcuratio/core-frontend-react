# UI flow for Network Creatives

## List of APIs used in this module

- **_'/pilot/get_creative_files/'_**
- **_'/admin/get_channels/'_**
- **_'/pilot/approve_creative/'_**
- **_'/pilot/decline_creative/'_**

In the dashboard of Network admin, when the user clicks on Creatives it takes the user to the Creatives page. It pings **_'/admin/get_channels/'_**, **_'/pilot/get_creative_files/'_** APIs to load the page.

It contains three tabs:

1. **Pending Approval -** In this tab user can Approve/Decline creatives using _Approve_/_Decline_ buttons respectively. On clicking the approve, button it pings **_'/pilot/approve_creative/'_** API. On clicking the decline button, it pings **_'/pilot/decline_creative/'_** API.

2. **Approved -** This tab contains the creative details which are approved.

3. **Declined** This tab contains the creative details which are declined.
