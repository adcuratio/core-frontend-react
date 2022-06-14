import moment from 'moment';

const getWeeks = (fromDate, toDate) => {
  const startDate = moment(fromDate);
  const endDate = moment(toDate);

  // 0-6 - (Sunday - Saturday)
  // 7 - Next Sunday

  // Convert to this week's monday's date.
  startDate.isoWeekday(1);

  // If not sunday convert to next sunday's date.
  if (endDate.day() > 0) {
    endDate.days(7);
  }

  const duration = moment.duration(endDate.diff(startDate));
  const totalDays = duration.asDays() + 1;
  return totalDays <= 7 ? 1 : Math.ceil(totalDays / 7);
};

const getDaysBetweenDates = function (startDate, endDate) {
  const now = startDate.clone();
  const dates = [];

  while (now.isSameOrBefore(endDate)) {
    dates.push(now.format('MM-DD-YYYY'));
    now.add(1, 'days');
  }
  return dates;
};

const randomNumbers = (weekNum) => [...Array(weekNum).keys()];

export const getDateRange = (start_date, end_date) => {
  if (start_date && end_date) {
    const dateRange = {};

    const fromDate = moment(start_date);
    const toDate = moment(end_date);

    const startweekday = 8 - fromDate?.isoWeekday();
    const endweekday = toDate?.isoWeekday();

    const dateList = getDaysBetweenDates(fromDate, toDate);
    const weekNum = getWeeks(fromDate, toDate, startweekday);

    const weeks = randomNumbers(weekNum).map(() => 7);

    weeks[0] = startweekday;
    weeks[weeks.length - 1] = endweekday;

    const tempDateList = [...dateList];
    weeks.forEach((week, index) => {
      dateRange[index + 1] = tempDateList.splice(0, week);
    });
    return dateRange;
  }
};

const rotationLableText = {
  Weighted: 'Weight',
  WeightedPercentage: 'Weighted Percentage',
  Sequenced: 'Sequenced',
  Storyboard: 'Storyboard',
};

export const getRotationLable = (type) => (rotationLableText?.[type] ? rotationLableText?.[type] : '---');

const rotationAssetKey = {
  Weighted: 'weight',
  WeightedPercentage: 'weighted_percentage',
  Sequenced: 'index',
  Storyboard: 'index',
};

export const getRotationAssetKey = (type) => (rotationAssetKey?.[type] ? rotationAssetKey?.[type] : 'invalid_rot_type');
