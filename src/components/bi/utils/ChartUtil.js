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

export const _getFormatter = (value, predefine) => {
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

//check is data include %
const _checkBarPercent = xaxisList => {
  return xaxisList[0].items[0].formatCount.includes("%") ? v => v.data[1]+"%" : null;
}
//slice % of data
const _slicePercent = str => str.includes("%") ? str.substr(0,str.length-1) : str ;

export const getBarChartOption = (chartData, chartInfo) => {
  const { xaxisList, legends } = chartData;
  const { titleXAxis, titleYAxis, showLegend, showDataTag } = chartInfo || new ChartInfo();
  
  if(!xaxisList || (xaxisList.length == 0) || !legends || (legends.length == 0)) {
    return {};
  }

  //is show %  
  const formatter = _checkBarPercent(xaxisList);

  const source = [];
  const series = [];
  const title = ["名称"];

  legends.forEach((each) => {
    title.push(_setFieldName(each));
    series.push({type: 'bar',
      label: {
        show: showDataTag,
        position: 'top',
        textStyle: {
          color: 'black'
        },
        formatter
      }
    });
  })

  source.push(title)
  xaxisList.forEach((each) => {
    let row = [];
    const items = each.items;
    row.push(each.dimensionName);

    if(legends.length == items.length) {
      items.forEach((item)=> {
        row.push(_slicePercent(item.formatCount));
      })
    }
    else { // tow dimensions, one measure
      legends.forEach((legend) => {
        let count = "";
        items.forEach((item)=> {
          if(item.legend.legendName == legend.legendName) {
            count = _slicePercent(item.formatCount);
          }
        })

        row.push(count);
      })
    }
    source.push(row);
  });

  const style = {
    color: 'red'
  }

  return  {
    dataset: {
      source
    },
    legend: {y: 'top', show: showLegend},
    tooltip: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      textStyle: {
        color: '#777F97'
      },
      formatter
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

const _checkIndexPercent = item => {
  let predefine = item.dataFormat.predefine;
  let count = item.count;

  return _getFormatter(count,predefine);
}
const _checkIndexSumPercent = item => {
  let predefine = item.dataFormat.predefine;
  let count = item.count.toString();

  return _getFormatter(count,predefine);
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
  headData.count = _checkIndexSumPercent(headItem);
  
  indexData.push(headData);
  if(items.length > 1){
    items.forEach(item=>{
      item = {
        ...item,
        count: _checkIndexPercent(item) || item.count
      }
      indexData.push(item);
    })
  }
  return indexData;
}

const _checkPiePercent = (sectorItems, value) => {
  let predefine = sectorItems[0].dataFormat.predefine;

  return _getFormatter(value,predefine);
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
        formatter: function(p) {return  p.name + ":"+ _checkPiePercent(sectorItems,p.value)}
      },
      data: data
    }

    series.push(series_item);
  }

    
  return  {
    legend: {y: "top", show: showLegend},
    tooltip: {
      trigger: 'item',
      formatter: function(p) {return  p.name + "<br/>"+  _checkPiePercent(sectorItems,p.value)}
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
    case ChartType.AREA_CHART: 
      return getPieChartOption(chartData, chartInfo);
    default:
      break;
  }
}

export const getChartAvailableList = (bindDataArr) => {
  if(!bindDataArr) {
    return AllType;
  }

  let dimCount = 0;
  let meaCount = 0;
  bindDataArr.forEach((each) => {
    if(each.bindType == Types.DIMENSION) {
      dimCount++;
    }

    if(each.bindType == Types.MEASURE) {
      meaCount++;
    }
  })

  return dimCount > 1 || meaCount > 1 ? BarType : AllType;
}

/**
 * Get chart attributes for req.
 */
export const getChartAttrs = (bindDataArr) => {
  bindDataArr = bindDataArr || [];
  let dimensions = [], indexes = [];
  const groups = [];
  let sort = { fieldId: "", value: "DEFAULT" };
  let dataFormat = {};
  const conditions = [];
  bindDataArr.forEach((each) => {
    if(each.bindType == Types.FILTER) {
      const field = new Field(each.fieldId, each.label, each.type);
      let condition = new FilterCondition(field, each.value, each.symbol);
      conditions.push(condition);
      return; // continue
    }
    
    const field = deepClone(each);
    const currentGroup = field.currentGroup;
    if(field.dataFormat){
      dataFormat=field.dataFormat;
    }
    if(field.sort) {
      sort = field.sort;
    }

    delete field.bindType;
    delete field.currentGroup;
    delete field.dataFormat;
   
    switch(each.bindType) {
      case Types.DIMENSION:
        dimensions.push({ field, currentGroup, groups, sort});
        break;
      case Types.MEASURE:
        indexes.push({ field, currentGroup, groups, sort,dataFormat});
        break;
      default:
        console.log("wrong type!");
    }
  })

  return { dimensions, indexes, conditions };
}

export const getOption2 = () => {
  return  {
    dataset: {
      source: [
          ['product', '性别', '数量'],
          ['Matcha Latte', "男", 85.8],
          ['Milk Tea', "女", 73.4],
          ['Cheese Cocoa', "男", 65.2],
          ['Walnut Brownie', "女", 53.9]
      ]
    },
    legend: {},
    tooltip: {},
    xAxis: {type: 'category'},
    yAxis: {},
    series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'}
    ]
  } 
}