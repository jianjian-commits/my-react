import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const isValid = (authorities, auth) => {
  return !!auth(authorities);
};
const noop = () => {};

const Authenticate = props => {
  const {
    type = "default",
    state = "fulfilled",
    to = "/app/list",
    authorities,
    auth = noop,
    unAuthComponent = null,
    options = {},
    children
  } = props;

  if (!authorities || state === "pending") return null;
  if (!isValid(authorities, auth)) {
    switch (type) {
      case "redirect":
        return <Redirect to={to} />;
      case "component":
        return unAuthComponent;
      case "disabled":
        return React.cloneElement(children, { disabled: true });
      case "custom":
        return React.cloneElement(children, options);
      default:
        return null;
    }
  }
  return children;
};

const mapStatesToProps = ({ login }) => ({
  authorities: login.authorities || []
});

export default connect(mapStatesToProps)(Authenticate);
