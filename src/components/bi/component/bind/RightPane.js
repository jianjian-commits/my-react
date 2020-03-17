import React, {PureComponent} from "react";
import { connect } from "react-redux";
import { Icon } from 'antd';
import './bind.scss'

export default class RightPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="right-pane">
        <div className="right-pane-chart">
          <Icon type="bar-chart" style={{fontSize: '52px', color: 'lightgreen', border: "2px solid #169bd5",
            theme: "outlined", margin: '5px 5px 5px 5px'}}/>
        </div>
        <div className="right-pane-tools">
          <span>工具栏</span>
        </div>
      </div>
    )
  }
}