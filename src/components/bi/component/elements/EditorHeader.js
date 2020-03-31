import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Icon} from "antd";
import { changeBind, setDashboards, clearBind, setDBMode } from '../../redux/action';
import { updateChartReq, setDB } from '../../utils/reqUtil';
import { DBMode } from '../dashboard/Constant';
import { useParams, useHistory } from "react-router-dom";

const EditorHeader = props => {
  const history = useHistory();
  const { appId, dashboardId, elementId } = useParams();
  const { elemName, bindDataArr, setDashboards, setDBMode } = props;
  let [name, setName] = useState("新建图表");

  const handleBack = () => {
    const { clearBind } = props;
    clearBind();
    history.push(`/app/${appId}/setting/bi/${dashboardId}`);
    setDBMode(DBMode.Edit);
  }

  const handleSave = (name) => {
    updateChartReq(elementId, bindDataArr, name);
    setDB(dashboardId, setDashboards);
  }

  const onBlur = (e) => {
    setName(e.target.value);
    handleSave(e.target.value);
  }

  return (
    <div className="element-header">
      <div className="element-header-back">
        <Button onClick={handleBack} type="link">
          <Icon type="arrow-left" style={{color:"#fff"}}/>
        </Button>
      </div>
      <input className="rename-element" defaultValue={elemName ? elemName: "新建图表"} onBlur={onBlur}/>
      <Button onClick={()=> {handleSave(name)}} className="element-header-save" type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({
    elemName: store.bi.elemName,
    bindDataArr: store.bi.bindDataArr
  }),
  { changeBind, setDashboards, clearBind, setDBMode }
)(EditorHeader);
