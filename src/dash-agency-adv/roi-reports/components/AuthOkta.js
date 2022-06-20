import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import OktaAuth from '@okta/okta-auth-js';

const oktaDomain = 'https://adcuratio.oktapreview.com';

const AuthOkta = (props) => {
  const { authStore } = props;

  // Register session if session is invalid
  const oktaFunction = () => {
    const session_token = authStore.userObj.oktaDetails ? authStore.userObj.oktaDetails.session_token : null;
    const config = {
      issuer: oktaDomain,
    };
    if (!(window.sessionStorage.oktaSession === 'true' || session_token === null)) {
      const authClient = new OktaAuth(config);
      authClient.session.setCookieAndRedirect(session_token);
      window.sessionStorage.oktaSession = 'true';
    }
  };

  useEffect(() => {
    oktaFunction();
  }, []);

  return <div></div>;
};

AuthOkta.propTypes = {
  authStore: PropTypes.object,
};

export default AuthOkta;
