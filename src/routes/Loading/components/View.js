import React from "react";
import Loading from "../../../components/Loading";

export const View = (props) => (
  <Loading data={props}>
    <div className="d-flex justify-content-between mb-2">
      <div></div>
      <div className="page-name">Loading</div>
    </div>
  </Loading>
);

export default View;
