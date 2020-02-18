import { get, post } from "../requests";

import { SET_DATA, CREATE, DELETE } from "../action";

let _saveUrl;
let _onPost;
let _onLoad;

export const load = (loadUrl, saveUrl, data) => dispatch => {
  _saveUrl = saveUrl;
  if (_onLoad) {
    _onLoad().then(x => dispatch({ type: SET_DATA, data: x }));
  } else if (loadUrl) {
    get(loadUrl).then(x => {
      if (data && data.length > 0 && x.length === 0) {
        data.forEach(y => x.push(y));
      }
      dispatch({ type: SET_DATA, data: x });
    });
  } else {
    dispatch({ type: SET_DATA, data: data });
  }
};

export const create = element => dispatch => {
  dispatch({
    type: CREATE,
    data: element
  });
};

export const deletek = dataArray => dispatch => {
  dispatch({
    type: DELETE,
    dataArray: dataArray
  });
};
export const save = data => {
  if (_onPost) {
    _onPost({ task_data: data });
  } else if (_saveUrl) {
    post(_saveUrl, { task_data: data });
  }
};
