import React from "react";
import { connect } from "react-redux";
import { Switch, useRouteMatch } from "react-router-dom";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import { history } from "../store";
import { PrivateRoute } from "./shared";
import { useParams } from "react-router-dom";
import { requestWithHeaders } from "../utils/request";
import { Process } from "componentized-process";
import { authorityIsValid } from "../utils";
import {
  APP_FORM_VISIABLED,
  APP_FORM_PROCESS_NEW,
  APP_FORM_PROCESS_EDIT,
  APP_FORM_PROCESS_DELETE,
  APP_FORM_PROCESS_ENABLE
} from "../auth";

const authMappings = {
  new: APP_FORM_PROCESS_NEW,
  edit: APP_FORM_PROCESS_EDIT,
  delete: APP_FORM_PROCESS_DELETE,
  enable: APP_FORM_PROCESS_ENABLE
};
export default connect(({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentCompany && login.currentCompany.id,
  debug: debug.isOpen
}))(({ debug, permissions, teamId }) => {
  const { url } = useRouteMatch();
  const { appId, formId } = useParams();
  const configAuth = Object.keys(authMappings).reduce((acc, key) => {
    console.log(authMappings[key](appId, formId));
    const result = authorityIsValid({
      debug,
      permissions,
      teamId,
      auth: authMappings[key](appId, formId)
    });
    if (result) acc.push(key);
    return acc;
  }, []);
  const config = {
    request: requestWithHeaders({ appid: appId, formid: formId }),
    pathPrefix: `${url}`,
    history,
    appId,
    formId,
    auth: configAuth
  };
  const auth = APP_FORM_VISIABLED(appId, formId);
  const authOptions = {
    type: "redirect",
    to: "/app/list"
  };
  return (
    <ConfigProvider locale={zhCN}>
    <Switch>
      <PrivateRoute
        path={`${url}/list`}
        exact
        auth={auth}
        authOptions={authOptions}
        component={Process.List}
        key={"process/list"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/builder`}
        auth={auth}
        authOptions={authOptions}
        component={Process.Builder}
        key={"process/builder"}
        options={{ config }}
      />
      <PrivateRoute
        path={`${url}/instance`}
        auth={auth}
        authOptions={authOptions}
        component={Process.Log}
        key={"process/instance"}
        options={{ config, type: "instance" }}
      />
      <PrivateRoute
        path={`${url}/schedule`}
        auth={auth}
        authOptions={authOptions}
        component={Process.Log}
        key={"process/schedule"}
        options={{ config, type: "instance" }}
      />
    </Switch>
    </ConfigProvider>
  );
});
