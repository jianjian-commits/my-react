import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "../store";
import { PrivateRoute } from "./shared";
import { useParams } from "react-router-dom";
import { requestWithHeaders } from "../utils/request";
import { Approval } from "componentized-process";
import { APP_FORM_VISIABLED } from "../auth";

export default () => {
  const { url } = useRouteMatch();
  const { appId, formId } = useParams();
  const config = {
    request: requestWithHeaders({ appid: appId, formid: formId }),
    pathPrefix: `${url}`,
    history,
    appId,
    formId
  };
  const auth = APP_FORM_VISIABLED(appId, formId);
  const authOptions = {
    type: "redirect",
    to: "/app/list"
  };
  console.log(auth)
  return (
    <Switch>
      <PrivateRoute
        path={`${url}/list`}
        exact
        auth={auth}
        authOptions={authOptions}
        authType={"redirect"}
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
};
