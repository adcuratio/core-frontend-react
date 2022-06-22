import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import ReactLoader from '../../components/ReactLoader';
import { showAckErrorMessage, processUTCtoEST, showAckMessage } from '../../common/utils';
import HeaderAggregate from './Header';
import styled from 'styled-components';
import withStore from '../../hocs/WithStore';
import API from '../../api';
import axios from 'axios';
import _ from 'lodash';

const TableWrapper = styled.div`
  height: 78vh;
  overflow: auto;
`;

const AggregateInventory = inject(
  'networkStore',
  'uiStore'
)(
  observer((props) => {
    const { networkStore, uiStore } = props;
    const [weekStarts, setWeekStarts] = useState([]);
    const [availableNetworks, setAvailableNetwroks] = useState([]);
    const [selectedWeekStart, setSelectedWeekStart] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState('');
    const DTformat = 'dd-MMM-y HH:mm:ss';
    const date = new Date();

    useEffect(() => {
      getFiltersData();
    }, []);

    const getFiltersData = () => {
      networkStore.getAggregateNetworksFilterData().then(
        (res) => {
          if (res.status === 200) {
            const current = res.data.data.weekstarts.reduce((c, i) => {
              if (
                parseInt(i.split('-')[0]) === date.getFullYear() &&
                parseInt(i.split('-')[1]) === date.getMonth() + 1 &&
                i.split('-')[2] <= date.getDate()
              ) {
                c = i;
              }
              return c;
            }, null);
            const weekStart = current ?? _.max(res.data.data.weekstarts);
            setWeekStarts(res.data.data.weekstarts);
            setAvailableNetwroks(res.data.data.networks);
            setSelectedWeekStart(weekStart);
            setSelectedNetwork(res.data.data.networks);
            getTableData(weekStart, res.data.data.networks);
          } else {
            showAckErrorMessage({ message: res.statusText });
          }
        },
        (error) => {
          showAckErrorMessage({ message: error.message });
        }
      );
    };

    const getTableData = (week, network, pageUrl) => {
      let url = '';
      if (week || network) {
        network.forEach((data) => {
          url += `networks=${data}&`;
        });
        url += `weekstarts=${week}`;
      }

      networkStore.getAggregateNetworksTableData(url, pageUrl).then(
        (res) => {
          if (res.status === 200) {
            setNextPageUrl(res.data.next);
            setTableData([...tableData, ...res.data.results]);
            uiStore.isLoading = false;
          } else {
            showAckErrorMessage({ message: res.data.message });
          }
        },
        (error) => showAckErrorMessage({ message: error.message })
      );
    };

    const downloadFile = (fileData) => {
      uiStore.isLoading = true; // loader while downloading the file.
      let url = '';
      if (selectedNetwork) {
        selectedNetwork.forEach((data) => {
          url += `networks=${data}&`;
        });
        url += `weekstarts=${selectedWeekStart}`;
      }
      API.get(`/schedules/download_agg_inventory/?${url}`).then(
        (res) => {
          axios.get(res?.data?.data).then(
            (r) => {
              if (res.status === 200) {
                uiStore.isLoading = false;
                const blob = new Blob([r.data], { type: 'application/xml;charset=utf-8;' });
                const downloadLink = document.createElement('a');
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.download = `${fileData.file_name}`;
                downloadLink.click();
                showAckMessage({ message: res });
              }
            },
            () => {
              uiStore.isLoading = false;
              showAckMessage({ message: res.data });
            }
          );
        },
        () => {
          uiStore.isLoading = false;
          showAckErrorMessage({ message: 'Error in downloading the file.' });
        }
      );
    };

    const handlePagination = () => {
      if (nextPageUrl) {
        getTableData(null, null, nextPageUrl);
      }
    };

    const handleScroll = (e) => {
      const bottom = e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight;
      if (bottom) {
        handlePagination();
      }
    };

    const onPageRefresh = () => {
      setSelectedNetwork([]);
      setSelectedWeekStart('');
      setTableData((tableData.length = 0));
      getFiltersData();
    };

    const handleNetworkSelect = (data) => {
      setSelectedNetwork(data);
      setTableData((tableData.length = 0));
      getTableData(selectedWeekStart, data);
    };

    const handleSelectWeekStart = (data) => {
      setSelectedWeekStart(data);
      setTableData((tableData.length = 0));
      getTableData(data, selectedNetwork);
    };

    const renderTableData = (tableData) =>
      tableData.length > 0 ? (
        <TableWrapper onScroll={(e) => handleScroll(e)}>
          <table className="table table-striped table-wrapper wrapped-table table-elem-center">
            <thead>
              <tr>
                <th>Network</th>
                <th>Call Sign</th>
                <th>Daypart</th>
                <th>Program Name</th>
                <th>Air Date</th>
                <th>Show Start Date</th>
                <th>Show End Date</th>
                <th>Ad Spot Airing Time</th>
                <th>Window Start Time</th>
                <th>Window End Time</th>
                <th>Segmentation Upid</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((rowData) => (
                <tr key={rowData.id}>
                  <td>{rowData?.channel}</td>
                  <td>{rowData?.dish_callsign}</td>
                  <td>{rowData?.daypart}</td>
                  <td>{rowData?.i_show_name}</td>
                  <td>{rowData?.i_flighting_date}</td>
                  <td>{processUTCtoEST(rowData?.i_show_start_time, DTformat)}</td>
                  <td>{processUTCtoEST(rowData?.i_show_end_time, DTformat)}</td>
                  <td>{processUTCtoEST(rowData?.i_airing_time, DTformat)}</td>
                  <td>{processUTCtoEST(rowData?.i_start_timeframe, DTformat)}</td>
                  <td>{processUTCtoEST(rowData?.i_end_timeframe, DTformat)}</td>
                  <td>{rowData?.i_airing_id}</td>
                  <td>{rowData?.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!tableData?.length && (
            <div key="no_data_found" className="text-center-imp">
              No Data Found
            </div>
          )}
        </TableWrapper>
      ) : (
        !uiStore.isLoading &&
        tableData.length === 0 && (
          <div key="no_plan_uploaded" className="mt40 text-center-imp">
            No Aggregate Inventory has been present in this month.
          </div>
        )
      );

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Aggregation Order Inventory</PageTitle>
        </PageHeader>
        <HeaderAggregate
          selectedMonth={selectedWeekStart}
          selectedNetworkFilterData={_.compact(selectedNetwork)}
          networkFilterData={_.compact(availableNetworks)}
          monthDate={weekStarts}
          onPageRefresh={onPageRefresh}
          handleNetworkSelect={handleNetworkSelect}
          setMonth={handleSelectWeekStart}
          downloadFile={downloadFile}
        />
        <div>{tableData?.length > 0 && renderTableData(tableData)}</div>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(AggregateInventory);
