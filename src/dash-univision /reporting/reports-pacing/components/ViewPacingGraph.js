import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { inject, observer, useLocalStore } from 'mobx-react';
import OktaAuth from '@okta/okta-auth-js';

import API from '../../../../api';

import { MainContent, PageHeader } from '../../../../components/PageLayout';
import { PageTitle } from '../../../../components/Typography';
import ReactLoader from '../../../../components/ReactLoader';

import { showAckErrorMessage, removeSpecialCharacters } from '../../../../common/utils';

import withStore from '../../../../hocs/WithStore';
import CustomButton from '../../../../components/CustomButton';

const oktaDomain = 'https://adcuratio.oktapreview.com';

const ViewPacingReports = inject('authStore')(
  observer((props) => {
    const { authStore, modalData, backButtonAction } = props;
    const [url, setUrl] = useState('');

    const getReportDetails = () => {
      const data = {};
      // setting reports type
      data.report_type = 'pacing';
      return data;
    };

    const getRequiredData = ({ userRole: role, userName }) => {
      const payload = { report_type: getReportDetails().report_type, user_name: userName };
      if (role === 'Network Admin') {
        payload.user_type = 'network';
      } else if (role === 'Distributor Admin') {
        payload.user_type = 'operator';
      }
      return payload;
    };

    useEffect(() => {
      oktaFunction();
    }, []);

    const store = useLocalStore(
      () => ({
        isLoading: false,
        ReportsData: [],
        postLogFileDetail: [],
        getReports: async () => {
          try {
            store.isLoading = true;
            const { report_type, user_type, user_name } = getRequiredData(authStore.userObj);
            if (!report_type && !user_type) return;
            const response = await API.get(
              `admin/get_tableau_report_url_from_pacing/?report_type=${report_type}&user_name=${user_name}&user_type=${user_type}&pacing_obj_id=${modalData.id}`
            );
            if (response.data.success) {
              const reportUrlData = response.data.data;
              // parsing tableau_url that will be help to load report
              const parsedUrl = `${
                reportUrlData.tableau_url + removeSpecialCharacters(reportUrlData.site_root)
              }/${removeSpecialCharacters(reportUrlData.action_type)}/${removeSpecialCharacters(
                reportUrlData.workbook_name
              )}/${removeSpecialCharacters(
                reportUrlData.report_name
              )}?:embed=y&:customViews=no&:toolbar=top&:subscriptions=no&:showShareOptions=true&:alerts=no&:linktarget=_blank&:showAppBanner=false&:showAskData=false&:refresh=y`;
              setUrl(parsedUrl);
            } else {
              showAckErrorMessage({ message: response.data.message });
            }
          } catch (error) {
            if (error.response && error.response.status === 403) {
              showAckErrorMessage({ message: error.response.data.detail });
            } else {
              showAckErrorMessage();
            }
          } finally {
            store.isLoading = false;
          }
        },
      }),
      props
    );

    const oktaFunction = () => {
      const session_token = authStore.userObj.oktaDetails ? authStore.userObj.oktaDetails.session_token : null;
      const config = {
        issuer: oktaDomain,
      };
      if (window.sessionStorage.oktaSession === 'true' || session_token === null) {
        store.getReports();
      } else {
        const authClient = new OktaAuth(config);
        authClient.session.setCookieAndRedirect(session_token);
        window.sessionStorage.oktaSession = 'true';
      }
    };

    return (
      <MainContent>
        <PageHeader className="flex-container2 mr20">
          <PageTitle>
            <span className="capitalize">{`${modalData?.campaign_name}`}</span> Campaign Report
          </PageTitle>
          <CustomButton type="primary" buttonText="Back" handleButtonClick={() => backButtonAction()} />
        </PageHeader>
        {url ? (
          <div className="col-md-12">
            <iframe style={{ width: '100%' }} id="tableauViz" src={url} height="800"></iframe>
          </div>
        ) : null}
        <ReactLoader isLoading={store.isLoading} />
      </MainContent>
    );
  })
);

ViewPacingReports.propTypes = {
  modalData: PropTypes.object,
};

export default withStore(ViewPacingReports);
