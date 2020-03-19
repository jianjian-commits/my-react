import React, {PureComponent, useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { changeData } from '../../redux/action';
import './bind.scss';

class LeftPane extends PureComponent {
  constructor(props) {
    super(props);
  }

  getItems = (dataSource) => {
    const dataArr = dataSource.data;
    const dimArr = [];
    const meaArr = [];

    if(!dataArr || dataArr.length == 0) {
      return {dimArr, meaArr};
    }

    dataArr.forEach((each, idx) => {
      if(each) {
        if(each.type === "NUMBER") {
          const item = {label: each.label, type: 'mea'}
          meaArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        } else {
          const item = {label: each.label, type: 'dim'}
          dimArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        }
      }
    })

    return {dimArr, meaArr};
  }

  onClick = () => {
    // show modal.
  }

  render() {
    const { dataName, dataSource } = this.props;

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
              {this.getItems(dataSource).dimArr}
            </ul>
        </div>
        <div className="left-pane-measure">
           <ul>
              <li className="col-title">数值型字段</li>
              {this.getItems(dataSource).meaArr}
            </ul>
        </div>
      </div>
    )
  }
}

export default connect((store) => {
  const state = store.bi;

  return {
    dataName: state.dataName,
    dataArr: state.dataArr,
    dataSource: state.dataSource,
    ddd: store
  }
}, { changeData })(LeftPane)