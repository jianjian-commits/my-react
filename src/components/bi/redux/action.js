export const NEW_DASHBOARD = "NEW_DASHBOARD";
export const NEW_ELEMENT = "NEW_ELEMENT";
export const CHANGE_BIND = "CHANGE_BIND";
export const SET_DASHBOARDS = "SET_DASHBOARDS";
export const SET_TYPE = "SET_TYPE";
export const RENAME_DASHBOARD = "RENAME_DASHBOARD";
export const RENAME_ELEMENT = "RENAME_ELEMENT";
export const SET_FORM_DATA = "SET_FORM_DATA";
export const SET_DATA_SOURCE = "SET_DATA_SOURCE";
export const CHANGE_CHART_DATA = "CHANGE_CHART_DATA";
export const CLEAR_BIND = "CLEAR_BIND";

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
      bindDataArr
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
console.log("====clearBind===");
  dispatch({
    type: CLEAR_BIND,
    dataSource: {},
    bindDataArr: [],
    chartData: {},
    dim: [],
    mea: [],
  })
}