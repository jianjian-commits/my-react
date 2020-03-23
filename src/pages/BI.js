import React, { useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {DBHeader, DBToolbar, DBEditor} from '../components/bi/component/dashboard';
import classes from "../styles/bi.module.scss";

const BI = props => {
  const HEADER_HEIGHT = 30;
  const TOOLBAR_HEIGHT = 30;

  const { dashboardId } = props;

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

const mapStateToProps = (store) => {
  return {
    dashboardId: store.bi.dashboardId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BI);
