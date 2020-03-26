import React, { PureComponent } from 'react';
import Chart from './Chart';
import { Icon } from "antd";
import { getOption } from '../../../utils/ChartUtil';
import './chart.scss';

const ToolbarBtns = props => {

  const { chartId = "default" , iconBtnGroup , isBtnBlock} = props;

  return (
    <span className="iconBtn" 
      style={ isBtnBlock ? { display:"block"} : {display:"none"}} 
      id={chartId + "btns"}
    >
      {iconBtnGroup.map((iconBtn,index) => 
          <Icon type={iconBtn.type} key={index} onClick={iconBtn.click} />
      )}
    </span>
  );
};

const ChartContainer = props => {
  const { chartData, style, chartId = "default"} = props;
  const chartOption = chartData ? getOption(chartData) : {};
  const chart = <Chart chartOption={chartOption} />;

  const isBtnBlock = true ;

  const iconBtnGroup = [
    {
      type:"edit",
      click:()=>{console.log("你点击了编辑按钮1");}
    },
    {
      type:"edit",
      click:()=>{console.log("你点击了编辑按钮2");}
    }
  ]

  const handlMouseEnter = () => {
    document.getElementById(chartId + "btns").style.display = "block";
  };

  const handlMouseLeave = () => {
    document.getElementById(chartId + "btns").style.display = "none";
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
      onMouseEnter={isBtnBlock?null:handlMouseEnter}
      onMouseLeave={isBtnBlock?null:handlMouseLeave}
      style={style}
    >
      <div className="chart-title">这里是图表的标题</div>
      <ToolbarBtns {...props} iconBtnGroup={iconBtnGroup} isBtnBlock={isBtnBlock}/>
      {chart}
    </div>
  );
};

export default ChartContainer;
