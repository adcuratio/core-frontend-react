export const AudienceTableTitles = [
  {
    id: 'advertiser-name',
    name: 'Advertiser',
  },
  {
    id: 'data-provider',
    name: 'Data Source',
  },
  {
    id: 'segment-name',
    name: 'Audience Name',
  },
  {
    id: 'segment-description',
    name: 'Audience Description',
  },
  {
    id: 'univision-count',
    name: 'Audience Count',
  },
  {
    id: 'dish-count',
    name: 'Adcuratio Footprint Count',
  },
  {
    id: 'created-date',
    name: 'Created By',
  },
  {
    id: 'approved-by-dish',
    name: 'Dish Approval',
  },
  {
    id: 'network-approved',
    name: 'Network Approval',
  },
  {
    id: 'actions',
    name: 'Actions',
  },

  {
    id: 'status',
    name: 'Status',
  },
  {
    id: 'rejection-date',
    name: 'Declined By',
  },
  {
    id: 'reason',
    name: 'Reason',
  },
];
export const declineCodes = [
  { id: 0, reason: 'Audience is too small' },
  { id: 1, reason: 'Changing audience parameters' },
  { id: 2, reason: 'Rejected by Client' },
  { id: 3, reason: 'Rejected by UCI' },
];
export const AudienceTableData = [
  {
    files: [],
    name: 'seg121',
    description: 'Individual Age :min :25max :80',
    impressions_count: 0,
    individual_count: 825038,
    is_default: false,
    filter_json: {
      Demographic: {
        advantage_individual_age: {
          max: 80,
          min: 25,
        },
      },
    },
    is_wanted: true,
    company: 89,
    is_stb: false,
    id: 124,
    processed: true,
    segment_type: 'tsp_lite',
    household_count: 823975,
    data_provider: 'epsilon',
    distributor_footprint_count: {
      dish_hh_count: 31728,
      vizio_hh_count: 12590,
      xandr_hh_count: 53707,
      dish_individual_count: 31790,
      vizio_individual_count: 12618,
      xandr_individual_count: 53825,
      adcuratio_footprint_hh_count: 97251,
      univision_linear_hh_footprint: 44318,
      adcuratio_footprint_indvi_count: 97457,
      univision_linear_indv_footprint: 44408,
    },
    company_name: 'univ-adv1',
    created: '2021-12-08T07:43:17.762868Z',
    modified: '2021-12-08T14:29:09.802787Z',
  },
  {
    files: [],
    name: 'seg-check',
    description: 'In the Market',
    impressions_count: 0,
    individual_count: 431061,
    is_default: false,
    filter_json: {
      Demographics: {
        Individual: {
          age: [44, 89],
        },
      },
    },
    is_wanted: true,
    company: 89,
    is_stb: false,
    id: 120,
    processed: true,
    segment_type: 'experian_standard',
    household_count: 430350,
    data_provider: 'experian',
    distributor_footprint_count: {
      dish_hh_count: 25039,
      vizio_hh_count: 9249,
      xandr_hh_count: 40827,
      dish_individual_count: 25085,
      vizio_individual_count: 9268,
      xandr_individual_count: 40905,
      adcuratio_footprint_hh_count: 74504,
      univision_linear_hh_footprint: 34288,
      adcuratio_footprint_indvi_count: 74644,
      univision_linear_indv_footprint: 34353,
    },
    company_name: 'univ-adv1',
    created: '2021-12-03T05:39:35.961933Z',
    modified: '2021-12-08T14:29:09.765453Z',
  },
];
