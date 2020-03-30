import { instanceAxios } from "../../../utils/tokenUtils";
import config from "../../../config/config";

export const filterDropDownSelection = (dataList, optionId) => {
  let newValuesList = [];
  let signArray = []; //用来标记当前插入的元素，保证不重复
  dataList.forEach(item => {
    if (item.data[optionId] instanceof Array) {
      item.data[optionId].forEach(value => {
        if (value && !signArray.includes(value)) {
          newValuesList.push({
            label: value,
            value: value
          });
          signArray.push(value);
        }
      });
    } else {
      if (item.data[optionId] && !signArray.includes(item.data[optionId])) {
        newValuesList.push({
          label: item.data[optionId],
          value: item.data[optionId]
        });
        signArray.push(item.data[optionId]);
      }
    }
  });
  return newValuesList;
};

export const getSelection = (appId, formId, optionId) => {
  // 这里暂时获取9999条数据
  return new Promise((resolve, reject) => {
    instanceAxios
      .get(config.apiUrl + `/form/${formId}/submission?skip=0`, {
        headers: {
          // "X-Custom-Header": "ProcessThisImmediately",
          "Content-Type": "application/json",
          appid: appId
        }
      })
      .then(res => {
        resolve(filterDropDownSelection(res.data, optionId));
      })
      .catch(err => {
        reject(err);
      });
  });
};
