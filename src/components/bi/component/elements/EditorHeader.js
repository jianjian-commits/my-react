import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Icon} from "antd";
import { changeBind, setDashboards, clearBind, setDBMode ,saveChartChange } from '../../redux/action';
import { updateChartReq, setDB } from '../../utils/ReqUtil';
import { DBMode } from '../dashboard/Constant';
import { useParams, useHistory } from "react-router-dom";
import SaveTipModal from "../elements/modal/saveTipModal";
import classes from '../../scss/elements/element.module.scss';

const EditorHeader = props => {
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();
  const { elemName, bindDataArr, chartInfo, setDashboards, setDBMode, saveChartChange, isChartEdited, dataSource} = props;
  let [name, setName] = useState("新建图表");

  const handleBack = () => {
    const { clearBind } = props;
    clearBind();
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
    setDBMode(DBMode.Edit);
  }

  const handleSave = (name) => {
    updateChartReq(elementId, dataSource.id, bindDataArr, name, chartInfo);
    setDB(dashboardId, setDashboards);
    saveChartChange();
  }

  const onBlur = (e) => {
    setName(e.target.value);
    handleSave(e.target.value);
  }

  const [visible, setVisible] = useState(false);
  const modalProps = {
    visible,
    showModal: () => {
      setVisible(true);
    },
    handleCancel: e => {
      setVisible(false);
    },
    //返回且保存图表
    saveChart: e => {
      handleSave(name);
      handleBack();
      setVisible(false);
    },
    //返回但不保存图表
    saveNoChart:e => {
      handleBack();
      setVisible(false);
    }
  };

  return (
    <div className={classes.elementHeader}>
      <SaveTipModal {...modalProps}/>
      <div className={classes.elementHeaderBack}>
        <Button onClick={isChartEdited ? modalProps.showModal : handleBack} type="link">
          <Icon type="arrow-left" style={{color:"#fff"}}/>
        </Button>
      </div>
      <input className={classes.renameElement} defaultValue={elemName ? elemName: "新建图表"} onBlur={onBlur}/>
      <Button onClick={()=> {handleSave(name)}} className={classes.elementHeaderSave} type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({
    elemName: store.bi.elemName,
    bindDataArr: store.bi.bindDataArr,
    isChartEdited:store.bi.isChartEdited,
    chartInfo: store.bi.chartInfo,
    dataSource: store.bi.dataSource
  }),
  { changeBind, setDashboards, clearBind, setDBMode ,saveChartChange}
)(EditorHeader);
