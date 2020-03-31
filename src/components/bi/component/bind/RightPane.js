import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { Icon,Tooltip, Checkbox, Input } from 'antd';
import classNames from "classnames";

export default class RightPane extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIcon:"bar-chart",
      seriesCheck: true,
      dataCheck: false
    };
  }

  showSeries = () => {
    this.setState({seriesCheck: !this.state.seriesCheck});
  }

  showDataTag = () => {
    this.setState({dataCheck: !this.state.dataCheck});
  }

  handleSelectIcon = chartIcon => {
    this.setState({activeIcon:chartIcon});
  }

  render() {
    const chartGroup = [
      {type:"barChart",intro:"条形图"},
    ]
    return (
      <div className="right-pane">
        <div className="right-pane-chart">
          <span>可视化</span>
          <div className="chart-group">
          {chartGroup.map(chart =>
          <Tooltip key={chart.type}  title={chart.intro}>
            <div
              className={classNames("IconBox",{activeIcon:this.state.activeIcon==chart.type})}
              onClick={()=>{this.handleSelectIcon(chart.type)}}
            >
              <img src={"/image/davinci/"+chart.type+".svg"}/>
            </div>
          </Tooltip>
          )}
          </div>
        </div>
        <div className="right-pane-tools">
          <span className="title">工具栏</span>
          <p>X轴标题</p>
          <Input />
          <p>Y轴标题</p>
          <Input />
          <div className="checkboxGroup">
            <Checkbox checked={this.state.dataCheck} onClick={this.showDataTag}>显示数据标签</Checkbox>
            <Checkbox checked={this.state.seriesCheck} onClick={this.showSeries}>显示图例</Checkbox>
          </div>
        </div>
      </div>
    )
  }
}