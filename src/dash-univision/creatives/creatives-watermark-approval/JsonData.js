export const NetworkCreativesTabData = [
  {
    id: 'nt_cr_pending',
    name: 'Pending Watermark',
    headingName: 'Pending Watermark',
  },
  {
    id: 'nt_cr_approved',
    name: 'Approved',
    headingName: 'Approved',
  },
  {
    id: 'nt_cr_declined',
    name: 'Declined',
    headingName: 'Declined',
  },
];

export const CommonHeaderList = [
  {
    id: 'nt_cr_creative_thumbnail',
    name: 'Creative',
    applyFilter: false,
  },
  {
    id: 'nt_cr_advertiser',
    name: 'Advertiser',
    applyFilter: true,
    dataProp: 'company_name',
    sortingType: true,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_brand_name',
    name: 'Brand',
    applyFilter: true,
    dataProp: 'brand_name',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_sub_brand',
    name: 'Sub-Brand',
    applyFilter: true,
    dataProp: 'sub_brand_name',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_creative_name',
    name: 'Creative Name',
    applyFilter: true,
    dataProp: 'ad_name',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_isci_code',
    name: 'ISCI Code',
    applyFilter: true,
    dataProp: 'identifier',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_watermark_id',
    name: 'Watermark ID',
    applyFilter: false,
    sortingType: null,
    isApplySorting: false,
    enableWordBreak: true,
  },
  {
    id: 'nt_cr_buying_agency',
    name: 'TV buying agency',
    applyFilter: true,
    dataProp: 'agency_name',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_creative_agency',
    name: 'Creative Agency',
    applyFilter: true,
    dataProp: 'agency_name',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_delivery_vendor',
    name: 'Digital Delivery Vendor',
    applyFilter: true,
    dataProp: 'delivery_vendor',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_duration',
    name: 'Duration',
    applyFilter: true,
    dataProp: 'actual_duration',
    sortingType: null,
    isApplySorting: true,
  },
  {
    id: 'nt_cr_channel',
    name: 'Channel',
    applyFilter: false,
    dataProp: null,
    sortingType: null,
    isApplySorting: false,
  },
];

export const manageHeaderList = (tabId) => {
  const _headerArray = [...CommonHeaderList];
  if (tabId === 'nt_cr_pending') {
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Watermark QA',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      columnSpan: 2,
    });
    _headerArray.push({
      id: 'nt_cr_download',
      name: 'Download',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      enableWordBreak: true,
    });
  } else if (tabId === 'nt_cr_approved') {
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Approved By',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
    });
    _headerArray.push({
      id: 'nt_cr_download',
      name: 'Download',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      enableWordBreak: true,
    });
  } else if (tabId === 'nt_cr_declined') {
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Declined By',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
    });
    _headerArray.push({
      id: 'nt_cr_download',
      name: 'Download',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      enableWordBreak: true,
    });
  }
  return _headerArray;
};
