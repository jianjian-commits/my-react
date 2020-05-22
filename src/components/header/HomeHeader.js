import React, { useState } from "react";
import { Layout } from "antd";
import User from "./UserSection";
import classes from "./header.module.scss";
import { HeaderLogo } from "../../assets/images";
import { connect } from "react-redux";
import { toggleSiderCollapsed } from "../../store/layoutReducer";
import { getTransactList } from "../../store/loginReducer";
import { Link } from "react-router-dom";

const { Header } = Layout;
const homeHeaderStyle = {
  background: "#2A7FFF",
  padding: "0 20px 0 0",
  boxShadow: "0 1px 4px rgba(0,21,41,.08)",
  height: 40,
  lineHeight: "40px"
  // padding: "0 20px",
};


export default connect(
  ({ router, login, layout }) => ({
    router,
    collapsed: layout.sider.collapsed,
    transactList: login.transactList || {},
    login
  }),
  { toggleSiderCollapsed, getTransactList }
)(function HomeHeader(props) {
  const {
    getTransactList,
    // collapsed,
    // toggleSiderCollapsed
  } = props;
  const [init, setInit] = useState(false);
  React.useEffect(() => {
    if (!init) {
      props.login.userId && getTransactList({});
      setInit(false);
    }
  }, [init, getTransactList, props.login.userId]);
  return (
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        {/* <Icon
          className={classes.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={toggleSiderCollapsed}
        /> */}
        <div className={classes.logo}><Link to="/"><HeaderLogo /></Link></div>
        <div className={classes.nav}></div>
        <div className={classes.user}>
          <User theme="white" />
        </div>
      </div>
    </Header>
  );
});

