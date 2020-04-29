import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
import {message} from "antd";
import axios from "axios";

import { RECEIVED_FORM_DATA, RECEIVED_FORM_DETAIL, Filter_FORM_DATA, CLEAR_FORM_DETAIL } from "../action";


// 获取提交数据总数
var getSubmissionDataTotal = resp => {
  let contentRangeValue = resp.headers["content-range"];
  if(contentRangeValue){
    const index = contentRangeValue.indexOf("/");
    return Number(contentRangeValue.substr(index + 1));
  }else{
    return 20;
  }
};


const filterData = (formId, filterStr, pageSize, currentPage,appId) => {
  let queryData = pageSize === -1 ?
   `/form/${formId}/submission?${filterStr}` 
   :`/form/${formId}/submission?${filterStr}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`; 
  return instanceAxios
    .get(
      encodeURI( config.apiUrl + queryData),
      {
        headers: {
          // "X-Custom-Header": "ProcessThisImmediately",
          "Content-Type": "application/json",
          appid: appId,
          "isDataPage": true,
        }
      }
    )
}


export const getFilterSubmissionData = (args) => dispatch => {
  const {formId, filterArray, connectCondition = "&", pageSize, currentPage, totalNumber = -1,appId, callback} = args;
  callback(true);
  let filterStr = "";
  if (connectCondition === "&") {
    filterStr = filterArray.join(connectCondition);
    filterData(formId, filterStr, pageSize, currentPage,appId).then(res => {
      callback(false);
      dispatch({
        type: Filter_FORM_DATA,
        submissionDataTotal: (totalNumber === -1 || getSubmissionDataTotal(res) < totalNumber) ? getSubmissionDataTotal(res) :totalNumber,
        formData: res.data.map(item => {
          let extraProp = item.extraProp? item.extraProp: { user :{id:"",name:""}}
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            extraProp: extraProp,
            id: item.id
          }
        })
      });
    }).catch((error)=> {
      callback(false);
      if (error.response) {
           message.error(error.response.data.msg);
         }
    });
  } else {
    axios.all(filterArray.map(filter => {
      return filterData(formId, filter, -1, 1)
    })).then(axios.spread((...data) => {
      const filterdata = data.map(data => data.data);
      const allSubmission = filterdata.flat();
      const submissionKeys = allSubmission.map(item => {
        return item.id
      });
      const filterSubmisstion = [...new Set(submissionKeys)].map(key => {
        return allSubmission.filter(item => {
          return item.id === key
        })[0]
      })
      callback(false);
      dispatch({
        type: Filter_FORM_DATA,
        submissionDataTotal:(totalNumber === -1 || totalNumber>filterSubmisstion.length) ? filterSubmisstion.length : totalNumber,
        formData: filterSubmisstion.map(item => {
          let extraProp = item.extraProp? item.extraProp: { user :{id:"",name:""}}
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            extraProp: extraProp,
            id: item.id
          }
        })
      });
    })).catch((error)=> {
      callback(false);
      if (error.response) {
        message.error(error.response.data.msg);
      }
    });
  }

}
//获取提交的数据
export const getSubmissionData = (params) => dispatch => {
  const {  appId, formId, pageSize, currentPage, total = -1, callback } = params
  callback(true);
  axios.get(config.apiUrl + `/form/${formId}`,{headers:{appid:appId,"isDataPage":true}}).then(res => {
    let forms = res.data;
    instanceAxios
      .get(
        config.apiUrl +
        `/form/${formId}/submission?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&desc=createdTime`,
        {
          headers: {
            "Content-Type": "application/json",
            appid:appId,
            "isDataPage": true,
          }
        }
      )
      .then(res => {
        callback(false);
        dispatch({
          type: RECEIVED_FORM_DATA,
          forms,
          submissionDataTotal: total === -1 || total > getSubmissionDataTotal(res) ? getSubmissionDataTotal(res) : total,
          formData: res.data.map(item => {
            let extraProp = item.extraProp? item.extraProp: { user :{id:"",name:""}}
            return {
              data: item.data,
              id: item.id,
              created: item.createdTime,
              modified: item.updateTime,
              extraProp: extraProp
            }
          })
        });
      }).catch(err=>{
        message.error("数据加载失败，请重试!");
        dispatch({
          type: RECEIVED_FORM_DATA,
          forms,
          submissionDataTotal: -1,
          formData: []
        });
        callback(false);
      });
  }).catch(err =>{
    message.error("数据加载失败，请重试!");
    dispatch({
      type: RECEIVED_FORM_DATA,
      forms: { components: [], name: "" },
      submissionDataTotal: -1,
      formData: []
    });
    callback(true);
  });
};

// 获得表单数据详情
export const getSubmissionDetail = (formId, submissionId, appId, callback) => dispatch => {
  callback(true);
  return axios.get(config.apiUrl + `/form/${formId}`,
  {   
    headers:{
      appid:appId,
      "isDataPage": true,
    }
  }
  ).then(res => {
    let currentForm = res.data;

    instanceAxios
      .get(
        config.apiUrl + `/submission/${submissionId}`,
        {
          headers: {
            "Content-Type": "application/json",
            appid: appId,
            "isDataPage": true,
          }
        }
      )
      .then(res => {
        instanceAxios.get(
          config.apiUrl + `/flow/history/approval/${submissionId}`,{
            headers:{
              appid: appId,
              formid: formId,
              "isDataPage": true,
            }
          }
        ).then(response =>{
          callback(false);
            dispatch({
              type: RECEIVED_FORM_DETAIL,
              forms: currentForm,
              formDetail: res.data.data,
              extraProp: res.data.extraProp,
              taskData: response.data.data,
              createdTime: res.data.createdTime,
              updateTime: res.data.updateTime,
              creator: res.data.extraProp.user.name
            });
        }).catch(err=>{
          callback(false);
          dispatch({
            type: RECEIVED_FORM_DETAIL,
            forms: currentForm,
            formDetail: res.data.data,
            extraProp: res.data.extraProp,
            taskData: []
          });
          message.error("获取审批流水失败",err.response.data.msg)
        })
      }).catch(err=>{
        callback(false);
        dispatch({
          type: RECEIVED_FORM_DETAIL,
          forms: currentForm,
          formDetail: {},
          extraProp: {},
          taskData: []
        });
        message.error("获取数据详情失败",err.response.data.msg)
      });
  }).catch(err=>{
    callback(false);
    dispatch({
      type: RECEIVED_FORM_DETAIL,
      forms: { components: [], name: "" },
      formDetail: {},
      extraProp: {},
      taskData: []
    });
    message.error("获取元数据失败",err.response.data.msg)
  }).catch(err=>{
    callback(false);
    message.error(err.response.data.msg)
  });
};

// 修改表单数据详情
export const modifySubmissionDetail = (formId, submissionId, formData, appid, extraProp, newExtraProp) => dispatch => {
  extraProp.updateUser = newExtraProp.user;
  return instanceAxios({
    url: config.apiUrl + `/submission/${submissionId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      appid:appid,
      "isDataPage": true,
    },
    data: {
      data: formData,
      formId: formId,
      extraProp
    }
  });
};

export const handleStartFlowDefinition = (formId, appId, data) => dispatch =>{
  return instanceAxios({
    url: config.apiUrl + `/flow/approval/start`,
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "application/json",
      appid: appId,
      formid: formId,
      "isDataPage": true,
    }
  })
}
