import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Sidebar from "./sidebar/Sidebar";
import {
  NavLink,
  useLocation,
  useNavigate,
  Route,
  Routes,
} from "react-router-dom";
import { Layout } from "antd";
import MainContent from "./content/Content";
import { Outlet } from "react-router-dom";

const MainLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("univision-network-admin/landing");
  }, []);

  return (
    <Layout>
      <Header />
      <Sidebar />
      <div
        className="main-container-wrapper main"
        id="main"
        style={{ padding: "0 24px 24px", marginTop: 64, marginLeft: "200px" }}
      >
        <MainContent />
      </div>
    </Layout>
  );
};

console.log(<MainLayout />);

export default MainLayout;
