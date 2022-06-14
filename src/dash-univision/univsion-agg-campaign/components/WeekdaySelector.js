import React from 'react';
import PropTypes from 'prop-types';

import AggPickyFilter from './PickyAgg';
import { showAckErrorMessage } from '../../../common/utils';

const WeekdaySelector = (props) => {
  const { selectedWeekdaysObj, onChange } = props;
  const weekdaysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <AggPickyFilter
      includeSelectAll={false}
      className="date-picker-length"
      allOptions={weekdaysList}
      allSelectedPlaceholder={`${weekdaysList.length - 1} selected`}
      selectedData={
        Object.entries(selectedWeekdaysObj || {})
          .map(([key, value]) => (value ? key : null))
          .filter((e) => e) || []
      }
      onFilterChange={(data) => {
        if (data.length === 7) {
          showAckErrorMessage({ message: 'All days cannot be selected' });
          return;
        } else {
          const selectedDays = {};
          weekdaysList.forEach((dayName) => {
            selectedDays[dayName] = data.includes(dayName);
          });
          onChange(selectedDays);
        }
      }}
      id="days_of_week"
    />
  );
};

WeekdaySelector.propTypes = {
  selectedWeekdaysObj: PropTypes.object,
  onChange: PropTypes.func,
};

export default WeekdaySelector;
