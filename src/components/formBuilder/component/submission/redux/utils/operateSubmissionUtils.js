import config from "../../../../config/config";
import { message } from "antd";
import { instanceAxios } from "../../../../utils/tokenUtils";
import {
  GET_FORM_COMPONENT,
  GET_CHILD_FORM_COMPONENT,
  GET_ALL_FORMS
} from "../action";
export const submitSubmission = (formId, values, appid, extraProp) => dispatch => {
  return instanceAxios({
    url: config.apiUrl + `/submission`,
    method: "POST",
    headers: {
      // "X-Custom-Header": "ProcessThisImmediately",
      "Content-Type": "application/json",
      appid:appid
    },
    data: {
      data: values,
      formId: formId,
      extraProp
    }
  });
};

export const submitLayout = (
  components,
  formComponent,
  layoutArray,
  currentLayoutId
) => dispatch => {
  let { formValidation, createdTime, path, name, id } = formComponent;

  let formData = {
    components,
    name,
    path,
    id,
    updateTime: new Date(),
    createdTime,
    formValidation,
    currentLayoutId, //默认布局ID
    layoutArray //布局
  };

  instanceAxios({
    url: config.apiUrl + `/form/${formComponent.id}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    data: formData
  })
    .then(response => {
      message.success("设置成功!");
      setTimeout(() => {
        window.location.href = config.hostUrl;
      }, 1000);
    })
    .catch(err => {
      console.log(err);
    });
};

export const getFormComponent = id => dispatch => {
  instanceAxios
    .get(config.apiUrl + "/form/" + id)
    .then(res => {
      dispatch({
        type: GET_FORM_COMPONENT,
        data: res.data,
        formValidation: res.data.formValidation
      });
      return res.data;
    })
    .catch(err => {
      console.error(err);
    });
};

export const getFormComponentByPath = path => dispatch => {
  instanceAxios
    .get(config.apiUrl + "/form?path=" + path)
    .then(res => {
      dispatch({
        type: GET_FORM_COMPONENT,
        data: res.data[0],
        formValidation: res.data[0].formValidation
      });
      return res.data[0];
    })
    .catch(err => {
      console.error(err);
    });
};

let ignoreFormIdArray = ["user", "admin", "userLogin", "userRegister"];

export const getAllForms = () => dispatch => {
  instanceAxios.get(config.apiUrl + "/form")
    .then(response => {
      dispatch({
        type: GET_ALL_FORMS,
        forms: response.data.filter(item => {
          return !ignoreFormIdArray.includes(item.name);
        })
      });
    })
    .catch(err => {
      console.log(err);
    });
};
