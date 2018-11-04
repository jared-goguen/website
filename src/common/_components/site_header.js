import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { cxOptions } from "../common_utils";
import * as constants from "../common_constants";
import "./site_header.scss";

const TitleHeaderItem = ({ title }) => (
  <div className="SiteHeader-title">
    <NavLink
      exact
      to={constants.root}
      activeClassName="SiteHeader-navActive"
    >
      {title}
    </NavLink>
  </div>
);

TitleHeaderItem.propTypes = {
  title: PropTypes.string.isRequired
};

const HeaderItem = ({ name, path, options }) => (
  <div className={cxOptions("SiteHeader-item", options)}>
    <NavLink
      to={path}
      activeClassName="SiteHeader-navActive"
    >
      {name}
    </NavLink>
  </div>
);

HeaderItem.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  options: PropTypes.shape({
    border: PropTypes.bool
  })
};

HeaderItem.defaultProps = {
  options: {}
};

const SiteHeader = () => (
  <div className="SiteHeader">
    <div className="SiteHeader-list">
      <div className="SiteHeader-title-holder">
        <TitleHeaderItem title={constants.title} />
      </div>
      <div className="SiteHeader-item-holder">
        {constants.headerItems.map(({ name, path, options }) => (
          <HeaderItem key={name} path={path} name={name} options={options} />
        ))}
      </div>
    </div>
  </div>
);

export default SiteHeader;
