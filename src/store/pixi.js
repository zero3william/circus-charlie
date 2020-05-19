// ------------------------------------
// Constants
// ------------------------------------
export const APP_CHANGE = "APP_CHANGE";

// ------------------------------------
// Actions
// ------------------------------------
export function appChange(app) {
  return {
    type: APP_CHANGE,
    payload: app,
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = null;
export default function pixiReducer(state = initialState, action) {
  return action.type === APP_CHANGE ? action.payload : state;
}
