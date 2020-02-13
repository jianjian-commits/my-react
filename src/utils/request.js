// 封装一个axios的实例
import axios from "axios";
import { serverHost, port } from "../config";

const baseURL = `${serverHost}${port ? ":" + port : ""}`;

async function ajax(url, params) {
  const headers = params.headers || {};
  headers["Content-Type"] = "application/json" || params.contentType;
  try {
    const res = await axios({
      url: `${baseURL}${url}`,
      timeout: params.timeout || 4000,
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
