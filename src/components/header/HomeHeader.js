import React from "react";
import { Layout, Menu, Badge, Button } from "antd";
import { useHistory } from "react-router-dom";
import User from "./UserSection";
import Authenticate from "../shared/Authenticate";
import { TEAM_MANAGEMENT_ABLE } from "../../auth";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import {
  ArrowLeftIcon
  // , PromptIcon
} from "../../assets/icons/header";
import { TeamManageIcon } from "../../assets/icons/teams";

const { Header } = Layout;
const homeHeaderStyle = {
  background: "#2A7FFF",
  height: 40,
  padding: "0 20px",
  lineHeight: "40px"
};
const logoStyle = {
  // background: "rgba(255, 255, 255, 0.4)",
  height: "100%",
  color: "#333",
  lineHeight: "37px",
  textAlign: "center"
};
const menuStyle = {
  // lineHeight: "40px",
  background: "transparent"
};
const backThunk = {
  height: "40px",
  display: "flex",
  alignItems: "center",
  marginLeft: "4.5px",
  position: "absolute"
};
const backImg = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "26px",
  height: "26px",
  cursor: "pointer"
};
const backArrow = {
  width: "15px",
  height: "14px"
};
const backTitle = {
  marginLeft: "13.5px",
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "14px",
  color: "#FFFFFF"
};
const ghostButton = {
  // background: "#4F96FF",
  borderRadius: "3px",
  color: "#ffffff",
  width: "110px",
  height: "32px",
  padding: "0"
};
const ghostButtonContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(255,255,255,0.9)"
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
      backArrow: "init",
      backUrl: null
    }
  } = props;
  // const getPrompt = count => (
  //   <Badge count={count || 6}>
  //     <PromptIcon />
  //   </Badge>
  // );
  return (
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <Authenticate hide={hides.logo}>
            <div style={logoStyle}>{/* logo */}</div>
          </Authenticate>
        </div>
        <div style={backThunk}>
          <Authenticate hide={hides.backArrow === "init"}>
            <div
              style={backImg}
              className={classes.backImg}
              onClick={
                hides.backArrow === "init"
                  ? null
                  : () => history.push(hides.backUrl)
              }
            >
              <ArrowLeftIcon style={backArrow} />
            </div>
            <div>
              <span style={backTitle}>{hides.backArrow}</span>
            </div>
          </Authenticate>
        </div>
        <div className={classes.homeNav}>
          <Authenticate hide={hides.menu}>
            <Menu
              style={menuStyle}
              selectedKeys={router.location.pathname}
              mode="horizontal"
              // theme="dark"
              onClick={selectHandle}
            >
              <Menu.Item key="/app/list">
                <span>我的应用</span>
              </Menu.Item>
              <Menu.Item key="/backlog">
                <Badge dot offset={[-8, 9]}>
                  待办事项
                </Badge>
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
                <TeamManageIcon
                  style={{
                    marginRight: "5px",
                    stroke: "#2A7FFF",
                    strokeWidth:"0.1",
                    fill:"#fff"
                  }}
                />
                团队管理
              </div>
            </Button>
          </Authenticate>
        </div>
        {/* <div className={classes.prompt}>{getPrompt(props.count)}</div> */}
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
});
