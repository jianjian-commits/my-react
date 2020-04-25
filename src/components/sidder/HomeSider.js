import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import classes from "./sider.module.scss";
import { main } from "../../routers";

const { Sider } = Layout;
const { SubMenu } = Menu;

const renderItem = r => <Menu.Item key={r.key}>
  <Link to={r.path}>
    {r.icon ? <i className="anticon"><r.icon /></i> : <Icon type="smile" />}
    <span>{r.label}</span></Link>
</Menu.Item>;

const HomeSider = props => {
  const { collapsed } = props;
  const location = useLocation();

  const selectedKeys = main.reduce((acc, r) => {
    if (r.path === location.pathname) acc.push(r);
    if (r.children) {
      for (const c of r.children) {
        if (c.path === location.pathname) acc.push(c);
      }
    }
    return acc;
  }, []).map(e => e.key);
  console.log(selectedKeys, location.pathname)
  return <Sider trigger={null} collapsible collapsed={collapsed}>
    <div className={classes.top}>
      <Link to="/">
        <div className={classes.logo} />
        <span>达芬奇</span>
      </Link>
    </div>
    <Menu forceSubMenuRender theme="dark" selectedKeys={selectedKeys}>
      {main.map(r => {
        if (r.children) {
          return <SubMenu
            key={r.key}
            title={
              <span>
                {r.icon ? <i className="anticon"><r.icon /></i> : <Icon type="smile" />}
                <span>{r.label}</span>
              </span>
            }
          >
            {r.children.map(e => renderItem(e))}
          </SubMenu>
        }
        return renderItem(r);
      })}
    </Menu>
  </Sider>
}

export default connect(
  ({ layout: { sider } }) => ({
    collapsed: sider.collapsed,
    openKeys: sider.openKeys,
  }), {}
)(HomeSider);