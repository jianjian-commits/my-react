import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import classes from "./sider.module.scss";
import { updateSiderOpenKeys } from "../../store/layoutReducer";
import { main } from "../../routers";

const { Sider } = Layout;
const { SubMenu } = Menu;

export const SiderTop = () => (
  <div className={classes.top}>
    <Link to="/">
      <div className={classes.logo} />
      <span>达芬奇</span>
    </Link>
  </div>
);

const renderItem = (r) => (
  <Menu.Item className={classes.item} key={r.key}>
    <Link to={r.path}>
      {r.icon ? (
        <i className="anticon">
          <r.icon />
        </i>
      ) : (
        <Icon type="smile" />
      )}
      <span>{r.label}</span>
    </Link>
  </Menu.Item>
);

const HomeSider = (props) => {
  const { collapsed, openKeys, updateSiderOpenKeys } = props;
  const location = useLocation();

  const selectedKeys = main
    .reduce((acc, r) => {
      if (r.path === location.pathname) acc.push(r);
      if (r.children) {
        for (const c of r.children) {
          if (c.path === location.pathname) acc.push(c);
        }
      }
      return acc;
    }, [])
    .map((e) => e.key);

  const revertOpenKeysWhileCollapse = () => {
    if (collapsed) updateSiderOpenKeys([]);
  };
  return (
    <Sider trigger={null} theme="light" width="240" collapsible collapsed={collapsed}>
      <SiderTop />
      <Menu
        forceSubMenuRender={true}
        className={classes.menu}
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onClick={revertOpenKeysWhileCollapse}
      >
        {main.map((r) => {
          if (r.children) {
            return (
              <SubMenu
                key={r.key}
                onTitleClick={(e) => updateSiderOpenKeys([e.key])}
                title={
                  <span>
                    {r.icon ? (
                      <i className="anticon">
                        <r.icon />
                      </i>
                    ) : (
                      <Icon type="smile" />
                    )}
                    <span>{r.label}</span>
                  </span>
                }
              >
                {r.children.map((e) => renderItem(e))}
              </SubMenu>
            );
          }
          return renderItem(r);
        })}
      </Menu>
    </Sider>
  );
};

export default connect(
  ({ layout: { sider } }) => ({
    collapsed: sider.collapsed,
    openKeys: sider.openKeys,
  }),
  { updateSiderOpenKeys }
)(HomeSider);
