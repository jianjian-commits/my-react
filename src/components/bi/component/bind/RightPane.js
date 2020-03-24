import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { Icon,Tooltip } from 'antd';
import './bind.scss';
import classNames from "classnames";

export default class RightPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIcon:"bar-chart",
    };
  }

  handleSelectIcon = chartIcon => {
    this.setState({activeIcon:chartIcon});
  }

  render() {
    const chartGroup = [
      {type:"bar-chart",intro:"条形图"},
      {type:"area-chart",intro:"条形图"},
      {type:"pie-chart",intro:"饼状图"},
      {type:"line-chart",intro:"折线图"},
      {type:"heat-map",intro:"条形图"},
      {type:"dot-chart",intro:"分布图"},
      {type:"radar-chart",intro:"条形图"},
    ]
    return (
      <div className="right-pane">
        <div className="right-pane-chart">
          <span>可视化</span>
          {chartGroup.map(chart =>
          <Tooltip key={chart.type}  title={chart.intro}>
            <div
              className={classNames("IconBox",{activeIcon:this.state.activeIcon==chart.type})}
              onClick={()=>{this.handleSelectIcon(chart.type)}}
            >
              <Icon type={chart.type}/>
            </div>
          </Tooltip>
          )}
        </div>
        <div className="right-pane-tools">
          <span>工具栏</span>
        </div>
      </div>
    )
  }
}