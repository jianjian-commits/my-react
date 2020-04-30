import request from '../../../utils/request';
import ChartInfo from '../data/ChartInfo';
import { Types } from '../../bind/Types';
import { getUUID } from '../../../utils/Util';
import { DBMode } from '../../dashboard/Constant';

export default class EditAction {
  constructor(elemType, chartId, callback, options) {
    this.type = "edit";
    this.elemType = elemType;
    this.chartId = chartId;
    this.callback = callback;
    this.options = options;
  }

  click = () => {
    request(`/bi/charts/${this.chartId}`).then((res) => {
      if(res && res.msg === "success") {
        const data = res.data.view;
        const formId = data.formId;
        const chartInfo = data.chartTypeProp;
        let bindDataArr = [];
        const { dimensions, indexes, conditions } = data;

        if(dimensions && dimensions.length > 0) {
          const dimArr = dimensions.map((each, idx) => {
            let field = each.field;
            field["currentGroup"] =each.currentGroup;
            field["groups"] =each.groups;
            field["sort"] =each.sort;
            field["bindType"] = Types.DIMENSION;
            field["idx"] = getUUID();
            return field;
          })

          bindDataArr = dimArr;
        }

        if(indexes && indexes.length > 0) {
          const meaArr = indexes.map((each, idx) => {
            const field = each.field;
            field["currentGroup"] = each.currentGroup;
            field["groups"] = each.groups;
            field["dataFormat"] =each.dataFormat;
            field["sort"] = each.sort;
            field["bindType"] = Types.MEASURE;
            field["idx"] = getUUID() 
            return field;
          })

          bindDataArr = bindDataArr.concat(meaArr);
        }

        if(conditions && conditions.length > 0) {
          const filterArr = conditions.map((each, idx) => {
            const field = each.field;
            field["value"] = each.value;
            field["symbol"] = each.symbol;
            field["bindType"] = Types.FILTER;
            field["idx"] = getUUID()
            return field;
          })

          bindDataArr = bindDataArr.concat(filterArr);
        }

        this.options.changeBind(bindDataArr);
        this.options.changeChartInfo(chartInfo || new ChartInfo());
        this.options.setElemType(this.elemType);
        this.options.setDBMode(DBMode.Editing);
        request(`/bi/charts/data`, {
          method: "POST",
          data: {
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
            this.options.changeChartData(data);
          }
        })

        return formId;
      }
    }).then((formId)  => {
      request(`/bi/forms/${formId}`).then((res) => {
        if(res && res.msg === "success") {
          const data = res.data;
          this.options.setDataSource({id: data.formId, name: data.formName, data: data.items});
        }
      })
    })

    this.callback();
  }
}