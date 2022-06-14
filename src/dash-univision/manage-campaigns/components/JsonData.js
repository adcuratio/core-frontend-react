export const NcmManageTradeTabs = [
  {
    heading: 'Active',
    id: 'active',
  },
  {
    heading: 'Pending UCI Approval',
    id: 'pendingUCIApproval',
  },
  {
    heading: 'Pending Distributor Approval',
    id: 'pendingDistributorApproval',
  },
  {
    heading: 'Canceled',
    id: 'cancelled',
  },
  {
    heading: 'Completed',
    id: 'completed',
  },
];
export const activeTradesTableTitle = [
  {
    heading: 'Campaign ID',
    id: 'campaignId',
    applyFilter: true,
    dataProp: 'order_identifier',
  },
  {
    heading: 'Advertiser',
    id: 'advertiser',
    applyFilter: true,
    dataProp: 'adv_company_name',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  // {
  //   heading: 'Desired Impressions',
  //   id: 'desired_impressions',
  //   applyFilter: true,
  //   dataProp: 'desired_impressions',
  // },

  {
    heading: 'Start Date',
    id: 'start_date',
    applyFilter: true,
    dataProp: 'start_date',
  },
  {
    heading: 'End Date',
    id: 'end_date',
    applyFilter: true,
    dataProp: 'end_date',
  },
  {
    heading: 'Created By',
    id: 'creator',
    applyFilter: true,
    dataProp: 'creator',
  },
  {
    heading: 'Approved by UCI',
    id: 'approved_by_uci',
    applyFilter: false,
  },
  {
    heading: 'View',
    id: 'view',
    applyFilter: false,
  },
];

export const pausedTradesTableTitle = [
  {
    heading: 'Campaign ID',
    id: 'campaignId',
    applyFilter: true,
    dataProp: 'order_identifier',
  },
  {
    heading: 'Advertiser',
    id: 'advertiser',
    applyFilter: true,
    dataProp: 'adv_company_name',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Start Date',
    id: 'start_date',
    applyFilter: true,
    dataProp: 'start_date',
  },
  {
    heading: 'End Date',
    id: 'end_date',
    applyFilter: true,
    dataProp: 'end_date',
  },
  {
    heading: 'Created By',
    id: 'creator',
    applyFilter: true,
    dataProp: 'creator',
  },
  {
    heading: 'Canceled By',
    id: 'canceled_by',
    applyFilter: true,
    dataProp: 'canceled_by',
  },
  {
    heading: 'Approved by UCI',
    id: 'approved_by_uci',
    applyFilter: false,
  },
  {
    heading: 'View',
    id: 'view',
    applyFilter: false,
  },
];

export const pendingDistributorTradesTableTitle = [
  {
    heading: 'Campaign ID',
    id: 'campaignId',
    applyFilter: true,
    dataProp: 'order_identifier',
  },
  {
    heading: 'Advertiser',
    id: 'advertiser',
    applyFilter: true,
    dataProp: 'adv_company_name',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Start Date',
    id: 'start_date',
    applyFilter: true,
    dataProp: 'start_date',
  },
  {
    heading: 'End Date',
    id: 'end_date',
    applyFilter: true,
    dataProp: 'end_date',
  },
  {
    heading: 'Created By',
    id: 'creator',
    applyFilter: true,
    dataProp: 'creator',
  },
  {
    heading: 'No of Creatives',
    id: 'no_of_creatives',
    applyFilter: false,
    dataProp: '',
  },
  {
    heading: 'Approved by UCI',
    id: 'approved_by_uci',
    applyFilter: false,
  },
  {
    heading: 'View',
    id: 'view',
    applyFilter: false,
  },
];

export const pendingUCITradesTableTitle = [
  {
    heading: 'Campaign ID',
    id: 'campaignId',
    applyFilter: true,
    dataProp: 'order_identifier',
  },
  {
    heading: 'Advertiser',
    id: 'advertiser',
    applyFilter: true,
    dataProp: 'adv_company_name',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Start Date',
    id: 'start_date',
    applyFilter: true,
    dataProp: 'start_date',
  },
  {
    heading: 'End Date',
    id: 'end_date',
    applyFilter: true,
    dataProp: 'end_date',
  },
  {
    heading: 'Created By',
    id: 'creator',
    applyFilter: true,
    dataProp: 'creator',
  },
  {
    heading: 'No of Creatives',
    id: 'no_of_creatives',
    applyFilter: false,
    dataProp: '',
  },
  {
    heading: 'View',
    id: 'view',
    applyFilter: false,
  },
  {
    heading: 'Action',
    id: 'action',
    applyFilter: false,
  },
];

export const accordionHeader = [
  {
    id: 'creative_name',
    name: 'Creative Name',
  },
  {
    id: 'creative_isci',
    name: 'Creative ISCI',
  },
  {
    id: 'duration',
    name: 'Duration',
  },
  {
    id: 'asset_id',
    name: ' Asset Id',
  },
  {
    id: 'ad_preview',
    name: 'Ad Preview',
  },
];

export const activeAccordionHeader = [
  {
    id: 'segment_name',
    name: 'Segment Name',
  },
  {
    id: 'segment_source',
    name: 'Segment Source',
  },
  {
    id: 'audience_size',
    name: 'Segment Size',
  },
  {
    id: 'avg_pacing',
    name: 'Average Pacing',
  },
  {
    id: 'impressions_delivered',
    name: 'Impressions Delivered',
  },
  {
    id: 'impressions_target',
    name: 'Impression Target',
  },
  {
    id: 'trend',
    name: 'Trend',
  },
  {
    id: 'view_details',
    name: 'View Details',
  },
  {
    id: 'view_graph',
    name: 'View Graph',
  },
  {
    id: 'download',
    name: 'Download',
  },
];

export const viewAccordionDetailsTitles = [
  {
    id: 'campaign_name',
    name: 'Campaign Name',
  },
  {
    id: 'source',
    name: 'Source',
  },
  {
    id: 'creative',
    name: 'Creative Name',
  },
  {
    id: 'isci',
    name: 'ISCI',
  },
  {
    id: 'date',
    name: 'Date',
  },
  {
    id: 'reach',
    name: 'Reach',
  },
  {
    id: 'reach_finalized',
    name: 'Reach Finalized',
  },
  {
    id: 'impression',
    name: 'Impression',
  },
  {
    id: 'impressions_finalized',
    name: 'Impressions Finalized',
  },
];

export const pacingReportsTitles = [
  {
    id: 'advertiser',
    name: 'Advertiser',
  },
  {
    id: 'campaign_name',
    name: 'Campaign Name',
  },
  {
    id: 'start_date',
    name: 'Start Date',
  },
  {
    id: 'end_date',
    name: 'End Date',
  },
  {
    id: 'audience_size',
    name: 'Segment Size',
  },
  {
    id: 'avg_pacing',
    name: 'Average Pacing',
  },
  {
    id: 'impressions_delivered',
    name: 'Impressions Delivered',
  },
  {
    id: 'impressions_target',
    name: 'Impression Target',
  },
  {
    id: 'trend',
    name: 'Trend',
  },
  {
    id: 'view',
    name: 'View',
  },
];

export const viewDetailsTitles = [
  {
    id: 'campaign_name',
    name: 'Campaign Name',
  },
  {
    id: 'source',
    name: 'Source',
  },
  {
    id: 'creative',
    name: 'Creative',
  },
  {
    id: 'isci',
    name: 'ISCI',
  },
  {
    id: 'date',
    name: 'Date',
  },
  {
    id: 'reach',
    name: 'Reach',
  },
  {
    id: 'reach_finalized',
    name: 'Reach Finalized',
  },
  {
    id: 'impression',
    name: 'Impression',
  },
  {
    id: 'impressions_finalized',
    name: 'Impressions Finalized',
  },
];

export const orderDetailsTableTitles = [
  {
    id: 'creative_type',
    name: 'Creative Type',
  },
  {
    id: 'no_of_creatives',
    name: 'No. of Creatives',
  },
  {
    id: 'creative_name',
    name: 'Creative Name (ISCI)',
  },
  {
    id: 'data_provider',
    name: 'Data Provider',
  },
  {
    id: 'segment_name',
    name: 'Segment Name',
  },
  {
    id: 'audience_count',
    name: 'Audience Count',
  },
  {
    id: 'activation_time',
    name: 'Activation Time',
  },
  {
    id: 'deactivation_time',
    name: 'Deactivation Time',
  },
  {
    id: 'approved_by_uci',
    name: 'Approved by UCI',
  },
  {
    id: 'action',
    name: 'Action',
  },
];
export const completedTradesTableTitle = [
  {
    heading: 'Campaign ID',
    id: 'campaignId',
    applyFilter: true,
    dataProp: 'order_identifier',
  },
  {
    heading: 'Advertiser',
    id: 'advertiser',
    applyFilter: true,
    dataProp: 'adv_company_name',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },

  {
    heading: 'Start Date',
    id: 'start_date',
    applyFilter: true,
    dataProp: 'start_date',
  },
  {
    heading: 'End Date',
    id: 'end_date',
    applyFilter: true,
    dataProp: 'end_date',
  },
  {
    heading: 'Created By',
    id: 'creator',
    applyFilter: true,
    dataProp: 'creator',
  },
  {
    heading: 'Approved by UCI',
    id: 'approved_by_uci',
    applyFilter: false,
  },
  {
    heading: 'View',
    id: 'view',
    applyFilter: false,
  },
  {
    heading: 'Pacing Report',
    id: 'report',
  },
  {
    heading: 'Post Campaign Report',
    id: 'post_campaign_report',
  },
];
