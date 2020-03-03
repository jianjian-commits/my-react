import React from "react";
import { Layout, Menu, Icon } from "antd";
import { history } from "../store";
import CommonHeader from "../components/header/CommonHeader";
// import UserManagement from "../components/userManagement";
import TeamInfo from "../components/team/TeamInfo";
import TeamMember from "../components/team/TeamMember";
import ProfileManagement from "../components/profileManagement";
import commonClasses from "../styles/common.module.scss";
import GroupDetail from "../components/profileManagement/GroupDetail";
import ApplyPermissionSetting from "../components/userManagement/applyPermissionSettings";

import { Route } from "react-router-dom";
const { Sider, Content } = Layout;

const navigationList = [
  { key: 0, label: "首页", onClick: () => history.push("/app/list") },
  { key: 1, label: "用户管理", disabled: true }
];

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
    component: TeamMember
  },
  {
    path: "/user/profile",
    key: "profile",
    label: "分组",
    icon: "team",
    exact: true,
    component: ProfileManagement
  }
];

const otherRoutes = [
  {
    path: "/user/profile/:action/:id",
    key: "viewGroupDetail",
    exact: true,
    component: GroupDetail
  },
  {
    path: "/user/profile/permissions/:action/:groupId/:teamId",
    key: "reditApplyPermissions",
    exact: true,
    component: ApplyPermissionSetting
  }
];
class UserPage extends React.Component {
  constructor(props) {
    super(props);
    const matches = /^\/user\/(\w+)\/?/.exec(history.location.pathname);
    this.state = {
      selectedKey: (matches && matches[1]) || "user"
    };
  }
  setSelectedKey(key, path) {
    this.setState({ selectedKey: key });
    history.push(path);
  }
  getMenu = webs =>
    webs.map(w => (
      <Menu.Item key={w.key} onClick={() => this.setSelectedKey(w.key, w.path)}>
        <Icon type={w.icon} />
        <span>{w.label}</span>
      </Menu.Item>
    ));

  render() {
    const { selectedKey } = this.state;
    return (
      <Layout>
        <CommonHeader navigationList={navigationList} />
        <Layout>
          <Sider style={{ background: "#fff" }}>
            <div className={commonClasses.title}>团队管理</div>
            <Menu selectedKeys={selectedKey}>{this.getMenu(webs)}</Menu>
          </Sider>
          <Content className={commonClasses.container}>
            {webs.map(route => (
              <Route {...route} />
            ))}
            {otherRoutes.map(route => (
              <Route {...route} />
            ))}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default UserPage;
