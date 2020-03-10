import React from "react";
import clx from "classnames";
import { Layout, Breadcrumb, Button } from "antd";
import User from "./UserSection";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import { getAppList } from "../../store/appReducer";

const { Header } = Layout;
const logoStyle = {
  background: "#eee",
  color: "#333",
  lineHeight: "44px",
  textAlign: "center"
};

const getNavigationList = navs => {
  if (!navs || !navs.length) return null;
  if (navs.filter(v => !v.label).length > 0) return null;
  return (
    <div className={classes.breadCrumbs}>
      <Breadcrumb separator=">">
        {navs.map(n => (
          <Breadcrumb.Item
            key={n.key}
            className={clx({
              [classes.breadcrumbItem]: true,
              [classes.disabled]: n.disabled,
              [classes.active]: !n.disabled
            })}
            onClick={n.onClick}
          >
            {n.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  );
};

const getOperations = ops => {
  if (!ops || !ops.length) return null;
  return ops.map(o => (
    <Button key={o.key} icon={o.icon ? o.icon : undefined} onClick={o.onClick}>
      {o.label}
    </Button>
  ));
};

export default connect(
  ({ router, app }) => ({
    router,
    appList: app.appList
  }),
  { getAppList }
)(function CommonHeader(props) {
  if (props.appList.length === 0) {
    props.getAppList();
  }
  return (
    <Header className={classes.homeHeader}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <div style={logoStyle}>logo</div>
        </div>
        <div className={classes.nav}>
          {getNavigationList(props.navigationList)}
        </div>
        <div className={classes.operations}>
          {getOperations(props.operations)}
        </div>
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
});
