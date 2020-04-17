import { message } from "antd";

export const authorityIsValid = ({ debug, permissions, teamId, auth }) => {
  if (debug) return true;
  if (!auth) return true;
  if (permissions.includes(`${teamId}:*:*:*:*:*`)) return true;
  if (permissions.includes(`${teamId}:${auth}`)) return true;
};

export function catchError(err) {
  message.error(
    (err.response && err.response.data && err.response.data.msg) || "系统错误"
  );
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

export class ScheduleCreate {
  constructor(params) {
    this.dispatch = null;
    this.fetchCoding = null;
    this.fetchCodeEnd = null;
    this.num = null;
    this.int = null;
    this.init(params);
  }
  init(params) {
    if (params) {
      const { dispatch, fetchCoding, fetchCodeEnd } = params;
      this.dispatch = dispatch;
      this.fetchCoding = fetchCoding;
      this.fetchCodeEnd = fetchCodeEnd;
      this.num = 59;
    }
  }
  interval(timeOut){
    const int = setInterval(() => {
      this.dispatch(this.fetchCoding(`重新发送（${this.num}s）`));
      this.interval = this.num
      this.num = this.num - 1;
    }, timeOut);
    this.int = int
  }
  clear(timeOut){
    setTimeout(() => {
      clearInterval(this.int);
      this.dispatch(this.fetchCodeEnd());
      this.num = null
    }, timeOut);
  }

}
