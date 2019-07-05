import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import SiteHeader from "./_components/site_header";
import { rootItem, headerRoutes, subRoutes } from "./constants";
import "./App.scss";

const App = () => (
  <BrowserRouter>
    <div className="App">
      <SiteHeader />
      <Route exact path={rootItem.path} component={rootItem.component} />
      {headerRoutes.map(({path, component}) => (
        <Route exact key={path} path={path} component={component} />
      ))}
      {subRoutes.map(({path, component}) => (
        <Route key={path} path={path} component={component} />
      ))}
    </div>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('app'));
