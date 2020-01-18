import React from "react";
import { Layout, Button } from "antd";
import CommonHeader from "../components/header/CommonHeader";
import classes from "../styles/apps.module.scss";
import { history } from "../store";
import { useParams } from "react-router";
const { Content, Sider } = Layout;

const navigationList = [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  { key: 1, label: "13号Devinci应用", disabled: true }
];

const getOreations = appid => [
  {
    key: "setting",
    icon: "setting",
    label: "应用设置",
    onClick: () => history.push(`/app/${appid}/setting`)
  }
];

const AppDetail = () => {
  const { appId } = useParams;
  return (
    <Layout>
      <CommonHeader
        navigationList={navigationList}
        operations={getOreations(appId)}
      />
      <Layout>
        <Sider style={{ background: "#fff" }}>1</Sider>
        <Content className={classes.container}>
          <div className={classes.header}>
            <div>
              <Button type="primary" onClick={null}>
                提交数据
              </Button>
            </div>
            <div>我是表单数据</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppDetail;
