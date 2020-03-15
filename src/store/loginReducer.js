import { message } from "antd";
import request from "../utils/request";
import { getAppList } from "./appReducer";

export const initialState = {
  isLoading: false,
  loginData: null,
  isAuthenticated: !!localStorage.getItem("id_token"),
  currentTeam: JSON.parse(localStorage.getItem("currentTeam")) || {},
  userDetail: JSON.parse(localStorage.getItem("userDetail")) || {},
  allTeam: JSON.parse(localStorage.getItem("allTeam")) || [],
  error: null,
  isSpinning: false
};

export const START_SPINNING = "Login/START_SPINNING";
export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const RESET_ERROR = "Login/RESET_ERROR";
export const LOGIN_USER = "Login/LOGIN_USER";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";
export const FETCH_ALL_TEAM = "Login/FETCH_ALL_TEAM";
export const FETCH_CURRENT_TEAM = "Login/FETCH_CURRENT_TEAM";
export const FETCH_USER_DETAIL = "Login/FETCH_USER_DETAIL";

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

//转换当前团队
export const switchCurrentTeam = teamId => async dispatch => {
  try {
    const res = await request(`/team/${teamId}/currentTeam`, { method: "put" });
    if (res && res.status === "SUCCESS") {
      dispatch(getCurrentTeam());
      dispatch(getUserDetail());
      dispatch(getAppList());
    } else {
      message.error("团队转换失败");
    }
  } catch (error) {
    message.error("团队转换失败");
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
      message.error("个人信息修改失败");
    }
  } catch (error) {
    message.error("个人信息修改失败");
  }
};

//获取个人信息
export const getUserDetail = () => async dispatch => {
  try {
    const res = await request(`/sysUser/current`);
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("userDetail", JSON.stringify(res.data));
      dispatch(fetchUserDetail(res.data));
    } else {
      message.error("个人信息获取失败");
    }
  } catch (error) {
    message.error("个人信息获取失败");
  }
};

//获取当前团队信息
export const getCurrentTeam = () => async dispatch => {
  try {
    const res = await request(`/team/current`);
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("currentTeam", JSON.stringify(res.data));
      dispatch(fetchCurrentTeam(res.data));
    } else {
      message.error("团队信息获取失败");
    }
  } catch (err) {
    message.error("团队信息获取失败");
  }
};

//获取所有团队信息
export const getAllTeam = () => async dispatch => {
  try {
    const res = await request(`/team/currentSysUser/all`);
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("allTeam", JSON.stringify(res.data));
      dispatch(fetchAllTeam(res.data));
    } else {
      message.error("获取全部团队信息失败");
    }
  } catch (err) {
    message.error("获取全部团队信息失败");
  }
};

//初始化所有信息
export const initAllDetail = () => async dispatch => {
  try {
    const res = await request("/sysUser/current");
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("userDetail", JSON.stringify(res.data));
      await getAllTeam(res.data.id)(dispatch);
      getCurrentTeam()(dispatch);
      dispatch(fetchUserDetail(res.data));
    } else {
      message.error("获取当前用户信息失败");
    }
  } catch (error) {
    message.error("获取当前用户信息失败");
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
    } else {
      dispatch(loginFailure());
      message.error("账号密码信息不匹配,请重试");
    }
  } catch (err) {
    dispatch(loginFailure());
    message.error("账号密码信息不匹配,请重试");
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
      message.error("退出失败");
    }
  } catch (err) {
    message.error("退出失败");
  }
};

export default function loginReducer(state = initialState, { type, payload }) {
  switch (type) {
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
    default:
      return state;
  }
}
