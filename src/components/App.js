import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { main } from "../routers";
import { history } from "../store";
import { PrivateRoute, PublicRoute } from "./shared";
import ErrorPage from "../pages/Error";
import Container from "../pages/Container";
import Login from "../pages/Login";

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

const App = () => (
  <ErrorBoundary error={<ErrorPage />}>
    <ConnectedRouter history={history}>
      <Switch>
        <PublicRoute path="/login" component={Login} />
        {getRoutes(main)}
        <PrivateRoute path="/app/:appId" component={Container} />
        <Route render={() => <Redirect to="/app/list" />} />
      </Switch>
    </ConnectedRouter>
  </ErrorBoundary>
);

export default connect(({ login }) => ({
  isAuthenticated: login.isAuthenticated
}))(App);
