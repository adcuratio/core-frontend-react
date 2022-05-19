import DateTime from 'luxon/src/datetime.js';
import './util.css';
export const formatNumber = (value) => new Intl.NumberFormat('en-US', {}).format(value);

export const getEntityType = (entityData) => {
  if (Object.prototype.hasOwnProperty.call(entityData, 'brands')) return 'company';
  else if (Object.prototype.hasOwnProperty.call(entityData, 'sub_brands')) return 'brand';
  else return 'sub_brand';
};

export const processUTCtoEST = (s, format = 'dd-MMM-y HH:mm') => {
  if (typeof s !== 'string') return '';
  return DateTime.fromISO(s).setZone('America/New_York').toFormat(format);
};

export const messageNotification = (params, timeoutInSeconds) => {
  const messageTimeout = timeoutInSeconds || 3000;
  params = params || {};

  const data = {
    class: params.class || 'alert alert-success',
    message: params.message || 'Success message',
  };

  const content = document.createElement('div');
  content.className = data.class;
  content.id = 'messageNotification';
  content.innerHTML = data.message;
  document.body.appendChild(content);

  setTimeout(() => {
    const element = document.getElementById('messageNotification');
    element.parentElement.removeChild(element);
  }, messageTimeout);
};

export const errorNotification = (params, timeoutInSeconds) => {
  const messageTimeout = timeoutInSeconds || 3000;
  params = params || {};
  const data = {
    class: params.class || 'alert alert-danger',
    message:
      params.message ||
      'An unexpected error occurred. If the problem persists, please contact the Adcuratio administrator for further support.',
  };
  const content = document.createElement('div');
  content.className = data.class;
  content.id = 'errorNotification';
  content.innerHTML = data.message;
  document.body.appendChild(content);
  setTimeout(() => {
    const element = document.getElementById('errorNotification');
    element.parentElement.removeChild(element);
  }, messageTimeout);
};

export const showAckMessage = (params) => {
  if (document.getElementsByClassName('message-notification-dialog').length > 0) return;
  params = params || {};
  const data = {
    class: params.class || 'alert alert-success',
    message: params.message || 'Success message',
  };
  const content = document.createElement('div');
  content.className = `${data.class} message-notification-dialog success-message-modal`;
  content.id = 'showAckErrorMessage';
  content.innerHTML = ` <h1 class="message-modal-header">Notification</h1>
  <div class="message-text-styling"> ${data.message}</div>
  <div class="message-modal-footer">
  <button id ="close" type="button" class="btn btn-default message-modal-button">
  OK</button>
  </div>
  </div> <div class="react-message-overlay {
    "></div>`;

  document.body.appendChild(content);
  document.getElementById('close').onclick = function () {
    const element = document.getElementById('showAckErrorMessage');
    element.parentElement.removeChild(element);
    const loaderOverlayElement = document.getElementsByClassName('react-message-overlay')[0];
    if (loaderOverlayElement) {
      loaderOverlayElement.removeClass('react-message-overlay');
    }
  };
};

export const showAckErrorMessage = (params) => {
  if (document.getElementsByClassName('message-notification-dialog').length > 0) return;
  params = params || {};
  const data = {
    class: params.class || 'alert alert-danger',
    message:
      params.message ||
      'An unexpected error occurred. If the problem persists, please contact the Adcuratio administrator for further support.',
  };
  const content = document.createElement('div');
  content.className = `${data.class} message-notification-dialog error-message-modal`;
  content.id = 'showAckErrorMessage';
  content.innerHTML = ` <h1 class="message-modal-header">Error</h1>
  <div class="message-text-styling">${data.message}</div>
  <div class="message-modal-footer">
  <button id ="close" type="button" class="btn btn-default message-modal-button ">
  OK</button>
  </div>
  </div> <div class="react-message-overlay {
    "></div>`;
  document.body.appendChild(content);
  document.getElementById('close').onclick = function () {
    const element = document.getElementById('showAckErrorMessage');
    element.parentElement.removeChild(element);
    const loaderOverlayElement = document.getElementsByClassName('react-message-overlay')[0];
    if (loaderOverlayElement) {
      loaderOverlayElement.removeClass('react-message-overlay');
    }
  };
};

export const showAckWarningMessage = (params) => {
  if (document.getElementsByClassName('message-notification-dialog').length > 0) return;
  params = params || {};
  const data = {
    class: params.class || 'alert alert-warning',
    message: params.message || 'Warning',
  };
  const content = document.createElement('div');
  content.className = `${data.class} message-notification-dialog warning-message-modal `;
  content.id = 'showAckWarningMessage';
  content.innerHTML = ` <h1 class="message-modal-header">Warning</h1>
  <div class="message-text-styling">${data.message}</div>
  <div class="message-modal-footer">
  <button id ="close" type="button" class="btn btn-default message-modal-button ">
  OK</button>
  </div>
  </div> <div class="react-message-overlay {
    "></div>`;
  document.body.appendChild(content);
  document.getElementById('close').onclick = function () {
    const element = document.getElementById('showAckWarningMessage');
    element.parentElement.removeChild(element);
    const loaderOverlayElement = document.getElementsByClassName('react-message-overlay')[0];
    if (loaderOverlayElement) {
      loaderOverlayElement.removeClass('react-message-overlay');
    }
  };
};

export const isObject = (obj) => {
  if ((typeof obj === 'object' || typeof obj === 'function') && obj !== null) {
    return true;
  }
  return false;
};

export const getSortingValues = (id, a, b) => {
  let value1;
  let value2;

  if (id === 'registration-date') {
    value1 = a.registration_date;
    value2 = b.registration_date;
  } else if (id === 'media-buying-agency') {
    value1 = a.Advertiser_Media_Buying_Agency_Name;
    value2 = b.Advertiser_Media_Buying_Agency_Name;
  } else if (id === 'sub-industry') {
    value1 = a.advertiser_sub_industry;
    value2 = b.advertiser_sub_industry;
  } else if (id === 'industry') {
    value1 = a.advertiser_industry;
    value2 = b.advertiser_industry;
  } else if (id === 'advertiser') {
    value1 = a.advertiser_name;
    value2 = b.advertiser_name;
  } else if (id === 'adv_sch_deal_id') {
    value1 = a.edi_filename;
    value2 = b.edi_filename;
  } else if (id === 'adv_sch_ad_name') {
    value1 = a.deal_data.advertiser_display_name;
    value2 = b.deal_data.advertiser_display_name;
  } else if (id === 'adv_sch_network') {
    value1 = a.deal_data.networks[0];
    value2 = b.deal_data.networks[0];
  } else if (id === 'adv_sch_last_modified') {
    value1 = a.modified;
    value2 = b.modified;
  } else if (id === 'adv_sch_brand') {
    value1 =
      a.deal_data.brand[0] && a.deal_data.brand[0].brand__display_name ? a.deal_data.brand[0].brand__display_name : '';
    value2 =
      b.deal_data.brand[0] && b.deal_data.brand[0].brand__display_name ? b.deal_data.brand[0].brand__display_name : '';
  } else if (id === 'adv_sch_sub_brand') {
    value1 =
      a.deal_data.sub_brand[0] && a.deal_data.sub_brand[0].sub_brand__display_name
        ? a.deal_data.sub_brand[0].sub_brand__display_name
        : '';
    value2 =
      b.deal_data.sub_brand[0] && b.deal_data.sub_brand[0].sub_brand__display_name
        ? b.deal_data.sub_brand[0].sub_brand__display_name
        : '';
  }

  // For Network creatives.
  else if (id === 'nt_cr_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'nt_cr_brand_name') {
    value1 = a.brand_name;
    value2 = b.brand_name;
  } else if (id === 'nt_cr_sub_brand') {
    value1 = a.sub_brand_name;
    value2 = b.sub_brand_name;
  } else if (id === 'nt_cr_creative_name') {
    value1 = a.ad_name;
    value2 = b.ad_name;
  } else if (id === 'nt_cr_isci_code') {
    value1 = a.identifier;
    value2 = b.identifier;
  } else if (id === 'nt_cr_buying_agency') {
    value1 = a.agency_name;
    value2 = b.agency_name;
  } else if (id === 'nt_cr_delivery_vendor') {
    value1 = a.delivery_vendor;
    value2 = b.delivery_vendor;
  } else if (id === 'nt_cr_duration') {
    value1 = a.actual_duration;
    value2 = b.actual_duration;
  }

  // -------------------------------
  else if (id === 'op_cr_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'op_cr_brand_name') {
    value1 = a.brand_name;
    value2 = b.brand_name;
  } else if (id === 'op_cr_sub_brand') {
    value1 = a.sub_brand_name;
    value2 = b.sub_brand_name;
  } else if (id === 'op_cr_creative_name') {
    value1 = a.ad_name;
    value2 = b.ad_name;
  } else if (id === 'op_cr_isci_code') {
    value1 = a.identifier;
    value2 = b.identifier;
  } else if (id === 'op_cr_asset_id') {
    value1 = a.asset_id;
    value2 = b.asset_id;
  } else if (id === 'op_cr_delivery_vendor') {
    value1 = a.delivery_vendor;
    value2 = b.delivery_vendor;
  } else if (id === 'op_cr_duration') {
    value1 = a.actual_duration;
    value2 = b.actual_duration;
  }

  // --------------------------------
  else if (id === 'msg_grp_advertiser') {
    value1 = a.advertiser;
    value2 = b.advertiser;
  } else if (id === 'msg_grp_brand') {
    value1 = a.brand;
    value2 = b.brand;
  } else if (id === 'msg_grp_sub_brand') {
    value1 = a.sub_brand;
    value2 = b.sub_brand;
  } else if (id === 'msg_grp_name') {
    value1 = a.name;
    value2 = b.name;
  } else if (id === 'msg_grp_household_count') {
    value1 = a.wanted_household_count;
    value2 = b.wanted_household_count;
  } else if (id === 'msg_grp_creative_name') {
    value1 = a.default_adid.ad_name;
    value2 = b.default_adid.ad_name;
  } else if (id === 'msg_grp_isci_code') {
    value1 = a.default_adid.identifier;
    value2 = b.default_adid.identifier;
  }

  // ------------------------------
  else if (id === 'cr_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'cr_brand') {
    value1 = a.brand_name;
    value2 = b.brand_name;
  } else if (id === 'cr_sub_brand') {
    value1 = a.sub_brand_name;
    value2 = b.sub_brand_name;
  } else if (id === 'cr_name') {
    value1 = a.ad_name;
    value2 = b.ad_name;
  } else if (id === 'cr_isci_code') {
    value1 = a.identifier;
    value2 = b.identifier;
  } else if (id === 'cr_delivery_vendor') {
    value1 = a.delivery_vendor;
    value2 = b.delivery_vendor;
  } else if (id === 'cr_duration') {
    value1 = a.actual_duration;
    value2 = b.actual_duration;
  }

  // ------------------------------
  else if (id === 'nt_ai_deal_id') {
    value1 = a.deal_id;
    value2 = b.deal_id;
  } else if (id === 'nt_ai_network') {
    value1 = a.channel_name;
    value2 = b.channel_name;
  } else if (id === 'nt_ai_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'nt_ai_brand') {
    value1 = a.brand_name;
    value2 = b.brand_name;
  } else if (id === 'nt_ai_airing_date') {
    value1 = a.flighting_dates;
    value2 = b.flighting_dates;
  } else if (id === 'nt_ai_selling_title') {
    value1 = a.show_name;
    value2 = b.show_name;
  } else if (id === 'nt_ai_unit_rate') {
    value1 = a.unit_cost;
    value2 = b.unit_cost;
  } else if (id === 'nt_ai_unit_duration') {
    value1 = a.duration;
    value2 = b.duration;
  } else if (id === 'nt_ai_spot_usn') {
    value1 = a.adspot_id;
    value2 = b.adspot_id;
  } else if (id === 'nt_broadcast_date_time') {
    value1 = a.i_airing_time;
    value2 = a.i_airing_time;
  }

  // ------------------------------
  else if (id === 'tag_advertiser') {
    value1 = a.trades && a.trades.length > 0 ? a.trades[0].advertiser : '';
    value2 = b.trades && b.trades.length > 0 ? b.trades[0].advertiser : '';
  } else if (id === 'tag_deafault_brand' || id === 'xan_cr_brand') {
    value1 = a.trades && a.trades.length > 0 ? a.trades[0].brand : '';
    value2 = b.trades && b.trades.length > 0 ? b.trades[0].brand : '';
  } else if (id === 'tag_sub_brand' || id === 'xan_cr_sub-brand') {
    value1 = a.trades && a.trades.length ? a.trades[0].sub_brand : '';
    value2 = b.trades && b.trades.length ? b.trades[0].sub_brand : '';
  } else if (id === 'tag_adcuratio_tag_name') {
    value1 = a.dish_filename;
    value2 = b.dish_filename;
  } else if (id === 'tag_order_name') {
    value1 = a.trades && a.trades.length > 0 ? a.trades[0].order_name : '';
    value2 = b.trades && b.trades.length > 0 ? b.trades[0].order_name : '';
  } else if (id === 'tag_mssg_grp') {
    value1 = a.replacement_messaging_groups;
    value2 = b.replacement_messaging_groups;
  } else if (id === 'tag_row_count') {
    value1 = a.row_count;
    value2 = b.row_count;
  }

  // -------------------------------
  else if (id === 'acc_man_subagency_name') {
    value1 = a.name;
    value2 = b.name;
  } else if (id === 'acc_man_adv_name') {
    value1 = a.name;
    value2 = b.name;
  } else if (id === 'acc_man_adv_industry') {
    value1 = a.segment;
    value2 = b.segment;
  } else if (id === 'acc_man_adv_sub_industry') {
    value1 = a.subSegment;
    value2 = b.subSegment;
  } else if (id === 'acc_man_adv_brands') {
    value1 = a.brands;
    value2 = b.brands;
  } else if (id === 'acc_man_rep_first_name' || id === 'acc_man_advadm_first_name') {
    value1 = a.first_name;
    value2 = b.first_name;
  } else if (id === 'acc_man_rep_last_name' || id === 'acc_man_advadm_last_name') {
    value1 = a.last_name;
    value2 = b.last_name;
  } else if (id === 'acc_man_rep_email' || id === 'acc_man_advadm_email') {
    value1 = a.email;
    value2 = b.email;
  } else if (id === 'acc_man_rep_phone' || id === 'acc_man_advadm_phone') {
    value1 = a.phone;
    value2 = b.phone;
  } else if (id === 'acc_man_br_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'acc_man_br_brand') {
    value1 = a.name;
    value2 = b.name;
  } else if (id === 'acc_man_br_subbrands') {
    value1 = a.sub_brands;
    value2 = b.sub_brands;
  } else if (id === 'acc_man_advadm_user_entity') {
    value1 = a.user_entity;
    value2 = b.user_entity;
  }

  // -------------------------------
  else if (id === 'xan_cr_advertiser') {
    value1 = a.advertiser_name;
    value2 = b.advertiser_name;
  } else if (id === 'xan_cr_creative_name') {
    value1 = a.creative_name;
    value2 = b.creative_name;
  } else if (id === 'xan_cr_isci_code') {
    value1 = a.isci_code;
    value2 = b.isci_code;
  } else if (id === 'xan_cr_duration') {
    value1 = a.actual_duration;
    value2 = b.actual_duration;
  } else if (id === 'xan_cr_delivery_vendor') {
    value1 = a.delivery_vendor;
    value2 = b.delivery_vendor;
  } else if (id === 'xan_cr_asset_id') {
    value1 = a.asset_id;
    value2 = b.asset_id;
  }

  // For vizio review creatives module.
  else if (id === 'vz_cr_advertiser') {
    value1 = a.company_name;
    value2 = b.company_name;
  } else if (id === 'vz_cr_brand') {
    value1 = a.brand_name;
    value2 = b.brand_name;
  } else if (id === 'vz_cr_sub_brand') {
    value1 = a.sub_brand_name;
    value2 = b.sub_brand_name;
  } else if (id === 'vz_cr_creative_name') {
    value1 = a.ad_name;
    value2 = b.ad_name;
  } else if (id === 'vz_cr_isci_code') {
    value1 = a.identifier;
    value2 = b.identifier;
  } else if (id === 'vz_cr_delivery_vendor') {
    value1 = a.delivery_vendor;
    value2 = b.delivery_vendor;
  } else if (id === 'vz_cr_duration') {
    value1 = a.actual_duration;
    value2 = b.actual_duration;
  } else if (id === 'vz_cr_media_file_id') {
    value1 = a.vizio_media_file_id;
    value2 = b.vizio_media_file_id;
  }

  value1 = value1 ? (typeof value1 === 'string' && value1.toLowerCase()) || value1 : '';
  value2 = value2 ? (typeof value2 === 'string' && value2.toLowerCase()) || value2 : '';
  return {
    value1,
    value2,
  };
};

export const applySorting = (isAsc, id, sortingData) => {
  if (isAsc) {
    sortingData?.sort((a, b) => {
      const values = getSortingValues(id, a, b);
      const value1 = values.value1;
      const value2 = values.value2;
      if (value1 < value2) {
        return -1;
      }
      if (value1 > value2) {
        return 1;
      }
      return 0;
    });
  } else if (!isAsc) {
    sortingData?.sort((a, b) => {
      const values = getSortingValues(id, a, b);
      const value1 = values.value1;
      const value2 = values.value2;
      if (value1 > value2) {
        return -1;
      }
      if (value1 < value2) {
        return 1;
      }
      return 0;
    });
  }
  return sortingData;
};

export const applySearch = (searchWord, list, columns) => {
  if (searchWord) {
    searchWord = searchWord.toLowerCase();
    const filterList = [];
    let keepgoing;
    if (!list) {
      return;
    }
    list.forEach((listData) => {
      keepgoing = true;
      if (columns) {
        columns.forEach((data) => {
          if (keepgoing) {
            if (
              data.applyFilter &&
              listData[data.dataProp] &&
              listData[data.dataProp].toString() &&
              Array.isArray(listData[data.dataProp])
            ) {
              listData[data.dataProp].forEach((arrayEle) => {
                if (arrayEle && arrayEle.toLowerCase().indexOf(searchWord) !== -1 && keepgoing) {
                  filterList.push({ ...listData });
                  keepgoing = false;
                }
              });
            } else if (
              data.applyFilter &&
              listData[data.dataProp] &&
              listData[data.dataProp].toString().toLowerCase().indexOf(searchWord) !== -1
            ) {
              filterList.push({ ...listData });
              keepgoing = false;
            }
          }
        });
      } else {
        return [];
      }
    });
    return filterList;
  } else {
    return list;
  }
};

export const validateUrl = (url) => {
  if (!url) {
    return false;
  }
  const regex = /^(http[s]?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,24}[.]?/;
  if (!regex.test(url)) {
    return false;
  }
  return true;
};

export const validateEmail = (email) => {
  if (!email) return false;

  const regex = /^([A-Za-z0-9_+\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  if (!regex.test(email)) return false;

  return true;
};

export const validatePassword = (password) => {
  if (!password) return false;

  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})([A-Za-z\d@$!%*?&])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,25}$/;
  if (!regex.test(password)) return false;

  return true;
};

export const removeSpecialCharacters = (str) => str.replace(/[^a-zA-Z0-9_-]/g, '');

export const validateName = (name) => {
  const regex = /^(?=.*[A-Za-z])[\w\s()!+*-,'".?@#$%|^]*$/;
  if (!regex.test(name)) return false;
  return true;
};

export const formatEmail = (email) => email.toLowerCase() || email;

export const formatText = (text) => {
  if (typeof text !== 'string') return '';
  return text.trim();
};

export const toTitleCase = (phrase) => {
  if (!phrase) {
    return '';
  }
  return phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const nameValidation = (name) => {
  if (name && /^[a-zA-Z ]*$/.test(name)) {
    return true;
  }
  return false;
};
export const numberValidation = (num) => {
  if (num && /^[0-9]+$/.test(num)) {
    return true;
  }
  return false;
};

export const isCompany = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'brands')) return true;
  return false;
};
export const isBrand = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'sub_brands')) return true;
  return false;
};

export const isSubBrand = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'brands') || Object.prototype.hasOwnProperty.call(node, 'sub_brands'))
    return false;
  return true;
};

export const getChildNodes = (node) => {
  if (isCompany(node)) {
    if (!node.brands) return [];
    return node.brands;
  } else if (isBrand(node)) {
    if (!node.sub_brands) return [];
    return node.sub_brands;
  }
};

export const isChannel = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'dayparts')) return true;
  return false;
};
export const isDaypart = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'shows')) return true;
  return false;
};
export const isShow = (node) => {
  if (Object.prototype.hasOwnProperty.call(node, 'parentDaypart')) return true;
  return false;
};
export const isValidDate = (date) => {
  const isValid = date instanceof Date && !isNaN(date);
  return isValid;
};

export const stdMonthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getMonthArray = (stdMonthArray) => {
  const monthArray = [];
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 3) % 12;
  const currentYear = currentDate.getFullYear() - 1;
  for (let x = currentMonth; x <= 22 + currentMonth; x++) {
    monthArray.push(`${stdMonthArray[x % 12]}, ${parseInt(currentYear + parseInt(x / 12))}`);
  }
  return monthArray;
};

export const getReportsMonthArray = (stdMonthArray) => {
  const monthArray = [];
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 3) % 12;
  const currentYear = currentDate.getFullYear() - 1;
  for (let x = currentMonth + 3; x <= 15 + currentMonth; x++) {
    monthArray.push(`${stdMonthArray[x % 12]}, ${parseInt(currentYear + parseInt(x / 12))}`);
  }
  return monthArray;
};

export const processName = (data) => data?.display_name || data?.name;
export const hasProperty = (obj, key) => obj && Object.prototype.hasOwnProperty.call(obj, key);
