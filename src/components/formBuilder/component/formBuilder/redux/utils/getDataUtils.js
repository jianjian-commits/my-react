import axios from "axios";
import config from "../../../../config/config";

let ignoreFormIdArray = ["user", "admin", "userLogin", "userRegister"];

export const getAllForms = () => {
    axios
    .get(config.apiUrl + "/form")
    .then(response => {
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
}