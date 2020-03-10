export const SUPER_ADMINISTRATOR = "*:*:*:*:*";

export const TEAM_MANAGEMENT = "?:?:?:?:TMV";

const PROFILE_MANAGEMENT_PREFIX =
  "?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:";
export const PROFILE_MANAGEMENT_LIST = `${PROFILE_MANAGEMENT_PREFIX}DR`;
export const PROFILE_MANAGEMENT_NEW = `${PROFILE_MANAGEMENT_PREFIX}DC`;

const TEAM_MANAGEMENT_PREFIX =
  "?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:";
export const TEAM_MANAGEMENT_LIST = `${TEAM_MANAGEMENT_PREFIX}DR`;
export const TEAM_MANAGEMENT_NEW = `${TEAM_MANAGEMENT_PREFIX}DC`;

export default {};
