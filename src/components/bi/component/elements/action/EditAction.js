import request from '../../../utils/request';
import ChartInfo from '../data/ChartInfo';
import { Types } from '../../bind/Types';
import { getUUID, deepClone } from '../../../utils/Util';
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
        const oldElement = deepClone(data);
        const formId = data.formId;
        const chartInfo = data.chartTypeProp;
        let bindDataObj = {dimensions: [], indexes: [], conditions: []};
        const { dimensions, indexes, conditions } = data;

        if(dimensions && dimensions.length > 0) {
          const dimArr = dimensions.map((each, idx) => {
            let field = each.field;
            field["currentGroup"] = each.currentGroup;
            field["groups"] = each.groups;
            field["sort"] = each.sort;
            field["bindType"] = Types.DIMENSIONS;
            field["idx"] = getUUID();
            return field;
          })

          bindDataObj.dimensions = dimArr;
        }

        if(indexes && indexes.length > 0) {
          const idxArr = indexes.map((each, idx) => {
            const field = each.field;
            field["currentGroup"] = each.currentGroup;
            field["groups"] = each.groups;
            field["dataFormat"] =each.dataFormat;
            field["sort"] = each.sort;
            field["bindType"] = Types.INDEXES;
            field["idx"] = getUUID() 
            return field;
          })

          bindDataObj.indexes = idxArr;
        }

        if(conditions && conditions.length > 0) {
          const filterArr = conditions.map((each, idx) => {
            const field = each.field;
            field["value"] = each.value;
            field["symbol"] = each.symbol;
            field["bindType"] = Types.CONDITIONS;
            field["idx"] = getUUID()
            return field;
          })

          bindDataObj.conditions = filterArr;
        }

        this.options.changeBind(bindDataObj);
        this.options.changeChartInfo(chartInfo || new ChartInfo());
        this.options.setElemType(this.elemType);
        this.options.setDBMode(DBMode.Editing);
        this.options.setElemName(data.name);
        this.options.setOldElement(oldElement);
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