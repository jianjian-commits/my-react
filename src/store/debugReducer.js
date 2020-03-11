export const initialState = {
  debugEnable: true,
  isOpen: false
};

export const SET_DEGUB = "SET_DEGUB";

export const setDebug = payload => ({
  type: SET_DEGUB,
  payload
});

export default function debugReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_DEGUB:
      return {
        ...state,
        isOpen: payload
      };
    default:
      return state;
  }
}
