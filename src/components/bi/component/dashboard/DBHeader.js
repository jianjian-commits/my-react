import React, {useState} from "react";
import { connect } from "react-redux";
import { Icon, Button } from "antd";
import { setDashboards } from '../../redux/action';
import "../../scss/dashboard.scss";
import request from '../../utils/request';
import { useParams, useHistory } from "react-router-dom";

const DBHeader = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { dashboards, setDashboards } = props;

  const handleBack = () => {
    setDashboards([]);
    history.push(`/app/${appId}/setting`);
  }

  const onBlur = (e) => {
    updateDB(e.target.value);
  }

  const saveDB = () => {
    // history.push(`/app/${appId}/setting`);
  }

  const updateDB = (dbName) => {
    request(`/bi/dashboards/${dashboardId}`, {
      method: "PUT",
      data: {
        name: dbName
      }
    });
  }

  const onChange = (e) => {
    setName(e.target.value);
  }

  const [name, setName] = useState("");

  const value = (dashboards && dashboards.length > 0) ? dashboards[0].name : null;
  return (
    <div className="biHeader">
      <div className="headerBarBack">
        <Button onClick={handleBack} type="link">
          <Icon type="left"/>
        </Button>
      </div>
      <input className="rename-db" value={ name || value || "新建仪表盘" } onChange={onChange} onBlur={onBlur}/>
      <Button onClick={saveDB} className="db-header-save" type="link">
        保 存
      </Button>
    </div>
  )
}

export default connect(
  store => ({
    dashboards: store.bi.dashboards
  }),
  { setDashboards }
)(DBHeader);
