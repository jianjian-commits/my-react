import axios from "axios";
import { instanceAxios } from "../../../../utils/tokenUtils";
import coverTimeUtils from "../../../../utils/coverTimeUtils";
import config from "../../../../config/config";
import { message } from "antd";
import { RECIVE_FORMS, GET_APPROVE_LIST_COUNT, CLEAR_APPROVE_COUNT} from "../action";

export const deleteForm = ( appId, formId ) => {
  return new Promise((resolve,reject)=>{
    axios({
      url: config.apiUrl + `/form/${formId}`,
      method: "DELETE",
      headers:{
        appid:appId
      }
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      });
  })
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
        `/form?limit=${pageSize}&skip=${(currentPage - 1) *
        pageSize}&desc=createdTime`,
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
              created: coverTimeUtils.localDate(
                item.createdTime
              ),
              modified: coverTimeUtils.localDate(
                item.updateTime
              ),
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
  });
};

export const getFormsAll = (appId, isDataPage , extraProp) => {
  let paramsObj = null;
  if(extraProp){
    paramsObj = {
      extraProp
    }
  }
  let headerObj = {
    "Content-Type": "application/json",
    appid: appId,
  };
  if (isDataPage == true) {
    headerObj.isDataPage = true
  }
  return new Promise((resolve, reject) => {
    axios({
      url: config.apiUrl + `/formAndDashboard/list`,
      method: "post",
      headers: headerObj,
      params:paramsObj
    })
      .then(response => {
        const forms = response.data.data
          .map(item => {
            return {
              key: item.id,
              name: item.name,
              id: item.id,
              type: item.type
            };
          });
        resolve(forms);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

export const getFormsByFormId = formId => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.apiUrl + "/form/" + formId,
      method: "get"
    })
      .then(response => {
        const forms = response.data;
        resolve(forms);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};

export const updateFormName = (appId,formId,params={}) =>{
  return new Promise((resolve,reject)=>{
    axios({
      url: config.apiUrl + `/form/${formId}`,
      method: "PATCH",
      headers:{
        appid:appId
      },
      data:{...params}
    })
      .then(response => {
        resolve(response)
      })
      .catch(err => {
        reject(err)
      });
  })
}
export const getApproveCount = (appId) =>dispatch =>{
  return new Promise((resolve, reject) =>{
    axios({
      url: config.apiUrl + "/flow/history/approval/count",
      headers:{appid: appId},
      method: "get"
    })
      .then(response => {
        dispatch({
          type: GET_APPROVE_LIST_COUNT,
          approveListCount: response.data.data
        })
        // resolve(response.data.data);
      })
      .catch(err => {
        console.log(err);
        // reject(err);
      });
  })
}

export const clearApproveCount = () => dispatch =>{
  dispatch({
    type: CLEAR_APPROVE_COUNT
  })
}