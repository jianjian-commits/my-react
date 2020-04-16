import { Types } from '../component/bind/Types';
import ChartInfo from '../component/elements/data/ChartInfo';
import { setElemType } from '../redux/action'
import { AllType, PieType, BarType, BarIndexType } from '../component/elements/Constant'

export const getBarChartOption = (chartData, chartInfo) => {
  const { xaxisList, legends } = chartData;
  const { titleXAxis, titleYAxis, showLegend, showDataTag } = chartInfo || new ChartInfo();

  if(!xaxisList || (xaxisList.length == 0) || !legends || (legends.length == 0)) {
    return {};
  }

  const source = [];
  const series = [];
  const title = ["名称"];

  legends.forEach((each) => {
    title.push(each.legendName);
    series.push({type: 'bar',
      label: {
        show: showDataTag,
        position: 'top',
        textStyle: {
          color: 'black'
        }
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
        row.push(item.count);
      })
    }
    else { // tow dimensions, one measure
      legends.forEach((legend) => {
        let count = 0

        items.forEach((item)=> {
          if(item.legend.legendName == legend.legendName) {
            count = item.count;
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
    tooltip: {},
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
    // color: [],
    grid: {top: '80px'},
    series
  } 
}

export const getIndexChartOption = (chartData, chartInfo) => {
  const { headItem, items } = chartData;
  let indexData = [];

  if(!headItem || (headItem.length == 0) || !items || (items.length == 0)) {
    return {};
  }

  indexData.push(headItem);
  if(items.length > 1){
    items.forEach(item=>{
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

  const source = [];
  const series = [];

  if( legends.length == sectorItems.length ){
    sectorItems.forEach((item) => {
      series.push({type: "pie",
        label: {
          show: showDataTag,
          position: 'top',
          textStyle: {
            color: 'gray'
          }
        }
      });
      let row = [];
      const legend = item.legend;
      legends.forEach((each) => {
        if(each.legendName == legend.legendName){
          row.push(each.legendName);
          row.push(item.count);
        }
      })
      source.push(row);
    })
  }
    

  // console.log(source)
  return  {
    dataset: {
      source
    },
    radius : '55%', 
    center: ['50%', '50%'], 
    legend: {y: "top", show: showLegend},
    tooltip: {
      trigger: 'item',
      formatter: '{c}<br/>({d}%)'
    },
    label:{ 
      show: true, 
      formatter: '{c} ({d}%)'
    }, 
    labelLine :{show:true},
    grid: {
      top: '40%',
    },
    series
  } 
}


export const getOption = (chartData, chartInfo, elemType) => {

  switch(elemType){
    case "HISTOGRAM": 
      return getBarChartOption(chartData, chartInfo);
    case "INDEX_DIAGRAM": 
      return getIndexChartOption(chartData, chartInfo); 
    case "AREA_CHART": 
      return getPieChartOption(chartData, chartInfo);
    default:
      break;
  }
}


export const getChartAvailableList = (bindDataArr) => {
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

  if((dimCount == 1 && meaCount > 1) || (dimCount == 2 && meaCount == 1) || (dimCount == 2 && meaCount == 0) || (dimCount > 1 && meaCount == 0) || (dimCount == 0 && meaCount > 1)){
    return BarType;
  } else {
    return AllType;
  }
}

/**
 * Get chart attributes for req.
 */
export const getChartAttrs = (bindDataArr) => {
  bindDataArr = bindDataArr || [];
  let dimensions = [], indexes = [];
  const groups = [{ name: "", value: "COUNT" }];
  const sort = { fieldId: "", value: "DESC" };
  const conditions = [];

  bindDataArr.forEach((each) => {
    const field = Object.assign({}, each);
    const option = field.option;
    const currentGroup = option.currentGroup;
    delete field.bindType;
    delete field.option;

    switch(each.bindType) {
      case Types.DIMENSION:
        dimensions.push({ field, currentGroup, groups, sort });
        break;
      case Types.MEASURE:
        indexes.push({ field, currentGroup, groups, sort });
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