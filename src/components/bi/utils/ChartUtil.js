import { Types } from '../component/bind/Types';

export const getOption = (xaxisList) => {
  const legend = xaxisList[0];

  if(!legend) {
    return {};
  }

  const source = [];
  const series = [];

  xaxisList.forEach((each, idx) => {
    let row = [];
    let title = [];
    const items = each.items;

    if(idx == 0) {
      title.push("名称");
      items.forEach((item)=> {
        title.push(item.legend.legendName);
        series.push({type: 'bar'});
      })
      source.push(title);
    }

    row.push(each.dimensionName);
    items.forEach((item)=> {
      row.push(item.count);
    })

    source.push(row);
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