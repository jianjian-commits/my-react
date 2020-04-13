import React from "react";
import { Layout, Menu } from "antd";
import { history } from "../store";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import HomeHeader from "../components/header/HomeHeader";
import TeamInfo from "../components/userManagement/team/TeamInfo";
import TeamMember from "../components/userManagement/team/TeamMember";
import ProfileManagement from "../components/profileManagement";
import commonClasses from "../styles/common.module.scss";
import { PROFILE_MANAGEMENT_LIST, TEAM_MANAGEMENT_LIST } from "../auth";
import { authorityIsValid } from "../utils";
import { Route } from "react-router-dom";
import Authenticate from "../components/shared/Authenticate";
import { InfoIcon, MemberIcon, ProfileIcon } from "../assets/icons/company";

const { Sider, Content } = Layout;

const webs = [
  {
    path: "/team/info",
    label: "团队信息",
    icon: InfoIcon,
    component: TeamInfo
  },
  {
    path: "/team/member",
    label: "团队成员",
    auth: TEAM_MANAGEMENT_LIST,
    icon: MemberIcon,
    component: TeamMember
  },
  {
    path: "/team/profile",
    label: "分组",
    auth: PROFILE_MANAGEMENT_LIST,
    icon: ProfileIcon,
    exact: true,
    component: ProfileManagement
  }
];

const TeamManagement = props => {
  const { pathname } = useLocation();

  const setSelectedKey = path => {
    history.push(path);
  };

  const getMenu = webs =>
    webs
      .filter(w => {
        const { permissions, teamId, debug } = props;
        return authorityIsValid({ permissions, teamId, debug, auth: w.auth });
      })
      .map(w => (
        <Menu.Item
          key={w.path}
          onClick={() => setSelectedKey(w.path)}
          className={commonClasses.menu}
          style={{
            backgroundColor: pathname === w.path ? "#DDEAFF" : "inherit"
          }}
        >
          <span>
            <w.icon />
            {w.label}
          </span>
        </Menu.Item>
      ));

  return (
    <Layout>
      <HomeHeader
        hides={{
          logo: true,
          menu: true,
          teamManage: true,
          backArrow: "团队管理",
          backUrl: "/"
        }}
      />
      <Layout>
        <Sider className={commonClasses.sider}>
          <Menu selectedKeys={pathname}>{getMenu(webs)}</Menu>
        </Sider>
        <Content className={commonClasses.container}>
          {webs.map(route => (
            <Authenticate key={route.path} auth={route.auth}>
              <Route {...route} />
            </Authenticate>
          ))}
        </Content>
      </Layout>
    </Layout>
  );
};

export default connect(({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentCompany && login.currentCompany.id,
  debug: debug.isOpen
}))(TeamManagement);
