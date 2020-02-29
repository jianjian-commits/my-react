/*
 * @Author: your name
 * @Date: 2020-02-26 15:24:46
 * @LastEditors: komons
 * @LastEditTime: 2020-02-28 17:08:43
 * @Description: 校验apiName是否唯一的方法
 * @FilePath: \form-builder\src\component\formBuilder\inspector\utils\checkUniqueApiName.js
 */
import { getDataFromUrl } from "../../../../utils/locationUtils";

export function checkUniqueApi(value, props) {
  if (!value) {
    return true;
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
              item.apiName && apiNames.push(item.apiName);
            }
          });
        } else {
          component.apiName && apiNames.push(component.apiName);
        }
      }
    });
  apiNames = apiNames.filter(item => item);
  return !apiNames.includes(value);
}
