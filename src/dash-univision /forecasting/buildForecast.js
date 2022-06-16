import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { ButtonToolbar, DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import withStore from '../../hocs/WithStore';
import { MainContent, PageHeader, PageContent } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import CustomButton from '../../components/CustomButton';
import AggPickyFilter from '../univsion-agg-campaign/components/PickyAgg';
import { showAckErrorMessage, showAckMessage } from '../../common/utils';
import ReactLoader from '../../components/ReactLoader';

import './forecasting.css';
import { toJS } from 'mobx';

const Forecast = inject(
  'uiStore',
  'companyStore',
  'aggCampaignStore'
)(
  observer((props) => {
    const { navigationService, uiStore, companyStore, aggCampaignStore } = props;

    const [advertiser, SetAdvertiser] = useState({});
    const [allCompanyData, setCompanyList] = useState([]);
    const [forecastName, setForecastName] = useState('');
    const [startDate, setStartDate] = useState(() => {
      const temp = new Date();
      temp.setDate(temp.getDate() + 1);
      return new Date(temp);
    });
    const [endDate, setEndDate] = useState(() => {
      const temp = new Date();
      temp.setDate(temp.getDate() + 1);
      return new Date(temp);
    });
    const [frequencyCap, setFrequencyCap] = useState(10);
    const [orderType, setOrderType] = useState('');
    const [allNetworkList, setAllNetworkList] = useState([]);
    const [includedNetworks, setIncludedNetWorks] = useState([]);
    const [dataProvider, setDataProvider] = useState('');
    const [dataProviderSegment, setDataProviderSegment] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState({});
    const [frequencyPeriod, setFrequencyPeriod] = useState('Weekly');

    const dataproviderKey = {
      'Custom Audience': 'audience_request_form',
      LiveRamp: 'live_ramp',
      'First Party': 'first_party',
    };

    useEffect(() => {
      companyStore.getAllCompanies().then(
        (res) => {
          setCompanyList(res?.data?.data);
        },
        () => showAckErrorMessage({ message: 'Something went wrong!' })
      );
      aggCampaignStore.getNetworksData().then(() => {
        setAllNetworkList(toJS(aggCampaignStore.networkList));
        const tempAllnetworks = [];
        aggCampaignStore?.networkList?.map((e) => tempAllnetworks.push(e.name));
        setIncludedNetWorks(tempAllnetworks);
      });
    }, []);

    const getInputContent = (name, value, setValue, type) => (
      <>
        <div>
          <p className="f12 bold-large">{name} </p>
        </div>
        <div>
          <input
            style={{ width: '200px' }}
            type="text"
            value={value}
            placeholder={name}
            min={type === 'number' ? '0' : null}
            onChange={(e) => {
              if (type === 'number' && (e.target.value < 0 || e.target.value.match('^[0-9]*$') === null)) {
                showAckErrorMessage({ message: 'frequency should be positive integer value' });
                return;
              }
              setValue(e.target.value);
            }}
          />
        </div>
      </>
    );

    const getDatePickerInput = (dateValue, setValue, type) => (
      <DatePicker
        selected={dateValue}
        minDate={
          type === 'end'
            ? startDate
            : (() => {
                const temp = new Date();
                temp.setDate(temp.getDate() + 1);
                return new Date(temp);
              })()
        }
        maxDate={(() => {
          const temp = new Date();
          temp.setDate(temp.getDate() + 91);
          return new Date(temp);
        })()}
        onChange={(date) => {
          if (type !== 'end') setEndDate(date);
          setValue(date);
        }}
        wrapperClassName="test-class"
      />
    );

    const handleDataProviderList = async (value) => {
      if (!advertiser?.company) {
        showAckErrorMessage({ message: 'Please select advertiser first!' });
        return;
      }
      const response = await aggCampaignStore.getFilterBasedonDataProvider({
        data_provider: dataproviderKey[value],
        entity_id: advertiser?.company?.id,
      });
      setDataProvider(value);
      setSelectedSegment({});
      if (response?.data?.success) {
        setDataProviderSegment(response?.data?.data);
      } else {
        showAckErrorMessage({ message: 'Something Went Wrong!' });
      }
    };

    const onSubmit = () => {
      if (!orderType.length) {
        showAckErrorMessage({ message: 'Please select order type!' });
        return;
      }
      if (!forecastName.length) {
        showAckErrorMessage({ message: 'Please select Forecast name!' });
        return;
      }
      if (!advertiser?.company) {
        showAckErrorMessage({ message: 'Please select advertiser!' });
        return;
      }
      if (!dataProvider) {
        showAckErrorMessage({ message: 'Please select data provider!' });
        return;
      }
      if (!selectedSegment?.name) {
        showAckErrorMessage({ message: 'Please select segment!' });
        return;
      }

      const includeId = [];
      const excludeID = [];
      if (includedNetworks.length) {
        allNetworkList.forEach((d) => {
          if (includedNetworks.includes(d.name)) {
            includeId.push(d.id);
          } else excludeID.push(d.id);
        });
      } else {
        allNetworkList.forEach((d) => includeId.push(d.id));
      }
      const payload = {
        adv_id: advertiser?.company?.id || '',
        forecast_name: forecastName,
        segment_id: selectedSegment?.id,
        start_date: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
        end_date: `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`,
        included_networks: [...includeId],
        excluded_networks: [...excludeID],
        frequency_count: frequencyCap.length ? frequencyCap : 10,
        frequency_period: frequencyPeriod,
        order_type: orderType,
      };
      aggCampaignStore.createForecastingData(payload).then(
        (res) => {
          if (res.status === 200 && res.data.success) {
            showAckMessage({ message: res.data.message });
            navigationService.goToUnivsionManageForecasting();
          } else {
            showAckErrorMessage({ message: res.message });
          }
        },
        (error) => {
          showAckErrorMessage({ message: error.message });
        }
      );
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Build New Forecast</PageTitle>
        </PageHeader>
        <PageContent>
          <div>
            <div className="grid-container column-border">
              <div>
                <p className="f12 bold-large">Order Type</p>
              </div>
              <div>
                <ButtonToolbar>
                  <DropdownButton className="test-class f12 overflow-hidden" title={orderType || 'Select Order Type'}>
                    <MenuItem onSelect={() => setOrderType('Pre')}>Pre</MenuItem>
                    <MenuItem onSelect={() => setOrderType('Post')}>Post</MenuItem>
                  </DropdownButton>
                </ButtonToolbar>
              </div>
              <>{getInputContent('Forecast Name', forecastName, setForecastName, 'text')}</>
              <p className="mr20 f12 bold-large">Start Date</p>
              {getDatePickerInput(startDate, setStartDate, 'start')}
              <p className="mr20 f12 bold-large">End Date</p>
              {getDatePickerInput(endDate, setEndDate, 'end')}
            </div>
            <div className="grid-container mt20 column-border">
              <div>
                <p className="f12 bold-large">Advertiser Name</p>
              </div>
              <div>
                <ButtonToolbar>
                  <DropdownButton
                    className="test-class f12 overflow-hidden"
                    title={advertiser?.company?.name || 'select Advertiser'}
                  >
                    {allCompanyData &&
                      allCompanyData.length &&
                      allCompanyData?.map((data, id) => (
                        <MenuItem
                          key={`${id}_drop_adv`}
                          onSelect={() => {
                            setDataProvider('');
                            setSelectedSegment({});
                            setDataProviderSegment([]);
                            SetAdvertiser(data);
                          }}
                        >
                          {data?.company?.name}
                        </MenuItem>
                      ))}
                  </DropdownButton>
                </ButtonToolbar>
              </div>
              <div>
                <p className="f12 bold-large">Data Provider</p>
              </div>
              <div>
                <ButtonToolbar>
                  <DropdownButton
                    className="test-class f12 overflow-hidden"
                    title={dataProvider || 'Select Data Provider'}
                  >
                    <MenuItem onSelect={() => handleDataProviderList('LiveRamp')}>LiveRamp</MenuItem>
                    <MenuItem onSelect={() => handleDataProviderList('Custom Audience')}>Custom Audience</MenuItem>
                    <MenuItem onSelect={() => handleDataProviderList('First Party')}>First Party</MenuItem>
                  </DropdownButton>
                </ButtonToolbar>
              </div>
              <p className="f12 bold-large">Segment Name</p>
              {/* <ReactSelectFilter /> */}
              <ButtonToolbar>
                <DropdownButton
                  className="test-class f12 overflow-hidden"
                  title={selectedSegment?.name || 'Select Segment'}
                  disabled={dataProviderSegment?.length === 0}
                >
                  {dataProviderSegment.length &&
                    dataProviderSegment?.map((data, idx) => (
                      <MenuItem key={`data_seg_name_${idx}`} onSelect={() => setSelectedSegment(data)}>
                        {data?.name}
                      </MenuItem>
                    ))}
                </DropdownButton>
              </ButtonToolbar>
              <p className="f12 bold-large">Audience Count</p>
              <p className="f12 bold-large">
                {selectedSegment?.name ? selectedSegment?.row_count?.toLocaleString() : '---'}
              </p>
            </div>
            <div className="grid-container mt20 column-border">
              <>
                <p className="f12 bold-large">
                  Included Networks{' '}
                  <OverlayTrigger
                    placement="right"
                    overlay={
                      <Tooltip id="standard-campaign-tooltip">
                        All the networks are included by default if nothing is selected
                      </Tooltip>
                    }
                  >
                    <i className="glyphicon glyphicon-info-sign ml5" aria-hidden="true" />
                  </OverlayTrigger>
                  <p className="small-description">
                    *The selected networks from the list will be Included and the rest will be treated as excluded
                    networks
                  </p>
                </p>
                <AggPickyFilter
                  includeSelectAll={false}
                  className="date-picker-length"
                  allOptions={allNetworkList.map((e) => e.name)}
                  disabled={false}
                  allSelectedPlaceholder={`${includedNetworks.length} selected`}
                  selectedData={includedNetworks}
                  onFilterChange={(data) => {
                    setIncludedNetWorks(data);
                  }}
                  id="included netwroks"
                />
              </>
              {/* <>
                <p className="f12 bold-large">Excluded Networks</p>
                <AggPickyFilter
                  includeSelectAll={false}
                  className="date-picker-length"
                  allOptions={allNetworkList.map((e) => e.name)}
                  disabled={false}
                  selectedData={excludedNetworks}
                  onFilterChange={(data) => {
                    let flag = 0;
                    data.forEach((d) => {
                      if (includedNetworks.includes(d)) {
                        flag = 1;
                        showAckErrorMessage({
                          message: 'You cannot exclude the Networks that have been selected in Included',
                        });
                      }
                    });
                    if (flag === 0) setExcludedNetWorks(data);
                  }}
                  id="excluded netwroks"
                />
              </> */}
            </div>
            <div className="grid-container mt20 column-border">
              <div>
                <p className="f12 bold-large">
                  Frequency Period
                  <p className="small-description">*By default frequency will be 10/Week</p>
                </p>
              </div>
              <div>
                <ButtonToolbar>
                  <DropdownButton
                    className="test-class f12 overflow-hidden"
                    title={frequencyPeriod || 'Select Data Provider'}
                  >
                    <MenuItem onSelect={() => setFrequencyPeriod('Weekly')}>Weekly</MenuItem>
                    <MenuItem onSelect={() => setFrequencyPeriod('Daily')}>Daily</MenuItem>
                    {/* <MenuItem onSelect={() => setFrequencyPeriod('PerFlight')}>PerFlight</MenuItem> */}
                  </DropdownButton>
                </ButtonToolbar>
              </div>
              {getInputContent('Frequency Count', frequencyCap, setFrequencyCap, 'number')}
            </div>
          </div>
          <div className="mt20 float-right-imp">
            <CustomButton buttonText="Submit" type="primary" handleButtonClick={onSubmit} />
          </div>
        </PageContent>
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

Forecast.propTypes = {
  navigationService: PropTypes.object,
  companyStore: PropTypes.object,
  uiStore: PropTypes.object,
  aggCampaignStore: PropTypes.object,
};

export default withStore(Forecast);
