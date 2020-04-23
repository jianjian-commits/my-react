import request from './request';
import { getChartAttrs, getChartAvailableList } from './ChartUtil';

export const updateChartReq = (elementId, formId, bindDataArr, name, chartTypeProp, elemType) => {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);

  return request(`/bi/charts/${elementId}`, {
    method: "PUT",
    data: {
      view: {
        chartTypeProp,
        conditions,
        dimensions,
        formFields: [],
        indexes,
        formId,
        name,
        supportChartTypes: [
          {
            "metadataId": "string",
            "status": "SUCCESS"
          }
        ],
        type: elemType
      }
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
    request(`/bi/charts?dashboardId=${dashboardId}`).then((res) => {
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

export const processBind = (bindDataArr, formId, changeBind, changeChartData, elemType, setElemType) => {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);
  const availableList = getChartAvailableList(bindDataArr);
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

  changeBind(bindDataArr);
}