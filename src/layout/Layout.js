import React, { useState, useEffect } from "react";
import Header from "./header/header";
import Sidebar from "./sidebar/Sidebar";
import { useLocation } from "react-router-dom";

const Layout = (props) => {
  const history = useLocation();
  console.log(history.pathname);
  return (
    <div>
      <Header />
      {/* <Sidebar /> */}
    </div>
  );
};

export default Layout;
