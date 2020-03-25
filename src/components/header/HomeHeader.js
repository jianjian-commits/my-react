import React from "react";
import { Layout, Menu, Badge, Button } from "antd";
import { useHistory } from "react-router-dom";
import User from "./UserSection";
import Authenticate from "../shared/Authenticate";
import { TEAM_MANAGEMENT_ABLE } from "../../auth";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import arrowLeft from "../../styles/images/arrow-left.svg";
import { promptIcon, teamManageIcon } from "../../styles/images/index";

const { Header } = Layout;
const homeHeaderStyle = {
  background: "#2A7FFF",
  height: 50,
  padding: "0 20px",
  lineHeight: "50px"
};
const logoStyle = {
  // background: "rgba(255, 255, 255, 0.4)",
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
const ghostButton = {
  background: "#4F96FF",
  borderRadius: "3px",
  color: "#ffffff",
  width: "110px",
  height: "32px",
  padding: "0",
  marginTop: "9px"
};
const ghostButtonContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
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
  const getPrompt = count => (
    <Badge count={count || 6}>
      <img src={promptIcon} alt="" />
    </Badge>
  );
  return (
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <Authenticate hide={hides.logo}>
            <div style={logoStyle}>
              {/* logo */}
              </div>
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
            <Button
              type="link"
              // ghost
              style={ghostButton}
              onClick={toTeamMangement}
            >
              <div style={ghostButtonContent}>
                <img
                  style={{ paddingRight: "5px" }}
                  src={teamManageIcon}
                  alt=""
                />
                团队管理
              </div>
            </Button>
          </Authenticate>
        </div>
        <div className={classes.prompt}>{getPrompt(props.count)}</div>
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
});
