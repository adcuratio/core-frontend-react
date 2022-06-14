export const NetworkCreativesTabData = [
  {
    id: 'nt_cr_pending',
    name: 'Pending Approval',
    headingName: 'Pending Approval',
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
];

export const manageHeaderList = (tabId) => {
  const _headerArray = [...CommonHeaderList];
  if (tabId === 'nt_cr_pending')
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Creative Review',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      columnSpan: 2,
    });
  else if (tabId === 'nt_cr_approved')
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Approved Networks And Dayparts',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
    });
  else if (tabId === 'nt_cr_declined') {
    _headerArray.push({
      id: 'nt_cr_decline_reason',
      name: 'Decline Reason',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
      columnSpan: 2,
    });
    _headerArray.push({
      id: 'nt_cr_action',
      name: 'Action',
      applyFilter: false,
      sortingType: null,
      isApplySorting: false,
    });
  }
  return _headerArray;
};

export const declineCodes = [
  { id: 0, reason: 'Inappropriate content' },
  { id: 1, reason: 'Rating mismatch' },
  { id: 2, reason: 'Expired usage rights' },
];
