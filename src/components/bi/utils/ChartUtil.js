import { Types } from '../component/bind/Types';

export const getOption = (data) => {
  const { xaxisList, legends } = data;

  if(!xaxisList || (xaxisList.length == 0) || !legends || (legends.length == 0)) {
    return {};
  }

  const source = [];
  const series = [];
  const title = ["名称"];

  legends.forEach((each) => {
    title.push(each.legendName);
    series.push({type: 'bar',
      // itemStyle: {
      //   color: 'lightskyblue',
      // },
      // label: {
      //   show: true,
      //   position: 'top',
      //   textStyle: {
      //     color: 'black'
      //   }
      // }
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
    legend: {y: 'bottom'},
    tooltip: {},
    xAxis: [
      {
        type: 'category', 
        name: 'x轴标题', 
        axisLabel: {
          interval:0,  
          rotate:30  
        }
      }],
    yAxis: {name: 'y轴标题'},
    series
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