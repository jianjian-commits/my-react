import request from './request';
import { getChartAttrs } from './ChartUtil';
import { ChartType } from '../component/elements/Constant';

export const updateChartReq = (elementId, formId, bindDataArr, name, chartTypeProp) => {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataArr);

  return request(`/bi/charts/${elementId}`, {
    method: "PUT",
    data: {
      view: {
        chartTypeProp,
        conditions,
        dimensions,
        formFields: [
          // {
          //   id: "string",
          //   label: "string",
          //   type: "string"
          // }
        ],
        indexes,
        formId,
        name,
        supportChartTypes: [
          {
            "metadataId": "string",
            "status": "SUCCESS"
          }
        ],
        type: ChartType.HISTOGRAM
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

export const getDashboardAll = (appId) => {
  return request(`/bi/dashboards?appId=${appId}`);
};