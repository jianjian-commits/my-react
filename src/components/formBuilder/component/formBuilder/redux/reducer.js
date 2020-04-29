import {
  RECALC_LAYOUT,
  SET_DATA,
  CREATE,
  DELETE,
  SET_ITEM_ATTR,
  SET_FORMCHILDITEM_ATTR,
  SET_FORM_NAME,
  SET_ITEM_VALUES,
  INIT_FORM_DOM,
  GET_ALL_FORMS,
  SET_DRAG_STATE,
  SET_ACTIVE_INDEX,
  ADD_VERIFICATION,
  DELETE_VERIFICATION,
  EDIT_VERIFICATION,
  SET_VERIFICATION,
  SET_VERIFICATION_MSG,
  SAVE_FORM_CHANGE,
  SET_FORMCHILDITEM_VALUES,
  SET_ACTIVEINNERINDEX,
  INIT_FORM_BEFORE,
  SET_ERROR_COMPONENT_INDEX

} from "./action";

const initState = {
  verificationList: [],    //校验规则
  data: [],
  name: "表单名字",
  isCalcLayout: false,
  isDragging: false,
  formArray: [],
  total: 0,
  activeIndex: -1,
  activeInnerIndex: -1,        //子表单内正在被编辑的组件
  errMessage: "",           //不满足校验提示文字
  isFormChanged: false,     //表单是否被修改过
  localForm: null,            //当前正在编辑的表单
  isInitForming: false,
  localFormPath: null,        //点击保存后，新表单的path
  errorComponentIndex: -1, //当前错误组件索引
};

export default function formBuilderReducer(state = initState, action) {
  switch (action.type) {
    case RECALC_LAYOUT: {
      return {
        ...state,
        isCalcLayout: action.isCalcLayout
      };
    }
    case SET_DATA: {
      return {
        ...state,
        data: action.data,
        isFormChanged: true
      };
    }
    case CREATE: {
      let newData = [].concat(state.data, action.data);
      return {
        ...state,
        data: newData,
        // isFormChanged: true
      };
    }
    case DELETE: {
      return {
        ...state,
        data: action.dataArray,
        isFormChanged: true
      };
    }
    case SET_ITEM_ATTR: {
      let newData = [...state.data];
      // let index = newData.indexOf(data);
      // newData[index][action.attr] = action.value;
      newData.forEach((item) => {
        if (item.id == action.data.id) {
          item[action.attr] = action.value
        }
      })

      return {
        ...state,
        data: newData,
        isFormChanged: true,
      };
    }
    case SET_FORMCHILDITEM_ATTR: {
      let newData = [...state.data];
      let index = newData.indexOf(action.data);
      if (newData[index] && newData[index]['values'] instanceof Array) {
        let innerIndex = newData[index]['values'].indexOf(action.innerElement);
        if (innerIndex > -1) {
          newData[index]['values'][innerIndex][action.attr] = action.value
        }
        if (action.dataType) {
          newData[index]['values'][innerIndex][action.attr].type = action.dataType
        }
      } else {
        newData[index][action.attr] = action.value;
      }
      return {
        ...state,
        data: newData,
        isFormChanged: true,
      };
    }
    case SET_FORM_NAME: {
      return {
        ...state,
        name: action.name,
        isFormChanged: true,
      };
    }
    // 添加类型属性，进行判断
    case SET_ITEM_VALUES: {
      let newData = [...state.data];
      let index = newData.indexOf(action.data);

      if(index === -1) {
        return state;
      }
      newData[index][action.attr] = {
        values: action.value,
        custom: "",
        json: "",
        resource: "",
        url: "",
      };
      if (action.dataType) {
        newData[index][action.attr].type = action.dataType
      }
      return {
        ...state,
        data: newData,
        isFormChanged: true,
      };
    }
    case SET_FORMCHILDITEM_VALUES: {
      let newData = [...state.data];
      let index = newData.indexOf(action.data);
      let innerIndex = newData[index]['values'].indexOf(action.innerElement);

      newData[index]['values'][innerIndex][action.attr] = {
        values: action.value,
        custom: "",
        json: "",
        resource: "",
        url: "",
      };
      if (action.dataType) {
        newData[index][action.attr].type = action.dataType
      }
      return {
        ...state,
        data: newData,
        isFormChanged: true,
      };
    }
    case INIT_FORM_DOM: {
      return {
        ...state,
        data: action.data,
        errMessage: action.errMessage,
        verificationList: action.verificationList,
        name: action.name,
        isFormChanged: false,
        localForm: action.localForm,
        isInitForming: false
      };
    }
    case INIT_FORM_BEFORE: {
      return {
        ...state,
        isInitForming: true
      }
    }
    case SET_DRAG_STATE: {
      return {
        ...state,
        isDragging: action.isDragging
      };
    }
    case GET_ALL_FORMS: {
      return {
        ...state,
        formArray: action.formArray
      };
    }
    case SET_ACTIVE_INDEX: {
      return {
        ...state,
        activeIndex: action.index,
        activeInnerIndex: -1
      };
    }
    case ADD_VERIFICATION: {
      const { name, value } = action;
      return {
        ...state,
        verificationList: [...state.verificationList, { name, value }],
        isFormChanged: true,
      }
    }
    case DELETE_VERIFICATION: {
      let newArray = state.verificationList;
      newArray.splice(action.index, 1);
      return {
        ...state,
        verificationList: [...newArray],
        isFormChanged: true,
      }
    }
    case EDIT_VERIFICATION: {
      const { name, value } = action;
      let newArray = state.verificationList;
      newArray[action.index] = { name, value }
      return {
        ...state,
        verificationList: [...newArray],
        isFormChanged: true,
      }
    }
    case SET_VERIFICATION: {
      return {
        ...state,
        verificationList: action.value,
      }
    }
    case SET_VERIFICATION_MSG: {
      return {
        ...state,
        errMessage: action.errMessage,
        isFormChanged: action.doType === 'init' ? false : true
      }
    }
    case SAVE_FORM_CHANGE: {
      return {
        ...state,
        isFormChanged: false,
        // data: action.data,
        localForm: action.localForm
      }
    }
    case SET_ACTIVEINNERINDEX: {
      return {
        ...state,
        activeInnerIndex: action.index,
        activeIndex: -1
      }
    }
    case SET_ERROR_COMPONENT_INDEX: {
      return {
        ...state,
        errorComponentIndex: action.index
      }
    }
    default:
      return state;
  }
};

