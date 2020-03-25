import React, { PureComponent } from "react";
import Chart from "./Chart";
import { Icon } from "antd";
import { getOption, getOption2 } from "../../../utils/ChartUtil";
import "./chart.scss";

const Toolbarbtns = props => {
  const { chartId = "default" } = props;

  const handleClick = () => {
    console.log("你点击了编辑图表");
  };

  return (
    <span className="iconBtn" style={{ display: "none" }} id={chartId + "btns"}>
      <Icon type="edit" onClick={handleClick} />
    </span>
  );
};

const ChartContainer = props => {
  const { chartData, style, chartId = "default" } = props;
  const chartOption = chartData ? getOption(chartData) : {};
  const chart = <Chart chartOption={chartOption} />;

  const handlMouseEnter = id => {
    document.getElementById(id + "btns").style.display = "block";
  };

  const handlMouseLeave = id => {
    document.getElementById(id + "btns").style.display = "none";
  };

  if (!chartData) {
    return (
      <div className="chart-container" style={style}>
        <div>组件配置异常</div>
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      onMouseEnter={() => {
        handlMouseEnter(chartId);
      }}
      onMouseLeave={() => {
        handlMouseLeave(chartId);
      }}
      style={style}
    >
      <Toolbarbtns {...props} />
      {chart}
    </div>
  );
};

export default ChartContainer;
