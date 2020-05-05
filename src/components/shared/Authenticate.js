import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { authorityIsValid } from "../../utils";

const Authenticate = props => {
  const {
    type = "default",
    state = "fulfilled",
    to = "/app/list",
    debug,
    permissions,
    teamId,
    auth = "",
    unAuthComponent = null,
    options = {},
    children,
    hide = false
  } = props;
  console.log(type)
  if (debug) return children;
  if (type === "ignore") return children;
  if (!permissions || state === "pending" || hide || !teamId) return null;
  if (!authorityIsValid({ debug, permissions, teamId, auth })) {
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
  switch (type) {
    default:
      return children;
  }
};

const mapStatesToProps = ({ login, debug }) => ({
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentCompany && login.currentCompany.id,
  login: login,
  debug: debug.isOpen
});

export default connect(mapStatesToProps)(Authenticate);
