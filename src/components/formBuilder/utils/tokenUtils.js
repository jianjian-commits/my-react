import axios from "axios";
import config from "../config/config";

let instanceAxios;

// const instance = token => {
//   return axios.create({
//     // baseURL: config.apiUrl + "/user/login/submission?live=1",
//     headers: {
//       "Content-Type": "application/json",
//       "x-jwt-token": token
//     }
//   });
// };

const instance = () => {
  return axios.create({
    // baseURL: config.apiUrl + "/user/login/submission?live=1",
    headers: {
      "Content-Type": "application/json",
    }
  });
};

export const getToken = () => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.apiUrl + "/user/login/submission?live=1",
      method: "post",
      data: config.loginData,
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        let token = response.headers["x-jwt-token"];
        resolve(token);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const initToken = () => {
  return new Promise((resolve, reject) => {
    if (!instanceAxios) {
      getToken()
        .then(token => {
          instanceAxios = instance(token);
          resolve(instanceAxios);
        })
        .catch(err => {
          console.error(err);
          reject();
        });
    } else {
      resolve(instanceAxios);
    }
  });
};


instanceAxios = instance();

export {instanceAxios};
