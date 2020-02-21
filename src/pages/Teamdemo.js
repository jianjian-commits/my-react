import React from "react";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import HomeHeader from "../components/header/HomeHeader";
import TeameMenu from "../components/team/TeamMenu";
import selectCom from "../utils/selectCom";
import { teamMenu } from "../config/menu";
import classes from "../styles/team.module.scss";

const { Content, Sider } = Layout;

const Backlog = () => {
  const { menuId } = useParams();
  const [ele, setEle] = React.useState(selectCom(menuId, teamMenu));
  //根据点击菜单栏加载内容组件
  const onClickMenu = (key, e) => {
    setEle(selectCom(key, teamMenu));
  };
  return (
    <Layout>
      <HomeHeader />
      <Layout>
        <Sider className={classes.appSider} style={{ background: "#fff" }}>
          <TeameMenu fn={onClickMenu}></TeameMenu>
        </Sider>
        <Content className={classes.container}>
          {ele ? (
            <ele.ContentEle count={ele.key}></ele.ContentEle>
          ) : (
            <div></div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Backlog;
