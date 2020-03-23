import { instanceAxios } from "../../../utils/tokenUtils";
import config from "../../../config/config";

// 获取需要的表单
export const getFormById = formId => {
  return new Promise((resolve, reject) => {
    instanceAxios
      .get(config.apiUrl + "/form/" + formId)
      .then(res => {
        // console.log(1);
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 获取表单的所有提交数据
export const getFormAllSubmission = (appId, formId) => {
  // 这里暂时获取9999条数据
  return new Promise((resolve, reject) => {
    instanceAxios
      .get(config.apiUrl + `/form/${formId}/submission`, {
        headers: {
          // "X-Custom-Header": "ProcessThisImmediately",
          "Content-Type": "application/json",
          appid:appId
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// 从所有数据中过滤出对应字段的数据
export const filterSubmissionData = (submissions, componentId) => {
  return submissions.map(item => {
    if (item.data && item.data[componentId]) {
      return item.data[componentId];
    } else {
      for (let key in item.data) {
        if (item.data[key] instanceof Array) {
          return filterSubmissionData(item.data[key], componentId);
        }
      }
    }
  });
};

// 针对多选数组的比较
export const compareEqualArray = (originArr, arr) => {
  let index = -1;
  arr.sort();
  originArr.forEach((oArr, i) => {
    oArr.sort();
    if (oArr.toString() === arr.toString()) {
      index = i;
    }
  });
  return index;
};

// 获取对应字段，同一字段对应不同值，显示所有值内容，争对-下拉框-
export const getResIndexArray = (value, originArr) => {
  let indexs = [];
  if (value instanceof Array) {
    value.sort();
    originArr.forEach((oArr, i) => {
      if (Array.isArray(oArr)) {
        oArr.sort();
      }
      if (oArr.toString() === value.toString()) {
        indexs.push(i);
      }
    });
    return indexs;
  } else {
    originArr.forEach((item, index) => {
      if (item === value) {
        indexs.push(index);
      }
    });
    return indexs;
  }
};
