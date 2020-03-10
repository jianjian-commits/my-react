import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { SUPER_ADMINISTRATOR } from "../../auth";

const isValid = (permissions, teamId, auth) => {
  if (!auth) return true;
  if (permissions.includes(`${teamId}:${SUPER_ADMINISTRATOR}`)) return true;
  return !!permissions.includes(`${teamId}:${auth}`);
};
// const noop = () => {};

const Authenticate = props => {
  const {
    type = "default",
    state = "fulfilled",
    to = "/app/list",
    permissions,
    teamId,
    auth = "",
    unAuthComponent = null,
    options = {},
    children
  } = props;

  if (!permissions || state === "pending") return null;
  if (!isValid(permissions, teamId, auth)) {
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
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentTeam && login.currentTeam.id
});

export default connect(mapStatesToProps)(Authenticate);
