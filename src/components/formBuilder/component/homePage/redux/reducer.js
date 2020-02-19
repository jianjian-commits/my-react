import { message } from "antd";
import { DELETE_FORM, RECIVE_FORMS } from "./action";

const initState = {
  formArray: [],
  total: -1,
};

export default function formsReducer(state = initState, action) {
  switch (action.type) {
    case RECIVE_FORMS:
      return {
        ...state,
        formArray: action.forms,
        total: action.total,
      };
    default:
      return state;
  }
}
