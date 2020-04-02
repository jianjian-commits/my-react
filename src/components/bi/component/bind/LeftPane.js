import React, {PureComponent, useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { setDataSource } from '../../redux/action';
import { Types } from './Types';
import { GroupType } from '../../component/elements/Constant';
import DataListModal from "../elements/modal/dataListModal";
import ChangeTipModal from "../elements/modal/changeTipModal";
import { Icon } from "antd";

const DragChild = props => {
  const { item } = props;

  return (
    <li className="bind-item"><Icon type={item.type == "NUMBER" ? "number" : "tags"}
      className="data-icon" style={{color: "#2B81FF"}}/>{item ? item.label : ""}</li>
  );
}

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
          const item = {...each, bindType: Types.MEASURE, option: {currentGroup}}
          meaArr.push(<DragItem item={item} key={each.fieldId} id={each.fieldId} Child={DragChild}/>);
        } else {
          const item = {...each,  bindType: Types.DIMENSION, option: {currentGroup}}
          dimArr.push(<DragItem item={item} key={each.fieldId} id={each.fieldId} Child={DragChild}/>);
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

  const [ listVisible,setListVisible] = useState(false); 
  const listModalProps = {
    visible:listVisible,
    showModal: () => {
      setListVisible(true);
    },
    handleCancel: e => {
      setListVisible(false);
    },
    handleOK: e => {
      setListVisible(false);
    }
  };  

  const [ changeVisible,setChangeVisible] = useState(false); 
  const changeModalProps = {
    visible:changeVisible,
    showModal: () => {
      setChangeVisible(true);
    },
    handleCancel: e => {
      setChangeVisible(false);
    },
    handleOK: e => {
      setChangeVisible(false);
      listModalProps.showModal();
    }
  };  
  return (
    <div className="left-pane">
      <div className="left-pane-data">
        <div className="data-box">
          <div className="data-text">数据</div>
          <div>
            <DataListModal key={Math.random()} {...listModalProps}/>
            <ChangeTipModal {...changeModalProps}/>
            <div className="change-data-source" onClick={changeModalProps.showModal}>更改数据源</div>
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