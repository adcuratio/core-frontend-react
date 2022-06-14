import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Sidebar from "./sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import MainContent from "./content/Content";

const MainLayout = (props) => {
  const history = useLocation();
  console.log(history.pathname);
  return (
    <Layout>
      <Header />
      <Sidebar />
      <Layout
        style={{ padding: "0 24px 24px", marginTop: 64, marginLeft: 250 }}
      >
        <MainContent />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
