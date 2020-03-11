import React from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticate from "../shared/Authenticate";
export const SpecialRoute = ({ component, props, ...rest }) => (
  <Route {...rest} render={props => React.createElement(component, props)} />
);

export const PrivateRoute = ({ auth, component, options, ...rest }) => (
  <Authenticate auth={auth}>
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("id_token") ? (
          React.createElement(component, { ...props, ...options })
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  </Authenticate>
);

export const PublicRoute = ({ component, props, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("id_token") ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          React.createElement(component, props)
        )
      }
    />
  );
};
