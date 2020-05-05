/**
 *  GROUP_TEAM_VISABLE("团队管理按钮可见","?:?:?:?:TMV"),
    GROUP_APP_VISABLE("应用可见","?:?:?:CAV"),
    GROUP_LIST("查看列表","?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:DR"),
    GROUP_ADD("增加","?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:DC"),
    GROUP_UPDATE("编辑","?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:DU"),
    GROUP_DELETE("删除","?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:DD"),
    GROUP_TEAM_UPDATE("团队信息修改","?:class#com.wctsoft.davinci.entity.Team:?:?:DU"),
    GROUP_TEAM_LIST("查看列表","?:class#com.wctsoft.davinci.entity.SysUser:?:?:DR"),
    GROUP_TEAM_INVENTUSER("邀请用户","?:?:?:?:IC"),
    GROUP_TEAM_UPDATEUSER("更改分组","?:class#com.wctsoft.davinci.entity.SysUser:?:?:RU"),
    GROUP_TEAM_DROPUSER("踢人","?:class#com.wctsoft.davinci.entity.SysUser:?:?:TU"),
    APP_SETTING("displayApplySettingButton","?:?:?:AMV"),
    APP_CREATEFORM("allowCreateNewForm","?:?:?:MC"),

    FORM_VISIBLE("DISPLAY","?:?:FV"),
    FORM_DATAEDIT("FORM_REDIT","?:?:MU"),
    FORM_DATADEL("FORM_DELETE","?:?:MD"),

    FORM_APPROVEADD("AP_ADD","?:?:?:AFC"),
    FORM_APPROVEEDIT("AP_REDIT","?:?:?:AFU"),
    FORM_APPROVEDEL("AP_DELETE","?:?:?:AFD"),
    FORM_APPROVEENABLE("AP_ENABLE","?:?:?:AFE"),
    FORM_AUTOADD("PB_ADD","?:?:?:DFC"),
    FORM_AUTOEDIT("PB_REDIT","?:?:?:DFU"),
    FORM_AUTODEL("PB_DELETE","?:?:?:DFD"),
    FORM_AUTOENABLE("PB_ENABLE","?:?:?:DFE"),

    FORMDATA_VISIBLE("DISPLAY","?:?:DV"),
    FORMDATA_CHECK("FORM_SEARCHOWNER","extraProp.id#owner:?:DR"),
    FORMDATA_ADD("FORM_ADD","?:?:DC"),
    FORMDATA_EDIT("FORM_REDITOWNER","extraProp.id#owner:?:DU"),
    FORMDATA_DEL("FORM_DELETE","extraProp.id#owner:?:DD"),
    FORMDATA_LIST("FORM_SEARCHALL","*:?:DR"),
    FORMDATA_EDITALL("FORM_REDITALL","*:?:DU"),
    FORMDATA_DELALL("FORM_DELETEALL","*:?:DD");

 */

export const SUPER_ADMINISTRATOR = "*:*:*:*:*";

export const TEAM_MANAGEMENT_ABLE = "?:?:?:?:TMV";
export const TEAM_CREATE_APP = "?:?:?:?:CAC";

const PROFILE_MANAGEMENT_PREFIX =
  "?:class#com.wctsoft.davinci.shiro.entity.SysRole:?:?:";
export const PROFILE_MANAGEMENT_LIST = `${PROFILE_MANAGEMENT_PREFIX}DR`;
export const PROFILE_MANAGEMENT_NEW = `${PROFILE_MANAGEMENT_PREFIX}DC`;
export const PROFILE_MANAGEMENT_UPDATE = `${PROFILE_MANAGEMENT_PREFIX}DU`;
export const PROFILE_MANAGEMENT_DELETE = `${PROFILE_MANAGEMENT_PREFIX}DD`;

const TEAM_MANAGEMENT_PREFIX =
  "?:class#com.wctsoft.davinci.entity.SysUser:?:?:";
export const TEAM_MANAGEMENT_UPDATE_INFO =
  "?:class#com.wctsoft.davinci.entity.Team:?:?:DU";
export const TEAM_MANAGEMENT_LIST = `${TEAM_MANAGEMENT_PREFIX}DR`;
export const TEAM_MANAGEMENT_INVITE = "?:?:?:?:IC";
export const TEAM_MANAGEMENT_DROP = `${TEAM_MANAGEMENT_PREFIX}TU`;
export const TEAM_MANAGEMENT_SWITCH = `${TEAM_MANAGEMENT_PREFIX}RU
`;

const POSITION_MANAGEMENT_PREFIX =
  "?:class#com.wctsoft.davinci.entity.Position:?:?:";
export const POSITION_MANAGEMENT_LIST = `${POSITION_MANAGEMENT_PREFIX}DR`;
export const POSITION_MANAGEMENT_NEW = `${POSITION_MANAGEMENT_PREFIX}DC`;
export const POSITION_MANAGEMENT_UPDATE = `${POSITION_MANAGEMENT_PREFIX}DU`;
export const POSITION_MANAGEMENT_DELETE = `${POSITION_MANAGEMENT_PREFIX}DD`;



export const APP_SETTING_ABLED = appId => `${appId}:?:?:?:AMV`;
export const APP_VISIABLED = appId => `${appId}:?:?:?:CAV`;
export const APP_NEW_FORM = appId => `${appId}:?:?:?:MC`;

const formIdPrefix = "id#";

export const APP_FORM_VISIABLED = (appId, formId) => `${appId}:${formIdPrefix}${formId}:?:?:FV`;
export const APP_FORM_EDIT = (appId, formId) => `${appId}:${formIdPrefix}${formId}:?:?:MU`;
export const APP_FORM_DELETE = (appId, formId) => `${appId}:$${formIdPrefix}${formId}:?:?:MD`;

export const APP_FORM_PROCESS_NEW = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:DFC`;
export const APP_FORM_PROCESS_EDIT = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:DFU`;
export const APP_FORM_PROCESS_DELETE = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:DFD`;
export const APP_FORM_PROCESS_ENABLE = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:DFE`;

export const APP_FORM_APPROVAL_NEW = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:AFC`;
export const APP_FORM_APPROVAL_EDIT = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:AFU`;
export const APP_FORM_APPROVAL_DELETE = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:AFD`;
export const APP_FORM_APPROVAL_ENABLE = (appId, formId) =>
  `${appId}:${formIdPrefix}${formId}:?:?:AFE`;

export default {};
