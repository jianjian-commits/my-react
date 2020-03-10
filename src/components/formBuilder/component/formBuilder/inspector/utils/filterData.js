// 判断联动表单是否相等时的可选类型 （为component的element值）
// SingleText, TextArea, RadioButtons CheckboxInput DropDown MultiDropDown NumberInput DateInput
// EmailInput PhoneInput IdCardInput GetLocalPosition ImageUpload FileUpload
const LinkFormAcceptDataType = {
  SingleText: ["SingleText", "RadioButtons", "DropDown"],
  TextArea: ["TextArea"],
  DropDown: [
    "SingleText",
    "RadioButtons",
    "CheckboxInput",
    "MultiDropDown",
    "number",
    "DateInput",
    "DropDown"
  ],
  MultiDropDown: [
    "SingleText",
    "RadioButtons",
    "CheckboxInput",
    "MultiDropDown",
    "number",
    "DateInput",
    "DropDown"
  ],
  number: ["number"],
  DateInput: ["DateInput"],
  EmailInput: ["EmailInput"],
  PhoneInput: ["PhoneInput"],
  IdCardInput: ["IdCardInput"],
  FormChildTest: ["FormChildTest"],
  Address: ["Address"]
};

// 过滤自生表单
export const filterFormExceptSelf = (forms = [], formId) => {
  return forms.filter(form => {
    if (form._id == formId) {
      return false;
    } else {
      return true;
    }
  });
};

// 过滤表单的当前组件和规则校验组件(新增子表单字段过滤)
export const filterComponentsExceptSelf = (
  form = [],
  componentId,
  elementParent
) => {
  if (elementParent) {
    let components = [];
    form.forEach(component => {
      if (component.element == "FormChildTest") {
        component.values.forEach(item => {
          if (item.id !== componentId) {
            item = JSON.parse(JSON.stringify(item));
            item.label = component.label + "--" + item.label;
            components.push(item);
          }
        });
      } else if (component.element !== "CustomValue") {
        components.push(component);
      }
    });
    return components;
  }
  return form.filter(component => {
    if (
      component.id == componentId ||
      component.element == "CustomValue" ||
      component.element == "FormChildTest"
    ) {
      return false;
    } else {
      return true;
    }
  });
};

export const filterAcceptComponent = (components, type) => {
  // 过滤可用组件
  return components.filter(component => {
    if (
      type &&
      LinkFormAcceptDataType[type] &&
      LinkFormAcceptDataType[type].includes(component.element)
    ) {
      return true;
    } else {
      return false;
    }
  });
};

// 根据表单id获得该表单的所有组件
export const filterLinkFormAndGetComponent = (forms = [], formId, type) => {
  const form = forms.filter(form => {
    if (form._id == formId) {
      return true;
    } else {
      return false;
    }
  });
  let components = form.length > 0 ? form[0].components : [];
  return filterAcceptComponent(components, type);
};

// 根据表单id获得该表单的对应id的子表单的所有组件
export const filterFormChildAllComponent = (
  forms = [],
  formId,
  formChildId,
  type
) => {
  // 获得对应id的表单
  const form = forms.filter(form => {
    if (form._id == formId) {
      return true;
    } else {
      return false;
    }
  });
  let component;
  // 获得对应id的子表单
  if (form[0] && form[0].components && formChildId) {
    component = form[0].components.filter(option => {
      return option.key == formChildId;
    });
  }
  // 获得子表单的可选组件
  if (component && component.length > 0) {
    return filterAcceptComponent(component[0].values, type);
  } else {
    return [];
  }
};

// 过滤已关联的子表单组件
export const filterLinkedFormChildItem = (components, formChildData = []) => {
  const linkedFormids = formChildData.map(item => item.id);
  return components.filter(item => !linkedFormids.includes(item.id));
};

// 格式化关联表单数据
export const filterFormsForRelation = (forms = [], formId) => {
  forms = filterFormExceptSelf(forms, formId);
  let treeData = [];
  forms.forEach(form => {
    let formData = {
      title: form.title,
      value: form._id,
      key: form._id,
      children: []
    };
    form.components.forEach(item => {
      if (item.element != "CustomValue") {
        formData.children.push({
          title: form.title + "-" + item.label,
          value: form._id + "|" + item.key,
          key: item.key
        });
      }
    });
    treeData.push(formData);
  });
  return treeData;
};

// 通过id取得selecte对应的文字
export const filterFormSubmitOption = (forms, values) => {
  const { formId, optionId } = values;
  let formName = "";
  let optionName = "";
  forms.forEach(form => {
    if (form._id == formId) {
      formName = form.title;
    }
    form.components.forEach(item => {
      if (item.id == optionId) {
        optionName = item.label;
      }
    });
  });
  return {
    formName,
    optionName
  };
};

// 检查子表单是否设置了子字段的数据联动
export const checkFormChildItemIsLinked = (parentElement, element) => {
  const id = element.id;
  try {
    const res = parentElement.data.values.formChildData.filter(
      item => item.id === id
    );
    if (res.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
