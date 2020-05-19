import { connect } from "react-redux";
import { appChange } from "../../../store/pixi";
import View from "../components/View";

const mapDispatchToProps = {
  appChange: (app) => appChange(app),
};

const mapStateToProps = (state) => ({
  store: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
