import request from '../../../utils/request';
import { deepClone } from '../../../utils/Util';
import {message} from "antd";

export default class CopyAction {
  constructor(chartId, dashboards, options) {
    this.type = "copy";
    this.dashboards = dashboards;
    this.chartId = chartId;
    this.options = options;
  }

  click = () => {
    request(`/bi/charts/${this.chartId}`,{
      method:"POST"
    })
    .then(res => {
      if(res && res.msg === "success") {
        const db = deepClone(this.dashboards);
        const elems = db[0].elements;
        elems.push(res.data.item)
        this.options.setDashboards(db);
        message.info("复制成功");
      }
    }).catch(err => {
      console.log(err);
    });
  }
}