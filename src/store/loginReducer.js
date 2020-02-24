import { message } from "antd";
import request from "../utils/request";

export const initialState = {
  isLoading: false,
  loginData: null,
  isAuthenticated: !!localStorage.getItem("id_token"),
  userDatas: (JSON.parse(localStorage.getItem("userData")) || []).filter(
    l => localStorage.getItem("id_token") === l.username
  )[0],
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

export const fetchDatas = () => dispatch => {
  const res = (JSON.parse(localStorage.getItem("userData")) || []).filter(
    l => localStorage.getItem("id_token") === l.username
  )[0];
  dispatch(loginSuccess(res));
};

export const loginUser = ({ actionType, rest }) => async dispatch => {
  dispatch(startLogin());
  try {
    const res = await request("/login", {
      method: "post",
      data: { loginType: "PASSWORD", ...rest }
    });
    if (res && res.status === "SUCCESS") {
      request(`/team/sysUser/${res.data}`).then(result => {
        if (result && result.status === "SUCCESS") {
          setTimeout(() => {
            localStorage.setItem("id_token", 1);
            message.success("登陆成功");
            dispatch(loginSuccess(result.data));
          }, 100);
        } else {
          message.error("获取数据失败");
        }
      });
    } else {
      dispatch(loginFailure());
      message.error("账号密码信息不匹配,请重试");
    }
  } catch (err) {
    dispatch(loginFailure());
    message.error("登陆失败,请重试");
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
        loginData: payload
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
