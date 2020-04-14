import { message } from "antd";
import request from "../utils/request";
import { getAppList, clearAppList } from "./appReducer";
// import { history } from "./index";
import { catchError } from "../utils";

export const initialState = {
  isLoading: false,
  loginData: null,
  isAuthenticated: !!localStorage.getItem("id_token"),
  userDetail: {},
  fetchRequestSent: false,
  allCompany: [],
  currentCompany: {},
  error: null,
  isSpinning: false,
  isFetchCoding: false
};

export const START_SPINNING = "Login/START_SPINNING";
export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
export const FETCH_REQUEST_SENT = "Login/FETCH_REQUEST_SENT";
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const RESET_ERROR = "Login/RESET_ERROR";
export const LOGIN_USER = "Login/LOGIN_USER";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";
export const FETCH_ALL_COMPANY = "Login/FETCH_ALL_COMPANY";
export const FETCH_CURRENT_COMPANY = "Login/FETCH_CURRENT_COMPANY";
export const FETCH_USER_DETAIL = "Login/FETCH_USER_DETAIL";
export const FETCH_TRANSACT_LIST = "Login/FETCH_TRANSACT_LIST";
export const CLEAR_USER_DATA = "Login/CLEAR_USER_DATA";
export const FETCH_CODE_START = "Login/FETCH_CODE_START";
export const FETCH_CODING = "Login/FETCH_CODING";
export const FETCH_CODE_END = "Login/FETCH_CODE_END";
export const ALLOW_SEND_CODE = "Login/ALLOW_SEND_CODE";
export const RESET_ALLOW_SEND_CODE = "Login/RESET_ALLOW_SEND_CODE";
export const RESET_SEND_CODE = "Login/RESET_SEND_CODE";

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
export const fetchAllCompany = payload => ({
  type: FETCH_ALL_COMPANY,
  payload
});
export const fetchCurrentCompany = payload => ({
  type: FETCH_CURRENT_COMPANY,
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
export const fetchCodeStart = () => ({
  type: FETCH_CODE_START
});
export const fetchCoding = payload => ({
  type: FETCH_CODING,
  payload
});
export const fetchCodeEnd = () => ({
  type: FETCH_CODE_END
});
export const allowSendCode = () => ({
  type: ALLOW_SEND_CODE
});
export const resetAllowSendCode = () => ({
  type: RESET_ALLOW_SEND_CODE
});

//重置发送验证码按钮状态
export const resetAllowSendCodeState = () => async dispatch => {
  dispatch(resetAllowSendCode());
};

// 发送验证码
export const sendCode = (mobilePhone, codeType) => async dispatch => {
  dispatch(fetchCodeStart());
  if (!mobilePhone) return dispatch(fetchCoding());
  try {
    const res = await request("/code", {
      method: "post",
      data: {
        codeType,
        mobilePhone
      }
    });
    if (res && res.status === "SUCCESS") {
      let num = 59;
      const int = setInterval(() => {
        dispatch(fetchCoding(`重新发送（${num}s）`));
        num = num - 1;
      }, 1000);
      setTimeout(() => {
        clearInterval(int);
        dispatch(fetchCodeEnd());
      }, 60000);
    } else {
      message.error(res.msg || "验证码发送失败，请重试");
    }
  } catch (err) {
    message.error("验证码发送失败，请重试");
    catchError(err);
  }
};

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

//转换当前公司
export const switchCurrentCompany = companyId => async dispatch => {
  try {
    const res = await request(`/company/${companyId}/currentCompany`, {
      method: "put"
    });
    if (res && res.status === "SUCCESS") {
      // history.push("/app/list");
      dispatch(getCurrentCompany());
      dispatch(getUserDetail());
      dispatch(getAppList());
    } else {
      message.error(res.msg || "公司切换失败");
    }
  } catch (err) {
    catchError(err);
  }
};
//获取当前公司信息
export const getCurrentCompany = () => async dispatch => {
  try {
    const res = await request(`/company/current`);
    if (res && res.status === "SUCCESS") {
      dispatch(fetchCurrentCompany(res.data));
    } else {
      message.error(res.msg || "当前公司信息获取失败");
    }
  } catch (err) {
    if (
      err.response &&
      err.response.data &&
      err.response.data.msg !== "未指定公司"
    )
      catchError(err);
  }
};
// 获取所有公司信息
export const getAllCompany = () => async dispatch => {
  try {
    const res = await request(`/company/currentSysUser/all`);
    if (res && res.status === "SUCCESS") {
      dispatch(fetchAllCompany(res.data));
    } else {
      message.error(res.msg || "获取全部公司信息失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//初始化所有信息
export const initAllDetail = () => async dispatch => {
  dispatch({ type: FETCH_REQUEST_SENT });
  dispatch({ type: CLEAR_USER_DATA });
  try {
    const res = await request("/sysUser/current");
    if (res && res.status === "SUCCESS") {
      await getAllCompany(res.data.id)(dispatch);
      getCurrentCompany()(dispatch);
      dispatch(fetchUserDetail(res.data));
    } else {
      message.error(res.msg || "获取当前用户信息失败");
    }
  } catch (err) {
    catchError(err);
  }
};

//登录用户
export const loginUser = ({
  token,
  rest,
  history,
  loginType
}) => async dispatch => {
  await dispatch(startLogin());
  try {
    const res = await request(token ? `/login?token=${token}` : "/login", {
      method: "post",
      data: { loginType: loginType, ...rest }
    });
    if (res && res.status === "SUCCESS") {
      localStorage.setItem("id_token", 1);
      dispatch(loginSuccess());
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
        currentCompany: {},
        userDetail: {},
        fetchRequestSent: true,
        allCompany: []
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
    case FETCH_ALL_COMPANY:
      return {
        ...state,
        allCompany: payload
      };
    case FETCH_CURRENT_COMPANY:
      return {
        ...state,
        currentCompany: payload
      };
    case FETCH_TRANSACT_LIST:
      return {
        ...state,
        transactList: payload
      };
    case FETCH_CODE_START:
      return {
        ...state,
        isFetchCoding: true,
        fetchText: `重新发送（60s）`
      };
    case FETCH_CODING:
      return {
        ...state,
        fetchText: payload
      };
    case FETCH_CODE_END:
      return {
        ...state,
        isFetchCoding: false,
        fetchText: null
      };
    case ALLOW_SEND_CODE:
      return {
        ...state,
        allowSendCode: true
      };
    case RESET_ALLOW_SEND_CODE:
      return {
        ...state,
        allowSendCode: false
      };
    default:
      return state;
  }
}

export const loginMiddleware = store => next => action => {
  if (action.type === FETCH_CURRENT_COMPANY) {
    store.dispatch(getAppList());
  }
  if (action.type === SIGN_OUT_SUCCESS) {
    store.dispatch(clearAppList());
  }
  next(action);
};
