import { message } from "antd";
import request from "../utils/request";

export const initialState = {
  appList: []
};

export const SAVE_APP_LIST = "SAVE_APP_LIST";

export const saveAppList = payload => ({
  type: SAVE_APP_LIST,
  payload
});

export default function loginReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SAVE_APP_LIST:
      return {
        ...state,
        appList: payload
      };
    default:
      return state;
  }
}

// 从后台获取更新所有AppList
export const getAppList = () => async dispatch => {
  try {
    const res = await request("/customApplication/list", {
      // method: "POST",
      // data: {
      //   page: "1",
      //   size: "10"
      // }
    });
    if (res && res.status === "SUCCESS") {
      dispatch(saveAppList(res.data));
    } else {
      message.error(res.status || "获取应用列表失败");
    }
  } catch (err) {
    message.error(
      (err.response && err.response.data && err.response.data.msg) ||
        "获取应用列表失败"
    );
  }
};
