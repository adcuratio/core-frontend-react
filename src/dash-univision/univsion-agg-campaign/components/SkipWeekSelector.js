import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { getDateRange } from './campaign-helper';
import moment from 'moment';
import { showAckErrorMessage } from '../../../common/utils';

const SkipWeekSelector = (props) => {
  const { start_date, end_date, skipWeek, onChange } = props;

  const [highlightedDates, setHighlightedDates] = useState([]);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (start_date && end_date) {
      setDateRange(getDateRange(start_date, end_date));
    }
    if (start_date && end_date && skipWeek) {
      const dateArr = getDateRange(start_date, end_date)?.[`${skipWeek}`]?.map(
        (dStr) => new Date(moment(dStr, 'MM-DD-YYYY'))
      );
      setHighlightedDates(dateArr);
    }
    if (skipWeek === null) {
      setHighlightedDates([]);
    }
  }, [start_date, end_date, skipWeek]);

  const onChangeSkipOff = (date) => {
    if (start_date && end_date) {
      if (date) {
        let integerWeek;
        Object.entries(dateRange).forEach(([key, value]) => {
          if (value.includes(moment(date).format('MM-DD-YYYY'))) {
            integerWeek = key;
            return true;
          }
          return false;
        });
        if (!isNaN(integerWeek)) {
          onChange(integerWeek * 1);
        }
      } else if (date === null) {
        onChange(null);
      }
    } else {
      showAckErrorMessage({ message: 'Please select Flight start and end date first.' });
    }
  };

  const CustomInput = forwardRef(({ onClick }, ref) => (
    <input
      readOnly
      style={{
        width: '200px',
        backgroundColor: '#fff',
        border: '0',
        borderWidth: '1px',
        borderColor: '#eee',
        borderStyle: 'solid',
        borderRadius: '2px',
        padding: '5px',
        textAlign: 'left',
        boxSizing: 'border-box',
        height: '38px',
        cursor: 'pointer',
      }}
      value={skipWeek || '- - -'}
      onClick={onClick}
      ref={ref}
    />
  ));
  CustomInput.propTypes = {
    onClick: PropTypes.func,
  };
  CustomInput.defaultProps = {
    onClick: () => {},
  };

  return (
    <DatePicker
      selected={skipWeek ? '' : null} // Display of clear button depends on this logic.
      disabledKeyboardNavigation={true}
      minDate={start_date ? new Date(start_date) : null}
      maxDate={end_date ? new Date(end_date) : null}
      highlightDates={highlightedDates}
      onChange={(date) => onChangeSkipOff(date)}
      isClearable={true}
      customInput={<CustomInput />}
    />
  );
};

SkipWeekSelector.propTypes = {
  start_date: PropTypes.any,
  end_date: PropTypes.any,
  skipWeek: PropTypes.number,
  onChange: PropTypes.func,
};

SkipWeekSelector.defaultProps = {
  start_date: null,
  end_date: null,
  skipWeek: null,
  onChange: () => {},
};

export default SkipWeekSelector;
