import React from "react";
import { Button } from "antd";
import classes from "./profile.module.scss";

class ProfileManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={classes.wrapper}>
        <div>
          <Button type="primary" onClick={null}>
            添加分组
          </Button>
        </div>
        <div>我是分组列表</div>
      </div>
    );
  }
}
export default ProfileManagement;
