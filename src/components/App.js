import React from "react";
import { Route, Switch, Redirect, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "antd";
import { ConnectedRouter, routerActions } from "connected-react-router";
import { main, appPaths } from "../routers";
import { history } from "../store";
import { PrivateRoute, PublicRoute } from "./shared";
import ErrorPage from "../pages/Error";
import Login from "./login";
import ForgetPassword from "./login/forgetPassword";
import InviteUser from "./login/InviteUser";
import { setDebug } from "../store/debugReducer";
import { signOut } from "../store/loginReducer";

import ErrorBoundary from "./shared/ErrorBoundary";

export const getRoutes = routes =>
  (routes || []).map(route =>
    route.content ? (
      getRoutes(route.content)
    ) : (
      <PrivateRoute
        auth={routerActions.auth}
        path={route.path}
        component={route.component}
        key={route.key}
        options={route.options}
      />
    )
  );

const AppInsideRouter = () => {
  const { appId } = useParams();

  const authOptions = {
    type: "redirect"
  };
  return (
    <Switch>
      {appPaths.map(p => (
        <PrivateRoute
          auth={p.auth && p.auth(appId)}
          authOptions={authOptions}
          exact={!p.rough}
          key={p.key}
          path={p.path}
          component={p.component}
        />
      ))}
      )}
      <Route render={() => <Redirect to="/app/list" />} />
    </Switch>
  );
};

const App = ({ debug, setDebug, signOut }) => (
  <ErrorBoundary error={<ErrorPage />}>
    <ConnectedRouter history={history}>
      <Switch>
        <PublicRoute
          exact
          path="/invite/:userId/:companyId/:token"
          component={InviteUser}
        />
        <PublicRoute path="/forgetPassword" component={ForgetPassword} />
        <PublicRoute path="/login" component={Login} />
        {getRoutes(main)}
        <PrivateRoute path="/app/:appId" component={AppInsideRouter} />
        <Route render={() => <Redirect to="/app/list" />} />
      </Switch>
      <Button
        style={{ position: "fixed", bottom: 0, left: 0 }}
        type={debug ? "danger" : "normal"}
        onClick={() => setDebug(!debug)}
      >
        {debug ? "贤者模式" : "找bug模式"}
      </Button>
      <Button
        style={{ position: "fixed", bottom: 0, left: "100px" }}
        onClick={() => signOut()}
      >
        临时退出
      </Button>
    </ConnectedRouter>
  </ErrorBoundary>
);

export default connect(
  ({ login, debug }) => ({
    isAuthenticated: login.isAuthenticated,
    debug: debug.isOpen
  }),
  { setDebug, signOut }
)(App);
