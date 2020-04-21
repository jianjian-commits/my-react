import React from "react";
import { connect } from "react-redux";
import { Icon, Button } from "antd";
import { setDashboards } from '../../redux/action';
import { useParams, useHistory } from "react-router-dom";
import classes from '../../scss/dashboard/header.module.scss';

const VisitorHeader = props => {
  const history = useHistory();
  const { appId } = useParams();
  const { dashboards, setDashboards } = props;

  const handleBack = () => {
    setDashboards([]);
    history.push(`/app/${appId}/setting`);
  }

  const value = (dashboards && dashboards.length > 0) ? dashboards[0].name : null;
  return (
    <div className={classes.biHeader}>
      <div className={classes.headerBarBack}>
        <Button onClick={handleBack} type="link">
          <Icon type="arrow-left"/>
        </Button>
      </div>
      <div className={classes.renameDB}>{value}</div>
    </div>
  )
}

export default connect(
  store => ({
    dashboards: store.bi.dashboards
  }),
  { setDashboards }
)(VisitorHeader);
