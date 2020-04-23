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

export const setDB = (dashboardId, setDashboards) => {
  request(`/bi/dashboards/${dashboardId}`).then((res) => {
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

export const deleteDB = (id) => {
  return request(`/bi/dashboards/${id}`, {
    method: "DELETE",
  });
}

export const renameDB = (id, name) => {
  return request(`/bi/dashboards/${id}`, {
    method: "PUT",
    data: {
      name
    }
  });
}


export const getDashboardAll = (appId) => {
  return request(`/bi/dashboards?appId=${appId}`);
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