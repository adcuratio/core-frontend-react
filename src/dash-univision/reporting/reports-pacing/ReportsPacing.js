import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import axios from 'axios';
import styled from 'styled-components';

import { MainContent, PageHeader } from '../../../components/PageLayout';
import ReactLoader from '../../../components/ReactLoader';
import { PageTitle } from '../../../components/Typography';
import ReactPickyFilter from '../../../components/ReactPickyFilter';
import CustomButton from '../../../components/CustomButton';
import { showAckErrorMessage, showAckMessage } from '../../../common/utils';

import withStore from '../../../hocs/WithStore';

import { pacingReportsTitles, viewDetailsTitles } from './components/JsonData';
import TableContainer from './components/TableContainer';
import ViewDetails from './components/ViewDetails';
import ViewPacingGraph from './components/ViewPacingGraph';

import Select from 'react-select';

const SelectWrapper = styled.div`
  width: auto;
  margin-left: 10px;
  border: 0.5px solid #ccc !important;
`;

const ReportsPacing = inject(
  'uiStore',
  'univisionStore',
  'aggCampaignStore'
)(
  observer((props) => {
    const { uiStore, univisionStore, aggCampaignStore } = props;
    const [postCampaignNetworkList, setPostCampaignNetworkList] = useState([]);

    const [advertiserFilterAllData, setAdvertiserFilterAllData] = useState([]);
    const [advertiserFilterSelectedData, setAdvertiserFilterSelectedData] = useState([]);

    const [campaignFilterAllData, setCampaignFilterAllData] = useState([]);
    const [campaignFilterSelectedData, setCampaignFilterSelectedData] = useState([]);

    const [statusFilterAllData, setStatusFilterAllData] = useState([]);
    const [statusFilterSelectedData, setStatusFilterSelectedData] = useState([]);
    const [statusKey, setStatusKey] = useState([]);

    const [activeModal, setActiveModal] = useState('');
    const [modalData, setModalData] = useState({});
    const [toggle, setToggle] = useState(false);
    const [viewDetailsList, setViewDetailsList] = useState([]);
    const [detailsData, setDetailsData] = useState({});

    const [reportData, setReportData] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [filteredEntityList, setFilteredEntityList] = useState([]);

    const getPacingReportsList = () => {
      univisionStore.getPacingReportsList().then(
        (res) => {
          if (res && res?.status === 200) {
            let results = [];
            if (res?.data?.data?.length) {
              results = res?.data?.data.map((data) => {
                const dCpy = JSON.parse(JSON.stringify(data));
                return dCpy;
              });
            }
            const postCampaignNetworkContent = JSON.parse(JSON.stringify(results));
            setPostCampaignNetworkList(postCampaignNetworkContent);
            const advData = [];
            postCampaignNetworkContent.forEach((a) => {
              if (a?.company?.display_name) {
                advData.push(a.company.display_name);
              } else {
                advData.push('with no advertiser');
              }
            });
            const advFilteredDataCpy = [...new Set(advData)];
            setAdvertiserFilterAllData(advFilteredDataCpy);
            onSetStatusData(postCampaignNetworkContent);
            onSetCampaignData(postCampaignNetworkContent);
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
      getPacingReportsList();
    }, []);

    const onFilteredAdvertiserData = (filteredData) => {
      setStatusFilterSelectedData([]);
      setCampaignFilterSelectedData([]);
      const modifiedData = postCampaignNetworkList.filter((a) => {
        if (a?.company?.display_name && filteredData.includes(a?.company?.display_name)) {
          return true;
        } else if (!a && a.company.display_name && filteredData.includes('with no advertiser')) {
          return true;
        }
        return false;
      });
      return modifiedData;
    };

    const onSetStatusData = (modifiedData) => {
      const statusData = [];
      if (modifiedData.length) {
        modifiedData.forEach((a) => {
          a.company.campaign?.forEach((c) => {
            if (c.status === 0 || c.status === 1) {
              statusData?.push('active');
            } else if (c.status === 9) {
              statusData?.push('canceled');
            } else if (c.status === 2) {
              statusData?.push('completed');
            } else if (c.status === 4) {
              statusData?.push('pending distributor approval');
            } else if (c.status === 8) {
              statusData?.push('pending UCI approval');
            } else {
              statusData.push('with no status');
            }
          });
        });
      } else {
        postCampaignNetworkList?.forEach((a) => {
          a.company.campaign?.forEach((c) => {
            if (c.status === 0 || c.status === 1) {
              statusData?.push('active');
            } else if (c.status === 9) {
              statusData?.push('canceled');
            } else if (c.status === 2) {
              statusData?.push('completed');
            } else if (c.status === 4) {
              statusData?.push('pending distributor approval');
            } else if (c.status === 8) {
              statusData?.push('pending UCI approval');
            } else {
              statusData.push('with no status');
            }
          });
        });
      }

      const statusFilteredDataCpy = [...new Set(statusData)];
      setStatusFilterAllData(statusFilteredDataCpy);
      return statusFilteredDataCpy;
    };

    const onSetCampaignData = (modifiedData) => {
      const campaignData = [];
      modifiedData?.forEach((c) => {
        c?.company?.campaign?.forEach((b) => {
          if (b.name) {
            campaignData.push({ value: b.name, label: b.name });
          } else {
            campaignData.push('with no campaign');
          }
        });
      });

      const campaignFilteredDataCpy = [...new Set(campaignData)];
      setCampaignFilterAllData(campaignFilteredDataCpy);
      return campaignFilteredDataCpy;
    };

    const onFilterStatusData = (filteredData) => {
      const mData = [];
      // status data on select status filter
      if (!filteredEntityList.length) {
        postCampaignNetworkList?.forEach((c) => {
          c?.company?.campaign?.forEach((b) => {
            if (b.id) {
              mData.push(b);
            }
          });
        });
      }
      // status data on select adv filter
      filteredEntityList?.forEach((c) => {
        c?.company?.campaign?.forEach((b) => {
          if (b.id) {
            mData.push(b);
          }
        });
      });

      const sData = [];
      filteredData.forEach((d) => {
        if (d === 'active') {
          sData.push(0);
        } else if (d === 'canceled') {
          sData.push(9);
        } else if (d === 'completed') {
          sData.push(2);
        } else if (d === 'pending distributor approval') {
          sData.push(4);
        } else if (d === 'pending UCI approval') {
          sData.push(8);
        } else {
          sData.push('with no status');
        }
      });

      const modifiedData = [];
      if (filteredData.length) {
        // if sData is available
        [...new Set(mData)]?.forEach((d) => {
          sData?.forEach((s) => {
            if (s === d.status) {
              modifiedData.push({ value: d.name, label: d.name });
            }
          });
        });
      } else {
        // if sData is not available
        postCampaignNetworkList.forEach((a) => {
          a.company.campaign.forEach((b) => {
            if (b.name) {
              modifiedData.push({ value: b.name, label: b.name });
            }
          });
        });
      }
      setCampaignFilterAllData(modifiedData);
      setStatusKey(sData);
    };

    const applyFilter = (filteredData, id) => {
      if (id === 'adv_filter') {
        setAdvertiserFilterSelectedData(filteredData);
        const modifiedData = onFilteredAdvertiserData(filteredData);
        onSetStatusData(modifiedData);
        onSetCampaignData(modifiedData);
        setFilteredEntityList(modifiedData);
      } else if (id === 'status_filter') {
        setStatusFilterSelectedData(filteredData);
        onFilterStatusData(filteredData);
      }
    };

    const selectedCampaignIds = () => {
      const advId = [];
      const campaignIds = [];
      const status = [];
      postCampaignNetworkList.forEach((a) => {
        advertiserFilterSelectedData.forEach((b) => {
          if (a.company.display_name === b) {
            advId.push(a.company.id);
          }
        });
        a.company.campaign.forEach((ids) => {
          campaignFilterSelectedData.forEach((a) => {
            if (a.value === ids.name) {
              campaignIds.push(ids.id);
            }
          });
          statusKey.forEach((b) => {
            if (parseInt(b) === ids.status) {
              if (status.indexOf(ids.status) === -1) {
                status.push(ids.status);
              }
            }
          });
        });
      });
      return { campaignIds, advId, status };
    };

    const getAllPacingReportsData = () => {
      const { campaignIds, advId, status } = selectedCampaignIds();
      univisionStore.getAllPacingReportsData(advId, campaignIds, status).then(
        (res) => {
          if (res && res.data) {
            setReportData(res?.data);
          } else {
            showAckErrorMessage({ message: 'No Data Available' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const handleSubmit = () => {
      if (
        advertiserFilterSelectedData?.length ||
        campaignFilterSelectedData?.length ||
        statusFilterSelectedData?.length
      ) {
        setToggle(!toggle);
        getAllPacingReportsData();
      } else {
        showAckErrorMessage({ message: 'Please select any filter.' });
      }
    };

    const handleModalAction = (id, data) => {
      if (id === 'pacing_details') {
        univisionStore.viewReportsDetails(data.id).then(
          (res) => {
            if (res?.data?.results && res?.data?.results?.length) {
              setDetailsData(res?.data);
              setViewDetailsList(res?.data?.results);
            } else {
              showAckErrorMessage({ message: 'No Data Found.' });
            }
          },
          () => showAckErrorMessage()
        );
      } else if (id === 'graph') {
        setModalData(data);
        setCurrentStep(currentStep + 1);
      }
      onSetActiveModal(id);
    };

    const getData = (url) => {
      univisionStore.viewReportsDetailsPage(url).then(
        (res) => {
          if (res?.data?.results && res?.data?.results?.length) {
            setViewDetailsList(res?.data?.results);
            setDetailsData(res?.data);
          } else {
            showAckErrorMessage({ message: 'No Data Found.' });
          }
        },
        () => showAckErrorMessage()
      );
    };

    const onSetActiveModal = (modalType) => {
      setActiveModal(modalType);
    };

    const downloadCampaignReport = (data) => {
      univisionStore.downloadCampaignReport(data.id).then((res) => {
        if (res && res.data) {
          axios.get(res.data.s3_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/json' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `${data?.campaign_name}_${data?.campaign_start_date}_${data?.campaign_end_date}.csv`;
              downloadLink.click();
              uiStore.isLoading = false;
            },
            () => {
              uiStore.isLoading = false;
              showAckErrorMessage({ message: 'Unable to download logs.' });
            }
          );
        }
      });
    };

    const downloadPacingReport = () => {
      const { campaignIds, advId, status } = selectedCampaignIds();
      univisionStore.downloadPacingReport(advId, campaignIds, status).then(
        (res) => {
          if (res?.success) {
            showAckMessage({ message: 'File will be sent to email address.' });
          } else {
            showAckErrorMessage({ message: 'Something went wrong.' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const backButtonAction = () => {
      setCurrentStep(0);
    };

    const backButton = () => {
      setToggle(false);
    };

    const onChange = (value) => {
      setCampaignFilterSelectedData(value);
    };

    const renderCurrentStep = () => {
      switch (currentStep) {
        case 0:
          return (
            <div>
              <TableContainer
                pacingReportsTitles={pacingReportsTitles}
                pacingReportsList={reportData}
                handleModalAction={handleModalAction}
                downloadCampaignReport={downloadCampaignReport}
                aggCampaignStore={aggCampaignStore}
                backButton={backButton}
                downloadPacingReport={downloadPacingReport}
              />
            </div>
          );
        case 1:
          return <ViewPacingGraph modalData={modalData} backButtonAction={backButtonAction} />;
      }
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>View Pacing Reports</PageTitle>
        </PageHeader>
        {!toggle ? (
          postCampaignNetworkList.length ? (
            <div>
              <div className="flex-container2 mt20 ml20">
                <div className="flex-container1">
                  <ReactPickyFilter
                    allOptions={advertiserFilterAllData}
                    selectedData={advertiserFilterSelectedData}
                    onFilterChange={applyFilter}
                    id="adv_filter"
                    selectAllText="Select All Advertiser"
                    allSelectedPlaceholder="All Advertiser"
                    placeholderText="Select Advertiser"
                  />
                  <ReactPickyFilter
                    allOptions={statusFilterAllData}
                    selectedData={statusFilterSelectedData}
                    onFilterChange={applyFilter}
                    id="status_filter"
                    selectAllText="Select All Status"
                    allSelectedPlaceholder="All Status"
                    placeholderText="Select Status"
                  />
                  <SelectWrapper>
                    <Select
                      styles={{ marginLeft: '5px', width: '200px' }}
                      isMulti
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      name="colors"
                      options={campaignFilterAllData}
                      className="basic-multi-select"
                      placeholder="Select Campaign"
                      onChange={onChange}
                    />
                  </SelectWrapper>
                  <div className="ml10">
                    <CustomButton
                      type="primary"
                      buttonText="Submit"
                      handleButtonClick={() => {
                        handleSubmit();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No pacing reports available for the campaigns.</p>
          )
        ) : (
          renderCurrentStep()
        )}
        <ViewDetails
          showModal={activeModal === 'pacing_details'}
          closeModal={() => onSetActiveModal('')}
          viewDetailsList={viewDetailsList}
          viewDetailsTitles={viewDetailsTitles}
          getData={getData}
          detailsData={detailsData}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ReportsPacing);
