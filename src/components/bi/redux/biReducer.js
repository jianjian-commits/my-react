import {
  SET_ELEM_TYPE,
  NEW_DASHBOARD,
  NEW_ELEMENT,
  CHANGE_BIND,
  SET_DASHBOARDS,
  RENAME_DASHBOARD,
  RENAME_ELEMENT,
  SET_FORM_DATA,
  SET_DATA_SOURCE,
  CHANGE_CHART_DATA,
  CHANGE_CHART_INFO,
  CLEAR_BIND,
  SET_DB_MODE,
  SAVE_CHART_CHANGE,
  CHANGE_CHART_AVAILABLE,
  RESET_STORE
} from "./action";

import { DBMode } from '../component/dashboard/Constant';
import ChartInfo from '../component/elements/data/ChartInfo';
import { ChartType, AllType } from "../component/elements/Constant";

const initState = {
  elemType: ChartType.HISTOGRAM,
  dbName: "",
  elemName: "新建图表",
  formDataArr: [],
  dataSource: {},
  bindDataArr: [],
  chartData: {},
  dashboards: [],
  dbMode: DBMode.Edit,
  isChartEdited:false,
  chartInfo: new ChartInfo(),
  chartAvailableList: AllType
};

export default function biReducer(state = initState, action) {
  switch (action.type) {
    case RESET_STORE: {
      return {
        ...initState
      };
    }
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
        bindDataArr: action.bindDataArr,
        chartAvailableList: action.chartAvailableList,
        isChartEdited:true
      };
    }
    case CLEAR_BIND: {
      return {
        ...state,
        bindDataArr: action.bindDataArr, 
        dataSource: action.dataSource,
        chartData: action.chartData,
        chartInfo: new ChartInfo(),
        elemType: action.elemType,
        chartAvailableList: action.chartAvailableList,
        isChartEdited:false,
      };
    }
    case RENAME_DASHBOARD: {
      return {
        ...state,
        dbName: action.dbName
      };
    }
    case SET_DASHBOARDS: {
      return {
        ...state,
        dashboards: action.dashboards,
      };
    }
    case RENAME_ELEMENT: {
      return {
        ...state,
        elemName: action.elemName,
        isChartEdited:true
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
        dataSource: action.dataSource,
        isChartEdited:true
      };
    }
    case CHANGE_CHART_DATA: {
      return {
        ...state,
        chartData: action.chartData,
        isChartEdited:true
      };
    }
    case CHANGE_CHART_INFO: {
      return {
        ...state,
        chartInfo: action.chartInfo,
        isChartEdited:true
      };
    }
    case CHANGE_CHART_AVAILABLE: {
      return {
        ...state,
        chartAvailableList: action.chartAvailableList,
        isChartEdited:true
      };
    }
    case SET_DB_MODE: {
      return {
        ...state,
        dbMode: action.dbMode
      };
    }
    case SET_ELEM_TYPE: {
      return {
        ...state,
        elemType: action.elemType,
        isChartEdited:true
      };
    }
    case SAVE_CHART_CHANGE:{
      return {
        ...state,
        isChartEdited: false
      }
    }
    default:
      return state;
  }
};
  
  