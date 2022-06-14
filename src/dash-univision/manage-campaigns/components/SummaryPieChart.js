import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import styled from 'styled-components';

import { OverlayTrigger, Popover } from 'react-bootstrap';

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
import { formatNumber } from '../../../common/utils';

const NcmManageSummary = (props) => {
  const { tradeData, summaryData, impressionsCount } = props;

  const ordersData = summaryData?.orders;

  const options = {
    legend: null,
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      titleFontColor: '#000',
    },
  };

  const orderData = {
    labels: ['Active', 'Canceled', 'Completed', 'Pending Distributor Approval'],
    datasets: [
      {
        backgroundColor: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c'],
        data: [
          tradeData?.tableProgressTradesData?.length,
          tradeData?.tablePausedTradesData?.length,
          tradeData?.tableCompletedTradesData?.length,
          tradeData?.tablePendingTradesData?.length,
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
      name: 'Canceled Orders',
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
  ];

  const orderSummaryDataColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c'];

  const d = new Date();
  d.setDate(d.getDate() - 3);

  return (
    <OrderSummary>
      <div className="mn-white-bg clearfix">
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
        {impressionsCount?.total_impressions_booked ||
        impressionsCount?.total_delivered_impressions ||
        impressionsCount?.total_daily_impressions_delivered ? (
          <div className="col-md-5 border-right-light">
            <h3 className="p5 bold text-center mb50">Impressions Summary</h3>
            <ul className="custom-legend-text ml30">
              <li>
                <span>
                  {impressionsCount?.total_impressions_booked ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Popover id="popover-positioned-scrolling-left" className="no-text-transform">
                          Active campaign sum
                        </Popover>
                      }
                    >
                      <span style={{ fontSize: '16px' }}>
                        Total Impressions Booked:{' '}
                        <span style={{ fontWeight: 'normal' }}>
                          {formatNumber(impressionsCount?.total_impressions_booked)}
                        </span>
                      </span>
                    </OverlayTrigger>
                  ) : null}
                </span>
              </li>
              <li>
                <span>
                  {impressionsCount?.total_daily_impressions_delivered ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Popover id="popover-positioned-scrolling-left" className="no-text-transform">
                          Impressions Delivered on{' '}
                          {d.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Popover>
                      }
                    >
                      <span style={{ fontSize: '16px' }}>
                        Impressions Delivered (T-3) :{' '}
                        <span style={{ fontWeight: 'normal' }}>
                          {formatNumber(impressionsCount?.total_daily_impressions_delivered)}
                        </span>
                      </span>
                    </OverlayTrigger>
                  ) : null}
                </span>
              </li>
              <li>
                <span>
                  {impressionsCount?.total_delivered_impressions ? (
                    <OverlayTrigger
                      placement="right"
                      overlay={
                        <Popover id="popover-positioned-scrolling-left" className="no-text-transform">
                          Active and completed
                        </Popover>
                      }
                    >
                      <span style={{ fontSize: '16px' }}>
                        Total Delivered Impressions:{' '}
                        <span style={{ fontWeight: 'normal' }}>
                          {formatNumber(impressionsCount?.total_delivered_impressions)}
                        </span>
                      </span>
                    </OverlayTrigger>
                  ) : null}
                </span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </OrderSummary>
  );
};
NcmManageSummary.propTypes = {
  tradeData: PropTypes.object,
  summaryData: PropTypes.any,
  impressionsCount: PropTypes.any,
};

export default NcmManageSummary;
