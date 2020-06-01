import React, {useState} from "react";
import DragItem from './DragItem';
import { connect } from "react-redux";
import { setDataSource } from '../../redux/action';
import { Types } from './Types';
import DataListModal from "../elements/modal/dataListModal";
import { Icon } from "antd";
import classes from '../../scss/bind/leftPane.module.scss';

const DragChild = props => {
  const { item } = props;

  return (
    <li className={classes.bindItem}><Icon type={item.type == "NUMBER" ? "number" : "tags"}
      className={classes.dataIcon} style={{color: "#2B81FF"}}/>{item ? item.label : ""}</li>
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
      if(each) {
        const item = {...each, bindType: each.type === "NUMBER" ? Types.INDEXES : Types.DIMENSIONS}
        const arr = each.type === "NUMBER" ? meaArr : dimArr;
        const comp = <DragItem item={item} key={each.fieldId} id={each.fieldId} Child={DragChild}/>;
        arr.push(comp);
      }
    })

    return {dimArr, meaArr};
  }

  const onClick = () => {
    // show modal.
    // this.props.setDataSource();
  }

  const { dataSource } = props;

  const [ listVisible, setListVisible] = useState(false); 
  const listModalProps = {
    visible:listVisible,
    type:"change",
    setVisible: setListVisible
  };
  return (
    <div className={classes.leftPane}>
      <div className={classes.leftPaneData}>
        <div className={classes.dataBox}>
          <div>数据</div>
          <div>
            <DataListModal key={Math.random()} {...listModalProps}/>
            <div className={classes.changeDataSource} onClick={() => setListVisible(true)}>更改数据源</div>
          </div>
        </div>
        <div>
          <Icon type="profile" style={{color:"orange"}}/>
          <span className={classes.dataSourceName} onClick={onClick}>
            {dataSource.name || "选择数据源"}
          </span>
        </div>
      </div>
      <div className={classes.leftPaneDimension}>
          <div className={classes.colTitle}>非数值型字段</div>
          <div className={classes.fieldContainer}>
            {getItems(dataSource).dimArr}
          </div>
      </div>
      <div className={classes.leftPaneMeasure}>
          <div className={classes.colTitle}>数值型字段</div>
          <div className={classes.fieldContainer}>
            {getItems(dataSource).meaArr}
          </div>
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