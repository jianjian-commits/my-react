import React from "react";
import { Button } from "antd";
import classes from "./user.module.scss";
class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={classes.wrapper}>
        <div>
          <Button type="primary" onClick={null}>
            邀请用户
          </Button>
        </div>
        <div>我是用户列表</div>
      </div>
    );
  }
}

export default UserManagement;
