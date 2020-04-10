import { message } from "antd";

export const authorityIsValid = ({ debug, permissions, teamId, auth }) => {
  if (debug) return true;
  if (!auth) return true;
  if (permissions.includes(`${teamId}:*:*:*:*:*`)) return true;
  if (permissions.includes(`${teamId}:${auth}`)) return true;
};

export function catchError(err) {
  if (
    err.response &&
    err.response.data &&
    err.response.data.msg !== "未指定公司"
  )
    message.error(err.response.data.msg);
  message.error("系统错误");
}
// 防抖
export const debounce = (fn, delay) => {
  let timer;
  return function() {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
};

// 节流
export const throttle = (fn, delay) => {
  let last = 0;
  return function() {
    const args = arguments;
    const now = +new Date();
    const offset = now - last;
    if (offset > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
};
