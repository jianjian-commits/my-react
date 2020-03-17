import React from "react";
import { connect } from "react-redux";
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "../store";
import { PrivateRoute } from "./shared";
import { useParams } from "react-router-dom";
import { requestWithHeaders } from "../utils/request";
import { Approval } from "componentized-process";
import { authorityIsValid } from "../utils";
import {
  APP_FORM_VISIABLED,
  APP_FORM_APPROVAL_NEW,
  APP_FORM_APPROVAL_EDIT,
  APP_FORM_APPROVAL_DELETE,
  APP_FORM_APPROVAL_ENABLE
} from "../auth";

const authMappings = {
  new: APP_FORM_APPROVAL_NEW,
  edit: APP_FORM_APPROVAL_EDIT,
  delete: APP_FORM_APPROVAL_DELETE,
  enable: APP_FORM_APPROVAL_ENABLE
};
export default connect(({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentTeam && login.currentTeam.id,
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
    <Switch>
      <PrivateRoute
        path={`${url}/list`}
        exact
        auth={auth}
        authOptions={authOptions}
        component={Approval.List}
        key={"approval/list"}
        options={{ config }}
      />
      <PrivateRoute
        auth={auth}
        authOptions={authOptions}
        path={`${url}/builder`}
        component={Approval.Builder}
        key={"approval/builder"}
        options={{ config }}
      />
    </Switch>
  );
});
