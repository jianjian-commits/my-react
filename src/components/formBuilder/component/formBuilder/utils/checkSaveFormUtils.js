/*
 * @Author: komons
 * @Date: 2020-02-17 10:23:58
 * @LastEditTime: 2020-02-18 15:04:01
 * @LastEditors: komons
 * @Description: 用于检验编辑的表单是否合理， 如果合理返回true
 * @FilePath: \form-builder\src\component\formBuilder\utils\checkSaveFormUtils.js
 */
import { message } from "antd";
// 检查是否可以保存表单
export default function checkAndSaveForm(props) {
  const { formData, forms } = props;
  return checkHasLinkComponent(formData) && checkHasLinkForm(forms, formData);
}

// 检查数据联动关联组件
export function checkHasLinkComponent(formData) {
  let linkIdArray = [];
  let allComponentsId = formData.map(item => {
    if (item.data && item.data.type === "DataLinkage") {
      linkIdArray.push(item.data.values.conditionId);
    }
    return item.id;
  });
  for (let i = 0; i < linkIdArray.length; i++) {
    if (!allComponentsId.includes(linkIdArray[i])) {
      message.error(`(${formData[i].label}) 联动条件失效，请重新设置！`, 2);
      return {res:false, componentsIndex: i};
    }
  }
  return {res:true, componentsIndex: -1};
}

// 检查联动表单是否存在
export function checkHasLinkForm(forms = [], components = []) {
  const formsIds = forms.map(form => form.id);
  for (let i = 0; i < components.length; i++) {
    let component = components[i];
    if (
      component.data &&
      component.data.type &&
      component.data.type !== "custom" &&
      component.data.values &&
      !formsIds.includes(component.data.values.linkFormId || component.data.values.formId)
    ) {
      message.error(`(${component.label}) 联动条件失效，请重新设置！`, 2);
      return {res: false, componentsIndex: i};
    }
  }
  return {res:true, componentsIndex: -1};
}
