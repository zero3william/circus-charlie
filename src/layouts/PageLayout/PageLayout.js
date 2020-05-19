import React from "react";
import PropTypes from "prop-types";
import "./PageLayout.scss";

export const PageLayout = ({ children }) => (
  <div className="d-flex justify-content-center align-items-center h-100">
    <div id="pixi-container">{children}</div>
  </div>
);
PageLayout.propTypes = {
  children: PropTypes.node,
};

export default PageLayout;
