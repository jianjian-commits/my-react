import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { useParams } from "react-router-dom";
import Chart from './Chart';
import './chart.scss';

const ChartContainer = () => {
  const { elementId } = useParams();

  let chart = elementId ? <Chart /> : <div/>

  return (
    <div className="chart-container">
      { chart }
    </div>
  )
}

export default connect((store) => ({}), {})(ChartContainer)
