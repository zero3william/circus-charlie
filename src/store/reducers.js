import { combineReducers } from "redux";
import locationReducer from "./location";
import pixiReducer from "./pixi";
import ruleReducer from "./rule";

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    pixi: pixiReducer,
    isRuleShow: ruleReducer,
    ...asyncReducers,
  });
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
