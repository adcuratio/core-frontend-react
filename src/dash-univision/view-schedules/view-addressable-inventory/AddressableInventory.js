import React, { useState, useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';

import { MainContent, PageHeader } from '../../../components/PageLayout';
import ReactLoader from '../../../components/ReactLoader';
import { PageTitle } from '../../../components/Typography';

import { applySearch, showAckErrorMessage, getMonthArray, stdMonthArray, processUTCtoEST } from '../../../common/utils';

import NetworkLogsViewPlan from '../../univision-network-logs/components/NetworkLogsViewPlan';
import { networkLogsTableTitles } from './components/JsonData';
import Header from '../../univision-network-logs/components/Header';
import ModalData from '../../univision-network-logs/components/UploadModal';
import TableContainerMain from './components/TableContainer';

import withStore from '../../../hocs/WithStore';

const UnivisionAddressableInventory = inject(
  'univisionStore',
  'uiStore'
)(
  observer((props) => {
    const { univisionStore, uiStore } = props;
    const allDates = getMonthArray(stdMonthArray); // get a set of months and year for previous nine months and coming four months
    const [selectedMonth, setSelectedMonth] = useState(
      //to get the selected month by default current month
      `${stdMonthArray[new Date().getMonth()]}, ${new Date().getFullYear()}`
    );
    const [filteredTraffickingPlansData, setFilteredTraffickingPlansData] = useState([]); // to get the all trafficking plans that has been sorted to show in main table
    const [showModal, setShowModal] = useState(false);
    const [showViewPlanModal, setViewPlanModal] = useState(false); // to show the modal for selected plan
    const [selectedPlanToView, setSelectedPlanToView] = useState([]); //set the plan that have been selected for view with processed data
    const [selectedPlanList, setSelectedPlanList] = useState({}); //selected plan without processing
    const [searchValue, setSearchValue] = useState(''); //search bar on main page
    const [numOfPages, setNumOfPages] = useState(0); //number of pages on modal
    const [selectedPlan, setSelectedPlan] = useState({});
    const [traffickingPlansData, setDefaultTraffickingPlanData] = useState([]); //table content of main page
    const [cpyForNetworkSelectTraffickPlanData, setCpyForNetworkSelectTraffickPlanData] = useState([]); // copy of table content without processing
    const [searchValueForModal, setSearchValueForModal] = useState(''); // search bar in plan modal
    const isMountedRef = useRef(null); // to handle memory leak after component unmount
    const [allChannels, setAllChannels] = useState([]); //to get the set of all the used channels
    const [networkFilterData, setNewtorkFilterData] = useState([]); // network filter data for dropdown
    const [selectedNetworkFilterData, setSelectedNetworkFilterData] = useState([]); //selected network filter that are present in trafficking plan
    const [buttonId, setButtonId] = useState('');

    const setMonth = (month) => {
      // set the selected month
      const monthIndex = stdMonthArray.indexOf(month.split(', ')[0]) + 1;
      const selectedYear = month.split(', ')[1];
      getTraffickingPlans(monthIndex, selectedYear);
      setSelectedMonth(month);
      setSearchValue('');
    };

    const updateChannelFilters = (channels = false, plans = []) => {
      if (allChannels && !channels) {
        channels = [...allChannels];
      }
      channels?.forEach((channel) => {
        if (plans) {
          channel.isVisible = true;
          channel.isSelected = true;
        } else {
          channel.isVisible = false;
          channel.isSelected = false;
        }
      });
      setAllChannels(channels);
      updateSelectNetworkFilterData(channels);
      return;
    };

    const updateSelectNetworkFilterData = (channels = []) => {
      //to get the name of dropdown data for view
      const networkArr = [];
      channels?.forEach((channel) => {
        if (channel.isSelected && channel.isVisible) {
          networkArr.push(channel.name);
        }
      });
      setNewtorkFilterData(networkArr);
      setSelectedNetworkFilterData(networkArr); //selected network names by default all
    };

    const getTraffickingPlans = (month, year, channels = null) => {
      // to get all the data for selected month
      univisionStore.getLogs(month, year).then(
        (res) => {
          if (!(res && res.status === 200)) {
            showAckErrorMessage({ message: res?.data?.message ?? 'Something went wrong while fetching Logs!' });
          } else if (Array.isArray(res.data)) {
            res.data?.forEach((data) => {
              data.date = new Date(data.log_date);
              const dateSplits = data.log_date.split('-');
              data.dateString = `${dateSplits[2]} ${stdMonthArray[parseInt(dateSplits[1]) - 1]} ${dateSplits[0]}`;
              data.created = processUTCtoEST(data.created);
              data.network_name = data?.channel?.name;
            });
            if (isMountedRef.current) {
              updateChannelFilters(channels, res.data);
              const filteredResponse = sortTable(filterPlanListByChannel(res.data, channels));
              setDefaultTraffickingPlanData(filteredResponse);
              setFilteredTraffickingPlansData(filteredResponse);
              setCpyForNetworkSelectTraffickPlanData(filteredResponse);
            }
          }
        },
        (err) => {
          showAckErrorMessage({ message: err?.message });
        }
      );
    };

    const filterPlanListByChannel = (traffickPlanData, channels = false) => {
      //to get all the plans that have available channels
      if (!channels) {
        channels = [...allChannels];
      }
      const traffickPlanDataCPy = traffickPlanData?.filter(() => {
        if (channels?.find((channel) => channel?.isSelected === true)) return true;
        else return false;
      });
      return traffickPlanDataCPy;
    };

    const sortTable = (data) => data.sort((a, b) => new Date(b.log_date) - new Date(a.log_date));

    const handleModalToggleForUpload = () => {
      // to upload new trafficking plan
      setShowModal(!showModal);
    };

    const toggleViewPlanModal = () => {
      setSearchValueForModal('');
      setViewPlanModal(!showViewPlanModal);
    };

    const getAllChannels = (month = new Date().getMonth() + 1, year = new Date().getFullYear()) => {
      univisionStore.getAllChannels().then(
        //api call to get all channels
        (response) => {
          if (!(response && response.status === 200)) {
            showAckErrorMessage({ message: response?.data?.message ?? 'Unable to Fetch Network Logs!' });
          } else {
            if (response.data) {
              const channels = response.data.data[0]?.channels?.map((channel) => ({
                //processing the data to add more fields
                name: channel.display_name,
                id: channel.id,
                isSelected: true,
                isVisible: true,
              }));
              if (isMountedRef.current) {
                getTraffickingPlans(month, year, channels);
              }
            }
          }
        },
        (err) => {
          showAckErrorMessage({ message: err });
        }
      );
    };

    useEffect(() => {
      isMountedRef.current = true;
      getAllChannels();
      return () => (isMountedRef.current = false);
    }, []);

    const onPageRefresh = () => {
      // page refresh button handler
      if (searchValue.length) {
        setSearchValue('');
      }

      const monthIndex = stdMonthArray.indexOf(selectedMonth.split(', ')[0]) + 1;
      const selectedYear = selectedMonth.split(', ')[1];
      getAllChannels(monthIndex, selectedYear);
    };

    const processANEdata = (data) =>
      data?.map((row) => ({
        ...row.univision_log_dict_row,
      }));

    const viewDetails = (id, plan, url) => {
      setButtonId(id);
      //view plan api call
      if (id === 'total_buyback') {
        if (!url) {
          univisionStore.getLogsDetail(plan.id).then(
            (res) => {
              if (!(res && res.status === 200)) {
                showAckErrorMessage({
                  message: res?.data?.message ?? 'Something went wrong while fetching Log Details!',
                });
              } else {
                const result = processANEdata(res.data?.results);
                const pages = Math.ceil(res.data?.count / res.data?.results.length);
                setSelectedPlanToView(result);
                setNumOfPages(pages);
                setSelectedPlanList(res?.data);
                setViewPlanModal(!showViewPlanModal);
                setSelectedPlan(plan);
              }
            },
            (err) => {
              showAckErrorMessage({ message: err.message });
            }
          );
        } else {
          univisionStore.getTraffickingPlanPage(url).then(
            //while having a url we can go back and forth to get previous and next page data
            (res) => {
              if (!(res && res.status === 200)) {
                showAckErrorMessage();
              } else {
                const result = processANEdata(res.data?.results);
                setSelectedPlanToView(result);
                setSelectedPlanList(res?.data);
              }
            },
            (err) => {
              showAckErrorMessage({ message: err.message });
            }
          );
        }
      } else if (['total_tp', 'total_units'].includes(id)) {
        if (!url) {
          univisionStore.getTotalPromoLogsDetails(plan.id).then(
            (res) => {
              if (!(res && res.status === 200)) {
                showAckErrorMessage({
                  message: res?.data?.message ?? 'Something went wrong while fetching Log Details!',
                });
              } else {
                const result = processANEdata(res.data?.results);
                const pages = Math.ceil(res.data?.count / res.data?.results.length);
                setSelectedPlanToView(result);
                setNumOfPages(pages);
                setSelectedPlanList(res?.data);
                setViewPlanModal(!showViewPlanModal);
                setSelectedPlan(plan);
              }
            },
            (err) => {
              showAckErrorMessage({ message: err.message });
            }
          );
        } else {
          univisionStore.getPromoTraffickingPlanPage(url).then(
            //while having a url we can go back and forth to get previous and next page data
            (res) => {
              if (!(res && res.status === 200)) {
                showAckErrorMessage();
              } else {
                const result = processANEdata(res.data?.results);
                setSelectedPlanToView(result);
                setSelectedPlanList(res?.data);
              }
            },
            (err) => {
              showAckErrorMessage({ message: err.message });
            }
          );
        }
      }
    };

    const handleNetworkSelect = (data) => {
      //network dropdown handler
      const newTableCpy = [];
      allChannels?.forEach((channel) => {
        if (data.includes(channel.name)) {
          const filteredData = traffickingPlansData?.filter((tdata) => tdata?.channel?.level_1 === channel.name);
          newTableCpy.push(...filteredData);
        }
      });
      if (searchValue.length) {
        setSearchValue('');
      }
      setCpyForNetworkSelectTraffickPlanData(sortTable(newTableCpy));
      setFilteredTraffickingPlansData(sortTable(newTableCpy));
      setSelectedNetworkFilterData(data);
    };

    const handleSearch = (value) => {
      setSearchValue(value);
      const tableDataCpy = [...cpyForNetworkSelectTraffickPlanData];
      const list = applySearch(value, tableDataCpy, networkLogsTableTitles);
      setFilteredTraffickingPlansData(sortTable(list));
    };

    const handleSearchTextForModal = (plan, value, url) => {
      setSearchValueForModal(value);
      if (!url) {
        univisionStore.searchLogDetails(plan.id, value).then(
          (res) => {
            if (res && res.status === 200) {
              const result = processANEdata(res.data?.results);
              const pages = Math.ceil(res.data?.count / res.data?.results.length);
              setNumOfPages(pages);
              setSelectedPlanToView(result);
              setSelectedPlanList(res?.data);
              setSelectedPlan(plan);
            } else {
              showAckErrorMessage();
            }
          },
          (err) => {
            showAckErrorMessage({ message: err.message });
          }
        );
      } else {
        univisionStore.getTraffickingPlanPage(url).then(
          //while having a url we can go back and forth to get previous and next page data
          (res) => {
            if (res && res.status === 200) {
              const result = processANEdata(res.data?.results);
              setSelectedPlanToView(result);
              setSelectedPlanList(res?.data);
            } else {
              showAckErrorMessage();
            }
          },
          (err) => {
            showAckErrorMessage({ message: err.message });
          }
        );
      }
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>View Addressable Inventory </PageTitle>
        </PageHeader>
        <Header
          selectedMonth={selectedMonth}
          monthDate={allDates}
          setMonth={setMonth}
          networkFilterData={networkFilterData}
          selectedNetworkFilterData={selectedNetworkFilterData}
          handleNetworkSelect={handleNetworkSelect}
          handleSearch={handleSearch}
          searchValue={searchValue}
          toggleModal={handleModalToggleForUpload}
          onPageRefresh={onPageRefresh}
        />
        <TableContainerMain
          traffickingPlansData={traffickingPlansData}
          networkLogsTableTitles={networkLogsTableTitles}
          filteredTraffickingPlansData={filteredTraffickingPlansData}
          uiStore={uiStore}
          viewDetails={viewDetails}
        />
        <ModalData showModal={showModal} closeModal={handleModalToggleForUpload} />
        {showViewPlanModal && (
          <NetworkLogsViewPlan
            viewPlanModal={showViewPlanModal}
            toggleModal={toggleViewPlanModal}
            selectedPlanToView={selectedPlanToView}
            handleSearchTextForModal={handleSearchTextForModal}
            numOfPages={numOfPages}
            selectedPlanList={selectedPlanList}
            viewPlan={viewDetails}
            searchValueForModal={searchValueForModal}
            selectedPlan={selectedPlan}
            setSearchValueForModal={setSearchValueForModal}
            buttonId={buttonId}
            isviewSchedules={false}
          />
        )}
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(UnivisionAddressableInventory);
