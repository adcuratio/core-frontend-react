import React from "react";
import "./App.css";
//import { Link } from "react-router-dom";
import store from "./store";
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/master.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

const Login = React.lazy(() => import("./auth/Login"));
const ForgotPassword = React.lazy(() => import("./auth/ForgotPassword"));
const Layout = React.lazy(() => import("./layout/Layout"));

function App() {
  return (
    <Provider {...store}>
      <BrowserRouter>
        <React.Suspense>
          <Routes>
            <Route exact path="/" name="Login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dash/*" name="Home page" element={<Layout />} />
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
