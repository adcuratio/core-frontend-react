import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import loaderimg from "../images/ajax-loader-inv.gif";

const StyledLoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  z-index: 10000;
`;

const StyledPageLoader = styled.div`
  position: fixed;
  width: 52px;
  height: 52px;
  margin: -26px;
  top: 50%;
  left: 50%;
  background: url(${loaderimg}) center center no-repeat rgba(0, 0, 0, 0.8);
  border-radius: 26px;
  z-index: 10000;
`;

const StyledLoaderText = styled.span`
  color: white;
  position: fixed;
  transform: translate(-50%, 200%);
  top: 50%;
  left: 50%;
  z-index: 10001;
  font-size: 16px;
`;

const ReactLoader = (props) => {
  const { isLoading, loaderText } = props;

  if (isLoading) {
    return (
      <div>
        <StyledLoaderOverlay></StyledLoaderOverlay>
        <StyledPageLoader></StyledPageLoader>
        <StyledLoaderText>
          {loaderText ? loaderText : "Waiting for server..."}
        </StyledLoaderText>
      </div>
    );
  }
  return null;
};

ReactLoader.propTypes = {
  isLoading: PropTypes.bool,
  loaderText: PropTypes.string,
};

ReactLoader.defaultProps = {
  isLoading: false,
  loaderText: "",
};

export default ReactLoader;
