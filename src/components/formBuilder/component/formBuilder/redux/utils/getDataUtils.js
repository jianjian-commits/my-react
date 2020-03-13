/*
 * @Author: your name
 * @Date: 2019-12-20 14:23:09
 * @LastEditors: komons
 * @LastEditTime: 2020-03-13 15:42:44
 * @Description: 
 * @FilePath: \form-builderc:\Komons\work\all\davinci-paas-frontend\src\components\formBuilder\component\formBuilder\redux\utils\getDataUtils.js
 */

// import axios from "axios";
// import config from "../../../../config/config";
// import { GET_ALL_FORMS } from "../action";

// let ignoreFormIdArray = ["user", "admin", "userLogin", "userRegister"];

// export const getAllForms = () => {
//   axios
//     .get(config.apiUrl + "/form")
//     .then(response => {
//       console.log(2);
//       dispatch({
//         type: GET_ALL_FORMS,
//         formArray: response.data.filter(item => {
//           return !ignoreFormIdArray.includes(item.name);
//         })
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// export const setAllForms = (forms) => dispatch => {
//   dispatch({
//     type: GET_ALL_FORMS,
//     formArray: forms
//   });
// }
