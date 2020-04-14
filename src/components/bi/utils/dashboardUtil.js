import request from "./request";

export const getDashboardAll = (appId) => {
  return new Promise((resolve, reject) => {
    request(`/bi/dashboards`)
      .then(res => {
        if (res && res.msg === "success") {
          resolve(res.data.items);
        }
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
