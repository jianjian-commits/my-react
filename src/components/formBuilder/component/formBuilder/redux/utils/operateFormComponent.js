import {
  SET_DATA,
  SAVE,
  SET_ITEM_ATTR,
  SET_ITEM_VALUES,
  RECALC_LAYOUT,
  SET_DRAG_STATE,
  SET_ACTIVE_INDEX,
  SET_FORMCHILDITEM_ATTR,
  SET_FORMCHILDITEM_VALUES,
  SET_ACTIVEINNERINDEX,
  SET_ERROR_COMPONENT_INDEX
} from "../action";

export const setData = (data, saveData) => dispatch => {
  dispatch({
    type: SET_DATA,
    data: data
  });
  if (saveData) {
    dispatch({
      type: SAVE
    });
  }
};

export const updateOrder = elements => dispatch => {
  dispatch({
    type: SET_DATA,
    data: elements
  });
};
const _attrArray = [
  "customMessage",
  "maxLength",
  "minLength",
  "required",
  "isLimitLength",
  "isLimitOrientationRange"
];
export const setItemAttr = (element, attr, value) => {
  if (_attrArray.includes(attr)) {
    attr = "validate";
  }
  return {
    type: SET_ITEM_ATTR,
    data: element,
    attr,
    value
  };
};
export const setFormChildItemAttr = (element, attr, value, innerElement, dataType) => {
  if (_attrArray.includes(attr)) {
    attr = "validate";
  }
  return {
    type: SET_FORMCHILDITEM_ATTR,
    data: element,
    attr,
    value,
    innerElement,
    dataType
  };
};

export const setItemValues = (element, attr, value, dataType) => {
  return {
    type: SET_ITEM_VALUES,
    data: element,
    attr,
    value,
    dataType
  };
};
export const setCalcLayout = value => {
  return {
    type: RECALC_LAYOUT,
    isCalcLayout: value
  };
};
// 设置拖拽状态
export const setDragState = isDragging => {
  return {
    type: SET_DRAG_STATE,
    isDragging
  };
};
export const setActiveIndex = index => {
  return {
    type: SET_ACTIVE_INDEX,
    index
  };
};


export const setActiveInnerIndex = index => {
  return {
    type: SET_ACTIVEINNERINDEX,
    index
  };
};

export const setFormChildItemValues = (element, attr, value, innerElement) => {
  return {
    type: SET_FORMCHILDITEM_VALUES,
    data: element,
    attr,
    value,
    innerElement
  };
};

// 设置当前错误组件index
export const setErrorComponentIndex = (index) => {
  return {
    type: SET_ERROR_COMPONENT_INDEX,
    index,
  }
}
