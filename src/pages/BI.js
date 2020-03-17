import React, { useState } from "react";
import { connect } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import {DBHeader, DBToolbar, DBEditor} from '../components/bi/component/dashboard';
import classes from "../styles/bi.module.scss";

const BI = props => {
  const HEADER_HEIGHT = 30;
  const TOOLBAR_HEIGHT = 30;

  return (
    <div className={classes.biContainer} style={{height: document.body.scrollHeight}}>
      <DBHeader/>
      <DBToolbar/>
      <div className={classes.biBody} style={{ height: document.body.scrollHeight - HEADER_HEIGHT - TOOLBAR_HEIGHT }}>
        <DBEditor/>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    dashboardId: state.dashboardId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BI);
