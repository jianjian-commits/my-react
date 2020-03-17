import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Chart from './Chart';
import './chart.scss';

export default class ChartContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chart-container">
        <Chart />
      </div>
    )
  }
}


connect((store) => ({}), {})(ChartContainer)
