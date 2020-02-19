import request from "../utils/request";
import { message } from "antd";

const initialState = {
  userData: null
};

const GET_USER_DETAIL_SUCCESS = "user/GET_USER_DETAIL_SUCCESS";

const getUserDetailSuccess = payload => ({
  type: GET_USER_DETAIL_SUCCESS,
  payload
});

export const getUserDetail = userId => async dispatch => {
  try {
    const res = await request(`/sysUser/${userId}`);
    if (res && res.status === "SUCCESS") {
      dispatch(getUserDetailSuccess(res.data));
    } else {
      message.error("个人信息获取失败");
    }
  } catch (error) {
    message.error("个人信息获取失败");
  }
};

export default function loginReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_USER_DETAIL_SUCCESS:
      return {
        ...state,
        userData: payload
      };
    default:
      return state;
  }
}
