import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
import {message} from "antd";
import axios from "axios";

import { RECEIVED_FORM_DATA, RECEIVED_FORM_DETAIL, Filter_FORM_DATA } from "../action";


// 获取提交数据总数
var getSubmissionDataTotal = resp => {
  let contentRangeValue = resp.headers["content-range"];
  if(contentRangeValue){
    const index = contentRangeValue.indexOf("/");
    return Number(contentRangeValue.substr(index + 1));
  }else{
    return 0;
  }
};


const filterData = (formId, filterStr, pageSize, currentPage) => {
  let queryData = pageSize === -1 ?
   `/form/${formId}/submission?${filterStr}` 
   :`/form/${formId}/submission?${filterStr}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`; 
  return instanceAxios
    .get(
      encodeURI( config.apiUrl + queryData),
      {
        headers: {
          // "X-Custom-Header": "ProcessThisImmediately",
          "Content-Type": "application/json"
        }
      }
    )
}


export const getFilterSubmissionData = (formId, filterArray, connectCondition = "&", pageSize, currentPage, totalNumber= -1) => dispatch => {
  let filterStr = "";
  if (connectCondition === "&") {
    filterStr = filterArray.join(connectCondition);
    filterData(formId, filterStr, pageSize, currentPage).then(res => {
      dispatch({
        type: Filter_FORM_DATA,
        submissionDataTotal: 10, //(totalNumber === -1 || getSubmissionDataTotal(res) < totalNumber) ? getSubmissionDataTotal(res) :totalNumber,
        formData: res.data.map(item => {
          let extraProp = item.extraProp
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            extraProp: extraProp.user,
            id: item.id
          }
        })
      });
    }).catch((error)=> {
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
      dispatch({
        type: Filter_FORM_DATA,
        submissionDataTotal:(totalNumber === -1 || totalNumber>filterSubmisstion.length) ? filterSubmisstion.length : totalNumber,
        formData: filterSubmisstion.map(item => {
          let extraProp = item.extraProp
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            extraProp: extraProp.user,
            id: item.id
          }
        })
      });
    })).catch((error)=> {
      if (error.response) {
        message.error(error.response.data.msg);
      }
    });
  }

}
//获取提交的数据
export const getSubmissionData = (
  formId,
  pageSize,
  currentPage,
  total = -1
) => dispatch => {
  axios.get(config.apiUrl + `/form/${formId}`).then(res => {
    let forms = res.data;
    let extraProp = forms.extraProp
    instanceAxios
      .get(
        config.apiUrl +
        `/form/${formId}/submission?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&desc=createdTime`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {

        dispatch({
          type: RECEIVED_FORM_DATA,
          forms,
          submissionDataTotal: 10, //total === -1 || total > getSubmissionDataTotal(res) ? getSubmissionDataTotal(res) : total,
          formData: res.data.map(item => {

            return {
              data: item.data,
              id: item.id,
              created: item.createdTime,
              modified: item.updateTime,
              extraProp: extraProp.user
            }
          })
        });
      });
  });
};

// 获得表单数据详情
export const getSubmissionDetail = (formId, submissionId) => dispatch => {
  axios.get(config.apiUrl + `/form/${formId}`).then(res => {
    let currentForm = res.data;

    instanceAxios
      .get(
        config.apiUrl + `/submission/${submissionId}`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(res => {
        console.log("res.data", res.data)
        dispatch({
          type: RECEIVED_FORM_DETAIL,
          forms: currentForm,
          formDetail: res.data.data,
          extraProp: res.data.extraProp
        });
      });
  });
};

// 修改表单数据详情
export const modifySubmissionDetail = (formId, submissionId, formData, appid, extraProp) => dispatch => {
  return instanceAxios({
    url: config.apiUrl + `/submission/${submissionId}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      appid:appid
    },
    data: {
      data: formData,
      formId: formId,
      extraProp
    }
  });
};

export const handleStartFlowDefinition = (userId, appId, data) => dispatch =>{
  console.log("handleStartFlowDefinition")
  instanceAxios({
    url: config.apiUrl + `/flow/approval/start`,
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "application/json",
      appid: appId
    }
  })
    .then(response => {
  
      console.log(response);
    })
    .catch(err => {
      console.log(err)
    });
}