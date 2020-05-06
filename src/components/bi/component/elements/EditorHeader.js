import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Icon, message} from "antd";
import { changeBind, setDashboards, clearBind, setDBMode ,setChartChange, setElemName } from '../../redux/action';
import { updateChartReq, setDB } from '../../utils/reqUtil';
import { DBMode } from '../dashboard/Constant';
import { useParams, useHistory } from "react-router-dom";
import SaveTipModal from "../elements/modal/saveTipModal";
import RenameInput from '../base/RenameInput';
import classes from '../../scss/elements/element.module.scss';

const EditorHeader = props => {
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();
  const { elemName, bindDataArr, chartInfo, setDashboards, setDBMode, setChartChange, isChartEdited,
    dataSource, elemType, setElemName } = props;

  const handleBack = () => {
    const { clearBind } = props;
    clearBind();
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
    setDBMode(DBMode.Edit);
  }

  const handleSave = (name) => {
    Promise.all([
      updateChartReq(elementId, dataSource.id, bindDataArr, name, chartInfo, elemType),
      setDB(appId, dashboardId, setDashboards),
      setChartChange(true)
    ]).then(
      message.success("保存成功")
    );
  }

  const handleCommit = (val) => {
    setElemName(val);
    handleSave(val);
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
      handleBack();
      handleSave(elemName);
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
      <RenameInput name={elemName} handleCommit={handleCommit}/>
      <Button className={classes.elementHeaderSave} onClick={()=> {handleSave(elemName)}} type="link">
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
    dataSource: store.bi.dataSource,
    elemType: store.bi.elemType
  }),
  { changeBind, setDashboards, clearBind, setDBMode ,setChartChange, setElemName }
)(EditorHeader);
