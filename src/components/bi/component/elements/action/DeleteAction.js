import request from '../../../utils/request';
import {setDB} from '../../../utils/reqUtil';
import {message} from "antd";

export default class DeleteAction {
  constructor(dashboardId, chartId, appId, options) {
    this.type = "delete";
    this.dashboardId = dashboardId;
    this.chartId = chartId;
    this.appId = appId;
    this.options = options;
  }

  click = () => {
    request(`/bi/charts/${this.chartId}`,{
      method:"DELETE"
    })
    .then(res => {
      if(res && res.msg === "success"){
        message.info("删除成功");
        setDB(this.appId, this.dashboardId, this.options.setDashboards);
      }
    }).catch(err => {
      console.log(err);
    });
  }
}