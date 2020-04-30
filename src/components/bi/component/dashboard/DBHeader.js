import React, {useState} from "react";
import { connect } from "react-redux";
import { Icon, Button, message } from "antd";
import { setDashboards } from '../../redux/action';
import { useParams, useHistory } from "react-router-dom";
import { renameDB } from "../../utils/reqUtil";
import RenameInput from '../base/RenameInput';
import classes from '../../scss/dashboard/header.module.scss';

const DBHeader = props => {
  const history = useHistory();
  const { appId, dashboardId } = useParams();
  const { dashboards, setDashboards } = props;

  const handleBack = () => {
    setDashboards([]);
    history.push(`/app/${appId}/setting`);
  }

  const handleCommit = (val) => {
    renameDB(appId, dashboardId, val);
    message.success('保存成功');
  }

  const name = (dashboards && dashboards.length > 0) ? dashboards[0].name : "";

  return (
    <div className={classes.biHeader}>
      <div className={classes.headerBarBack}>
        <Button onClick={handleBack} type="link">
          <Icon type="arrow-left"/>
        </Button>
      </div>
      <RenameInput name={name} defName="新建仪表盘" handleCommit={handleCommit}/>
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
