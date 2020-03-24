import axios from 'axios';
import config from "../../formBuilder/config/config";
import { message } from 'antd';

async function request(url, params = {}) {
  const headers = params.headers || {"Content-Type": "application/json"};
  const res = await axios({
    url: config.apiUrl + url,
    headers,
    data: params.data || {},
    params: params.params || {},
    method: params.method || "GET"
  });

  return res.data;
}

export default request;