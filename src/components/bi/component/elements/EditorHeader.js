import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Icon, message} from "antd";
import { changeBind, setDashboards, clearBind, setDBMode , setElemName, setOldElement } from '../../redux/action';
import { updateChartReq, setDB } from '../../utils/reqUtil';
import { DBMode } from '../dashboard/Constant';
import { useParams, useHistory } from "react-router-dom";
import SaveTipModal from "../elements/modal/saveTipModal";
import RenameInput from '../base/RenameInput';
import { getChartObj } from '../../utils/ChartUtil';
import _ from 'lodash';
import classes from '../../scss/elements/element.module.scss';

const EditorHeader = props => {
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();
  const { elemName, bindDataObj, chartInfo, setDashboards, setDBMode,
    dataSource, elemType, setElemName, oldElement, setOldElement } = props;

  const handleBack = () => {
    const { clearBind } = props;
    clearBind();
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
    setDBMode(DBMode.Edit);
  }

  const handleSave = () => {
    Promise.all([
      updateChartReq(elementId, dataSource.id, bindDataObj, elemName, chartInfo, elemType),
      setDB(appId, dashboardId, setDashboards),
      setOldElement(getChartObj(elementId, dataSource.id, bindDataObj, elemName, chartInfo, elemType))
    ]).then(
      message.success("保存成功")
    );
  }

  const handleCommit = (val) => {
    setElemName(val);
  }

  const isChanged = () => {
    const elem = getChartObj(elementId, dataSource.id, bindDataObj, elemName, chartInfo, elemType);
    return !_.isEqual(oldElement, elem);
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
      handleSave();
      setVisible(false);
    },
    //返回但不保存图表
    saveNoChart:e => {
      handleBack();
      setVisible(false);
    }
  };

  const onClickBack = () => {
    isChanged() ? modalProps.showModal() : handleBack()
  }

  return (
    <div className={classes.elementHeader}>
      <SaveTipModal {...modalProps}/>
      <div className={classes.elementHeaderBack}>
        <Button onClick={onClickBack} type="link">
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
    bindDataObj: store.bi.bindDataObj,
    chartInfo: store.bi.chartInfo,
    dataSource: store.bi.dataSource,
    elemType: store.bi.elemType,
    oldElement: store.bi.oldElement
  }),
  { changeBind, setDashboards, clearBind, setDBMode, setElemName, setOldElement }
)(EditorHeader);
