import AppList from "../pages/Apps";
import Backlog from "../pages/Backlog";
import UserManagement from "../pages/User";

import Placeholder from "../pages/Placeholder";
import AppDetail from "../pages/AppDetail";
import AppSetting from "../pages/AppSetting";

export const main = [
  {
    key: "app",
    label: "应用",
    path: "/app/list",
    icon: "web",
    component: AppList
  },
  {
    key: "backlog",
    label: "待办事项",
    path: "/backlog",
    icon: "web",
    component: Backlog
  },
  {
    key: "user",
    label: "用户",
    path: "/user",
    icon: "web",
    component: UserManagement
  },
  {
    key: "authority",
    label: "权限",
    path: "/authority",
    icon: "web",
    component: Placeholder
  }
];

export const appPaths = [
  {
    key: "setting",
    label: "应用设置",
    path: `/app/:appId/setting`,
    icon: "file_copy",
    component: AppSetting
  },
  {
    key: "general",
    label: "概览",
    path: `/app/:appId/detail`,
    icon: "file_copy",
    component: AppDetail
  }
];

export const appServices = (appId, formId) => [
  {
    key: "form",
    label: "表单编辑",
    path: `/app/${appId}/setting/form/${formId}/editform`,
    icon: "file_copy",
    component: Placeholder
  },
  {
    key: "process",
    label: "自动化",
    path: `/app/${appId}/setting/form/${formId}/process`,
    icon: "file_copy",
    component: Placeholder
  },
  {
    key: "approval",
    label: "审批流",
    path: `/app/${appId}/setting/form/${formId}/approval`,
    icon: "file_copy",
    component: Placeholder
  }
];
