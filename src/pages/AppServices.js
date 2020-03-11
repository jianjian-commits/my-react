import React from "react";
import { connect } from "react-redux";
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "../store";
import { PrivateRoute } from "../components/shared";
import { Layout, Menu, Icon, Tooltip } from "antd";
import { Route, Redirect, useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
// import PlaceHolder from "./Placeholder";
import CreateForm from "../components/formBuilder/component/formBuilder/formBuilder";
import classes from "../styles/apps.module.scss";
import { Process, Approval } from "componentized-process";
import { requestWithHeaders } from "../utils/request";

const { Content, Sider } = Layout;

const Proc = () => {
  const { url } = useRouteMatch();
  const { appId, formId } = useParams();
  const config = {
    request: requestWithHeaders({ appid: appId, formid: formId }),
    pathPrefix: `${url}`,
    history,
    appId,
    formId
  };
  return (
    <Switch>
      <PrivateRoute
        path={`${url}/list`}
        exact
        component={Process.List}
        key={"process/list"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/builder`}
        component={Process.Builder}
        key={"process/builder"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/log`}
        component={Process.Log}
        key={"process/log"}
        options={{ config }}
      />
    </Switch>
  );
};

const Appr = () => {
  const { url } = useRouteMatch();
  const { appId, formId } = useParams();
  const config = {
    request: requestWithHeaders({ appid: appId, formid: formId }),
    pathPrefix: `${url}`,
    history,
    appId,
    formId
  };
  return (
    <Switch>
      <PrivateRoute
        path={`${url}/list`}
        exact
        component={Approval.List}
        key={"approval/list"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/builder`}
        component={Approval.Builder}
        key={"approval/builder"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/log`}
        component={Approval.Log}
        key={"approval/log"}
        options={{ config }}
      />
    </Switch>
  );
};

const services = [
  { key: "edit", name: "表单编辑", icon: "table", component: CreateForm },
  {
    key: "process/list",
    name: "自动化",
    icon: "cloud-sync",
    component: Proc
  },
  { key: "approval/list", name: "审批流", icon: "audit", component: Appr }
];
const navigationList = (history, appId, appName) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: `${appName}`,
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  {
    key: 1,
    label: "应用设置",
    onClick: () => history.push(`/app/${appId}/setting`)
  },
  { key: 1, label: "用车申请", disabled: true }
];

const AppServices = props => {
  const history = useHistory();
  const { appId, formId, serviceId } = useParams();
  const currentApp =
    Object.assign([], props.appList).find(v => v.id === appId) || {};
  const appName = currentApp.name || "";
  const service = services.find(s => {
    return s.key.indexOf(serviceId) !== -1;
  });
  const clickHandle = e => {
    history.push(`/app/${appId}/setting/form/${formId}/${e.key}`);
  };

  if (!service) {
    return <Route render={() => <Redirect to={`/app/${appId}/setting`} />} />;
  }
  return (
    <Layout>
      <CommonHeader navigationList={navigationList(history, appId, appName)} />
      <Layout>
        <Sider className={classes.appSider} theme="light" width={64}>
          <Menu className={classes.menuBorderNone} selectedKeys={serviceId}>
            {services.map(s => (
              <Menu.Item key={s.key} onClick={clickHandle}>
                <Tooltip title={s.name}>
                  <Icon type={s.icon} style={{ fontSize: 22 }} />
                </Tooltip>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content>
          <service.component />
        </Content>
      </Layout>
    </Layout>
  );
};
export default connect(({ app }) => ({
  appList: app.appList
}))(AppServices);
