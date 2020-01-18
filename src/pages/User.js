import React from "react";
import { Layout, Menu, Icon } from "antd";
import { history } from "../store";
import CommonHeader from "../components/header/CommonHeader";
import UserManagement from "../components/userManagement";
import ProfileManagement from "../components/profileManagement";
import commonClasses from "../styles/common.module.scss";

const { Sider, Content } = Layout;

const navigationList = [
  { key: 0, label: "首页", onClick: () => history.push("/app/list") },
  { key: 1, label: "用户管理", disabled: true }
];

const webs = [
  {
    key: "user",
    label: "用户",
    icon: "user",
    component: UserManagement
  },
  {
    key: "profile",
    label: "分组",
    icon: "team",
    component: ProfileManagement
  }
];

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKey: "user"
    };
  }
  setSelectedKey(key) {
    this.setState({ selectedKey: key });
  }
  getMenu = webs =>
    webs.map(w => (
      <Menu.Item key={w.key} onClick={() => this.setSelectedKey(w.key)}>
        <Icon type={w.icon} />
        <span>{w.label}</span>
      </Menu.Item>
    ));
  render() {
    const { selectedKey } = this.state;
    const CurrentWeb = webs.find(w => w.key === selectedKey);
    return (
      <Layout>
        <CommonHeader navigationList={navigationList} />
        <Layout>
          <Sider style={{ background: "#fff" }}>
            <Menu selectedKeys={selectedKey}>{this.getMenu(webs)}</Menu>
          </Sider>
          <Content className={commonClasses.container}>
            <CurrentWeb.component />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default UserPage;
