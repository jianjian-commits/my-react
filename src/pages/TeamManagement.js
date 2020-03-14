import React from "react";
import { Layout, Menu } from "antd";
import { history } from "../store";
import { connect } from "react-redux";
// import CommonHeader from "../components/header/CommonHeader";
import HomeHeader from "../components/header/HomeHeader";
import TeamInfo from "../components/userManagement/team/TeamInfo";
import TeamMember from "../components/userManagement/team/TeamMember";
import ProfileManagement from "../components/profileManagement";
import commonClasses from "../styles/common.module.scss";
import { PROFILE_MANAGEMENT_LIST, TEAM_MANAGEMENT_LIST } from "../auth";
import { authorityIsValid } from "../utils";
import { Route } from "react-router-dom";
import Authenticate from "../components/shared/Authenticate";

const { Sider, Content } = Layout;

const webs = [
  {
    path: "/team/info",
    key: "info",
    label: "团队信息",
    icon: "info",
    component: TeamInfo
  },
  {
    path: "/team/member",
    key: "member",
    label: "团队成员",
    auth: TEAM_MANAGEMENT_LIST,
    icon: "member",
    component: TeamMember
  },
  {
    path: "/team/profile",
    key: "profile",
    label: "分组",
    auth: PROFILE_MANAGEMENT_LIST,
    icon: "profile",
    exact: true,
    component: ProfileManagement
  }
];

class TeamManagement extends React.Component {
  constructor(props) {
    super(props);
    const matches = /^\/team\/(\w+)\/?/.exec(history.location.pathname);
    this.state = {
      selectedKey: (matches && matches[1]) || "info"
    };
  }
  setSelectedKey(key, path) {
    this.setState({ selectedKey: key });
    history.push(path);
  }
  getMenu = webs =>
    webs
      .filter(w => {
        const { permissions, teamId, debug } = this.props;
        return authorityIsValid({ permissions, teamId, debug, auth: w.auth });
      })
      .map(w => (
        <Menu.Item
          key={w.key}
          onClick={() => this.setSelectedKey(w.key, w.path)}
          className={commonClasses.menu}
        >
          <span>
            <img src={`/image/davinci/${w.icon}.png`} alt="" />
            {w.label}
          </span>
        </Menu.Item>
      ));

  render() {
    const { selectedKey } = this.state;
    return (
      <Layout>
        <HomeHeader
          hides={{
            logo: true,
            menu: true,
            teamManage: true,
            backArrow: false
          }}
        />
        <Layout>
          <Sider style={{ background: "#fff" }}>
            <Menu selectedKeys={selectedKey}>{this.getMenu(webs)}</Menu>
          </Sider>
          <Content className={commonClasses.container}>
            {webs.map(route => (
              <Authenticate key={route.key} auth={route.auth}>
                <Route {...route} />
              </Authenticate>
            ))}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentTeam && login.currentTeam.id,
  debug: debug.isOpen
}))(TeamManagement);
