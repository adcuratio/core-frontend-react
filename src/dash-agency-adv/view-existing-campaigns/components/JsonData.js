export const NcmManageTradeTabs = [
  {
    heading: 'Active',
    id: 'active',
  },
  {
    heading: 'Paused',
    id: 'paused',
  },
  {
    heading: 'Completed',
    id: 'completed',
  },
  {
    heading: 'Pending Distributor Approval',
    id: 'pendingDistributorApproval',
  },
  {
    heading: 'Requiring your approval',
    id: 'pendingAgencyApproval',
  },
  {
    heading: 'Pending Advertiser approval',
    id: 'pendingAdvApproval',
  },
  {
    heading: 'Pending Processing',
    id: 'pendingProcessing',
  },
  {
    heading: 'Declined',
    id: 'declined',
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
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Default Creative ISCI code',
    id: 'defaultIsci',
    applyFilter: false,
  },
  {
    heading: 'Default Messaging Group',
    id: 'default_messaging_group',
    applyFilter: false,
  },
  {
    heading: 'Default Ad',
    id: 'defaultAd',
    applyFilter: true,
    dataProp: 'default_ad',
  },
  {
    heading: 'Default Ad Preview',
    id: 'defaultAdPreview',
    applyFilter: false,
  },
  {
    heading: 'Action',
    id: 'action',
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
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Last Modified By',
    id: 'lastModifiedBy',
    applyFilter: true,
    dataProp: 'last_modified_by',
  },
  {
    heading: 'Last Modified At',
    id: 'lastModifiedAt',
    applyFilter: false,
  },
  {
    heading: 'Default Ad',
    id: 'defaultAd',
    applyFilter: true,
    dataProp: 'default_ad',
  },
  {
    heading: 'Default Ad Preview',
    id: 'defaultAdPreview',
    applyFilter: false,
  },
  {
    heading: 'Action',
    id: 'action',
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
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Last Modified By',
    id: 'lastModifiedBy',
    applyFilter: true,
    dataProp: 'last_modified_by',
  },
  {
    heading: 'Last Modified At',
    id: 'lastModifiedAt',
    applyFilter: false,
  },
  {
    heading: 'Default Ad',
    id: 'defaultAd',
    applyFilter: true,
    dataProp: 'default_ad',
  },
  {
    heading: 'Default Ad Preview',
    id: 'defaultAdPreview',
    applyFilter: false,
  },
  {
    heading: 'Distributors Approval Status',
    id: 'distributors',
    applyFilter: false,
  },
  {
    heading: 'Action',
    id: 'action',
    applyFilter: false,
  },
];

export const declineTradesTableTitle = [
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
    dataProp: 'order_advertiser',
  },
  {
    heading: 'Campaign Name',
    id: 'campaignName',
    applyFilter: true,
    dataProp: 'name',
  },
  {
    heading: 'Declined By',
    id: 'declinedBy',
    applyFilter: true,
    dataProp: 'last_modified_by',
  },
  {
    heading: 'Declined At',
    id: 'declinedAt',
    applyFilter: false,
  },
  {
    heading: 'Declined Reason',
    id: 'declinedReason',
    applyFilter: true,
    dataProp: 'comment',
  },
  {
    heading: 'Default Ad',
    id: 'defaultAd',
    applyFilter: true,
    dataProp: 'default_ad',
  },
  {
    heading: 'Default Ad Preview',
    id: 'defaultAdPreview',
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
    id: 'segment_name',
    name: 'Messaging Group',
  },
  {
    id: 'ratio',
    name: 'Ratio',
  },
  {
    id: 'frequency_cap',
    name: 'Frequency Capping',
  },
  {
    id: 'min_threshold',
    name: 'Minimum Threshold',
  },
  {
    id: 'frequency_period',
    name: 'Frequency Period',
  },
  {
    id: 'creative_name',
    name: 'Creative Name',
  },
  {
    id: 'creative_isci',
    name: 'Creative ISCI',
  },
  {
    id: 'ad_preview',
    name: 'Ad Preview',
  },
];
