import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  AuthWrapper,
  AuthTitle,
  AuthInput,
  LoginHeaderWrapper,
  LogoWrapper,
} from "./components/AuthStyledComponents";

import { formatEmail, validateEmail } from "../common/utils";
//import ReactLoader from '../components/ReactLoader';
import CustomButton from "../components/CustomButton";
import { inject, observer } from "mobx-react";

import Logo from "../images/logo.png";
import { Link } from "react-router-dom";

const Login = inject("authStore")(
  observer((props) => {
    const { authStore, navigationService } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
      authStore.deleteSession();
    }, []);

    const onLogin = () => {
      const email = emailRef?.current?.value;
      const password = passwordRef?.current?.value;
      if (!(email && password)) {
        setErrorMessage("Please enter email and password !!");
        return;
      }
      if (!validateEmail(email)) {
        setErrorMessage("Please enter valid email id !!");
        return;
      }
      setIsLoading(true);
      authStore.authenticate(formatEmail(email), password).then(
        () => {
          setIsLoading(false);
          if (
            authStore.isAgencyAdminUser() ||
            authStore.isAdvertiserAdminUser() ||
            authStore.isAdvertiserUserUser() ||
            authStore.isAgencyRepUser()
          ) {
            navigationService.goToNcmCampaignLandingPage();
          }
          if (authStore.isSuperAdminUser()) {
            navigationService.goToAgency();
          }
          if (authStore.isQuantAdminUser()) {
            navigationService.goToTradesAction();
          }
          if (authStore.isNetworkAdminUser()) {
            if (authStore.userObj.related_data.network.name === "vizio_fox") {
              navigationService.goToFoxImpressionData();
            } else if (authStore.isCbsNetworkAdminUser()) {
              navigationService.goToCbsNetworkLanding();
            } else if (authStore.isFoxNetworkAdminUser()) {
              navigationService.goToFoxNetworkLanding();
            } else if (authStore.isUnivisionNetworkAdminUser()) {
              navigate("/dash");
              //navigationService.goToUnivisionLanding();
            } else {
              navigationService.goToNetworkLanding();
            }
          }
          if (authStore.isOperatorAdminUser()) {
            if (authStore.userObj.related_data.operator.name === "dish") {
              navigationService.goToOperatorLanding();
            } else if (
              authStore.userObj.related_data.operator.name === "vizio"
            ) {
              navigationService.goToVizioLanding();
            } else if (
              authStore.userObj.related_data.operator.name === "xandr"
            ) {
              navigationService.goToXandrLanding();
            }
          }
        },
        (err) => {
          setErrorMessage(err);
          setIsLoading(false);
        }
      );
    };
    const onForgotPassword = () => {
      navigationService.goToForgotPassword();
    };
    const onInputChange = () => {
      if (errorMessage) {
        setErrorMessage("");
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        onLogin();
      }
    };
    return (
      <>
        <LoginHeaderWrapper>
          <img src={Logo} alt="Logo of Adcuratio" className="image-logo" />
        </LoginHeaderWrapper>
        <AuthWrapper>
          <AuthTitle>Adcuratio Login</AuthTitle>
          <div>
            <AuthInput
              type="email"
              placeholder="Email Address"
              ref={emailRef}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
            />
            <AuthInput
              type="password"
              placeholder="Password"
              ref={passwordRef}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
            />
            {errorMessage ? (
              <div className="alert alert-danger">{errorMessage}</div>
            ) : null}
            <div className="flex-container2 mt20">
              <Link to="/forgot-password">
                <p className="cursor-pointer">Forgot Password?</p>
              </Link>

              <CustomButton
                buttonText="LOGIN"
                type="ternary"
                handleButtonClick={onLogin}
              />
            </div>
          </div>
        </AuthWrapper>
        {/* <ReactLoader isLoading={isLoading} /> */}
      </>
    );
  })
);
Login.propTypes = {
  navigationService: PropTypes.object.isRequired,
  authStore: PropTypes.object,
};
export default Login;
