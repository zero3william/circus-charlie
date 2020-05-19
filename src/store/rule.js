// ------------------------------------
// Constants
// ------------------------------------
export const RULE_SHOW = "RULE_SHOW";
export const RULE_HIDE = "RULE_HIDE";

// ------------------------------------
// Actions
// ------------------------------------
export function open() {
  return {
    type: RULE_SHOW,
    payload: true,
  };
}

export function close() {
  return {
    type: RULE_HIDE,
    payload: false,
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = false;
export default function ruleReducer(state = initialState, action) {
  return action.type === RULE_SHOW || action.type === RULE_HIDE
    ? action.payload
    : state;
}
