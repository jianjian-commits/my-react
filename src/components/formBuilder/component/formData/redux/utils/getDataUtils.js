import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
import {message} from "antd";
import axios from "axios";

import { RECEIVED_FORM_DATA, RECEIVED_FORM_DETAIL, Filter_FORM_DATA } from "../action";


// 获取提交数据总数
var getSubmissionDataTotal = resp => {
  let contentRangeValue = resp.headers["content-range"];
  const index = contentRangeValue.indexOf("/");
  return Number(contentRangeValue.substr(index + 1));
};


const filterData = (formPath, filterStr, pageSize, currentPage) => {
  let queryData = pageSize === -1 ?
   `/${formPath}/submission?${filterStr}` 
   :`/${formPath}/submission?${filterStr}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`; 
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


export const getFilterSubmissionData = (formPath, filterArray, connectCondition = "&", pageSize, currentPage, totalNumber= -1) => dispatch => {
  let filterStr = "";
  if (connectCondition === "&") {
    filterStr = filterArray.join(connectCondition);
    filterData(formPath, filterStr, pageSize, currentPage).then(res => {
      dispatch({
        type: Filter_FORM_DATA,
        submissionDataTotal: (totalNumber== -1 || getSubmissionDataTotal(res) < totalNumber) ? getSubmissionDataTotal(res) :totalNumber,
        formData: res.data.map(item => {
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            id: item.id
          }
        })
      });
    }).catch((error)=> {
      if (error.response && error.response.data.code === 9999 ) {
           message.error("查询条件矛盾，请检查");
         }
    });
  } else {
    axios.all(filterArray.map(filter => {
      return filterData(formPath, filter, -1, 1)
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
        submissionDataTotal:(totalNumber== -1 || totalNumber>filterSubmisstion.length) ? filterSubmisstion.length : totalNumber,
        formData: filterSubmisstion.map(item => {
          return {
            data: item.data,
            created: item.createdTime,
            modified: item.updateTime,
            id: item.id
          }
        })
      });
    })).catch((error)=> {
      if (error.response && error.response.data.code === 9999 ) {
           message.error("查询条件矛盾，请检查");
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
    instanceAxios
      .get(
        config.apiUrl +
        `/${forms.path}/submission?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}&desc=createdTime`,
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
          submissionDataTotal: total === -1 || total > getSubmissionDataTotal(res) ? getSubmissionDataTotal(res) : total,
          formData: res.data.map(item => {
            return {
              data: item.data,
              id: item.id,
              created: item.createdTime,
              modified: item.updateTime,
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
        dispatch({
          type: RECEIVED_FORM_DETAIL,
          forms: currentForm,
          formDetail: res.data.data
        });
      });
  });
};
