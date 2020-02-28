import React from "react";
import { Route, Redirect } from "react-router-dom";
export const SpecialRoute = ({ component, props, ...rest }) => (
  <Route {...rest} render={props => React.createElement(component, props)} />
);

export const PrivateRoute = ({ component, options, ...rest }) => (
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
);

export const PublicRoute = ({ component, props, ...rest }) => {
  if (
    rest.location.pathname !== "/login" &&
    rest.location.pathname !== "/register"
  )
    return (
      <Route
        {...rest}
        render={props => React.createElement(component, props)}
      />
    );
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
