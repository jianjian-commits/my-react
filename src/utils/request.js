// 封装一个axios的实例
import Axios from "axios";
import { serverHost, port } from "./config";

// Axios.defaults.headers.post["content-type"] = "application/json";
// 创建一个新的实例
export let r = Axios.create({
  baseURL: `http://${serverHost}${port ? ":" + port : ""}`
});
r.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

let request = function(url = "", options = {}) {
  return r({
    url,
    method: "get", // method先给一个get请求
    ...options // options中有method就会覆盖,
  });
};

export default request;
