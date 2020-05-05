import React from "react";
import { Route, Switch, Redirect, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "antd";
import { ConnectedRouter, routerActions } from "connected-react-router";
import { main, appPaths } from "../routers";
import { history } from "../store";
import { PrivateRoute, PublicRoute } from "./shared";
import ErrorPage from "../pages/Error";
import { FullLoading } from "../pages/Loading";
import Login from "./login";
import ForgetPassword from "./login/ForgetPassword";
import InviteUser from "./login/InviteUser";
import { setDebug } from "../store/debugReducer";
import { signOut, initAllDetail } from "../store/loginReducer";

import ErrorBoundary from "./shared/ErrorBoundary";

export const getRoutes = (routes) =>
  (routes || []).map((route) =>
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
    type: "redirect",
  };
  return (
    <Switch>
      {appPaths.map((p) => (
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
class App extends React.Component {
  componentDidMount() {
    const INIT = true;
    this.props.initAllDetail(INIT);
  }
  renderRoutes() {
    return (
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
    );
  }
  renderTemporary() {
    const { debug, setDebug, signOut } = this.props;
    return (
      <>
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
      </>
    );
  }
  render() {
    const { appInit } = this.props;
    if (!appInit) return <FullLoading />;
    return (
      <ErrorBoundary error={<ErrorPage />}>
        <ConnectedRouter history={history}>
          {this.renderRoutes()}
          {this.renderTemporary()}
        </ConnectedRouter>
      </ErrorBoundary>
    );
  }
}

export default connect(
  ({ login, debug }) => ({
    isAuthenticated: login.isAuthenticated,
    appInit: login.appInit,
    debug: debug.isOpen,
  }),
  { setDebug, signOut, initAllDetail }
)(App);
