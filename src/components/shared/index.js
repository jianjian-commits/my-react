import React from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticate from "../shared/Authenticate";

export const PrivateRoute = ({
  auth,
  authOptions = {},
  component,
  options,
  ...rest
}) => (
  <Authenticate
    {...authOptions}
    type={authOptions.type || "default"}
    auth={auth}
  >
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

export const PublicRoute = ({ component, props, ...rest }) => (
  <Route {...rest} render={props => React.createElement(component, props)} />
);
