import axios from "axios";
import { HOST_IP } from "../config";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${HOST_IP}`;
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.status === "UNAUTHENTICATED"
    ) {
      if (localStorage.getItem("id_token")) localStorage.removeItem("id_token");
    }
    return Promise.reject(error);
  }
);

async function request(url, params = {}) {
  const headers = params.headers || {};
  const res = await axios({
    url,
    headers,
    data: params.data || {},
    params: params.params || {},
    method: params.method || "GET"
  });
  return res.data;
}
export default request;

export const requestWithHeaders = ({ ...headers }) => {
  debugger;
  const ins = axios.create({
    // baseURL: "http://192.168.3.106:9080",
    headers: {
      ...headers
    }
  });
  return async (url, params = {}) => {
    const headers = params.headers || {};
    const res = await ins({
      url,
      headers,
      data: params.data || {},
      params: params.params || {},
      method: params.method || "GET"
    });
    return res.data;
  };
};
