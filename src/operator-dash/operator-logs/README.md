# Introduction

- Operator logs are audit of the events that are happening in the Distributor data with not just login and logout but also includes attempts outside of standard methods. Users can download these operator logs for specified duration in Excel file (.xlsx)
- Route: **/dash/operator-admin/logs**
- Portal: **Distributor Admin**

# List of APIs used in this module

- **_'/operator/get_activity_logs?month=&year='_**
- **_'/operator/list_dish_log'_**
- **_'/operator/get_activity_log?filename='_**
- **_'/operator/get_log_range?from_date=&to_date='_**

# List of components used

- CustomButton
- ReactLoader
- SearchBox

# List of Libraries used

- react
- mobx-react
- luxon
- react-bootstrap
- react-datepicker
- styled-components

# UI flow for Operator Logs

In the dashboard, when user clicks on _Operator Logs_ it takes the user to the _Operator Logs_ page. It pings **_'/operator/get_activity_logs?month=&year='_** and **_'/operator/list_dish_log'_** API to load the page.

There are two radio buttons **Select Month** and **Select Date Range**, from which the user can select one.

## On selecting **Select Month**

A dropdown to select month is shown, from which the user may select the month based on which the table beneath it displays the available logs for the month.

The table contents are:

1. _Log Files_
2. _Download Link_

   The Column contains one button:

   - **Download**: On clicking this button, the respective file is downloaded in xlsx format

## On selecting **Date Range**

Two datepickers are shown to select the starting and the ending of the date range for which the user wishes to download the logs. On clicking the download button next to them, the logs for respective date range are downloaded in xlsx format.

Beneath the datepickers, a table is displayed listing all the available dish log files

The table contents are:

1. _File Name_
2. _Start Date_
3. _End Date_
4. _Status_

   The Column contains one button:

   - **Download**: On clicking this button, the respective file is downloaded in xlsx format

# Module Owners

- Dhruv Rathi
- Yaswanth
