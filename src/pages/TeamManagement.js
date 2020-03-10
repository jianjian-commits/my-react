import React from "react";
import { Layout, Menu, Icon } from "antd";
import { history } from "../store";
// import CommonHeader from "../components/header/CommonHeader";
import HomeHeader from "../components/header/HomeHeader";
import TeamInfo from "../components/team/TeamInfo";
import TeamMember from "../components/team/TeamMember";
import ProfileManagement from "../components/profileManagement";
import commonClasses from "../styles/common.module.scss";
import { PROFILE_MANAGEMENT_LIST, TEAM_MANAGEMENT_LIST } from "../auth";
import Authenticate from "../components/shared/Authenticate";

import { Route } from "react-router-dom";
const { Sider, Content } = Layout;

const webs = [
  {
    path: "/user/info",
    key: "info",
    label: "团队信息",
    icon: "exclamation-circle",
    component: TeamInfo
  },
  {
    path: "/user/member",
    key: "member",
    label: "团队成员",
    icon: "user",
    auth: TEAM_MANAGEMENT_LIST,
    component: TeamMember
  },
  {
    path: "/user/profile",
    key: "profile",
    label: "分组",
    icon: "team",
    auth: PROFILE_MANAGEMENT_LIST,
    exact: true,
    component: ProfileManagement
  }
];

class TeamManagement extends React.Component {
  constructor(props) {
    super(props);
    const matches = /^\/user\/(\w+)\/?/.exec(history.location.pathname);
    this.state = {
      selectedKey: (matches && matches[1]) || "info"
    };
  }
  setSelectedKey(key, path) {
    this.setState({ selectedKey: key });
    history.push(path);
  }
  getMenu = webs =>
    webs.map(w => (
      <Menu.Item key={w.key} onClick={() => this.setSelectedKey(w.key, w.path)}>
        <Authenticate auth={w.auth}>
          <Icon type={w.icon} />
          <span>{w.label}</span>
        </Authenticate>
      </Menu.Item>
    ));

  render() {
    const { selectedKey } = this.state;
    return (
      <Layout>
        <HomeHeader />
        <Layout>
          <Sider style={{ background: "#fff" }}>
            <div className={commonClasses.title}>团队管理</div>
            <Menu selectedKeys={selectedKey}>{this.getMenu(webs)}</Menu>
          </Sider>
          <Content className={commonClasses.container}>
            {webs.map(route => (
              <Route {...route} />
            ))}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default TeamManagement;
