/* eslint-disable  */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import withStore from '../../hocs/WithStore';

import { MainContent, PageHeader } from '../../components/PageLayout';
import { PageTitle } from '../../components/Typography';

import PageContainer from './components/PageContainer';
import { userAdministrationTiles, advertiserAdministrationTiles } from './components/JsonData';

import ReactLoader from '../../components/ReactLoader';

import { showAckErrorMessage } from '../../common/utils';

const UnivisionAdministration = inject(
  'accountManagementStore',
  'uiStore',
  'univisionStore'
)(
  observer((props) => {
    const { accountManagementStore, uiStore, univisionStore } = props;
    const [uniUserList, setUniUserList] = useState([]);
    const [addAdvertiser, setAddAdvertiser] = useState([]);
    const [subAgencyId, setSubAgencyId] = useState({});

    const getAllAgencyRepAPI = () => {
      accountManagementStore.getAllAgencyRepUnivision().then(
        (response) => {
          if (response && response.status === 200) {
            setUniUserList(response?.data?.data);
          } else {
            showAckErrorMessage({ message: response?.data?.message ?? 'Cannot fetch Agency Representative!' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getAdvertiserList = () => {
      univisionStore.getAdvertiserLists().then(
        (res) => {
          if (res && res.status === 200) {
            setAddAdvertiser(res?.data?.data);
          } else {
            showAckErrorMessage({ message: res?.message ?? 'Something went wrong.' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    const getSubAgencyId = () => {
      univisionStore.getSubAgencyId().then(
        (res) => {
          if (res && res.status === 200) {
            setSubAgencyId(res?.data?.data[0]?.sub_agency[0]?.id);
          } else {
            showAckErrorMessage({ message: res?.message ?? 'Something went wrong.' });
          }
        },
        () => {
          showAckErrorMessage();
        }
      );
    };

    useEffect(() => {
      getAllAgencyRepAPI();
      getAdvertiserList();
      getSubAgencyId();
    }, []);

    return (
      <MainContent>
        <PageHeader>
          <PageTitle>Administration</PageTitle>
        </PageHeader>
        <PageContainer
          userAdministrationTiles={userAdministrationTiles}
          uniUserList={uniUserList}
          advertiserAdministrationTiles={advertiserAdministrationTiles}
          addAdvertiser={addAdvertiser}
          univisionStore={univisionStore}
          getAdvertiserList={getAdvertiserList}
          getAllAgencyRepAPI={getAllAgencyRepAPI}
          isLoading={uiStore.isLoading}
          subAgencyId={subAgencyId}
        />
        <ReactLoader isLoading={uiStore.isLoading} />
      </MainContent>
    );
  })
);

UnivisionAdministration.propTypes = {
  navigationService: PropTypes.object,
};

export default withStore(UnivisionAdministration);
