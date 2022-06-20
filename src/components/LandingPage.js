import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import DashboardButton from "../components/DashboardButton";

const LandingPageContentWrapper = styled.div`
  padding: 40px 60px;
`;

const LandingPageTitle = styled.h3`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 25px;
`;

const LandingPage = (props) => {
  const { landingList } = props;

  return (
    <LandingPageContentWrapper>
      {landingList?.map((division) => (
        <div key={division?.id}>
          <LandingPageTitle>{division?.heading}</LandingPageTitle>
          <div className="flex mb20">
            {division.buttons?.length ? (
              division.buttons.map((button) => {
                return (
                  !button.isHidden && (
                    <DashboardButton
                      key={button.id}
                      buttonText={button.name}
                      ButtonIcon={button.icon}
                      infoSignClass={button.infoClass}
                      handleButtonClick={() =>
                        button.onClickFunction
                          ? button.onClickFunction()
                          : () => {}
                      }
                      buttonIconClass={button.iconClass}
                      buttonClass={button.class}
                      tooltipText={button.tooltipText}
                      isDisabled={button.isDisabled}
                      isGreyOut={button.isGreyOut}
                    ></DashboardButton>
                  )
                );
              })
            ) : (
              <>No buttons for this category</>
            )}
          </div>
        </div>
      ))}
    </LandingPageContentWrapper>
  );
};

LandingPage.propTypes = {
  landingList: PropTypes.array,
};

LandingPage.defaultProps = {
  landingList: [],
};

export default LandingPage;
