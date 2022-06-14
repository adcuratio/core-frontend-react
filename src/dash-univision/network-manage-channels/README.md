# UI flow for Manage Networks

## List of APIs used in this module

- **_'/admin/channels/'_**
- **_'/admin/show_list/'_**

In the dashboard when the user clicks on _Manage Networks_ it takes the user to Manage Networks and Shows page. It pings **_'/admin/channels/'_** API to load the page.

In this page, we can add Networks and Shows using _Add a Network_ and _Add a new show buttons_ respectively.

After adding a Network and clicking on Create, it pings **_'/admin/channels/'_** API. After adding a show and clicking on Creare, it pings **_'/admin/show_list/'_** API.

We can view the added Networks and Shows in the page.
