import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import { history } from "../store";
import { PrivateRoute } from "./shared";
import { useParams } from "react-router-dom";
import { requestWithHeaders } from "../utils/request";
import { Process } from "componentized-process";

export default () => {
  const { url } = useRouteMatch();
  const { appId, formId } = useParams();
  const config = {
    request: requestWithHeaders({ appid: appId, formid: formId }),
    pathPrefix: `${url}`,
    history,
    appId,
    formId,
    auth: {
      edit: 1
    }
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
