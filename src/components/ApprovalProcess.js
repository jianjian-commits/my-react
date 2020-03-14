import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "../store";
import { PrivateRoute } from "./shared";
import { useParams } from "react-router-dom";
import { requestWithHeaders } from "../utils/request";
import { Approval } from "componentized-process";

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
