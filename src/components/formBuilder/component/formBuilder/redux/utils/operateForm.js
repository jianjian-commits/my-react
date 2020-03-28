import config from "../../../../config/config";
import { instanceAxios } from "../../../../utils/tokenUtils";
import Axios from "axios";
import ID from "../../../../utils/UUID";
import { message } from "antd";
import {
  SAVE_FORM_CHANGE,
  SET_FORM_NAME,
  INIT_FORM_DOM,
  GET_ALL_FORMS,
  INIT_FORM_BEFORE
} from "../action";

var _checkMinAndMax = components => {
  const componentArray = components.map(component => {
    if (
      (component.type === "SingleText" || components.type === "TextArea") &&
      component.validate.maxLength !== null &&
      component.validate.minLength !== null &&
      component.validate.maxLength < component.validate.minLength
    ) {
      const tmpLength = component.validate.maxLength;
      component.validate.maxLength = component.validate.minLength;
      component.validate.minLength = tmpLength;
    }
    if (
      component.type === "NumberInput" &&
      component.validate.max !== null &&
      component.validate.min !== null &&
      component.validate.max < component.validate.min
    ) {
      const tmpLength = component.validate.max;
      component.validate.max = component.validate.min;
      component.validate.min = tmpLength;
    }
    if (
      component.type === "MultiDropDown" &&
      component.validate.maxOptionNumber !== null &&
      component.validate.minOptionNumber !== null &&
      component.validate.maxOptionNumber < component.validate.minOptionNumber
    ) {
      const tmpLength = component.validate.maxOptionNumber;
      component.validate.maxOptionNumber = component.validate.minOptionNumber;
      component.validate.minOptionNumber = tmpLength;
    }

    return component;
  });
  return componentArray;
};

var _calcFormComponentLayout = formDataArray => {
  let y = 0;

  formDataArray.forEach(item => {
    if (item.element === "CustomValue") {
      return;
    }

    let domElement = document.getElementById(item.key);
    let newHeight = null;

    if (item.type === "FormChildTest") {
      newHeight = 240 / 30;
      item.layout.x = 0;
      item.layout.w = item.layout.minW = item.layout.maxW = 12;
    } else if (item.type === "FileUpload") {
      newHeight = 180 / 30;
    } else {
      newHeight = domElement.offsetHeight / 30;
    }

    newHeight = Number(newHeight.toFixed(1));

    item.layout.h = newHeight;
    item.layout.maxH = item.layout.minH = newHeight; // 最小高度
    item.layout.y = y;
    y += newHeight;
  });

  formDataArray.forEach(item => {
    if (item.element === "Button" || item.type === "FormChildTest") {
      return;
    }

    let domElement = document.getElementById(item.key + "Title");

    let minWidth = Math.ceil((domElement.offsetWidth + 15) / 65);

    item.layout.minW = minWidth > 10 ? 10 : minWidth;

    if (item.type === "CheckboxInput") {
      let dom = document.querySelector(`#${item.key}`);
      let checkboxItemArray = dom.querySelectorAll(`.ant-checkbox-wrapper`);
      let currentMaxWidth = minWidth;

      checkboxItemArray.forEach(item => {
        let itemWidth = Math.ceil((item.offsetWidth + 15) / 65);

        currentMaxWidth = Math.max(currentMaxWidth, itemWidth);
      });

      item.layout.minW = currentMaxWidth > 10 ? 10 : currentMaxWidth;
    } else if (item.type === "RadioButtons") {
      let dom = document.querySelector(`#${item.key}`);
      let redioItemArray = dom.querySelectorAll(`.ant-radio-wrapper`);
      let currentMaxWidth = minWidth;

      redioItemArray.forEach(item => {
        let width = 0;

        item.querySelectorAll(`span`).forEach(span => {
          width += span.offsetWidth;
        });

        let itemWidth = Math.ceil((width + 15) / 65);

        currentMaxWidth = Math.max(currentMaxWidth, itemWidth);
      });

      item.layout.minW = currentMaxWidth > 10 ? 10 : currentMaxWidth;
    }
  });
};

// var buildCustomComponent = (verificationList, errMessage, submitBtnObj, layoutArray) => {
//   let key = ID.uuid();
//   let customComponent = {
//     type: "CustomValue",
//     id: key,
//     key: key,
//     element: "CustomValue",
//     layoutArray: layoutArray,
//     currentLayoutId: "defaultLayout",
//     errMessage: errMessage,
//     validate: [...verificationList],
//     submitBtnObj: submitBtnObj
//   };

//   return customComponent;
// };

function updateCustomValue(components, verificationList = [], errMessage = "") {
  let index = -1;
  let verificationEle = components.filter((item, i) => {
    if (item.element === "CustomValue") {
      index = i;
      return true;
    } else {
      return false;
    }
  });
  if (verificationEle.length > 0) {
    verificationEle[0]["validate"] = [...verificationList];
    verificationEle[0]["errMessage"] = errMessage;
    return {
      index,
      verification: verificationEle[0]
    };
  } else {
    console.error("the update form has no CustomValue");

    return {
      index: -1,
      verification: {}
    };
  }
}

export const saveForm = (
  submissionAccess,
  name,
  verificationList,
  errMessage,
  // type,
  path,
  formInfo = "",
  callback,
  url,
  extraProp,
  appId
) => dispatch => {
  if (formInfo != "") {
    formInfo = formInfo
      .replace(/\r\n/g, "<br/>")
      .replace(/\n/g, "<br/>")
      .replace(/\s/g, " ");
  }

  let defaultLayout = {
    id: "defaultLayout",
    name: "默认布局",
    layout: [],
    createDate: Date.now(),
    modified: Date.now()
  };

  const time = new Date();
  let formData = {
    display: "form",
    components: [],
    type: "resource",
    tags: ["common"],
    page: 0,
    submissionAccess: submissionAccess,
    title: name,
    path: path,
    name: name,
    formInfo: formInfo,
    createdTime: time,
    extraProp: extraProp,
    updateTime: time,
    formValidation: {
      errMessage: errMessage,
      validate: verificationList
    },
    layoutArray: [defaultLayout],
    currentLayoutId: "defaultLayout"
  };

  instanceAxios({
    url: config.apiUrl + "/form",
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      appid: appId
    }
  })
    .then(response => {
      let id = response.data.id;
      console.log(id);
      callback(`${url}${id}/edit?formId=${id}`);
    })
    .catch(err => {
      console.info(err);
      if ((err.response.data.code = "1002")) {
        message.error("该api已存在");
      }

      // }
    });
};

export const updateForm = (
  formDataArray,
  submissionAccess,
  name,
  verificationList,
  localForm,
  errMessage,
  type,
  callback,
  appid,
  extraProp
) => dispatch => {

  formDataArray.forEach((item) => {
    item.layout.i = item.key
  });

  _calcFormComponentLayout(formDataArray);

  let defaultLayout = {
    id: "defaultLayout",
    name: "默认布局",
    layout: [],
    createDate: Date.now(),
    modified: Date.now()
  };

  formDataArray.forEach(item => {
    defaultLayout.layout.push({
      ...item.layout,
      isShow: true
    });
  });

  let tempApiStatus = setIsSetApiStatus(formDataArray);

  if (localForm.layoutArray != void 0) {
    localForm.layoutArray.shift();
    localForm.layoutArray.unshift(defaultLayout);
  } else {
    localForm.layoutArray = defaultLayout.layout;
    localForm.currentLayoutId = "defaultLayout";
  }

  let { path, id, createdTime, currentLayoutId, layoutArray } = localForm;
  let formData = {
    display: "form",
    components: _checkMinAndMax(formDataArray),
    type: "resource",
    tags: ["common"],
    page: 0,
    submissionAccess: submissionAccess,
    name,
    path,
    id,
    updateTime: new Date(),
    createdTime,
    formValidation: {
      errMessage: errMessage,
      validate: verificationList
    },
    currentLayoutId, //默认布局ID
    layoutArray, //布局
    extraProp
  };

  instanceAxios({
    url: config.apiUrl + `/form/${formData.id}`,
    method: "PUT",
    data: formData,
    headers: {
      "Content-Type": "application/json",
      appid: appid
    }
  })
    .then(response => {
      setIsSetApiStatus(formDataArray, tempApiStatus);
      if (type === "back") {
        message.success("保存成功", 1, () => {
          dispatch({
            type: SAVE_FORM_CHANGE,
            localForm: response.data,
            data: response.data.components
          });
          let newPath = window.location.pathname
            .split("/")
            .splice(0, window.location.pathname.split("/").length - 3)
            .join("/");
          window.location.href = `${window.location.origin}${newPath}`;
        });
      } else {
        message.success("保存成功", 1);
        dispatch({
          type: SAVE_FORM_CHANGE,
          localForm: response.data,
          data: response.data.components
        });
        callback();
      }
    })
    .catch(err => {
      // if (err.response.data === "Token Expired") {
      //   console.log("token 已过期，正在请求新的token");
      //   // mockLoginAndSetData(false, true);
      // } else {
      console.info(err);
      // }
    });
};

export const setFormName = name => {
  return {
    type: SET_FORM_NAME,
    name: name
  };
};

// 当通过id进入时获取数据
export const initForm = id => dispatch => {
  dispatch({
    type: INIT_FORM_BEFORE,
    isInitForming: true
  });
  instanceAxios
    .get(config.apiUrl + "/form/" + id)
    .then(res => {
      // console.log(1);
      let { components, name, formValidation } = res.data;
      let localForm = res.data;
      dispatch({
        type: INIT_FORM_DOM,
        data: components,
        name,
        errMessage: formValidation.errMessage,
        verificationList: formValidation.validate,
        localForm,
        isInitForming: false
      });
    })
    .catch(err => {
      dispatch({
        type: INIT_FORM_BEFORE,
        isInitForming: false
      });
      // mockLoginAndSetData(false, true);
    });
};

export const getAllForms = () => dispatch => {
  Axios.get({
    url: config.apiUrl + "/form"
  })
    .then(response => {
      // console.log(1);
      // console.log(response);
      dispatch({
        type: GET_ALL_FORMS,
        formArray: response.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// 设置isSetAPIName状态
function setIsSetApiStatus(components, tempSetArray = []) {
  components.forEach(component => {
    if (tempSetArray.length === 0) {
      if (component.type === "FormChildTest") {
        component.values.forEach(item => {
          if (!item.isSetAPIName) {
            tempSetArray.push(item.id);
            item.isSetAPIName = true;
          }
        });
      } else if (!component.isSetAPIName) {
        tempSetArray.push(component.id);
        component.isSetAPIName = true;
      }
    } else {
      if (component.type === "FormChildTest") {
        component.values.forEach(item => {
          if (tempSetArray.includes(item.id)) {
            item.isSetAPIName = false;
          }
        });
      } else if (tempSetArray.includes(component.id)) {
        component.isSetAPIName = false;
      }
    }
  });
}
