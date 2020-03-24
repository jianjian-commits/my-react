import React, {PureComponent, useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { setDataSource } from '../../redux/action';
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
          const item = {...each, bindType: "mea"}
          meaArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        } else {
          const item = {...each,  bindType: 'dim'}
          dimArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        }
      }
    })

    return {dimArr, meaArr};
  }

  onClick = () => {
    // show modal.
    // this.props.setDataSource();
  }

  render() {
    const { dataSource } = this.props;

    return (
      <div className="left-pane">
        <div className="left-pane-data">
          <span className="data-source-name" onClick={this.onClick}>
            {dataSource.name || "选择数据源"}
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
    dataArr: state.dataArr,
    dataSource: state.dataSource,
  }
}, { setDataSource })(LeftPane)