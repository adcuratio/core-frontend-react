import "./App.css";
import { Link } from "react-router-dom";
import store from "./store";
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Invoices from "./routes/invoices";
import Expenses from "./routes/expenses";
import Login from "./auth/Login";

import "./styles/main.css";
import "./styles/common.css";
import "./styles/campaign.css";
import "./styles/exclusion.css";
import "./styles/inventory.css";
import "./styles/new-trade.css";
import "./styles/wanted.css";
import "./styles/card.css";
import "./styles/unwantedGroup.css";
import "./styles/frequency.css";
import "./styles/manage-trade.css";
import "./styles/advertiser-list.css";
import "./styles/custom-trade.css";
import "./styles/new-card.css";
import "./styles/creatives.css";
import "./styles/media-query-resolution.css";
import "./styles/multi-select-dropdown.css";
import "./styles/company-selection.css";

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
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/expenses" element={<Expenses />} />
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
