import React from "react";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import classes from "./sider.module.scss";
import { updateSiderOpenKeys } from "../../store/layoutReducer";
import { main } from "../../routers";
import { authorityIsValid } from "../../utils";
import clx from "classnames";

const { Sider } = Layout;
const { SubMenu } = Menu;

export const SiderTop = ({ collapsed }) => (
  <div className={classes.top}>
    <Link to="/">
      <div className={clx(classes.logoBox, { [classes.collapsed]: collapsed })}>
        <div className={classes.logo} />
      </div>
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
  const {
    collapsed,
    openKeys,
    updateSiderOpenKeys,
    debug,
    permissions,
    teamId,
  } = props;
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
  const authFilter = (e) =>
    authorityIsValid({
      debug,
      permissions,
      teamId,
      auth: e.auth,
    });
  return (
    <Sider
      trigger={null}
      className={classes.sider}
      theme="light"
      width="240"
      collapsible
      collapsed={collapsed}
    >
      <SiderTop collapsed={collapsed} />
      <Menu
        forceSubMenuRender={true}
        className={classes.menu}
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onClick={revertOpenKeysWhileCollapse}
      >
        {main.filter(authFilter).map((r) => {
          if (r.children) {
            const onTitleClick = (e) => {
              updateSiderOpenKeys(
                openKeys.includes(e.key)
                  ? openKeys.filter((k) => k !== e.key)
                  : [...openKeys, e.key]
              );
            };
            return (
              <SubMenu
                key={r.key}
                onTitleClick={onTitleClick}
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
                {r.children.filter(authFilter).map((e) => renderItem(e))}
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
  ({ debug, login, layout: { sider } }) => ({
    collapsed: sider.collapsed,
    openKeys: sider.openKeys,
    teamId: login.currentCompany && login.currentCompany.id,
    permissions: (login.userDetail && login.userDetail.permissions) || [],
    debug: debug.isOpen,
  }),
  { updateSiderOpenKeys }
)(HomeSider);
