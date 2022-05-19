import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { AuthWrapper, AuthTitle, AuthInput } from './components/AuthStyledComponents';

import { validatePassword, showAckMessage, formatEmail } from '../common/utils';

import CustomButton from '../components/CustomButton';
import ReactLoader from '../components/ReactLoader';

import withStore from '../hocs/WithStore';

const ResetPwd = inject('authStore')(
  observer((props) => {
    const { authStore, navigationService, $state, $stateParams } = props;

    const [validationMsg, setValidationMsg] = useState({
      error: '',
      status: '',
    });
    const [userEmail, setUserEmail] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordRef = useRef(null);
    const resetPasswordRef = useRef(null);

    useEffect(() => {
      const userEmailCpy = atob($state.params.email);
      authStore.deleteSession();
      setUserEmail(userEmailCpy);
      setIsLoading(true);
      authStore.authenticateWithToken(formatEmail(userEmailCpy), $stateParams.reset_token).then(
        () => {
          setIsLoading(false);
          if (!authStore.isAuthenticated) {
            setValidationMsg({
              error: 'User cannot be found.',
              status: '',
            });
          } else {
            setValidationMsg({
              error: '',
              status: 'Authenticated...Please set a new password.',
            });
          }
        },
        () => {
          setIsLoading(false);
          setIsDisabled(true);
          setValidationMsg({
            error: 'Error occurred. The link might have expired.',
            status: '',
          });
        }
      );
    }, []);

    const isValidPassword = () => {
      let errorMessage = '';
      const newPassword = passwordRef?.current?.value;
      const confirmPassword = resetPasswordRef?.current?.value;
      if (!newPassword || !validatePassword(newPassword)) {
        errorMessage = `Password length should be more than 8 characters and less than 25 characters also it should atleast include one upper case, one lower case, one digit and one special character !`;
        setValidationMsg({
          error: errorMessage,
          status: '',
        });
        return false;
      }
      if (!confirmPassword || confirmPassword !== newPassword) {
        errorMessage = `Passwords do not match in the both the fields.`;
        setValidationMsg({
          error: errorMessage,
          status: '',
        });
        return false;
      }
      return true;
    };

    const resetPassword = () => {
      if (isValidPassword()) {
        setIsLoading(true);
        authStore.resetPassword(passwordRef.current.value).then(
          () => {
            setIsLoading(false);
            setValidationMsg({
              error: '',
              status: 'Password has been changed successfully. Redirecting to login page...',
            });
            showAckMessage({ message: 'Password successfully updated. Please login again.' });
            setTimeout(() => {
              navigationService.goToLogin();
            }, 3000);
          },
          (err) => {
            setIsLoading(false);
            setValidationMsg({
              error: err,
              status: '',
            });
          }
        );
      }
    };

    const onInputChange = () => {
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
        resetPassword();
      }
    };

    return (
      <>
        <AuthWrapper>
          <AuthTitle>Reset password for {userEmail}</AuthTitle>
          <div>
            <AuthInput
              type="password"
              placeholder="Password"
              ref={passwordRef}
              onChange={onInputChange}
              disabled={isDisabled ? 'disabled' : ''}
              onKeyDown={handleKeyDown}
            />
            <AuthInput
              type="password"
              placeholder="Retype Password"
              ref={resetPasswordRef}
              onChange={onInputChange}
              disabled={isDisabled ? 'disabled' : ''}
              onKeyDown={handleKeyDown}
            />
            {validationMsg?.error ? (
              <div className="alert alert-danger mt20">
                {typeof validationMsg.error === 'string'
                  ? validationMsg.error
                  : validationMsg.error?.message || 'Something went wrong, please try again.'}
              </div>
            ) : null}
            {validationMsg?.status ? <div className="alert alert-info mt20">{validationMsg.status}</div> : null}
            <CustomButton
              buttonText="Set new password"
              type="ternary"
              isDisabled={isDisabled}
              buttonClassName="mt20 element-right-align"
              handleButtonClick={resetPassword}
            />
          </div>
        </AuthWrapper>
        <ReactLoader isLoading={isLoading} />
      </>
    );
  })
);

ResetPwd.propTypes = {
  authStore: PropTypes.object,
  navigationService: PropTypes.object.isRequired,
  $state: PropTypes.object.isRequired,
  $stateParams: PropTypes.object.isRequired,
};

export default withStore(ResetPwd);
