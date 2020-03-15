import React from "react";
import { Layout, Menu, Badge, Button } from "antd";
import { useHistory } from "react-router-dom";
import User from "./UserSection";
import Authenticate from "../shared/Authenticate";
import { TEAM_MANAGEMENT_ABLE } from "../../auth";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import arrowLeft from "../../styles/images/arrow-left.svg";

const { Header } = Layout;
const homeHeaderStyle = {
  background: "#2A7FFF",
  height: 50,
  padding: "0 20px",
  lineHeight: "50px"
};
const logoStyle = {
  background: "rgba(255, 255, 255, 0.4)",
  height: "100%",
  color: "#333",
  lineHeight: "37px",
  textAlign: "center"
};
const menuStyle = {
  // lineHeight: "50px",
  background: "transparent"
};
const backThunk = {
  height: "50px",
  display: "flex",
  alignItems: "center",
  marginLeft: "10px",
  position: "absolute"
};
const backArrow = {
  width: "15px",
  height: "14px",
  cursor: "pointer"
};
const backTitle = {
  marginLeft: "19px",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "16px",
  color: "#FFFFFF"
};

export default connect(({ router }) => ({
  router
}))(function HomeHeader(props) {
  const history = useHistory();
  const selectHandle = e => {
    history.push(e.key);
  };
  const toTeamMangement = () => history.push("/team/info");
  const {
    router,
    hides = {
      logo: false,
      menu: false,
      teamManage: false,
      backArrow: true
    }
  } = props;
  return (
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <Authenticate hide={hides.logo}>
            <div style={logoStyle}>logo</div>
          </Authenticate>
        </div>
        <div style={backThunk}>
          <Authenticate hide={hides.backArrow}>
            <div>
              <img
                src={arrowLeft}
                alt=""
                style={backArrow}
                onClick={() => history.push("/")}
              />
            </div>
            <div>
              <span style={backTitle}>团队管理</span>
            </div>
          </Authenticate>
        </div>
        <div className={classes.nav}>
          <Authenticate hide={hides.menu}>
            <Menu
              style={menuStyle}
              selectedKeys={router.location.pathname}
              mode="horizontal"
              // theme="dark"
              onClick={selectHandle}
            >
              <Menu.Item key="/app/list">我的应用</Menu.Item>
              <Menu.Item key="/backlog">
                <Badge dot>待办事项</Badge>
              </Menu.Item>
            </Menu>
          </Authenticate>
        </div>
        <div className={classes.operations}>
          <Authenticate auth={TEAM_MANAGEMENT_ABLE} hide={hides.teamManage}>
            <Button type="link" ghost icon="user" onClick={toTeamMangement}>
              团队管理
            </Button>
          </Authenticate>
        </div>
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
});
