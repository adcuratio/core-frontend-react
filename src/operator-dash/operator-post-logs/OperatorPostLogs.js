import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';
import ReactLoader from '../../components/ReactLoader';
import PostLogFileData from '../../components/post-logs/PostLogFileData';
import PostLogsTable from '../../components/post-logs/PostLogsTable';
import ErrorsModal from '../../components/post-logs/ErrorsModal';

import { showAckErrorMessage } from '../../common/utils';

import withStore from '../../hocs/WithStore';

const OperatorPostLogs = inject(
  'postLogsStore',
  'uiStore'
)(
  observer((props) => {
    const { postLogsStore, uiStore } = props;
    const [activeModal, setActiveModal] = useState('');
    const [isViewDetailsLoading, setIsViewDetailsLoading] = useState(false);
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
      getPostLogs();
    }, []);

    //Function to call API to load post logs table data
    const getPostLogs = () => {
      postLogsStore.getPostLogs().then(
        (res) => {
          if (!(res && res.status === 200)) {
            showAckErrorMessage();
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    //Function to call API to load data for View details modal
    const getPostLogFileDetail = (id) => {
      postLogsStore.getPostLogFileDetail(id).then(
        (res) => {
          if (res && res.status === 200) {
            setActiveModal('view_details_modal');
            setIsViewDetailsLoading(false);
          }
        },
        (error) => {
          showAckErrorMessage({
            message: error,
          });
        }
      );
    };

    const onViewDetails = (data) => {
      setIsViewDetailsLoading(true);
      getPostLogFileDetail(data.id); // To load data for the View details modal from API.
    };

    const onViewErrors = (data) => {
      setActiveModal('view_error_modal');
      setModalData(data);
    };

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Post Logs</PageTitle>
        </PageHeader>
        <PostLogsTable
          postLogsData={postLogsStore.postLogsData}
          onViewDetails={onViewDetails}
          onViewErrors={onViewErrors}
          type="operator"
        />
        {activeModal === 'view_details_modal' ? (
          <PostLogFileData
            closeModal={() => setActiveModal('')}
            isLoading={uiStore.isLoading}
            postLogFileDetail={postLogsStore.postLogsViewData}
            type="operator"
          />
        ) : null}
        {activeModal === 'view_error_modal' ? (
          <ErrorsModal
            closeModal={() => setActiveModal('')}
            isLoading={uiStore.isLoading}
            modalData={modalData}
            type="operator"
          />
        ) : null}
        <ReactLoader isLoading={uiStore.isLoading || isViewDetailsLoading} />
      </MainContent>
    );
  })
);

export default withStore(OperatorPostLogs);
