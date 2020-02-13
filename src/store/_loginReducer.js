import { message } from "antd";

export const initialState = {
  isLoading: false,
  register_token: "null",
  isAuthenticated: !!localStorage.getItem("id_token"),
  error: null
};

export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const RESET_ERROR = "Login/RESET_ERROR";
export const LOGIN_USER = "Login/LOGIN_USER";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";

export const startLogin = () => ({
  type: START_LOGIN
});

export const loginSuccess = payload => ({
  type: LOGIN_SUCCESS,
  payload
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE
});

export const resetError = () => ({
  type: RESET_ERROR
});

export const loginUser = ({ actionType, rest }) => dispatch => {
  dispatch(startLogin());
  const users = JSON.parse(localStorage.getItem("register")) || [];
  const user = users.filter(
    u => rest.username === u.username || rest.phone === u.phone
  )[0];

  if (
    actionType === "login" &&
    user &&
    (rest.username
      ? rest.password === user.password
      : rest.verificationCode === user.verificationCode)
  ) {
    setTimeout(() => {
      message.success("登陆成功");
      localStorage.setItem("id_token", "1");
      dispatch(loginSuccess(user));
    }, 2000);
  } else {
    dispatch(loginFailure());
  }
};

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS
});

export const signOut = () => dispatch => {
  localStorage.removeItem("id_token");
  dispatch(signOutSuccess());
};

export default function loginReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_LOGIN:
      return {
        ...state,
        isLoading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        ...payload
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true
      };
    case RESET_ERROR:
      return {
        error: false
      };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      return state;
  }
}
