import React from "react";
import Game from "../../../components/Game";
import Rule from "../../../components/Rule";
import Modal from "../../../components/Modal/Modal";
import "./View.scss";

export const View = (props) => (
  <div>
    <Game data={props}>
      <div className="d-flex justify-content-between mb-2">
        <div className="cmd-tip">
          <span id="start" className="mr-4">
            Start(Enter)
          </span>
          <span className="mr-4">Help(Space)</span>
          <span id="sound" data="on">
            Mute(M)
          </span>
        </div>
        <div className="page-name">Game</div>
      </div>
    </Game>

    <Modal show={props.store.isRuleShow}>
      <Rule show={props.store.isRuleShow} />
    </Modal>
  </div>
);

export default View;
