import axios from "axios";
import { serverHost, port } from "../config";

const baseURL = `${serverHost}${port ? ":" + port : ""}`;

axios.defaults.withCredentials = true;

async function request(url, params = {}) {
  const headers = params.headers || {};
  headers["Content-Type"] = "application/json" || params.contentType;
  const res = await axios({
    url: `${baseURL}${url}`,
    // timeout: params.timeout || 4000,
    headers,
    data: params.data || {},
    params: params.params || {},
    method: params.method || "GET"
  });
  console.log("fetch options", params);
  console.log("fetch res", res);
  return res.data;
}

export default request;
