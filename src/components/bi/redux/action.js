import ChartInfo from "../component/elements/data/ChartInfo";
import { ChartType, AllType } from "../component/elements/Constant";
import { getChartAvailableList } from "../utils/ChartUtil"

export const NEW_DASHBOARD = "NEW_DASHBOARD";
export const NEW_ELEMENT = "NEW_ELEMENT";
export const CHANGE_BIND = "CHANGE_BIND";
export const SET_DASHBOARDS = "SET_DASHBOARDS";
export const SET_ELEM_TYPE = "SET_ELEM_TYPE";
export const RENAME_DASHBOARD = "RENAME_DASHBOARD";
export const RENAME_ELEMENT = "RENAME_ELEMENT";
export const SET_FORM_DATA = "SET_FORM_DATA";
export const SET_DATA_SOURCE = "SET_DATA_SOURCE";
export const CHANGE_CHART_DATA = "CHANGE_CHART_DATA";
export const CLEAR_BIND = "CLEAR_BIND";
export const SET_DB_MODE = "SET_DB_MODE";
export const SAVE_CHART_CHANGE = "SAVE_CHART_CHANGE";
export const CHANGE_CHART_INFO = "CHANGE_CHART_INFO";
export const CHANGE_CHART_AVAILABLE = "CHANGE_CHART_AVAILABLE";

export const saveChartChange = () => dispatch => {
  dispatch({
    type: SAVE_CHART_CHANGE,
  })
}

export const newDashboard = (dashboardId, dbName) => dispatch => {
  dispatch({
      type: NEW_DASHBOARD,
      dashboardId,
      dbName
  })
}

export const newElement = (dashboardId, dbName) => dispatch => {
  dispatch({
      type: NEW_DASHBOARD,
      dashboardId,
      dbName
  })
}

export const changeBind = (bindDataArr) => dispatch => {
  dispatch({
      type: CHANGE_BIND,
      bindDataArr,
      chartAvailableList: getChartAvailableList(bindDataArr)
  })
}

export const renameDashboard = (dbName) => dispatch => {
  dispatch({
      type: RENAME_DASHBOARD,
      dbName
  })
}

export const renameElement = (elemName) => dispatch => {
  dispatch({
      type: RENAME_ELEMENT,
      elemName
  })
}

export const setFormData = (formDataArr) => dispatch => {
  dispatch({
    type: SET_FORM_DATA,
    formDataArr
  })
}

export const changeChartData = (chartData) => dispatch => {
  dispatch({
    type: CHANGE_CHART_DATA,
    chartData
  })
}

export const setDataSource = (dataSource) => dispatch => {
  dispatch({
    type: SET_DATA_SOURCE,
    dataSource
  })
}

export const setDashboards = (dashboards) => dispatch => {
  dispatch({
    type: SET_DASHBOARDS,
    dashboards
  })
} 

export const clearBind = (params) => dispatch => {
  dispatch({
    type: CLEAR_BIND,
    dataSource: {},
    bindDataArr: [],
    chartData: {},
    elemType: ChartType.HISTOGRAM,
    chartInfo: new ChartInfo(),
    chartAvailableList: AllType
  })
}

export const setDBMode = (mode) => dispatch => {
  dispatch({
    type: SET_DB_MODE,
    dbMode: mode
  });
}

export const changeChartInfo = (chartInfo) => dispatch => {
  dispatch({
    type: CHANGE_CHART_INFO,
    chartInfo
  });
}

export const setElemType = (elemType) => dispatch => {
  dispatch({
    type: SET_ELEM_TYPE,
    elemType
  });
}