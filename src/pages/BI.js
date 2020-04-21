import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import {DBHeader, DBToolbar, DBEditor, DBVisitor, VisitorHeader } from '../components/bi/component/dashboard';
import { DBMode } from '../components/bi/component/dashboard/Constant';
import { setDashboards } from '../components/bi/redux/action';
import { setDB } from '../components/bi/utils/reqUtil';
import classes from "../styles/bi.module.scss";
import "../components/bi/scss/index.scss";

const BI = props => {
  const HEADER_HEIGHT = 50;
  const TOOLBAR_HEIGHT = 45;
  const { dashboardId } = useParams();
  const { formDataArr, dbMode } = props;

  if(!formDataArr || formDataArr.length === 0) {
    setDB(dashboardId, props.setDashboards);
  }

  return (
    <div className={classes.biContainer}>
      {dbMode == DBMode.Edit ? <DBHeader/> : <VisitorHeader/>}
      {dbMode == DBMode.Edit && <DBToolbar/>}
      <div className={classes.biBody}>
        {dbMode == DBMode.Edit ? <DBEditor height={document.body.scrollHeight - HEADER_HEIGHT - TOOLBAR_HEIGHT}/> :
        <DBVisitor height={document.body.scrollHeight - HEADER_HEIGHT}/>}
      </div>
    </div>
  );
};

export default connect((store) => ({
  formDataArr: store.bi.formDataArr,
  dbMode: store.bi.dbMode
  }), { setDashboards })(BI);
