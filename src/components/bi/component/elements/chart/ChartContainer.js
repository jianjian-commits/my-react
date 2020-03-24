import React, { PureComponent } from 'react';
import Chart from './Chart';
import { getOption, getOption2 } from '../../../utils/ChartUtil';
import './chart.scss';

const ChartContainer = (props) => {
  const { chartData } = props;
  const chartOption = chartData ? getOption(chartData): getOption2();
  const chart =  <Chart chartOption={chartOption}/>;

  return (
    <div className="chart-container">
      { chart }
    </div>
  )
}

export default ChartContainer;