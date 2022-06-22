export const manageAudienceHeaderList = (selectedTab) => {
  const tabId = selectedTab.id;
  if (tabId === 'active') {
    return [
      ...commonHeaderList,
      {
        id: 'dish_count',
        name: 'Dish Count',
        applyFilter: true,
      },
      {
        id: 'creation_date',
        name: 'Created By',
        applyFilter: true,
      },
      {
        id: 'attribute_id',
        name: 'Attribute Id',
      },
      {
        id: 'reason',
        name: 'Network Approval',
      },
      {
        id: 'network',
        name: 'Dish Approval',
      },
      {
        id: 'confirmation',
        name: 'Confirmation Tagging Complete',
        colSpan: 3,
      },
    ];
  } else if (tabId === 'pending processing') {
    return [
      ...commonHeaderList,
      {
        id: 'dish_count',
        name: 'Dish Count',
        applyFilter: true,
      },
      {
        id: 'Attribute_id',
        name: 'Attribute Id',
      },
      {
        id: 'creation_date',
        name: 'Created By',
        applyFilter: true,
      },
      // {
      //   id: 'reason',
      //   name: 'Status',
      //   applyFilter: true,
      // },
      {
        id: 'confirmation',
        name: 'Confirmation Tagging Complete',
        colSpan: 3,
      },
    ];
  } else if (tabId === 'pending approval') {
    return [
      ...commonHeaderList,
      {
        id: 'dish_count',
        name: 'Dish Count',
        applyFilter: true,
      },
      {
        id: 'creation_date',
        name: 'Created By',
        applyFilter: true,
      },
      {
        id: 'attribute_id',
        name: 'Attribute Id',
      },
      {
        id: 'status_reason',
        name: 'Network Reason',
      },
      // {
      //   id: 'confirmation',
      //   name: 'Confirmation Tagging Complete',
      //   colSpan: 3,
      // },
      {
        id: 'reason',
        name: 'Audience Approval',
        applyFilter: true,
      },
    ];
  } else if (tabId === 'declined') {
    return [
      ...commonHeaderList,
      {
        id: 'dish_count',
        name: 'Dish Count',
        applyFilter: true,
      },

      {
        id: 'creation_date',
        name: 'Created By',
        applyFilter: true,
      },

      {
        id: 'rejection_date',
        name: 'Declined By',
        applyFilter: true,
      },
      {
        id: 'reason',
        name: 'Status/ Reason',
        applyFilter: true,
      },
    ];
  } else if (tabId === 'archive') {
    return [
      ...commonHeaderList,
      {
        id: 'dish_count',
        name: 'Dish Count',
        applyFilter: true,
      },
      {
        id: 'creation_date',
        name: 'Created By',
        applyFilter: true,
      },
    ];
  } else {
    return [...commonHeaderList];
  }
};

export const commonHeaderList = [
  {
    id: 'advertiser',
    name: 'Advertiser',
    applyFilter: true,
  },
  {
    id: 'data_source',
    name: 'Data Source',
    applyFilter: true,
  },
  {
    id: 'audience_name',
    name: 'Audience Name',
    applyFilter: true,
  },
  {
    id: 'audience_description',
    name: 'Audience Description',
    applyFilter: true,
  },
  {
    id: 'live_ramp_count',
    name: 'Audience Count',
    applyFilter: true,
  },
];

export const data = [
  {
    id: 0,
    name: 'Test',
    data_source: 'Live Ramp',
    audience_name: 'Test Name',
    audience_description: 'Description',
    live_ramp_count: '1,000,000',
    dish_count: '10,000',
    status: 'Approved',
    creation_date: '05-Dec-2021 08:40 ET',
    reason: 'Confirmed By Admin Univision At 29-Oct-2021',
    status_decline: 'Decline',
    status_pending: 'Pending',
    reason_pending_processing: 'Waiting for Dish response',
    reason_pending_univision: 'Waiting for Univsion response',
    reason_declined: 'Audience too small',
    rejection_date: '10-Dec-2021 08:40 ET',
    //attribute_id: 'Q321005338',
    active_reason: 'Confirmed By Admin Univision At 03-Nov-2021',
  },
  {
    id: 1,
    name: 'Paypal',
    data_source: 'Live Ramp',
    audience_name: 'High Income',
    audience_description: 'Truck Intenders',
    live_ramp_count: '1,145,300',
    dish_count: '45,569',
    status: 'Approved',
    creation_date: '05-Dec-2021 08:40 ET',
    reason: 'Confirmed By Admin Univision At 29-Oct-2021',
    status_decline: 'Decline',
    status_pending: 'Pending',
    reason_pending_processing: 'Waiting for Dish response',
    reason_pending_univision: 'Waiting for Univsion response',
    reason_declined: 'Audience too small',
    rejection_date: '09-Dec-2021 08:40 ET',
    attribute_id: 'Q321099',
    active_reason: 'Confirmed By Admin Univision At 03-Nov-2021',
  },
  {
    id: 2,
    name: 'Ford',
    data_source: 'Audience Request Form',
    audience_name: 'SUV Intenders',
    audience_description: 'SUV Intenders Low Income',
    live_ramp_count: '2,145,300',
    dish_count: '65,569',
    status: 'Approved',
    creation_date: '06-Dec-2021 09:40 ET',
    reason: 'Confirmed By Admin Univision At 29-Oct-2021',
    status_decline: 'Decline',
    status_pending: 'Pending',
    reason_pending_processing: 'Waiting for Dish response',
    reason_pending_univision: 'Waiting for Univsion response',
    reason_declined: 'Audience too small',
    rejection_date: '09-Dec-2021 08:40 ET',
    attribute_id: 'Q321009',
    active_reason: 'Confirmed By Admin Univision At 03-Nov-2021',
  },
  // {
  //   id: 3,
  //   name: 'Advertiser',
  //   data_source: 'Live Ramp',
  //   audience_name: 'High Income',
  //   audience_description: 'Truck Intenders',
  //   live_ramp_count: '1,145,300',
  //   dish_count: '45,569',
  //   status: 'Approved',
  //   creation_date: '2021-12-05',
  //   reason: 'Confirmed By Admin Univision At 29-Oct-2021',
  //   status_decline: 'Decline',
  //   status_pending: 'Pending',
  //   reason_pending_processing: 'Waiting for Dish response',
  //   reason_pending_univision: 'Waiting for Univsion response',
  //   reason_declined: 'Audience too small',
  //   rejection_date: '2021-12-10',
  // },
  // {
  //   id: 4,
  //   name: 'Advertiser',
  //   data_source: 'Live Ramp',
  //   audience_name: 'High Income',
  //   audience_description: 'Truck Intenders',
  //   live_ramp_count: '1,145,300',
  //   dish_count: '45,569',
  //   status: 'Approved',
  //   creation_date: '2021-12-05',
  //   reason: 'Confirmed By Admin Univision At 29-Oct-2021',
  //   status_decline: 'Decline',
  //   status_pending: 'Pending',
  //   reason_pending_processing: 'Waiting for Dish response',
  //   reason_pending_univision: 'Waiting for Univsion response',
  //   reason_declined: 'Audience too small',
  //   rejection_date: '2021-12-10',
  // },
];
