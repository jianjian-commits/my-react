import {
  RECEIVED_FORM_DATA,
  CLEAR_FORM_DATA,
  CLEAR_FORM_DETAIL,
  RECEIVED_FORM_DETAIL,
  Filter_FORM_DATA
} from "./action";

const initState = {
  formData: [], // 用户提交的所以数据
  formDetail: [], // 一条数据的具体信息
  formHeader: [],
  forms: { components: [], name: "" },
  formDataLoading: false,
  formDetailLoading: false,
  submissionDataTotal: -1,
  extraProp: null,
  taskData:{}
};

const formSubmitDataReducer = (state = initState, action) => {
  switch (action.type) {
    case RECEIVED_FORM_DATA: {
      return {
        ...state,
        formDataLoading: false,
        token: action.token,
        formData: action.formData,
        forms: action.forms,
        submissionDataTotal: action.submissionDataTotal,
      };
    }
    case Filter_FORM_DATA: {
      return {
        ...state,
        formDataLoading: false,
        token: action.token,
        formData: action.formData,
        submissionDataTotal: action.submissionDataTotal
      };
    }
    case CLEAR_FORM_DATA: {
      return {
        ...state,
        formData: []
      };
    }

    case RECEIVED_FORM_DETAIL: {
      return {
        ...state,
        formDetail: action.formDetail,
        forms: action.forms,
        extraProp: action.extraProp,
        taskData: action.taskData
      };
    }

    case CLEAR_FORM_DETAIL: {
      return {
        ...state,
        formDetail: []
      };
    }
    default: {
      return state;
    }
  }
};

export default formSubmitDataReducer;
