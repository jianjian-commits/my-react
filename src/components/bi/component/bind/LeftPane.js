import React, {PureComponent, useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { changeData } from '../../redux/action';
import './bind.scss';

class LeftPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  getItems = () => {
    const arr = [{text: "姓名", type: 'dim'}, {text: "详细地址", type: 'dim'}, {text: "年龄", type: 'mea'}, 
    {text: "姓名2", type: 'dim'}, {text: "详细地址2", type: 'dim'}, {text: "年龄2", type: 'mea'},
    {text: "姓名3", type: 'dim'}, {text: "详细地址3", type: 'dim'}];

    return arr.map((item)=> {
       return <DragItem item={item} key={item.text}/>;
    });
  }

  onClick = () => {
    // show modal.
  }

  render() {
    const { dataName } = this.props;

    return (
      <div className="left-pane">
        <div className="left-pane-data">
          <span className="data-source-name" onClick={this.onClick}>
            {dataName ? dataName : "选择数据源"}
          </span>
        </div>
        <div className="left-pane-dimension">
            <ul>
              <li className="col-title">非数值型字段</li>
              {this.getItems()}
            </ul>
        </div>
        <div className="left-pane-measure">
           <ul>
              <li className="col-title">数值型字段</li>
              {this.getItems()}
            </ul>
        </div>
      </div>
    )
  }
}

export default connect((store) => ({
  dataName: store.bi.dataName,
  dataArr: store.bi.dataArr
}), { changeData })(LeftPane)