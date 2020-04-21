import React from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticate from "../shared/Authenticate";
import { BreadRight } from "../../assets/icons";
import { Breadcrumb } from "antd";
import clx from "classnames";
import comClasses from "../../styles/common.module.scss";

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

export const Title = ({ navs }) => {
  return (
    <>
      <Breadcrumb separator={<BreadRight />}>
        {navs.map(n => (
          <Breadcrumb.Item
            key={n.key}
            className={clx({
              [comClasses.breadcrumbItem]: true,
              [comClasses.disabled]: n.disabled,
              [comClasses.active]: !n.disabled
            })}
            onClick={n.onClick}
          >
            {n.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
};
