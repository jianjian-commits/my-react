import React from "react";
import { Layout, Card } from "antd";
import classes from "./content.module.scss";
import clx from "classnames";
import { history } from "../../store";
import { Navigation } from "../shared";
import { connect } from "react-redux";
import comClasses from "../../styles/common.module.scss"

const { Content } = Layout;

const defaultNavigationList = [
  { key: 0, label: "首页", onClick: () => history.push("/app/list") }
];
export const HomeContentTitle = ({ title, navs=defaultNavigationList, btns }) => {
  return <Card className={comClasses.homeContentTitle} bodyStyle={{ padding: "12px 18px 6px" }}>
    {navs ? <Navigation navs={navs}/> : null }
    <div className={comClasses.main}>
      <div className={comClasses.title}>{typeof title === "string" ? <h3>{title}</h3> : title}</div>
      <div className={comClasses.btns}>{btns}</div>
    </div>
  </Card>
};

export default connect(
  () => ({}),
)(function HomeContent(props) {
  const {
    title, navs, btns, children, mainClassName
  } = props;
  return (
    <Content className={classes.homeContentWrapper} style={{}}>
      <HomeContentTitle {...{title, navs, btns}}/>
      <div className={clx(comClasses.homeContentMain, mainClassName)}>
        {children}
      </div>
    </Content>
  );
});

