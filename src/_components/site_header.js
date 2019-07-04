import React, { useState } from "react";
import { cold } from "react-hot-loader";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import FlipText from "./flip_text";
import { cx } from "Source/utils";
import { rootItem, headerItems } from "Source/constants";
import "./site_header.scss";

const TitleHeaderItem = ({ title, path }) => (
  <div className="SiteHeader-title">
    <NavLink exact to={path} activeClassName="SiteHeader-navActive">
      <FlipText text={title} />
    </NavLink>
  </div>
);

TitleHeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired
};

const HeaderItem = ({ title, path, options, onClick }) => (
  <div
    onClick={() => setTimeout(onClick, 200)}
    className={cx("SiteHeader-item", options)}
  >
    <NavLink to={path} activeClassName="SiteHeader-navActive" className='SiteHeader-flip'>
      <FlipText text={title} additionalClass='SiteHeader-flip'/>
    </NavLink>
  </div>
);

HeaderItem.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  options: PropTypes.shape({
    border: PropTypes.bool
  }),
  onClick: PropTypes.func
};

HeaderItem.defaultProps = {
  options: {},
  onClick: () => {}
};

const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div className="SiteHeader">
      <div className="SiteHeader-list">
        <TitleHeaderItem {...rootItem} />
        <div className="SiteHeader-hamburger">
          <div className={cx("SiteHeader-hamburger-overlay", { open })}>
            {headerItems.map(item => (
              <HeaderItem key={item.title} onClick={toggleOpen} {...item} />
            ))}
          </div>
        </div>
        <div onClick={toggleOpen} className="SiteHeader-button">
          <span className={cx("SiteHeader-button-span", "top", { open })} />
          <span className={cx("SiteHeader-button-span", "bottom", { open })} />
        </div>
      </div>
    </div>
  );
};

// TODO: Update when fixed: https://github.com/gaearon/react-hot-loader/issues/1088
export default cold(SiteHeader);
