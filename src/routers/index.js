import AppList from "../pages/Apps";
import Placeholder from "../pages/Placeholder";

export const main = [
  {
    key: "app",
    label: "应用",
    path: "/app/list",
    icon: "web",
    component: AppList
  },
  {
    key: "user",
    label: "用户",
    path: "/user",
    icon: "web",
    component: Placeholder
  },
  {
    key: "authority",
    label: "权限",
    path: "/authority",
    icon: "web",
    component: Placeholder
  }
];

export const services = appId => [
  {
    key: "form",
    label: "表单",
    path: `/app/${appId}/form`,
    icon: "file_copy",
    component: Placeholder
  },
  {
    key: "process",
    label: "自动化",
    path: `/app/${appId}/process`,
    icon: "file_copy",
    component: Placeholder
  },
  {
    key: "approval",
    label: "审批流",
    path: `/app/${appId}/approval`,
    icon: "file_copy",
    component: Placeholder
  }
];
