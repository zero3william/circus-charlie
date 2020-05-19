import { connect } from "react-redux";
import View from "../components/View";
import { open, close } from "../../../store/rule";

const mapDispatchToProps = {
  showRule: () => open(),
  hideRule: () => close(),
};

const mapStateToProps = (state) => ({
  store: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
