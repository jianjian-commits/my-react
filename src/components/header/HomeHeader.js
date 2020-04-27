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
        </div>
      </div>
    </Header>
  );
});

