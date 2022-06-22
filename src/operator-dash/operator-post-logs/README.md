# Documentation for Operator Post Logs

## Introduction

When an Asrun file drops in the system, it creates an PostLogFile object which stores the following information related to that file.

- file path - where the file saved in system
- filename - name of the file
- s3 file url - reference link of the file uploaded in aws
- error - precheck output of asrun file

**Note**: Adcuratio Asrun file is a set of specific information of campaign adspots. It is a XML file of a specific format which drops into SFTP server. Its sole purpose is to mark campaign adspots complete for NCM campaign.

**Route URL Path** : _'/dash/operator-post-logs'_

**Portal Name** : Operator/Dish

## APIs used in this module

- **_'/network/post_log/'_**

- **_'/network/get_postlog_file_detail/?postlog_file_id='_**

## List of components used in this module

- ReactLoader
- PosLogFileData
- PostLogsTable
- ErrorsModal

## List of Libraries used in this module

- react
- mobx-react

## UI Flow

In the operator dashboard, when user clicks on Post Logs, it takes the user to Post Logs page and pings **_'/network/post_log/'_** API to load the data.

The post logs table contains:

- **File name** - Name of the logs file.
- **Created at** - Date and time of creation of the file.
- **Action** - This column contains _View details_ button which on click pings **_'/network/get_postlog_file_detail/?postlog_file_id='_** API and opens a modal to display the details of the file which consists of:

  - Order number
  - Network Code
  - ADID
  - Length
  - Spot USN
  - Deal Name
  - Selling Title
  - Mirror Indicator
  - Unit Aired Status
  - Broadcast Date Time

  This column also shows _View Error button_ if there is any error occured and onclicking the button it shows:

  - Hard check failed details
  - Soft check failed details

## Module Owners

**Primary Owner** - Sripriya

**Secondary Owner** - Vidhya
