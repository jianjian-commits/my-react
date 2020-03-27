import React from "react";
import clx from "classnames";
import {
  Layout,
  Breadcrumb,
  Button
  // , Badge
} from "antd";
import User from "./UserSection";
import classes from "./header.module.scss";
import { connect } from "react-redux";
import Authenticate from "../shared/Authenticate";
import { getAppList } from "../../store/appReducer";
import {
  // PromptIcon,
  RightOutlined
} from "../../assets/icons";

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
  marginRight: "10px",
  color: "#333",
  lineHeight: "37px",
  textAlign: "center"
};

const getNavigationList = navs => {
  if (!navs || !navs.length) return null;
  if (navs.filter(v => !v.label).length > 0) return null;
  return (
    <div className={classes.breadCrumbs}>
      <Breadcrumb separator={<RightOutlined className={classes.rightOutlined} />}>
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

const ghostButton = {
  background: "#4F96FF",
  borderRadius: "3px",
  color: "#ffffff",
  width: "110px",
  height: "32px",
  padding: "0"
};
const ghostButtonContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const getOperations = ops => {
  if (!ops || !ops.length) return null;
  return ops.map(o => (
    <Authenticate key={o.key} auth={o.auth}>
      <Button
        type="link"
        // ghost
        style={ghostButton}
        onClick={o.onClick}
      >
        <div style={ghostButtonContent}>
          {o.icon ? o.icon : null}
          {o.label}
        </div>
      </Button>
    </Authenticate>
  ));
};

// const getPrompt = count => (
//   <Badge count={count || 6}>
//     <PromptIcon />
//   </Badge>
// );

const getTitle = title => <span>{title}</span>;

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
    <Header className={classes.homeHeader} style={homeHeaderStyle}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <div style={logoStyle}>{/* logo */}</div>
        </div>
        <div className={classes.title}>{getTitle(props.title)}</div>
        <div className={classes.nav}>
          {getNavigationList(props.navigationList)}
        </div>
        <div className={classes.operations}>
          {getOperations(props.operations)}
        </div>
        {/* <div className={classes.prompt}>{getPrompt(props.count)}</div> */}
        <div className={classes.user}>
          <User />
        </div>
      </div>
    </Header>
  );
});
