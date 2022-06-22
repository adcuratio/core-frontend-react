# Dish Manage Orders

## Table of Contents

1. [Introduction](#introduction)
1. [List of APIs Used](#list-of-apis-used)
1. [List of Components Used](#list-of-components-used)
1. [List of Libraries Used](#list-of-libraries-used)
1. [UI Flow](#ui-flow)
1. [Module Owner](#module-owner)

## Introduction

### Summary

Manage Order is the module where operator admin can manage order list. It provides multiple views that are related to the order Orderlines, Inventory Details, Order Details, Approve/Decline Order.

### Route URL Path

- {base_url}/dash/operator-admin/ncm

### Portal Used

- Distributor/Operator Admin

## List of APIs Used

- **'/ncm/get_order/'**
- **'/ncm/get_orderlines/?trade_id=\${order_id}'/**
- **'/ncm/order_detail/?trade_id=\${order_id}'/**
- **'/ncm/inventory_detail/?trade_id=\${order_id}'/**
- **'/advertiser/approve_trade/'/**

## List of Components Used

- CreativesAdPreviewModal - Show creative using Video Player
- TabContainer - Show Tabs eg. `pending approval`, `approved-in progress`, `declined` and `completed`
- SearchBox
- ManageTable - Show Orders List
- ActionModal - Approve/Decline Order
- InventoryModal
- OrderLinesModal

## List of Libraries Used

- [pusher-js](https://www.npmjs.com/package/pusher-js) - It is used to setup a continuous connection.
- [mobx-react](https://mobx.js.org/react-integration.html)

## UI Flow

In the dashboard of Operator admin, when the user clicks on Manager Orders it takes the user to the Review Order page. It pings **_'/ncm/get_order/'_** API to load the page.

It consists of four tabs:

- **Pending Approval -** Trades that are confirmed from _Manage Campaign Tags_ are displayed here. Users can approve trades using _Approve_ button. Users can decline trades using _Decline_ button. When clicked on approve / decline, it pings **_'/advertiser/approve_trade/'_** API.

- **Approved - In-Progress -** Approved trades from the **Pending Approval** tab will be displayed here.

- **Declined -** Declined trades from the **Pending Approval** tab will be displayed here.

- **Completed -** After approval, when it reaches the end date it will come to this tab.

Contents of the table are as follows:

1. _Order Id_ (Only displayed in **Approved - In-Progress** and **Completed** tabs)
2. _Agency_
3. _Advertiser_
4. _Brand_
5. _Sub-Brand_
6. _Order Name_
7. _# Of Creatives_
8. _Orderlines_
9. _Inventory_ (Only displayed in **Approved - In-Progress** and **Completed** tabs)

### Order Details

User can see order detail by clicking on table row. It will show accordion.

API end point:
**'/ncm/order_detail/?trade_id=\${order_id}'**

Contents of the accordion are as follows:

1. _Creative Name_
2. _Creative ISCI_
3. _Asset ID_
4. _Ad Preview_
5. _Creative Approval Status_

### Order Lines

Contents of the table are as follows:

1. _Advertiser_
2. _Asset ID_
3. _Sales ID_
4. _Attribute Code_
5. _Start Date_
6. _End Date_
7. _Dish Orderline ID_
8. _Status_

### Inventory Details

Contents of the table are as follows:

1. _Advertiser_
2. _Brand_
3. _Sub Brand_
4. _Ad ID_
5. _Program_
6. _Name_
7. _Default Asset ID_
8. _Air Date_
9. _Show Start Time_
10. _Show End Time_
11. _Ad Spot Airing Time_
12. _Window Start Time_
13. _Window End Time_
14. _Spot USN_
15. _Duration_

## Module Owner

- [Deepak Mittal](https://github.com/DeepakM02)
- [Yaswant Somala](https://github.com/yaswanthsomala)
