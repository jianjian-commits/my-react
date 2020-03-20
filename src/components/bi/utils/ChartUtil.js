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