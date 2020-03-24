import { Types } from '../component/bind/Types';

export const getOption = (xaxisList) => {
  const legend = xaxisList[0];

  if(!legend) {
    return {};
  }

  const xTitle = legend.dimensionName;
  const yTitle = "COUNT";
  const source = [];
  const series = [];
  const title = [xTitle, yTitle]
  source.push(title);
  const itemArr = legend.items;

  itemArr.forEach((item) => {
    series.push({type: 'bar'});
    source.push([item.legend.legendName, item.count]);
  });

  return  {
    dataset: {
      source
    },
    legend: {},
    tooltip: {},
    xAxis: {type: 'category'},
    yAxis: {},
    series
  } 
}


/**
 * Get chart attributes for req.
 */
export const getChartAttrs = (bindDataArr) => {
  bindDataArr = bindDataArr || [];
  let dimensions = [], indexes = [];
  const currentGroup = { name: "", value: "COUNT" };
  const groups = [{ name: "", value: "COUNT" }];
  const sort = { fieldId: "", value: "DEFAULT" };
  const conditions = [];

  bindDataArr.forEach((each) => {
    const field = Object.assign({}, each);
    delete field.bindType;

    switch(each.bindType) {
      case Types.DIMENSION:
        dimensions.push({ field, currentGroup, groups, sort });
        break;
      case Types.MEASURE:
        indexes.push({ currentGroup: {name: "求和", value: "SUM"}, field, groups, sort });
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
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', 43.3, 85.8, 93.7],
          ['Milk Tea', 83.1, 73.4, 55.1],
          ['Cheese Cocoa', 86.4, 65.2, 82.5],
          ['Walnut Brownie', 72.4, 53.9, 39.1]
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