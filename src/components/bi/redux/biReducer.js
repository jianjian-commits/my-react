import {
  SET_TYPE,
  NEW_DASHBOARD,
  NEW_ELEMENT,
  CHANGE_BIND,
  SAVE_DASHBOARDS,
  RENAME_DASHBOARD,
  RENAME_ELEMENT,
  SET_FORM_DATA,
  SET_DATA_SOURCE,
  CHANGE_CHART_DATA
} from "./action";

const initState = {
  type: 'bar',
  dim: [],
  mea: [],
  dbName: "",
  elemName: "",
  dataName: "",
  formDataArr: [],
  dataSource: {},
  bindDataArr: [],
  chartData: {},
  dashboards: []
};

export default function biReducer(state = initState, action) {
  switch (action.type) {
    case NEW_DASHBOARD: {
      return {
        ...state,
        dashboardId: action.dashboardId,
        dbName: action.dbName
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
        bindDataArr: action.bindDataArr
      };
    }
    case RENAME_DASHBOARD: {
      return {
        ...state,
        dbName: action.dbName
      };
    }
    case SAVE_DASHBOARDS: {
      return {
        ...state,
        dashboards: action.dashboards
      };
    }
    case RENAME_ELEMENT: {
      return {
        ...state,
        elemName: action.elemName
      };
    }
    case SET_FORM_DATA: {
      return {
        ...state,
        formDataArr: action.formDataArr
      };
    }
    case SET_DATA_SOURCE: {
      return {
        ...state,
        dataSource: action.dataSource
      };
    }
    case CHANGE_CHART_DATA: {
      return {
        ...state,
        chartData: action.chartData
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
  
  