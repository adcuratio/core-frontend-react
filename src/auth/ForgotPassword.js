import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { AuthWrapper, AuthTitle, AuthInput } from './components/AuthStyledComponents';

import { formatEmail, validateEmail } from '../common/utils';

import ReactLoader from '../components/ReactLoader';
import CustomButton from '../components/CustomButton';

import withStore from '../hocs/WithStore';

const ForgotPassword = inject('authStore')(
  observer((props) => {
    const { authStore } = props;
    const [validationMsg, setValidationMsg] = useState({
      error: '',
      status: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef(null);

    const forgotPassword = () => {
      const email = emailRef?.current?.value;
      if (!email?.length) {
        setValidationMsg({
          error: 'Please enter email id !!',
          status: '',
        });
        return;
      }
      if (!validateEmail(email)) {
        setValidationMsg({
          error: 'Please enter valid email id !!',
          status: '',
        });
        return;
      }
      const formattedEmail = formatEmail(email);
      setIsLoading(true);
      authStore.forgotPassword(formattedEmail).then(
        () => {
          setIsLoading(false);
          setValidationMsg({
            error: '',
            status: 'A recovery link will be sent to your email, if found in the system.',
          });
        },
        (err) => {
          setIsLoading(false);
          setValidationMsg({
            error: err,
            status: '',
          });
        }
      );
    };

    const emailInputOnchange = () => {
      if (validationMsg?.error) {
        setValidationMsg({
          error: '',
          status: '',
        });
      }
      if (validationMsg?.status) {
        setValidationMsg({
          error: '',
          status: '',
        });
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        forgotPassword();
      }
    };

    return (
      <>
        <AuthWrapper>
          <AuthTitle>Recover your password</AuthTitle>
          <AuthInput
            type="email"
            placeholder="Email Address"
            ref={emailRef}
            onChange={emailInputOnchange}
            onKeyDown={handleKeyDown}
          />
          {validationMsg?.error ? <div className="alert alert-danger mt20">{validationMsg.error}</div> : null}
          {validationMsg?.status ? <div className="alert alert-info mt20">{validationMsg.status}</div> : null}
          <div className="flex-container2 mt20">
            <CustomButton buttonText="Back" type="secondary" handleButtonClick={() => window.history.back()} />
            {!validationMsg.status ? (
              <CustomButton buttonText="Send Recovery Mail" type="ternary" handleButtonClick={forgotPassword} />
            ) : null}
          </div>
        </AuthWrapper>
        <ReactLoader isLoading={isLoading} />
      </>
    );
  })
);

ForgotPassword.propTypes = {
  authStore: PropTypes.object,
};

export default withStore(ForgotPassword);
