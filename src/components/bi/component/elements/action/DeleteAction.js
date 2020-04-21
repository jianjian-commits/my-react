import request from '../../../utils/request';
import {setDB} from '../../../utils/reqUtil';
import {message} from "antd";

export default class DeleteAction {
  constructor(type, dashboardId, chartId, options) {
    this.type = type;
    this.dashboardId = dashboardId;
    this.chartId = chartId;
    this.options = options;
  }

  click = () => {
    request(`/bi/charts/${this.chartId}`,{
      method:"DELETE"
    })
    .then(res => {
      if(res && res.msg === "success"){
        message.info("删除成功");
        setDB(this.dashboardId, this.options.setDashboards);
      }
    }).catch(err => {
      console.log(err);
    });
  }
}