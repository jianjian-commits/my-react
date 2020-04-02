import axios from "axios";
import { HOST_IP } from "../config";
import store from "../store";
import { signOut } from "../store/loginReducer";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `${HOST_IP}`;

axios.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.status === "UNAUTHENTICATED"
    ) {
      store.dispatch(signOut());
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
  const ins = axios.create({
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
