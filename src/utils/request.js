// 封装一个axios的实例
import axios from "axios";
import { serverHost, port } from "../config";

const baseURL = `${serverHost}${port ? ":" + port : ""}`;

async function ajax(url, params = {}) {
  const headers = params.headers || {};
  headers["Content-Type"] = "application/json" || params.contentType;
  try {
    const res = await axios({
      url: `${baseURL}${url}`,
      headers,
      data: params.data || {},
      params: params.params || {},
      method: params.method || "GET"
    });
    console.log("fetch options", params);
    console.log("fetch res", res);
    return res.data;
  } catch (error) {
    return console.log(error);
  }
}

export default ajax;

// import Axios from "axios";
// import { serverHost, port } from "./config";

// // Axios.defaults.headers.post["content-type"] = "application/json";
// // 创建一个新的实例
// export let r = Axios.create({
//   baseURL: `${serverHost}${port ? ":" + port : ""}`
// });
// r.interceptors.response.use(
//   response => response.data,
//   error => Promise.reject(error)
// );

// let request = function(url = "", options = {}) {
//   return r({
//     url,
//     method: "get", // method先给一个get请求
//     ...options // options中有method就会覆盖,
//   });
// };

// export default request;
