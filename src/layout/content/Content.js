//import React, { useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Routes, Route } from "react-router-dom";
import { routes } from "../../routes/routes";
import { Layout } from "antd";

const { Content } = Layout;

const MainContent = inject("authStore")(
  observer((props) => {
    const { authStore } = props;

    const getAuthenticatedRoutes = () => {
      const userRoles = authStore.getUser().userRole;
      const allowedRoutes = routes.filter(
        (route) => route?.roles && route?.roles === userRoles
      );
      return [...allowedRoutes];
    };

    return (
      <Content>
        <Routes>
          {getAuthenticatedRoutes().map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
        {/* {uiStore.getIsLoading && <Loader />} */}
      </Content>
    );
  })
);

export default MainContent;
