import React, {PureComponent, useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { setDataSource } from '../../redux/action';
import { GroupType } from '../../component/elements/Constant';
import './bind.scss';
import DataListModal from "../elements/modal/dataListModal";
import { Icon } from "antd";


const LeftPane = props => {
  const getItems = (dataSource) => {
    const dataArr = dataSource.data;
    const dimArr = [];
    const meaArr = [];

    if(!dataArr || dataArr.length == 0) {
      return {dimArr, meaArr};
    }

    dataArr.forEach((each, idx) => {
      const currentGroup = GroupType.SUM;
      if(each) {
        if(each.type === "NUMBER") {
          const item = {...each, bindType: "mea", option: {currentGroup}}
          meaArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        } else {
          const item = {...each,  bindType: 'dim', option: {currentGroup}}
          dimArr.push(<DragItem item={item} key={each.id} id={each.id}/>);
        }
      }
    })

    return {dimArr, meaArr};
  }

  const onClick = () => {
    // show modal.
    // this.props.setDataSource();
  }

  const { dataSource } = props;

  const [visible,setVisible] = useState(false); 
  const modalProps = {
    visible,
    showModal: () => {
      setVisible(true);
    },
    handleCancel: e => {
      setVisible(false);
    },
    handleOK: e => {
      setVisible(false);
    }
  };  

  return (
    <div className="left-pane">
      <div className="left-pane-data">
        <div className="data-box">
          <div className="data-text">数据</div>
          <div>
            <DataListModal key={Math.random()} {...modalProps}/>
            <div className="change-data-source" onClick={modalProps.showModal}>更改数据源</div>
          </div>
        </div>
        <div>
          <Icon type="profile" style={{color:"orange"}}/>
          <span className="data-source-name" onClick={onClick}>
            {dataSource.name || "选择数据源"}
          </span>
        </div>
      </div>
      <div className="left-pane-dimension">
          <ul>
            <li className="col-title">非数值型字段</li>
            {getItems(dataSource).dimArr}
          </ul>
      </div>
      <div className="left-pane-measure">
          <ul>
            <li className="col-title">数值型字段</li>
            {getItems(dataSource).meaArr}
          </ul>
      </div>
    </div>
  )
}


export default connect((store) => {
  const state = store.bi;

  return {
    dataArr: state.dataArr,
    dataSource: state.dataSource,
  }
}, { setDataSource })(LeftPane)