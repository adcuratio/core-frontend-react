import React, { useState, useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import DateTime from 'luxon/src/datetime.js';
import Info from 'luxon/src/info.js';
import DatePicker from 'react-datepicker';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';

import { PageTitle } from '../../components/Typography';
import { MainContent, PageHeader } from '../../components/PageLayout';
import ReactLoader from '../../components/ReactLoader';
import CustomButton from '../../components/CustomButton';

import { showAckErrorMessage, showAckMessage } from '../../common/utils';

import withStore from '../../hocs/WithStore';
import { ActivityLogsHeaders, DishLogsHeaders } from './JsonData';

const DropdownWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  & .open > .dropdown-menu {
    overflow-y: auto;
    max-height: 420px;
    min-width: 100%;
    min-width: -moz-available; /* Mozilla-based browsers */
    min-width: -webkit-fill-available; /* WebKit-based browsers */
    min-width: fill-available;
  }
`;

const OperatorLogs = inject(
  'uiStore',
  'operatorStore'
)(
  observer((props) => {
    const { uiStore, operatorStore } = props;
    const stdMonthArray = Info.months('short'); // Array of month short names (Jan, Feb...)
    const numberOfMonths = 16; // Total number of months to display in months list
    // const numberOfMonths = 26; // If future 10 months are required
    const monthsOffset = -15; // Starting of list should be offset by these number of months from current month

    // Array from 0 to numberOfMonths - 1 -> each number in array is added to offset + current month number to get previous 15 months upto 26 months from then
    const monthArray = Array.from(Array(numberOfMonths).keys()).map((_key, index) => {
      const _date_day_1 = new Date(new Date().setDate(1)); // To prevent 30th February
      const _date = new Date(_date_day_1.setMonth(new Date().getMonth() + monthsOffset + index));
      return `${_date.toLocaleString('default', { month: 'short' })}, ${_date.toLocaleString('default', {
        year: 'numeric',
      })}`;
    }); //array of months in 'MMM, YYYY' format

    const [selectedMonth, setSelectedMonth] = useState(monthArray[0 - monthsOffset > 0 ? 0 - monthsOffset : 0]); // Current month is selected from drop down list if it exists

    const [content, setContent] = useState('activity_log'); //To display month or date range

    const [dateRangeFrom, setDateRangeFrom] = useState(null); //Date picker for starting date
    const [dateRangeTo, setDateRangeTo] = useState(null); //Date picker for ending date

    // On changing radio button selection
    const changeContent = (event) => {
      setContent(event.target.value);
    };
    // GET request to show success message on which download button is clicked
    const getAneLog = (data) => {
      operatorStore.getAneLog(data).then(
        (res) => {
          handleEmailLogResponse(res);
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleEmailLogResponse = (res) => {
      if (res && res.status === 200) {
        if (res.data && res.data.success === true) {
          showAckMessage({ message: res?.data?.msg ?? 'File sent to your mail address.' });
        } else if (res.data && res.data.success === false) {
          showAckErrorMessage({ message: res?.data?.msg ?? 'Logs files are not available for selected value' });
        } else {
          showAckErrorMessage();
        }
      } else {
        showAckErrorMessage();
      }
    };

    // Dropdown month change
    const handleMonthChange = (event) => {
      setSelectedMonth(event);
    };

    // Start of datepicker date range
    const handleDatePickerFromChange = (event) => {
      setDateRangeFrom(event);
    };

    // End of datepicker date range
    const handleDatePickerToChange = (event) => {
      setDateRangeTo(event);
    };

    // GET logs for selected month from API
    const updateLogs = () => {
      const _selectedDateMonth = selectedMonth.split(', '); // Array of 2 elements e.g. ["Feb", 2021]
      let _selectedMonth = stdMonthArray.indexOf(_selectedDateMonth[0]) + 1; // 1 added as array has 0 base indexing
      _selectedMonth = _selectedMonth > 9 ? _selectedMonth : `0${_selectedMonth}`; // To pad 0 to single digit month
      const _selectedYear = _selectedDateMonth[1];

      operatorStore.getAneLogData(_selectedMonth, _selectedYear).then(
        (res) => {
          handleAPIErrors(res);
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    // GET dish logs of all months
    const getDishLogsList = () => {
      operatorStore.getDishLogData().then(
        (res) => {
          handleAPIErrors(res);
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getLogRange = () => {
      const _startDate = DateTime.fromISO(dateRangeFrom.toISOString()).toFormat('y-MM-dd');
      const _endDate = DateTime.fromISO(dateRangeTo.toISOString()).toFormat('y-MM-dd');
      operatorStore.getLogRange(_startDate, _endDate).then(
        (res) => {
          handleEmailLogResponse(res);
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    // GET request to download dish log file on which download button is clicked
    const getDishRange = (id) => {
      operatorStore.getDishRange(id).then(
        (res) => {
          handleEmailLogResponse(res);
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleAPIErrors = (res) => {
      if (res && res.status === 200) {
        if (res.data && res.data.success === false) {
          if (res.data.msg) {
            showAckErrorMessage({ message: res.data.msg });
          } else {
            showAckErrorMessage();
          }
        }
      } else showAckErrorMessage();
    };

    useEffect(() => {
      updateLogs();
    }, [selectedMonth]);

    useEffect(() => {
      getDishLogsList();
    }, []);

    return (
      <>
        <MainContent>
          <PageHeader>
            <PageTitle>Activity Logs</PageTitle>
          </PageHeader>
          <div className="row mb10 flex-container1 h35">
            <div className="col-md-12">
              <label className="checkbox-inline clearfix" htmlFor="radio-activity_log">
                <input
                  type="radio"
                  value="activity_log"
                  checked={content === 'activity_log'}
                  onChange={changeContent}
                  className="radio"
                  id="radio-activity_log"
                />
                <span className="v-align-middle"></span>

                <span>Select Month: </span>
              </label>
              {content === 'activity_log' && (
                <DropdownWrapper>
                  <DropdownButton title={selectedMonth || 'select'} id="networkSelect" className="mt5 width-110p">
                    {monthArray.map((month, index) => (
                      <MenuItem
                        key={index}
                        value={month}
                        onSelect={() => handleMonthChange(month)}
                        active={month === selectedMonth}
                      >
                        {month}
                      </MenuItem>
                    ))}
                  </DropdownButton>
                </DropdownWrapper>
              )}
            </div>
          </div>

          <div className="row flex-container1 h35">
            <div className="col-md-3">
              <label className="checkbox-inline clearfix" htmlFor="radio-dish_log">
                <input
                  type="radio"
                  value="dish_log"
                  checked={content === 'dish_log'}
                  onChange={changeContent}
                  className="radio"
                  id="radio-dish_log"
                />
                <span className="v-align-middle"></span>

                <span>Select Date Range:</span>
              </label>
            </div>
            {content === 'dish_log' && (
              <div className="flex-container1">
                <div className="col-md-4">
                  <span className="input-group feedback-date-wrapper">
                    <DatePicker
                      selected={dateRangeFrom}
                      onChange={handleDatePickerFromChange}
                      showWeekNumbers
                      todayButton="Today"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      maxDate={dateRangeTo}
                    />
                  </span>
                </div>
                <div className="col-md-1 text-align-center">to</div>
                <div className="col-md-4">
                  <span className="input-group feedback-date-wrapper">
                    <DatePicker
                      selected={dateRangeTo}
                      onChange={handleDatePickerToChange}
                      showWeekNumbers
                      todayButton="Today"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={dateRangeFrom}
                    />
                  </span>
                </div>
                <div>
                  <button
                    className="form-button tradebtn"
                    disabled={!(dateRangeFrom && dateRangeTo)}
                    onClick={() => getLogRange()}
                  >
                    Email Log
                  </button>
                </div>
              </div>
            )}
          </div>

          {content === 'activity_log' && (
            <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
              <thead>
                <tr>
                  {ActivityLogsHeaders.map((header) => (
                    <th
                      key={header.id}
                      {
                        ...(header.columnSpan && { colSpan: header.columnSpan })
                        // If columnSpan is defined for the header, then colSpan is specified
                      }
                    >
                      {header.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {operatorStore.aneLogData.data && operatorStore.aneLogData.data.length ? (
                  operatorStore.aneLogData.data.map((data, index) => (
                    <tr key={index}>
                      <td colSpan={2}>{data}</td>
                      <td>
                        <CustomButton
                          buttonText="Email Log"
                          buttonClassName="tradebtn"
                          handleButtonClick={() => getAneLog(data)}
                        ></CustomButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {!uiStore.isLoading && (
                      <tr>
                        <td
                          colSpan={
                            ActivityLogsHeaders.reduce((acc, curr) => acc + (curr.columnSpan ? curr.columnSpan : 1), 0) // Calculate colSpan based on all columnSpan defined for all headers
                          }
                          className="text-align-center-imp bg-main-imp"
                        >
                          No logs found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          )}

          {content === 'dish_log' && (
            <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder">
              <thead>
                <tr>
                  {DishLogsHeaders.map((header) => (
                    <th key={header.id}>{header.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {operatorStore.dishLogData.data && operatorStore.dishLogData.data.length ? (
                  operatorStore.dishLogData.data.map((data, index) => (
                    <tr key={index}>
                      <td>{data.file_name}</td>
                      <td>{data.start_date}</td>
                      <td>{data.end_date}</td>
                      <td>
                        <CustomButton
                          buttonText="Email Log"
                          buttonClassName="tradebtn"
                          handleButtonClick={() => getDishRange(data.id)}
                        ></CustomButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {!uiStore.isLoading && (
                      <tr>
                        <td colSpan={DishLogsHeaders.length} className="text-align-center-imp bg-main-imp">
                          No logs found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          )}
          <ReactLoader isLoading={uiStore.isLoading} />
        </MainContent>
      </>
    );
  })
);

export default withStore(OperatorLogs);
