import * as React from "react";
import "./Modal.scss";

class Modal extends React.Component {
  render() {
    return (
      <div>
        <div
          className="demo-modal-bg"
          style={{ display: this.props.show ? "flex" : "none" }}
          onClick={this.props.close}
        >
          <div className="demo-modal">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default Modal;
