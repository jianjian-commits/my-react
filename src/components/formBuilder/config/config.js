const isProd = true;
const apiUrl = isProd
  ? "http://192.168.3.43:8200"
  : "http://192.168.3.150:8080"; // 27017
const hostIp = isProd ? "http://192.168.3.103:9021" : "http://192.168.3.146";
const port = "8001";

const config = {
  port,
  apiUrl,
  hostUrl: `${hostIp}:${port}`,
  loginData: {
    data: {
      email: "123@123.com",
      password: "123",
      submit: true
    },
    state: "submitted"
  }
};
export default config;
