import { message } from "antd";
import request from "../utils/request";
import { getAppList } from "./appReducer";
import { history } from "./index";
import { clearAppList } from "./appReducer";
import { catchError } from "../utils";

export const initialState = {
  isLoading: false,
  loginData: null,
  isAuthenticated: !!localStorage.getItem("id_token"),
  currentTeam: {},
  userDetail: {},
  fetchRequestSent: false,
  allTeam: [],
  error: null,
  isSpinning: false
};

export const START_SPINNING = "Login/START_SPINNING";
export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
const FETCH_REQUEST_SENT = "Login/FETCH_REQUEST_SENT"
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const RESET_ERROR = "Login/RESET_ERROR";
export const LOGIN_USER = "Login/LOGIN_USER";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";
export const FETCH_ALL_TEAM = "Login/FETCH_ALL_TEAM";
export const FETCH_CURRENT_TEAM = "Login/FETCH_CURRENT_TEAM";
export const FETCH_USER_DETAIL = "Login/FETCH_USER_DETAIL";
export const FETCH_TRANSACT_LIST = "Login/FETCH_TRANSACT_LIST";
export const CLEAR_USER_DATA = "Login/CLEAR_USER_DATA";

export const startSpinning = () => ({
  type: START_SPINNING
});

export const startLogin = () => ({
  type: START_LOGIN
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE
});

export const resetError = () => ({
  type: RESET_ERROR
});

export const fetchAllTeam = payload => ({
  type: FETCH_ALL_TEAM,
  payload
});

export const fetchCurrentTeam = payload => ({
  type: FETCH_CURRENT_TEAM,
  payload
});

export const fetchUserDetail = payload => ({
  type: FETCH_USER_DETAIL,
  payload
});

export const fetchTransactList = payload => ({
  type: FETCH_TRANSACT_LIST,
  payload
});

//获取我的待办
export const getTransactList = ({
  currentPage,
  pageSize
}) => async dispatch => {
  try {
    const res = await request(`/flow/history/approval/todos`, {
      method: "POST",
      data: {
        page: currentPage || 1,
        size: pageSize || 1
      }
    });
    if (res && res.status === "SUCCESS") {
      dispatch(fetchTransactList(res.data));
    } else {
      message.error(res.msg || "待办列表获取失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//转换当前团队
export const switchCurrentTeam = teamId => async dispatch => {
  try {
    const res = await request(`/team/${teamId}/currentTeam`, { method: "put" });
    if (res && res.status === "SUCCESS") {
      history.push("/app/list");
      dispatch(getCurrentTeam());
      dispatch(getUserDetail());
      dispatch(getAppList());
    } else {
      message.error(res.msg || "团队转换失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//更新个人信息
export const updateUserDetail = payload => async dispatch => {
  try {
    const res = await request(`/sysUser`, {
      method: "put",
      data: payload
    });
    if (res && res.status === "SUCCESS") {
      message.success("修改成功");
      await getUserDetail()(dispatch);
    } else {
      message.error(res.msg || "个人信息修改失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//获取个人信息
export const getUserDetail = () => async dispatch => {
  try {
    const res = await request(`/sysUser/current`);
    if (res && res.status === "SUCCESS") {
      dispatch(fetchUserDetail(res.data));
    } else {
      message.error(res.msg || "个人信息获取失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//获取当前团队信息
export const getCurrentTeam = () => async dispatch => {
  try {
    const res = await request(`/team/current`);
    if (res && res.status === "SUCCESS") {
      dispatch(fetchCurrentTeam(res.data));
    } else {
      message.error(res.msg || "团队信息获取失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//获取所有团队信息
export const getAllTeam = () => async dispatch => {
  try {
    const res = await request(`/team/currentSysUser/all`);
    if (res && res.status === "SUCCESS") {
      dispatch(fetchAllTeam(res.data));
    } else {
      message.error(res.msg || "获取全部团队信息失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//初始化所有信息
export const initAllDetail = () => async dispatch => {
  dispatch({ type: FETCH_REQUEST_SENT});
  dispatch({ type: CLEAR_USER_DATA});
  try {
    const res = await request("/sysUser/current");
    if (res && res.status === "SUCCESS") {
      await getAllTeam(res.data.id)(dispatch);
      getCurrentTeam()(dispatch);
      dispatch(fetchUserDetail(res.data));
    } else {
      message.error(res.msg || "获取当前用户信息失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//登录用户
export const loginUser = ({ token, rest, history }) => async dispatch => {
  await dispatch(startLogin());
  try {
    const res = await request(token ? `/login?token=${token}` : "/login", {
      method: "post",
      data: { loginType: "PASSWORD", ...rest }
    });
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("id_token", 1);
      dispatch(loginSuccess());
      dispatch(initAllDetail());
      history.push("/");
    } else {
      dispatch(loginFailure());
      message.error(res.msg || "账号密码信息不匹配,请重试");
    }
  } catch (err) {
    dispatch(loginFailure());
    catchError(err);
  }
};

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS
});

export const signOut = () => async dispatch => {
  try {
    const res = await request(`/logout`, { method: "post", data: {} });
    if (res && res.status === "SUCCESS") {
      localStorage.removeItem("id_token");
      dispatch(signOutSuccess());
    } else {
      message.error(res.msg || "退出失败");
    }
  } catch (err) {
    catchError(err);
  }
};

export default function loginReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR_USER_DATA:
      return {
        ...state,
        currentTeam: {},
        userDetail: {},
        fetchRequestSent: true,
        allTeam: [],
      };
    case START_SPINNING:
      return {
        ...state,
        isSpinning: true
      };
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
        userId: payload
      };
    case FETCH_REQUEST_SENT:
      return {
        ...state,
        fetchRequestSent: true
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
    case FETCH_USER_DETAIL:
      return {
        ...state,
        userDetail: payload
      };
    case FETCH_ALL_TEAM:
      return {
        ...state,
        allTeam: payload
      };
    case FETCH_CURRENT_TEAM:
      return {
        ...state,
        currentTeam: payload
      };
    case FETCH_TRANSACT_LIST:
      return {
        ...state,
        transactList: payload
      };
    default:
      return state;
  }
};


export const loginMiddleware = store => next => action => {
  if (action.type === SIGN_OUT_SUCCESS) {
    store.dispatch(clearAppList());
  }
  next(action);
};


