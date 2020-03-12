import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { main, appPaths } from "../routers";
import { history } from "../store";
import { PrivateRoute, PublicRoute } from "./shared";
import ErrorPage from "../pages/Error";
import Login from "./login/login";
import ForgetPassword from "./login/forgetPassword";
import InviteUser from "../components/login/inviteUser";

import ErrorBoundary from "./shared/ErrorBoundary";

export const getRoutes = routes =>
  (routes || []).map(route =>
    route.content ? (
      getRoutes(route.content)
    ) : (
      <PrivateRoute
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

const App = () => (
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
    </ConnectedRouter>
  </ErrorBoundary>
);

export default connect(({ login }) => ({
  isAuthenticated: login.isAuthenticated
}))(App);
