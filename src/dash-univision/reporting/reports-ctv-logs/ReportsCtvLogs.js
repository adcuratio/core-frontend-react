import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';

import { MainContent, PageHeader } from '../../../components/PageLayout';
import ReactLoader from '../../../components/ReactLoader';
import { PageTitle } from '../../../components/Typography';
import { Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';

import withStore from '../../../hocs/WithStore';
import CustomButton from '../../../components/CustomButton';
import { showAckErrorMessage, getReportsMonthArray, stdMonthArray } from '../../../common/utils';
import ReactPickyFilter from '../../../components/ReactPickyFilter';

const ReportsCtvLogs = inject(
  'uiStore',
  'univisionStore'
)(
  observer((props) => {
    const { uiStore, univisionStore } = props;
    const [ctvLogs, setCtvLogs] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [networkFilterData, setNetworkFilterData] = useState([]);
    const [selectedNetworkFilterData, setSelectedNetworkFilterData] = useState([]);

    const monthDate = getReportsMonthArray(stdMonthArray);
    const [selectedMonth, setSelectedMonth] = useState(
      //to get the selected month by default current month
      `${stdMonthArray[new Date().getMonth()]}, ${new Date().getFullYear()}`
    );

    const setMonth = (month) => {
      // set the selected month
      const monthIndex = stdMonthArray.indexOf(month.split(', ')[0]) + 1;
      const selectedYear = month.split(', ')[1];
      getCtvLogs(monthIndex, selectedYear);
      setSelectedMonth(month);
      // setNetwork(dropdownMenu[0]);
    };

    const handleNetworkSelect = (data) => {
      setSelectedNetworkFilterData(data);
      const tableDataCpy = [];
      ctvLogs.forEach((obj) => {
        if (data.includes('With no network') && obj.network === null) {
          tableDataCpy.push(obj);
        } else if (data.includes(obj.network)) {
          tableDataCpy.push(obj);
        }
      });
      setTableData(tableDataCpy);
    };

    const updateNetworkData = (data) => {
      const networkDataCpy = [];
      data.forEach((obj) => {
        if (obj.network === null && networkDataCpy.indexOf('With no network') === -1) {
          networkDataCpy.push('With no network');
        } else if (networkDataCpy.indexOf(obj.network) === -1 && obj.network !== null) {
          networkDataCpy.push(obj.network);
        }
      });
      setNetworkFilterData(networkDataCpy);
      setSelectedNetworkFilterData(networkDataCpy);
    };

    const getCtvLogs = (month, year) => {
      univisionStore.getCTVlogs(month, year).then(
        (res) => {
          if (res && res?.status === 200) {
            setCtvLogs(res?.data?.data);
            setTableData(res?.data?.data);
            updateNetworkData(res?.data?.data);
          } else {
            showAckErrorMessage({ message: 'No data available.' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    useEffect(() => {
      getCtvLogs(new Date().getMonth() + 1, new Date().getFullYear());
    }, []);

    const onCtvFileDownload = (mdata) => {
      uiStore.isLoading = mdata?.isDownloaded ? false : true;
      if (!mdata.isDownloaded) {
        const updatedData = ctvLogs.map((a) => ({
          ...a,
          isDownloaded: a.link === mdata.link ? true : a?.isDownloaded,
        }));
        setCtvLogs(updatedData);
      }
    };

    const downloadFile = (mData) => {
      if (mData) {
        onCtvFileDownload(mData);
        axios.get(mData.link).then(
          (res) => {
            const blob = new Blob([res.data], { type: 'application/json' });
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = `${mData.file_name}`;
            downloadLink.click();
            uiStore.isLoading = false;
          },
          () => {
            uiStore.isLoading = false;
            showAckErrorMessage({ message: 'Unable to download logs.' });
          }
        );
      } else showAckErrorMessage({ message: 'No file found on server.' });
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle className="mt5 ml10">CTV Logs</PageTitle>
        </PageHeader>

        <div className="flex-container1">
          <Row>
            <div className="flex-container2 mt10 ml20">
              <Col>
                <span>Select Month:</span>
                <DropdownButton title={selectedMonth || 'select'} id="networkSelect" className="mt5">
                  {monthDate?.map((month, idx) => (
                    <MenuItem key={`${idx} months`} onSelect={() => setMonth(month)} active={month === selectedMonth}>
                      {month}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </Col>
              <Col className="flex">
                <span className="ml10 mt10">Select Network:</span>
                <ReactPickyFilter
                  allOptions={networkFilterData}
                  selectedData={selectedNetworkFilterData}
                  onFilterChange={handleNetworkSelect}
                  id="network-select"
                  selectAllText="Select All Networks"
                  allSelectedPlaceholder="All Networks"
                />
              </Col>
            </div>
          </Row>
        </div>

        <table className="table table-striped table-wrapper mt10 wrapped-table">
          <thead>
            <tr>
              <th colSpan="2" className="text-center-imp">
                Date
              </th>
              <th>Network</th>
              <th colSpan="2" className="text-center-imp">
                Download Data
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((obj, index) => (
              <tr key={index}>
                <td colSpan="2" className="text-center-imp">
                  {obj.date}
                </td>
                <td>{obj.network === null ? 'N/A' : obj.network}</td>
                <td colSpan="2" className="text-center-imp">
                  <CustomButton
                    buttonText="Download"
                    buttonClassName="tradebtn"
                    handleButtonClick={() => downloadFile(obj)}
                  ></CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ReportsCtvLogs);
