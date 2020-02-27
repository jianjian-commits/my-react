import axios from "axios";
import { instanceAxios } from "../../../../utils/tokenUtils";
import coverTimeUtils from '../../../../utils/coverTimeUtils';
import config from "../../../../config/config";
import { message } from "antd";
import { RECIVE_FORMS } from '../action'

export const deleteForm = formId => dispatch => {
  instanceAxios({
    url: config.apiUrl + `/form/${formId}`,
    method: "DELETE",
  })
    .then(response => {
      response.data === "ok"
        ? (window.location.href = config.hostUrl)
        : message.error("删除失败！", 2);
    })
    .catch(err => {
      console.log(err);
    });
};

let ignoreFormIdArray = ["user", "admin", "userLogin", "userRegister"];


var getFormsTotal = resp => {
  let contentRangeValue = resp.headers["content-range"];
  const index = contentRangeValue.indexOf("/");
  return Number(contentRangeValue.substr(index + 1));
};

export const getForms = (pageSize, currentPage) => dispatch => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        config.apiUrl +
        `/form?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&desc=createdTime`,
      method: "get"
    })
      .then(response => {
        const forms = response.data
          .filter(item => {
            return !ignoreFormIdArray.includes(item.name);
          })
          .map(item => {
            return {
              key: item.id,
              created: coverTimeUtils.localTime(item.createdTime, "yyyy-MM-dd hh:mm"),
              modified: coverTimeUtils.localTime(item.updateTime, "yyyy-MM-dd hh:mm"),
              name: item.name,
              id: item.id,
              path: item.path,
              components: item.components
            };
          });
        dispatch({
          type: RECIVE_FORMS,
          total: getFormsTotal(response),
          forms
        });
        resolve(forms);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  })
};