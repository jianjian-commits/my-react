/*
 * @Author: your name
 * @Date: 2019-12-20 14:23:09
 * @LastEditors: komons
 * @LastEditTime: 2020-02-21 10:58:14
 * @Description: 
 * @FilePath: \form-builder\src\component\formBuilder\redux\utils\getDataUtils.js
 */

import axios from "axios";
import config from "../../../../config/config";

let ignoreFormIdArray = ["user", "admin", "userLogin", "userRegister"];

export const getAllForms = () => {
  axios.get(config.apiUrl + "/form")
    .then(response => {
      console.log(2);
      dispatch({
        type: GET_ALL_FORMS,
        formArray: response.data.filter(item => {
          return !ignoreFormIdArray.includes(item.name);
        })
      });
    })
    .catch(err => {
      console.log(err);
    });
};
