export const authorityIsValid = ({ debug, permissions, teamId, auth }) => {
  if (debug) return true;
  if (!auth) return true;
  if (permissions.includes(`${teamId}:*:*:*:*:*`)) return true;
  if (permissions.includes(`${teamId}:${auth}`)) return true;
};
