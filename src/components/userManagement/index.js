import React from "react";
import { connect } from "react-redux";
import classes from "./user.module.scss";
import InviteUser from "./inviteUser";

export default connect(({ login }) => ({
  loginData: login.loginData
}))(function UserManagement({ loginData }) {
  return (
    <div className={classes.wrapper}>
      <div>
        <InviteUser loginData={loginData} />
      </div>
      <div>我是用户列表</div>
    </div>
  );
});
