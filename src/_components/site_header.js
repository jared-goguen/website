import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { cx } from "../utils";
import { rootItem, headerItems } from "../constants";
import "./site_header.scss";

const TitleHeaderItem = ({ title, path }) => (
  <div className="SiteHeader-title">
    <NavLink exact to={path} activeClassName="SiteHeader-navActive">
      {title}
    </NavLink>
  </div>
);

TitleHeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
};

const HeaderItem = ({ title, path, options }) => (
  <div className={cx("SiteHeader-item", options)}>
    <NavLink to={path} activeClassName="SiteHeader-navActive">
      {title}
    </NavLink>
  </div>
);

HeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
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
        <TitleHeaderItem {...rootItem} />
      </div>
      <div className="SiteHeader-item-holder">
        {headerItems.map(item => <HeaderItem key={item.name} {...item} />)}
      </div>
    </div>
  </div>
);

export default SiteHeader;
