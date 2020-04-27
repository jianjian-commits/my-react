import React, {useState} from "react";
import { connect } from "react-redux";
import { Icon, Button, message } from "antd";
import { setDashboards } from '../../redux/action';
import { useParams, useHistory } from "react-router-dom";
import { renameDB } from "../../utils/reqUtil";
import classes from '../../scss/dashboard/header.module.scss';

const DBHeader = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { dashboards, setDashboards } = props;

  const handleBack = () => {
    setDashboards([]);
    history.push(`/app/${appId}/setting`);
  }

  const onBlur = (e) => {
    renameDB(appId, dashboardId, e.target.value);
    message.success('保存成功');
  }

  const onChange = (e) => {
    setName(e.target.value);
  }

  const [name, setName] = useState("");

  const value = (dashboards && dashboards.length > 0) ? dashboards[0].name : null;
  return (
    <div className={classes.biHeader}>
      <div className={classes.headerBarBack}>
        <Button onClick={handleBack} type="link">
          <Icon type="arrow-left"/>
        </Button>
      </div>
      <input className={classes.renameDB} defaultValue={ name || value || "新建仪表盘" } onChange={onChange} onBlur={onBlur}/>
      {/* <Button onClick={saveDB} className={classes.dbHeaderSave} type="link">
        保 存
      </Button> */}
    </div>
  )
}

export default connect(
  store => ({
    dashboards: store.bi.dashboards
  }),
  { setDashboards }
)(DBHeader);
