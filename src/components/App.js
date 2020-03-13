import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "antd";
import { ConnectedRouter, routerActions } from "connected-react-router";
import { main, appPaths } from "../routers";
import { history } from "../store";
import { PrivateRoute, PublicRoute } from "./shared";
import ErrorPage from "../pages/Error";
import Login from "./login/login";
import ForgetPassword from "./login/forgetPassword";
import InviteUser from "../components/login/inviteUser";
import { setDebug } from "../store/debugReducer";

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
  return (
    <Switch>
      {appPaths.map(p => (
        <PrivateRoute
          auth={p.auth}
          exact={!p.rough}
          key={p.key}
          path={p.path}
          component={p.component}
        />
      ))}
      <Route render={() => <Redirect to="/app/list" />} />
    </Switch>
  );
};

const App = ({ debug, setDebug }) => (
  <ErrorBoundary error={<ErrorPage />}>
    <ConnectedRouter history={history}>
      <Switch>
        <PublicRoute
          exact
          path="/invite/:userId/:teamId/:token"
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
    </ConnectedRouter>
  </ErrorBoundary>
);

export default connect(
  ({ login, debug }) => ({
    isAuthenticated: login.isAuthenticated,
    debug: debug.isOpen
  }),
  { setDebug }
)(App);
