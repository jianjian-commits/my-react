import request from './request';
import { getChartAttrs, getChartAvailableList, getChartObj } from './ChartUtil';
import { message } from 'antd';

export const updateChartReq = (elementId, formId, bindDataObj, name, chartTypeProp, elemType) => {
  const view = getChartObj(elementId, formId, bindDataObj, name, chartTypeProp, elemType);

  return request(`/bi/charts/${elementId}`, {
    method: "PUT",
    data: {
      view
    }
  });
}

export const setDB = (appId, dashboardId, setDashboards) => {
  request(`/bi/dashboards/${dashboardId}`, {
    headers: {appId, "Content-Type": "application/json"}
  }).then((res) => {
    if(res && res.msg === "success") {
      return res.data.name;
    }
  }).then((name) => {
    const response =  request(`/bi/charts?dashboardId=${dashboardId}`);
    response.then((res) => {
      if(res && res.msg === "success") {
        setDashboards([{name, elements: res.data.items}])
      }
    })
  })
}

export const deleteDB = (appId, id) => {
  return request(`/bi/dashboards/${id}`, {
    method: "DELETE",
    headers: {appId, "Content-Type": "application/json"}
  });
}

export const renameDB = (appId, id, name) => {
  return request(`/bi/dashboards/${id}`, {
    method: "PUT",
    headers: {appId, "Content-Type": "application/json"},
    data: { name }
  });
}

export const newDB = (appId) => {
  return request(`/bi/dashboards/`, {
    method: "POST",
    headers: {appId, "Content-Type": "application/json"},
    data: {name: "新建仪表盘", appid: appId}, 
    warning: "创建报表失败"
  });
}

export const processBind = (bindDataObj, formId, changeBind, changeChartData, elemType, setElemType) => {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataObj);
  const availableList = getChartAvailableList(bindDataObj);
  let type = elemType

  if(!availableList.includes(elemType)) {
    type = availableList[0];
    setElemType(type);
  }

  request(`/bi/charts/data`, {
    method: "POST",
    data: {
      formId,
      dimensions,
      indexes,
      conditions,
      chartType: type
    }
  }).then((res) => {
    if(res && res.msg === "success") {
      const dataObj = res.data;
      const data = dataObj.data;
      changeChartData(data);
    }
  })

  changeBind(bindDataObj);
}