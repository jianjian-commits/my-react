/*
 * @Author: your name
 * @Date: 2020-02-26 15:24:46
 * @LastEditors: komons
 * @LastEditTime: 2020-03-28 10:05:54
 * @Description: 校验apiName是否唯一的方法
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formBuilder\inspector\utils\checkUniqueApiName.js
 */
import { getDataFromUrl } from "../../../../utils/locationUtils";

export function checkUniqueApi(value, props) {
  if (!value) {
    return {err: true, msg: "API Name 不能为空"};
  }
  const reg = /[^A-Za-z0-9\/-]|^\/|\/$|^-|-$/;
  if (reg.test(value)) {
    return {err:true, msg:"API Name只能包含字母、数字、连字符和正斜杠"};
  }
  const { data, element } = props;
  const formAPi = getDataFromUrl("path");
  let apiNames = [formAPi];
  data &&
    data.forEach(component => {
      if (component.id !== element.id) {
        if (component.type === "FormChildTest") {
          component.values.forEach(item => {
            if (item.id !== element.id) {
              item.key && apiNames.push(item.key);
            }
          });
        } else {
          component.key && apiNames.push(component.key);
        }
      }
    });
  apiNames = apiNames.filter(item => item);
  return {err: apiNames.includes(value), msg: "API Name已存在"};
}
