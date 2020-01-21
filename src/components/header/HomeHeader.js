import React from "react";
import { Layout, Menu, Badge, Button } from "antd";
import { useHistory } from "react-router-dom";
import User from "./UserSection";
import classes from "./header.module.scss";
import { connect } from "react-redux";

const { Header } = Layout;
const logoStyle = {
  background: "#eee",
  color: "#333",
  lineHeight: "44px",
  textAlign: "center"
};
const menuStyle = {
  lineHeight: "64px"
};

const HomeHeader = props => {
  const history = useHistory();
  const selectHandle = e => {
    history.push(e.key);
  };
  const toUserMangement = () => history.push("/user/management");
  return (
    <Header className={classes.homeHeader}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <div style={logoStyle}>logo</div>
        </div>
        <div className={classes.nav}>
          <Menu
            style={menuStyle}
            selectedKeys={props.router.location.pathname}
            mode="horizontal"
            theme="dark"
            onClick={selectHandle}
          >
            <Menu.Item key="/app/list">我的应用</Menu.Item>
            <Menu.Item key="/backlog">
              <Badge dot>待办事项</Badge>
            </Menu.Item>
          </Menu>
        </div>
        <div className={classes.operations}>
          <Button icon="user" onClick={toUserMangement}>
            用户管理
          </Button>
        </div>
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
};
export default connect(({ router }) => ({ router }))(HomeHeader);
