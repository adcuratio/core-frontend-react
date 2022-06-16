import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { formatNumber, processUTCtoEST, showAckErrorMessage, showAckMessage } from '../../../../common/utils';

import CustomButton from '../../../../components/CustomButton';
import AggViewEditModal from '../../../univsion-agg-campaign/components/ViewEditModal';
import { PageTitle } from '../../../../components/Typography';
import { PageHeader } from '../../../../components/PageLayout';

const TableContainer = (props) => {
  const {
    pacingReportsTitles,
    pacingReportsList,
    aggCampaignStore,
    backButton,
    handleModalAction,
    downloadCampaignReport,
    id,
    setId,
    downloadPacingReport,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const [vieOrderlineData, setViewOrderlineData] = useState({});
  const [isView, setIsView] = useState(true);

  // Function to map the header list
  const renderTableHeader = () => {
    if (pacingReportsTitles?.length) {
      const headerComp = [];
      pacingReportsTitles.forEach((title) => {
        headerComp.push(
          <th key={title.id} style={{ fontSize: '12px' }}>
            {title.name}
          </th>
        );
      });
      return headerComp;
    }
    return null;
  };

  const toggleViewOrEdit = () => {
    setIsView(!isView);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const getOnviewEditOrderlineData = (data) => {
    aggCampaignStore.getViewOrderlineData(data?.orderline_id).then(
      (res) => {
        if (res.data.success) {
          setViewOrderlineData(res.data.data);
          toggleModal();
        } else {
          showAckErrorMessage({ message: 'something went wrong' });
        }
      },
      (error) => showAckErrorMessage({ message: error.message })
    );
  };

  const onSubmitEdits = (orderlineID, editData) => {
    aggCampaignStore.editOrderLine(orderlineID, editData).then(
      (res) => {
        if (res.data.success) {
          showAckMessage({ message: res.data.message });
          setIsView(true);
          setShowModal(false);
        } else {
          showAckErrorMessage({ message: res.data.message });
        }
      },
      (error) => {
        showAckErrorMessage({ message: error?.message });
      }
    );
  };

  // Function to show the table content
  const renderTableContent = () => {
    if (pacingReportsList?.length) {
      const tableContentComp = [];
      pacingReportsList?.forEach((data) => {
        tableContentComp.push(
          <tr key={data.id}>
            <td>{data.advertiser_name}</td>
            <td>{data.campaign_name}</td>
            <td>{data.orderline_activation_time ? `${processUTCtoEST(data.orderline_activation_time)} ET` : 'N/A'}</td>
            <td>
              {data.orderline_activation_time ? `${processUTCtoEST(data.orderline_deactivation_time)} ET` : 'N/A'}
            </td>
            <td>{data.isci}</td>
            <td>{data.segment_name}</td>
            <td>{data.segment_data_provider}</td>
            <td>{formatNumber(data.target_size)}</td>
            <td>{data.avg_pacing ? formatNumber(data.avg_pacing) : 'N/A'}</td>
            <td>{data.delivery_index !== 0 ? `${data.delivery_index}%` : 'N/A'}</td>
            <td>{formatNumber(data.total_impressions)}</td>
            <td>{formatNumber(data.target_impressions)}</td>
            <td>
              <div>
                {data.status_indication === 0 && (
                  <i
                    className="glyphicon glyphicon-play mr10"
                    style={{ color: '#FFE900', transform: 'rotate(90deg)', fontSize: '16px' }}
                  />
                )}
                {data.status_indication === 1 && (
                  <i
                    className="glyphicon glyphicon-play"
                    style={{ color: 'green', transform: 'rotate(270deg)', fontSize: '16px' }}
                  />
                )}
              </div>
            </td>
            <td>
              <CustomButton
                buttonText="Details"
                buttonClassName="tradebtn"
                handleButtonClick={() => handleModalAction('pacing_details', data)}
              />
              <CustomButton
                buttonText="Graph"
                buttonClassName="tradebtn"
                handleButtonClick={() => {
                  handleModalAction('graph', data);
                }}
              />
            </td>
            <td>
              <CustomButton
                buttonText="Download"
                buttonClassName="tradebtn"
                handleButtonClick={() => downloadCampaignReport(data)}
              />
            </td>
            {data?.orderline_status === 'Active' ? (
              <td>
                <CustomButton
                  buttonText="View/Edit"
                  buttonClassName="tradebtn"
                  handleButtonClick={() => getOnviewEditOrderlineData(data)}
                />
              </td>
            ) : (
              <td>N/A</td>
            )}
          </tr>
        );
      });
      return tableContentComp;
    }
    return null;
  };

  return (
    <div>
      <div style={{ overflowX: 'scroll' }}>
        {id === '' && (
          <div className="flex-container1 pull-right mb10">
            <div className="flex-container2">
              <CustomButton type="primary" buttonText="Back" handleButtonClick={() => backButton()} />
              <CustomButton
                buttonText="Download"
                type="primary"
                buttonClassName="ml10"
                handleButtonClick={() => downloadPacingReport()}
              />
            </div>
          </div>
        )}
        {id === 'report' || id === 'pacing_details' ? (
          <PageHeader>
            <PageTitle>View Pacing Reports</PageTitle>
          </PageHeader>
        ) : null}
        {id === 'report' || id === 'pacing_details' ? (
          <div className="pull-right mb10" style={{ marginRight: '10px' }}>
            <CustomButton
              buttonText="Back"
              type="primary"
              handleButtonClick={() => {
                setId('');
              }}
            />
          </div>
        ) : null}
        <table className="table table-striped table-wrapper mt10 wrapped-table table-heavyborder table-layout-auto">
          <thead>
            <tr>{renderTableHeader()}</tr>
          </thead>
          <tbody>{renderTableContent()}</tbody>
        </table>
        {!pacingReportsList.length && (
          <div key="no_data_found" className="text-center-imp">
            No data available.
          </div>
        )}
      </div>
      {Object.keys(vieOrderlineData).length > 0 && (
        <AggViewEditModal
          showModal={showModal}
          orderlineData={vieOrderlineData?.orderline_details?.orderline_data[0]}
          toggleViewOrEdit={toggleViewOrEdit}
          isView={isView}
          toggleModal={toggleModal}
          onSubmitEdits={onSubmitEdits}
          orderDetails={vieOrderlineData}
          comingFromUCIPending={'pacing_reports'}
        />
      )}
    </div>
  );
};

TableContainer.propTypes = {
  pacingReportsTitles: PropTypes.array,
  pacingReportsList: PropTypes.array,
  handleModalAction: PropTypes.func,
  downloadCampaignReport: PropTypes.func,
  aggCampaignStore: PropTypes.object,
  backButton: PropTypes.func,
  id: PropTypes.string,
  setId: PropTypes.func,
  downloadPacingReport: PropTypes.func,
};

TableContainer.defaultProps = {
  pacingReportsTitles: [],
  pacingReportsList: [],
  handleModalAction: () => {},
  aggCampaignStore: {},
  backButton: () => {},
  id: '',
  setId: () => {},
};

export default TableContainer;
