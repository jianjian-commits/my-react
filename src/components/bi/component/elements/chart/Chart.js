import React from "react";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Chart extends React.PureComponent {
    constructor(props) {
      super(props);
    }
  
    render() {
      return (<ReactEcharts
        option={this.getOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        nameLocation='end'
        style={{width: "100%", height: '85%'}}
        onChartReady={this.onChartReadyCallback}/>)
    }
  
    getOption = () => {
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
  
    onChartReadyCallback =() => {
  
    }
  }
  
  export default connect(store => ({}),{})(Chart);