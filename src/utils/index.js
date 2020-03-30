import { message } from "antd";

export const authorityIsValid = ({ debug, permissions, teamId, auth }) => {
  if (debug) return true;
  if (!auth) return true;
  if (permissions.includes(`${teamId}:*:*:*:*:*`)) return true;
  if (permissions.includes(`${teamId}:${auth}`)) return true;
};

export function catchError(err) {
  message.error(
    (err.response && err.response.data && err.response.data.msg) || "系统错误"
  );
}
