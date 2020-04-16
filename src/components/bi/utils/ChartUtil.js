import { Types } from '../component/bind/Types';
import ChartInfo from '../component/elements/data/ChartInfo';

export const getOption = (chartData, chartInfo) => {
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

/**
 * Get chart attributes for req.
 */
export const getChartAttrs = (bindDataArr) => {
  bindDataArr = bindDataArr || [];
  let dimensions = [], indexes = [];
  const groups = [];
  let sort = { fieldId: "", value: "DEFAULT" };
  const conditions = [];

  bindDataArr.forEach((each) => {
    const field = Object.assign({}, each);
    const option = field.option;
    const currentGroup = option.currentGroup;
    if(option.sort){
      sort = option.sort;
    }
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