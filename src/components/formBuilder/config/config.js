const port = "8001";

const config = {
  port,
  apiUrl: process.env.REACT_APP_HOST_IP,
  hostUrl: process.env.REACT_APP_HOST_IP,
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
