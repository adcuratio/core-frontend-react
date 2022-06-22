export const ManageOrderTabs = [
  {
    id: 'pending',
    name: 'Pending Approval',
    state: 0,
  },
  {
    id: 'approved',
    name: 'Approved - In-Progress',
    state: 1,
  },
  {
    id: 'declined',
    name: 'Declined',
    state: 3,
  },
  {
    id: 'completed',
    name: 'Completed',
    state: 2,
  },
  {
    id: 'pending processing',
    name: 'Pending Processing',
    state: 4,
  },
];

export const CommonHeaderList = [
  {
    id: 'inventory_owner',
    name: 'Inventory Owner',
    dataProp: 'inventory_owner',
    applyFilter: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    dataProp: 'agency',
    applyFilter: true,
  },
  {
    id: 'advertiser',
    name: 'Advertiser',
    dataProp: 'advertiser_name',
    applyFilter: true,
  },
  {
    id: 'brand',
    name: 'Brand',
    dataProp: 'brand',
    applyFilter: true,
  },
  {
    id: 'name',
    name: 'Order Name',
    dataProp: 'order_name',
    applyFilter: true,
  },
  {
    id: 'number_of_creatives',
    name: '# Of Creatives',
    dataProp: 'number_of_creatives',
    applyFilter: true,
  },
  {
    id: 'order_type',
    name: 'Order Type',
    dataProp: 'order_type',
    applyFilter: true,
  },
];

export const manageHeaderList = (selectedTab) => {
  const tabId = selectedTab.id;
  if (tabId === 'approved' || tabId === 'completed') {
    return [
      {
        id: 'order_id',
        name: 'Order Id',
        dataProp: 'order_id',
        applyFilter: true,
      },
      ...CommonHeaderList,
      {
        id: 'orderlines',
        name: 'Orderlines',
        classes: '',
      },
      {
        id: 'inventory',
        name: 'Inventory',
        classes: '',
      },
    ];
  } else if (tabId === 'declined') {
    return [
      ...CommonHeaderList,
      {
        id: 'comment',
        name: 'Decline Comment',
        dataProp: 'decline_comment',
        classes: '',
      },
      {
        id: 'orderlines',
        name: 'Orderlines',
        classes: '',
      },
    ];
  } else if (tabId === 'pending processing') {
    return [
      ...CommonHeaderList,
      {
        id: 'error',
        name: 'Error Message',
        dataProp: 'error',
        classes: '',
      },
      {
        id: 'action',
        name: 'Action',
        classes: '',
      },
    ];
  } else {
    return [
      ...CommonHeaderList,
      {
        id: 'orderlines',
        name: 'Orderlines',
        classes: '',
      },
      {
        id: 'action',
        name: 'Action',
        classes: '',
      },
    ];
  }
};

export const orderLinesTableColumn = [
  { title: 'Advertiser' },
  { title: 'Asset ID' },
  { title: 'Attribute Code' },
  { title: 'Desired Impressions' },
  { title: 'Priority' },
  { title: 'CPM' },
  { title: 'Segment Name' },
  { title: 'Data Provider' },
  { title: 'Audience Size' },
  { title: 'Frequency Cap / Maximum Viewings' },
  { title: 'Separations' },
  { title: 'Activation Time' },
  { title: 'Deactivation Time' },
  { title: 'Dish Orderline ID' },
  { title: 'Action' },
];

export const sasoOrderLinesTableColumn = [
  { title: 'Advertiser' },
  { title: 'Asset ID' },
  {
    title: 'Sales ID',
  },
  { title: 'Attribute Code' },
  { title: 'Activation Time' },
  { title: 'Deactivation Time' },
  { title: 'Orderline ID' },
  { title: 'Status' },
];

export const inventoryTableColumn = [
  {
    title: 'Advertiser',
  },
  { title: 'Brand' },
  { title: 'Sub Brand' },
  { title: 'Channel' },
  { title: 'Ad ID' },
  { title: 'Program Name' },
  { title: 'Default Asset ID' },
  { title: 'Air Date' },
  { title: 'Show Start Time' },
  { title: 'Show End Time' },
  { title: 'Ad Spot Airing Time' },
  { title: 'Window Start Time' },
  { title: 'Window End Time' },
  { title: 'Spot USN' },
  { title: 'Duration' },
];

export const declineCodes = [
  { id: 0, reason: 'Sales Strategy Conflict' },
  { id: 1, reason: 'Advertiser not approved' },
  { id: 2, reason: 'Capacity Overload' },
];

export const accrodionHeaderList = [
  {
    id: 'creative_name',
    name: 'Creative Name',
  },
  {
    id: 'creative_isci',
    name: 'Creative ISCI',
  },
  {
    id: 'asset_id',
    name: 'Asset ID',
  },
  {
    id: 'ad_preview',
    name: 'Ad Preview',
  },
  {
    id: 'creative_status',
    name: 'Creative Approval Status',
  },
];

export const orderAccordionData = [
  {
    success: true,
    data: {
      id: 66,
      orderline_details: null,
      creative_details: [
        {
          id: 156,
          adid_meta_file_upload: [
            {
              file_name: 'Y030FGN20TUB122H11212.mp4',
              ad_name: 'uni9',
              campaign_name: 'Custom AD',
              id: 83,
              identifier: 'uni9',
              s3_thumbnail_url:
                'https://adcuratio-axiom.s3.amazonaws.com:443/creatives/a9bb22ca9bdffce547d73872acb038f575541cc0/2a4d705e-a7e3-48b9-87ac-ea2d3148aea7.jpg?Signature=CJ7ZZyQZDbTU%2BL1iUlFVfjMvSaE%3D&Expires=1669711139&AWSAccessKeyId=AKIAIYBX4G2O5QSSJEHA&response-content-type=image/jpeg',
              actual_duration: 30.03,
              default_asset_id: 'iADC7770012',
              status_list: null,
              company_name: 'Univision Advertiser',
              duration: 30,
              is_received: [],
              brand_name: null,
              sub_brand_name: null,
              delivery_vendor: 'Extreme Reach',
              agency_name: 'univision',
              is_encoded: [
                {
                  is_encoded: true,
                  created: '2021-12-08T11:27:18.031503Z',
                  modified: '2021-12-08T11:27:18.093690Z',
                  operator: 3,
                  operator_name: 'dish',
                  first_name: 'Dish',
                  last_name: 'abv',
                  user_type: 'Distributor Admin',
                },
              ],
              is_spooled: [],
              asset_id: 'iADC0000004',
              created: '2021-11-18T08:13:32.166043Z',
              modified: '2021-11-29T08:38:59.295851Z',
              vizio_media_file_id: null,
              channels: [
                {
                  id: 36,
                  name: 'tudn',
                  display_name: 'TUDN',
                },
                {
                  id: 37,
                  name: 'cable networks',
                  display_name: 'Cable Networks',
                },
                {
                  id: 38,
                  name: 'univision',
                  display_name: 'Univision',
                },
                {
                  id: 39,
                  name: 'galavision',
                  display_name: 'Galavision',
                },
                {
                  id: 40,
                  name: 'unimas',
                  display_name: 'UniMas',
                },
              ],
              order_type: ['AGG'],
              inventory_owner: 'Univision',
            },
          ],
          created: '2021-11-18T08:13:32.002674Z',
          modified: '2021-11-18T08:13:32.002760Z',
          is_deleted: false,
          identifier: 'uni9',
          duration: 30,
          actual_duration: '30.030',
          video_url: 'Y030FGN20TUB122H11212.mxf',
          is_custom_ad: false,
          ad_name: 'uni9',
          creative_file: 'creatives/Y030FGN20TUB122H11212.mxf',
          is_cmt_frozen: false,
          status: null,
          default_asset_id: 'iADC7770012',
          airing_id: null,
          created_by: 18,
          updated_by: 18,
          company: 5,
          brand: null,
          sub_brand: null,
          networks: [],
        },
      ],
      created: '2021-12-03T05:15:14.039740Z',
      modified: '2021-12-03T05:15:14.039778Z',
      is_deleted: false,
      name: 'aggregate-camp',
      order_identifier: 'Order-8d11b6aab4-66',
      trade_draft: null,
      status: 4,
      budget: null,
      type: 'standard',
      comment: null,
      ratio_mgs: null,
      upgrade_adspots_count: 0,
      is_meta_generated: false,
      invidi_signal_done: false,
      filters: null,
      is_icdx_generated: false,
      start_date: '2022-01-17',
      end_date: '2022-01-10',
      order_type: 'AGG',
      created_by: 18,
      updated_by: 18,
      ad_id: null,
      campaign: null,
      messaging_group: null,
      adv_company: 1,
      adv_brand: null,
      adv_sub_brand: null,
      campaign_adspots: [],
      upgraded_adspots: [],
    },
  },
];
