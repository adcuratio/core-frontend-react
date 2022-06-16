import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { toJS } from 'mobx';
import axios from 'axios';

import { MainContent, PageHeader } from '../../../components/PageLayout';
import ReactLoader from '../../../components/ReactLoader';
import { PageTitle } from '../../../components/Typography';
import ReactPickyFilter from '../../../components/ReactPickyFilter';

import { showAckErrorMessage } from '../../../common/utils';

import withStore from '../../../hocs/WithStore';

import { postCampaignNetworkTitles } from './components/JsonData';
import TableContainer from './components/TableContainer';
import CustomButton from '../../../components/CustomButton';

const SelectWrapper = styled.div`
  width: 200px;
  margin: auto;
  overflow: hidden;

  .transparent {
    background-color: transparent;
    border: none;
  }
`;

const ReportsPostCampaign = inject(
  'uiStore',
  'univisionStore'
)(
  observer((props) => {
    const { uiStore, univisionStore } = props;
    const [postCampaignNetworkList, setPostCampaignNetworkList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(0);

    const [campaignFilterAllData, setCampaignFilterAllData] = useState([]);
    const [campaignFilterSelectedData, setCampaignFilterSelectedData] = useState([]);

    const [creativeFilterAllData, setCreativeFilterAllData] = useState([]);
    const [creativeFilterSelectedData, setCreativeFilterSelectedData] = useState([]);

    const [filteredEntityList, SetFilteredEntityList] = useState({});

    const [toggle, setToggle] = useState(false);

    const [reportData, setReportData] = useState([]);

    const [nextPageUrl, setNextPageUrl] = useState('');

    const getPostCampaignNetworkList = () => {
      univisionStore.getPostCampaignNetworkList().then(
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
      getPostCampaignNetworkList();
    }, []);

    const handleEntitySelection = (e) => {
      const currentCompanydata = postCampaignNetworkList.find((c) => c.company.id === parseInt(e.target.value));
      SetFilteredEntityList(toJS(currentCompanydata));
      setSelectedCompany(e.target.value);
      onSetCampaignData(toJS(currentCompanydata));
    };

    const onSetCampaignData = (modifiedData) => {
      const campaignData = [];
      modifiedData?.company?.campaign.forEach((b) => {
        if (b.name) {
          campaignData.push(b.name);
        } else {
          campaignData.push('with no campaign');
        }
      });
      const brandFilteredDataCpy = [...new Set(campaignData)];
      setCampaignFilterAllData(brandFilteredDataCpy);
      return brandFilteredDataCpy;
    };

    const onSetCreativeData = (modifiedData) => {
      const creativeData = filteredEntityList?.company?.campaign?.filter((c) => modifiedData.includes(c.name));
      const filteredData = [];
      creativeData.forEach((a) => {
        a.creative.forEach((c) => {
          if (c.ad_name) {
            filteredData.push(c.ad_name);
          } else {
            filteredData.push('with no creative');
          }
        });
      });
      const creativeFilteredDataCpy = [...new Set(filteredData)];
      setCreativeFilterAllData(creativeFilteredDataCpy);
      setCreativeFilterSelectedData([]);
    };

    const applyFilter = (filteredData, id) => {
      if (id === 'campaign_filter') {
        setCampaignFilterSelectedData(filteredData);
        onSetCreativeData(filteredData);
      } else if (id === 'creative_filter') {
        setCreativeFilterSelectedData(filteredData);
      }
    };

    const selectedCampaignIds = () => {
      const advId = filteredEntityList?.company?.id;
      const campaignIds = [];
      const creativeIds = [];
      filteredEntityList?.company?.campaign?.forEach((ids) => {
        campaignFilterSelectedData.forEach((a) => {
          if (a === ids.name) {
            campaignIds.push(ids.id);
            creativeFilterSelectedData.forEach((b) =>
              ids.creative.some((a) => a.ad_name === b && creativeIds.push(a.id))
            );
          }
        });
      });
      return { campaignIds, creativeIds, advId };
    };

    const getAllCampaignNetworkReports = (pageUrl) => {
      const { campaignIds, creativeIds, advId } = selectedCampaignIds();

      let url = '';
      url += `&company=${advId}&campaign=${campaignIds?.join(',')}&creative=${creativeIds?.join(',')}`;

      univisionStore.getAllCampaignNetworkReports(url, pageUrl).then(
        (res) => {
          if (res?.status === 200) {
            setNextPageUrl(res.data.next);
            setReportData([...reportData, ...res.data.results]);
            uiStore.isLoading = false;
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
      if (selectedCompany && campaignFilterSelectedData?.length) {
        setToggle(!toggle);
        getAllCampaignNetworkReports();
      } else {
        showAckErrorMessage({ message: 'Please select all details.' });
      }
    };

    const downloadNetworkReport = () => {
      const { campaignIds, creativeIds, advId } = selectedCampaignIds();
      univisionStore.downloadCampaignNetworkReport(advId, campaignIds, creativeIds).then((res) => {
        if (res && res.data) {
          axios.get(res.data.s3_url).then(
            (res) => {
              const blob = new Blob([res.data], { type: 'application/json' });
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(blob);
              downloadLink.download = `Report.csv`;
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

    const handlePagination = () => {
      if (nextPageUrl) {
        getAllCampaignNetworkReports(nextPageUrl);
        setNextPageUrl('');
      }
    };

    const backButton = () => {
      setToggle(false);
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Post Campaign By ISCI and Hour</PageTitle>
        </PageHeader>
        {!toggle ? (
          postCampaignNetworkList.length ? (
            <div className="flex-container2 mt20 ml20">
              <div className="flex-container1">
                <SelectWrapper>
                  <select className="capitalize" value={selectedCompany} onChange={(e) => handleEntitySelection(e)}>
                    <option value="0" disabled>
                      {postCampaignNetworkList?.length > 0 ? 'Select Advertiser' : 'Loading advertiser'}
                    </option>
                    {postCampaignNetworkList?.length > 0 &&
                      postCampaignNetworkList?.map((c) => (
                        <option key={c.company.id} value={c.company.id}>
                          {c.company.name}
                        </option>
                      ))}
                  </select>
                </SelectWrapper>
                <ReactPickyFilter
                  allOptions={campaignFilterAllData}
                  selectedData={campaignFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="campaign_filter"
                  selectAllText="Select All Campaigns"
                  allSelectedPlaceholder="All Campaigns"
                  placeholderText="Select Campaign"
                />
                <ReactPickyFilter
                  allOptions={creativeFilterAllData}
                  selectedData={creativeFilterSelectedData}
                  onFilterChange={applyFilter}
                  id="creative_filter"
                  selectAllText="Select All Creatives"
                  allSelectedPlaceholder="All Creatives"
                  placeholderText="Select Creative (optional)"
                />
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
          ) : (
            <p className="text-center">No Post campaign network reports available for the campaigns.</p>
          )
        ) : (
          <TableContainer
            postCampaignNetworkTitles={postCampaignNetworkTitles}
            postCampaignNetworkList={reportData}
            downloadNetworkReport={downloadNetworkReport}
            nextPageUrl={nextPageUrl}
            handlePagination={handlePagination}
            isLoading={uiStore.isLoading}
            backButton={backButton}
          />
        )}
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

export default withStore(ReportsPostCampaign);
