import React from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {DBHeader, DBToolbar, DBEditor} from '../components/bi/component/dashboard';
import { setDashboards } from '../components/bi/redux/action';
import { setDB } from '../components/bi/utils/reqUtil';
import classes from "../styles/bi.module.scss";

const BI = props => {
  const HEADER_HEIGHT = 30;
  const TOOLBAR_HEIGHT = 30;
  const { dashboardId } = useParams();
  const { formDataArr } = props;

  if(!formDataArr || formDataArr.length == 0) {
    setDB(dashboardId, props.setDashboards);
  }

  return (
    <div className={classes.biContainer}>
      <DBHeader/>
      <DBToolbar/>
      <div className={classes.biBody}>
        <DBEditor height={document.body.scrollHeight - HEADER_HEIGHT - TOOLBAR_HEIGHT} />
      </div>
    </div>
  );
};

export default connect((store) => ({
  formDataArr: store.bi.formDataArr}), { setDashboards })(BI);
