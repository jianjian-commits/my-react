import request from '../../../utils/request';

export default class RefreshAction {
  constructor(elemType, chartId, dashboards, options) {
    this.type = "redo";
    this.elemType = elemType
    this.chartId = chartId;
    this.dashboards = dashboards;
    this.options = options;
  }

  click = () => {
    request(`/bi/charts/${this.chartId}`).then((res) => {
      if(res && res.msg === "success") {
        const data = res.data.view;
        const formId = data.formId;
        const dimensions = data.dimensions;
        const indexes = data.indexes;
        request(`/bi/charts/data`, {
          method: "POST",
          data: {
            chartId: this.chartId,
            formId,
            dimensions,
            indexes,
            conditions: data.conditions,
            chartType: this.elemType
          }
        }).then((res) => {
          if(res && res.msg === "success") {
            const dataObj = res.data;
            const data = dataObj.data;
            const newDashboardsItem = {
              name: this.dashboards[0].name,
              elements: this.dashboards[0].elements.map(element => {
                if(element.id == this.chartId){
                  element.data = data;
                }

                return element;
              })
            }

            this.options.setDashboards([newDashboardsItem]);
          }
        })
      }
    })
  }
}