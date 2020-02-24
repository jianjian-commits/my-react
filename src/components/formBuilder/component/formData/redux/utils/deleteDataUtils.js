import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
import { CLEAR_FORM_DATA, CLEAR_FORM_DETAIL } from "../action";

// 删除一条数据
export const deleteFormData = (
    formId,
    submissionId
  ) => dispatch => {
   return instanceAxios({
      url: config.apiUrl + `/submission/${submissionId}`,
      method: "DELETE",
      headers: {
        // "X-Custom-Header": "ProcessThisImmediately",
        "Content-Type": "application/json"
      }
    })
  };
  
  // 清空表单数据
  export const clearFormData = () => {
    return {
      type: CLEAR_FORM_DATA
    };
  };
  
  // 清空表单数据详情的数据
  export const clearFormDetail = () => {
    return {
      type: CLEAR_FORM_DETAIL
    };
  };