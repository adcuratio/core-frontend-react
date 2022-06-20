import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';

const OrderSummary = styled.div`
  .mn-order-summary-chart {
    display: block;
    height: 150px !important;
    width: 200px !important;
  }
  .mn-white-bg {
    background-color: #fff;
  }
  .mn-trade-chart-margin {
    margin-top: 15px !important;
    cursor: pointer;
  }
`;

import CustomLegend from '../../../components/CustomLegend';

const NcmManageSummary = (props) => {
  const { isAgencyAdminUser, tradeData, summaryData } = props;

  const adspotsData = summaryData?.adspots,
    ordersData = summaryData?.orders;
  const adspotsSummaryData = [
    {
      name: 'Completed Ad Spots',
      y: adspotsData?.completed,
    },
    {
      name: 'Pending Ad Spots',
      y: adspotsData?.pending,
    },
  ];

  const adspotData = {
    labels: ['Completed Ad Spots', 'Pending Ad Spots'],
    datasets: [
      {
        backgroundColor: ['#7cb5ec', '#434348'],
        data: [adspotsData?.completed, adspotsData?.pending],
      },
    ],
  };

  const options = {
    legend: null,
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      titleFontColor: '#000',
    },
  };

  const orderData = {
    labels: [
      'Active',
      'Paused',
      'Completed',
      'Pending Distributor Approval',
      isAgencyAdminUser ? 'Pending Advertiser approval' : 'Requiring your approval',
      isAgencyAdminUser ? 'Requiring your approval' : 'Pending Agency approval',
      'Pending Processing',
      'Declined',
    ],
    datasets: [
      {
        backgroundColor: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80', '#FF5733', '#0000FF'],
        data: [
          tradeData?.tableProgressTradesData?.length,
          tradeData?.tablePausedTradesData?.length,
          tradeData?.tableCompletedTradesData?.length,
          tradeData?.tablePendingTradesData?.length,
          tradeData?.tableAdvertiserApprovalTradesData?.length,
          tradeData?.tableAgencyApprovalTradesData?.length,
          tradeData?.tablePendingProcessingTradesData?.length,
          tradeData?.tableDeclinedTradesData?.length,
        ],
      },
    ],
  };

  const ordersSummaryData = [
    {
      name: 'Active Orders',
      y: tradeData?.tableProgressTradesData?.length,
    },
    {
      name: 'Paused Orders',
      y: tradeData?.tablePausedTradesData?.length,
    },
    {
      name: 'Completed Orders',
      y: tradeData?.tableCompletedTradesData?.length,
    },
    {
      name: 'Pending Distributor approval',
      y: tradeData?.tablePendingTradesData?.length,
    },
    {
      name: isAgencyAdminUser ? 'Pending Advertiser approval' : 'Requiring your approval',
      y: tradeData?.tableAdvertiserApprovalTradesData?.length,
    },
    {
      name: isAgencyAdminUser ? 'Requiring your approval' : 'Pending Agency approval',
      y: tradeData?.tableAgencyApprovalTradesData?.length,
    },
    {
      name: 'Pending processing',
      y: tradeData?.tablePendingProcessingTradesData?.length,
    },

    {
      name: 'Declined',
      y: tradeData?.tableDeclinedTradesData?.length,
    },
  ];

  const adspotsSummaryDataColors = ['#7cb5ec', '#434348'];
  const orderSummaryDataColors = [
    '#7cb5ec',
    '#434348',
    '#90ed7d',
    '#f7a35c',
    '#8085e9',
    '#f15c80',
    '#FF5733',
    '#0000FF',
  ];

  return (
    <OrderSummary>
      <div className="mn-white-bg clearfix">
        {adspotsData?.completed || adspotsData?.pending ? (
          <div className="col-md-5 border-right-light">
            <h3 className="p5 bold text-center mb10">Ad Spots Summary</h3>
            <div className="flex flex-align-center ">
              <div className="mn-order-summary-chart">
                <div className="mn-trade-chart-margin">
                  <Pie data={adspotData} options={options} />
                </div>
              </div>
              <div className="custom-legend-mouse-icon">
                <CustomLegend
                  legendData={adspotsSummaryData}
                  legendDataColors={adspotsSummaryDataColors}
                ></CustomLegend>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {ordersData?.total ? (
          <div className="col-md-7">
            <h3 className="p5 bold text-center mb10">Orders Summary</h3>

            <div className="flex flex-align-center ">
              <div className="mn-order-summary-chart">
                <div className="mn-trade-chart-margin">
                  <Pie data={orderData} options={options} />
                </div>
              </div>
              <CustomLegend
                className="custom-legend-mouse-icon"
                legendData={ordersSummaryData}
                legendDataColors={orderSummaryDataColors}
              ></CustomLegend>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </OrderSummary>
  );
};
NcmManageSummary.propTypes = {
  isAgencyAdminUser: PropTypes.bool,
  tradeData: PropTypes.object,
  summaryData: PropTypes.any,
};

export default NcmManageSummary;
