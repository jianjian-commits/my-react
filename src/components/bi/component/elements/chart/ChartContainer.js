import React, { PureComponent, useState } from "react";
import Chart from "./Chart";
import { connect } from "react-redux";
import { getOption } from "../../../utils/ChartUtil";
import BlankElement from "../BlankElement";
import { useParams } from "react-router-dom";
import ChartToolbarBtn from "../ChartToolbarBtn";

const ChartContainer = props => {
  const { chartData, style, dashboards, chartName, isBtnBlock=false} = props;
  const { elementId } = useParams();
  const chartOption = chartData ? getOption(chartData) : {};
  const chart = <Chart chartOption={chartOption} />;
  const [btnVisible, setBtnVisible] = useState(isBtnBlock);
  const elements =
    dashboards && dashboards.length > 0 ? dashboards[0].elements : [];
  let name = "新建图表";

  if (elementId) {
    elements.forEach(item => {
      if (item.id == elementId) {
        name = item.name;
      }
    });
  } else {
    name = chartName || name;
  }

  const iconBtnGroup = [
    {
      type: "edit",
      click: () => {
        console.log("你点击了编辑按钮1");
      }
    }
  ];

  const handlMouseEnter = () => {
    if (!isBtnBlock) {
      setBtnVisible(true);
    }
  };

  const handlMouseLeave = () => {
    if (!isBtnBlock) {
      setBtnVisible(false);
    }
  };

  if (!chartData) {
    return (
      <div className="chart-container" style={style}>
        <BlankElement />
      </div>
    );
  }

  return (
    <div
      className="chart-container"
      onMouseEnter={handlMouseEnter}
      onMouseLeave={handlMouseLeave}
      style={style}
    >
      <div className="chart-title">{name}</div>
      {btnVisible && (
        <ChartToolbarBtn
          {...props}
          iconBtnGroup={iconBtnGroup}
          isBtnBlock={isBtnBlock}
        />
      )}
      {chart}
    </div>
  );
};

export default connect(
  store => ({
    dashboards: store.bi.dashboards
  }),
  {}
)(ChartContainer);
