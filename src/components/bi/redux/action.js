export const NEW_DASHBOARD = "NEW_DASHBOARD";
export const NEW_ELEMENT = "NEW_ELEMENT";
export const CHANGE_BIND = "CHANGE_BIND";
export const SAVE_DASHBOARD = "SAVE_DASHBOARD";
export const SAVE_ELEMENT = "SAVE_ELEMENT";
export const SET_TYPE = "SET_TYPE";
export const RENAME_DASHBOARD = "RENAME_DASHBOARD";
export const RENAME_ELEMENT = "RENAME_ELEMENT";
export const CHANGE_DATA = "CHANGE_DATA";


export const changeBind = (mea, dim) => dispatch => {
  dispatch({
      type: CHANGE_BIND,
      mea,
      dim
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

export const changeData = (dataName) => dispatch => {
  console.log("======changeData====", changeData);
    dispatch({
        type: CHANGE_DATA,
        dataName
    })
  }
