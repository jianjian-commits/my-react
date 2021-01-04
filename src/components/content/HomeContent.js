import React from "react";
import { Card } from "antd";
import { Content} from "../shared/customWidget"
import classes from "./content.module.scss";
import clx from "classnames";
import { history } from "../../store";
import { Navigation } from "../shared";
import { connect } from "react-redux";
import comClasses from "../../styles/common.module.scss"


/* 内部上面的首页 */
const defaultNavigationList = [
  { key: 0, label: "首页", onClick: () => {
    history.push("/app/list")
  } }
];

/* Card 这个组件表示的是右边内容区域的上面 */
export const HomeContentTitle = ({ title, navs=defaultNavigationList, btns }) => {
  /* Card 这个组件表示的是右边内容区域的上面 */
  return <Card className={comClasses.homeContentTitle} bodyStyle={{ padding: "15.5px 30px 6px", height: "100px" }}>
    {/* ***********面包屑都在这里  navs传进来的！！！！！！！！！！！！************* */}
    {navs ? <Navigation navs={navs} separator={"/"} style={{ height: 36 }} fontStyle={{ fontSize: 14 }}/> : null }
    <div className={comClasses.main}>
      {/* top标题  我的应用 */}
      <div className={comClasses.title}>
        {typeof title === "string" ? <span className={comClasses.font}>{title}</span> : title}
      </div>
      {/* top标题  我的应用并排的  但是没有显示出来是没有   */}
      <div className={comClasses.btns}>{btns}</div>
    </div>
  </Card>
};

export default connect(
  () => ({}),
)(function HomeContent(props) {
  const {
    title, navs, btns, children, mainClassName, className
  } = props;
  return (
    <Content className={clx(className, classes.homeContentWrapper)} style={{}}>
      {/* 右边内容上面部分 */}
      <HomeContentTitle {...{title, navs, btns}}/>
      {/* 右边内容主体部分  我的应用 */}
      <div className={clx(comClasses.homeContentMain, mainClassName)}>
        {children}
      </div>
    </Content>
  );
});

