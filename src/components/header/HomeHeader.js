import React, { useState } from "react";
import { Layout, Icon } from "antd";
import User from "./UserSection";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import { toggleSiderCollapsed } from "../../store/layoutReducer";
import { getTransactList } from "../../store/loginReducer";

const { Header } = Layout;
const homeHeaderStyle = {
  background: "#2A7FFF",
  padding: 0,
  boxShadow: "0 1px 4px rgba(0,21,41,.08)",
  height: 40,
  lineHeight: "40px"
  // padding: "0 20px",
};


export default connect(
  ({ router, login, layout }) => ({
    router,
    collapsed: layout.sider.collapsed,
    transactList: login.transactList || {}
  }),
  { toggleSiderCollapsed, getTransactList }
)(function HomeHeader(props) {
  const {
    getTransactList,
    collapsed,
    toggleSiderCollapsed
  } = props;
  const [init, setInit] = useState(false);
  React.useEffect(() => {
    if (!init) {
      getTransactList({});
      setInit(false);
    }
  }, [init, getTransactList]);
  return (
<<<<<<< HEAD
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        <Icon
          className={classes.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleSiderCollapsed}
        />
        <div className={classes.nav}></div>
        <div className={classes.user}>
          <User theme="white" />
=======
    <div className={classes.hideHeader}>
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
                  <Badge dot offset={[-8, 8]} count={transactList.total || 0}>
                    待办事项
                  </Badge>
                </Menu.Item>
              </Menu>
            </Authenticate>
          </div>
          <div className={classes.operations}>
            <Authenticate auth={TEAM_MANAGEMENT_ABLE} hide={hides.companyManage}>
              <Button
                type="link"
                // ghost
                style={ghostButton}
                onClick={toTeamMangement}
              >
                <div style={ghostButtonContent}>
                  <CompanyManageIcon
                    style={{
                      marginRight: "5px",
                      stroke: "#2A7FFF",
                      strokeWidth: "0.1",
                      fill: "#fff"
                    }}
                  />
                  公司管理
                </div>
              </Button>
            </Authenticate>
          </div>
          {/* <div className={classes.prompt}>{getPrompt(props.count)}</div> */}
          <div className={classes.user}>
            <User />
          </div>
>>>>>>> 9eccb7f7e18e374f6f79c833b9b8a3c1f8f5b3cc
        </div>
      </div>
    </Header>
  );
});

