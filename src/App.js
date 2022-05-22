import "./App.css";
import { Link } from "react-router-dom";
import store from "./store";
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Invoices from "./routes/invoices";
import Expenses from "./routes/expenses";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import "./styles/master.css";

import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

function App() {
  return (
    <Provider {...store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        {/* <div className="App">
          <header className="App-header">
            <h1>Adcuratio Home</h1>
            <nav>
              <Link to="/invoices">Invoices</Link> |{" "}
              <Link to="/expenses">Expenses</Link>
            </nav>
          </header>
        </div> */}
      </BrowserRouter>
    </Provider>
  );
}

export default App;
