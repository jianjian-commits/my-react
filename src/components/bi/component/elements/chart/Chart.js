import React from "react";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Chart extends React.PureComponent {
    constructor(props) {
      super(props);
    }
  
    render() {
      const { chartOption } = this.props;

      return (<ReactEcharts
        option={chartOption}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        nameLocation='end'
        style={{width: "100%", height: '85%'}}
        onChartReady={this.onChartReadyCallback}/>)
    }

    onChartReadyCallback =() => {
  
    }
  }
  
  export default connect(store => ({}),{})(Chart);