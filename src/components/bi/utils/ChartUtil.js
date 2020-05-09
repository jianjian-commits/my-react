import { Types } from '../component/bind/Types';
import ChartInfo from '../component/elements/data/ChartInfo';
import { ChartType, AllType, BarType, ChartColor } from '../component/elements/Constant'
import FilterCondition from '../component/elements/data/FilterCondition';
import Field from '../component/elements/data/Field';
import { deepClone, equals } from './Util';

const _setFieldName = field => field.alias||field.legendName;

const _thousands = (value) => {
  if(isNaN(parseFloat(value))) {
    return 0;
  }

  let str = value.toString();
  let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg,"$1,");
}


export const getFormatter = (value, predefine) => {
  if(!predefine) {
    return value;
  }

  const decimals = predefine.decimals;
  const thousands = predefine.thousandSymbols;
  const percent = predefine.percent;

  let result = parseFloat(value);

  if(percent) {
    result = result * 100;
  }

  if(decimals > 0) {
    result = result.toFixed(decimals);
  }

  if(thousands) {
    result = _thousands(result);
  }

  if(percent) {
    result += "%"
  }

  return result;
}

export const getBarChartOption = (chartData, chartInfo) => {
  const { xaxisList, legends } = chartData;
  const { titleXAxis, titleYAxis, showLegend, showDataTag } = chartInfo || new ChartInfo();
  
  if(!xaxisList || (xaxisList.length == 0) || !legends || (legends.length == 0)) {
    return {};
  }

  const source = [];
  const series = [];
  const formats = [];
  const title = ["名称"];
  let oneMeasure = false;

  legends.forEach((each) => {
    title.push(_setFieldName(each));
  })

  source.push(title)
  xaxisList.forEach((each, index) => {
    let row = [];
    const items = each.items;
    row.push(each.dimensionName);

    if(legends.length == items.length) {
      items.forEach((item)=> {
        row.push(item.count);

        if(index == 0) {
          formats.push(item.dataFormat)
        }
      })
    }
    else { // tow dimensions, one measure
      legends.forEach((legend) => {
        let count = "";
        items.forEach((item)=> {
          if(item.legend.legendName == legend.legendName) {
            count = item.count;
            oneMeasure = true;

            if(formats.length === 0) {
              formats.push(item.dataFormat);
            }
          }
        })

        row.push(count);
      })
    }
    source.push(row);
  });

  legends.forEach((each, idx) => {
    let predefine = oneMeasure ? formats[0].predefine : formats[idx].predefine
    series.push({type: 'bar',
      label: {
        show: showDataTag,
        position: 'top',
        textStyle: {
          color: 'black'
        },
        formatter: (v) => {return getFormatter(v.data[v.seriesIndex + 1], predefine)}
      },
      tooltip: {
        trigger: 'item',
        formatter: (v) => {return _setFieldName(each) + "<br/>" + v.data[0] + ": " +
          getFormatter(v.data[v.seriesIndex + 1], predefine)}
      }
    });
  })

  return  {
    dataset: {
      source
    },
    legend: {y: 'top', show: showLegend},
    tooltip: {
      backgroundColor: 'rgba(255,255,255, 0.9)',
      textStyle: {
        color: '#777F97'
      }
    },
    xAxis: [
      {
        type: 'category', 
        name: titleXAxis || "", 
        axisLabel: {
          interval:0 ,
          rotate: 30
        }
      }],
    yAxis: {name: titleYAxis || ""},
    color: ChartColor,
    grid: {top: '80px'},
    series
  } 
}

export const getIndexChartOption = (chartData, chartInfo) => {
  const { headItem, items } = chartData;
  let indexData = [];
  let headData = {
    name: '',
    count: ''
  };

  if(!headItem || (headItem.length == 0) || !items || (items.length == 0)) {
    return {};
  }

  headData.name = headItem.name;
  headData.count = getFormatter(headItem.count, headItem.dataFormat.predefine);
  
  indexData.push(headData);
  if(items.length > 1){
    items.forEach(item=>{
      item = {
        ...item,
        count: getFormatter(item.count, item.dataFormat.predefine)
      }
      indexData.push(item);
    })
  }
  return indexData;
}

export const getPieChartOption = (chartData, chartInfo) => {
  const { sectorItems, legends } = chartData;
  const { showDataTag, showLegend } = chartInfo || new ChartInfo();

  if(!sectorItems || (sectorItems.length == 0) || !legends || (legends.length == 0)) {
    return {};
  }

  const series = [];

  if( legends.length == sectorItems.length ) {
    const data = [];

    sectorItems.forEach((item, idx) => {
      data.push({ name: legends[idx].legendName, value: sectorItems[idx].count });
    })

    const series_item = {
      type: "pie",
      label: {
        show: showDataTag,
        position: 'top',
        textStyle: {
          color: 'gray'
        },
        formatter: function(p) { return p.name + ": " + getFormatter(p.value, sectorItems[0].dataFormat.predefine) +
          `(${p.percent}%)`}
      },
      data: data
    }

    series.push(series_item);
  }

    
  return  {
    legend: {y: "top", show: showLegend},
    tooltip: {
      trigger: 'item',
      formatter: function(p) {return  p.name + "<br/>" + getFormatter(p.value, sectorItems[0].dataFormat.predefine) +
        "<br/>" + `${p.percent}%`}
    },
    labelLine : {show: true},
    color: ChartColor,
    series
  } 
}


export const getOption = (chartData, chartInfo, elemType) => {
  if(equals(chartData, {})) {
    return {};
  }

  switch(elemType){
    case ChartType.HISTOGRAM:
      return getBarChartOption(chartData, chartInfo);
    case ChartType.INDEX_DIAGRAM: 
      return getIndexChartOption(chartData, chartInfo); 
    case ChartType.PIE:
      return getPieChartOption(chartData, chartInfo);
    default:
      break;
  }
}

export const getChartAvailableList = (bindDataObj) => {
  if(!bindDataObj || equals(bindDataObj, {})) {
    return AllType;
  }

  let dimCount = bindDataObj.dimensions ? bindDataObj.dimensions.length : 0;
  let idxCount = bindDataObj.indexes ? bindDataObj.indexes.length : 0;
  return dimCount > 1 || idxCount > 1 ? BarType : AllType;
}

export const getChartObj = (id, formId, bindDataObj, name, chartTypeProp, type) => {
  const { dimensions, indexes, conditions } = getChartAttrs(bindDataObj);

  return {
    chartTypeProp,
    conditions,
    dimensions,
    indexes,
    formId,
    name,
    type,
    id
  }
}

/**
 * Get chart attributes for req.
 */
export const getChartAttrs = (bindDataObj) => {
  let { dimensions, indexes, conditions } = bindDataObj;
  let dimensionsArr = [], indexesArr = [], conditionsArr = [];

  if(dimensions && dimensions.length > 0) {
    dimensions.forEach((each) => {
      dimensionsArr.push(_getField(each, true))
    })
  }

  if(indexes && indexes.length > 0) {
    indexes.forEach((each) => {
      indexesArr.push(_getField(each))
    })
  }

  if(conditions && conditions.length > 0) {
    conditions.forEach((each) => {
      const field = {fieldId: each.fieldId, type: each.type, label: each.label, alias: each.alias};
      conditionsArr.push({field, value: each.value, symbol: each.symbol});
    })
  }

  return { dimensions: dimensionsArr, indexes: indexesArr, conditions: conditionsArr };
}

const _getField = (val, isDim) => {
  const field = deepClone(val);

  const groups = [];
  let dataFormat = field.dataFormat ? field.dataFormat : {};
  let sort = field.sort ? field.sort : { fieldId: "", value: "DEFAULT" };
  const currentGroup = field.currentGroup;

  delete field.bindType;
  delete field.currentGroup;
  delete field.dataFormat;
  delete field.idx;
  delete field.sort;
  delete field.groups;

  return isDim ? { field, currentGroup, groups, sort} :
    { field, currentGroup, groups, sort, dataFormat};
}