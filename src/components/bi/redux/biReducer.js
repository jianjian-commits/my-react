import {
  SET_TYPE,
  NEW_DASHBOARD,
  NEW_ELEMENT,
  CHANGE_BIND,
  SAVE_DASHBOARD,
  SAVE_ELEMENT,
  RENAME_DASHBOARD,
  RENAME_ELEMENT,
  CHANGE_DATA
} from "./action";

const initState = {
  type: 'bar',
  dim: [],
  mea: [],
  dbName: "",
  elemName: "",
  dataName: ""
};

export default function biReducer(state = initState, action) {
  switch (action.type) {
    case NEW_DASHBOARD: {
      return {
        ...state
      };
    }
    case NEW_ELEMENT: {
      return {
        ...state,
      };
    }
    case CHANGE_BIND: {
      return {
        ...state,
        dim: action.dim,
        mea: action.mea
      };
    }
    case RENAME_DASHBOARD: {
      return {
        ...state,
        dbName: action.dbName
      };
    }
    case RENAME_ELEMENT: {
      return {
        ...state,
        elemName: action.elemName
      };
    }
    case CHANGE_DATA: {
      return {
        ...state,
        dataName: action.dataName
      };
    }
    case SAVE_ELEMENT: {
      return {
        ...state,
      };
    }
    case SET_TYPE: {
      return {
        ...state,
        elemType: action.elemType
      };
    }
    default:
      return state;
  }
};
  
  