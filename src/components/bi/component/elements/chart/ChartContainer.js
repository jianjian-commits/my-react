import React, { PureComponent } from 'react';
import Chart from './Chart';
import { getOption, getOption2 } from '../../../utils/ChartUtil';
import './chart.scss';

const ChartContainer = (props) => {
  const { chartData, style } = props;
  const chartOption = chartData ? getOption(chartData): {};
  const chart =  <Chart chartOption={chartOption}/>;

  if(!chartData) {
    return (
      <div className="chart-container" style={style}>
        <div>组件配置异常</div>
      </div>
    )
  }

  return (
    <div className="chart-container" style={style}>
      { chart }
    </div>
  )
}

export default ChartContainer;