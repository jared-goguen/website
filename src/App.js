import React from "react";
import { BrowserRouter } from "react-router-dom";
import Logo from "./logo.svg";
import SiteHeader from "./common/_components/site_header";
import "./App.scss";

const App = () => (
  <BrowserRouter>
    <div className="App">
      <SiteHeader />
      <div className="App-holder">
        <Logo className="App-logo" alt="logo" />
      </div>
    </div>
  </BrowserRouter>
);

export default App;
