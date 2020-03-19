import React from "react";
import { connect } from "react-redux";
import { Icon, Button } from "antd";
import { renameDashboard } from '../../redux/action';
import "../../scss/dashboard.scss";
import request from '../../utils/request';
import { useParams, useHistory } from "react-router-dom";

    
const DBHeader = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { renameDashboard, dbName } = props;

  const handleBack = () => {
    history.push(`/app/${appId}/setting`);
  }

  const onBlur = (e) => {
    renameDashboard(e.target.value);
  }

  const saveDB = () => {
    history.push(`/app/${appId}/setting`);

    const res = request(`/bi/dashboards/${dashboardId}`, {
      method: "POST",
      data: {
        dashboardId,
      }
    });
  }

  return (
    <div className="biHeader">
      <div className="headerBarBack">
        <Button onClick={handleBack} type="link">
          <Icon type="left"/>
        </Button>
      </div>
      <input className="rename-db" defaultValue={dbName ? dbName : "新建仪表盘"} onBlur={onBlur}/>
      <Button onClick={saveDB} className="db-header-save" type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({ dbName: store.bi.dbName }),
  { renameDashboard }
)(DBHeader);
