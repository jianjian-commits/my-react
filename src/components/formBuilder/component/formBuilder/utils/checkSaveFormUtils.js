/*
 * @Author: komons
 * @Date: 2020-02-17 10:23:58
 * @LastEditTime: 2020-03-28 09:45:39
 * @LastEditors: komons
 * @Description: 用于检验编辑的表单是否合理， 如果合理返回true
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formBuilder\utils\checkSaveFormUtils.js
 */
import { message } from "antd";
import { getDataFromUrl } from "../../../utils/locationUtils";
// 检查是否可以保存表单
export default function checkAndSaveForm(props) {
  console.log(props);
  const { formData, formArray } = props;
  console.log("fck", formData)
  const [...result] = [
    checkHasUniqueApiName(formData),
    checkHasLinkComponent(formData),
    checkHasLinkForm(formArray, formData)
  ];
  for (let i = 0; i < result.length; i++) {
    if (!result[i].res) {
      return result[i];
    }
  }
  return {
    res: true
  };
}

// 检查数据联动关联组件
export function checkHasLinkComponent(formData) {
  let linkIdArray = [];
  let allComponentsId = formData.map(item => {
    if (item.data && item.data.type == "DataLinkage") {
      linkIdArray.push(item.data.values.conditionId);
    }
    return item.id;
  });
  for (let i = 0; i < linkIdArray.length; i++) {
    if (!allComponentsId.includes(linkIdArray[i])) {
      message.error(`(${formData[i].label}) 联动条件失效，请重新设置！`, 2);
      return { res: false, componentsIndex: i };
    }
  }
  return { res: true, componentsIndex: -1 };
}

// 检查联动表单是否存在
export function checkHasLinkForm(forms = [], components = []) {
  console.log(forms, components);
  const formsIds = forms.map(form => form.id);
  for (let i = 0; i < components.length; i++) {
    let component = components[i];
    if (
      component.data &&
      component.data.type &&
      component.data.type == "DataLinkage" &&
      component.data.values &&
      !formsIds.includes(
        component.data.values.linkFormId || component.data.values.formId
      )
    ) {
      message.error(`(${component.label}) 联动条件失效，请重新设置！`, 2);
      return { res: false, componentsIndex: i };
    }
  }
  return { res: true, componentsIndex: -1 };
}

// 检查API Name 是否唯一(API Name 已替换为Key)
export function checkHasUniqueApiName(components = [], tempAPINameArr = []) {
  const formAPi = getDataFromUrl("formId");
  for (let i = 0; i < components.length; i++) {
    // 争对子表单的校验
    if (components[i].type === "FormChildTest") {
      let res = checkHasUniqueApiName(components[i].values, tempAPINameArr);
      if (!res.res) {
        return res;
      }
    }
    let key = components[i].key;
    if (key) {
      if (key == formAPi) {
        message.error(`(${components[i].label}) API Name不能和表单相同！`, 2);
        return { res: false };
      }
      let index = tempAPINameArr.indexOf(key);
      if (index > -1) {
        message.error(`(${components[index].label}) API Name必须唯一！`, 2);
        return { res: false };
      }
      tempAPINameArr.push(key);
    } else {
      message.error(`(${components[i].label}) API Name不能为空！`, 2);
      return { res: false };
    }
  }
  return { res: true };
}
