import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from 'react-bootstrap';
// import ReactLoader from './ReactLoader';

export const MainContent = styled.div`
  padding: 0 10px 10px;
`;

export const PageHeader = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const PageContent = styled(Grid)`
  background-color: white;
  padding: 10px 10px;
  width: 100%;
  min-height: 70%;
`;

export const MainContentWithLoader = (props) => (
  <MainContent>
    {props.children}
    {/* <ReactLoader isLoading={props.isPageLoading} /> */}
  </MainContent>
);

MainContentWithLoader.propTypes = {
  isPageLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
