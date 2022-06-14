import React, { useState, useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Routes, Route } from "react-router-dom";

const MainContent = inject("authStore")(
  observer((props) => {
    const { authStore } = props;

    const getAuthenticatedRoutes = () => {
      const userRoles = authStore.getUser().userRole;
      console.log(userRoles);
    };

    getAuthenticatedRoutes();
    return (
      <div>
        <h1>this is main layout!</h1>
      </div>
    );
  })
);

export default MainContent;
