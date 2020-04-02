import { message } from "antd";
import { DELETE_FORM, RECIVE_FORMS, GET_APPROVE_LIST_COUNT} from "./action";

const initState = {
  formArray: [],
  total: -1,
  approveListCount: {todos: 0, dones: 0, submits:0}
};

export default function formsReducer(state = initState, action) {
  switch (action.type) {
    case RECIVE_FORMS:
      return {
        ...state,
        formArray: action.forms,
        total: action.total,
      };
    case GET_APPROVE_LIST_COUNT:
      return {
        ...state,
        approveListCount: action.approveListCount
      }
    default:
      return state;
  }
}
