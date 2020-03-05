import AppList from "../pages/Apps";
import Backlog from "../pages/Backlog";
import UserManagement from "../pages/User";

import Placeholder from "../pages/Placeholder";
import AppDetail from "../pages/AppDetail";
import Submission from "../components/formBuilder/component/submission/submission";
import AppSetting from "../pages/AppSetting";
import AppServices from "../pages/AppServices";
import UserDetail from "../components/header/userDetail";
import Dispose from "../pages/Dispose";
import mobileAdoptor from "../components/formBuilder/utils/mobileAdoptor";

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
    label: "团队管理",
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
  },
  {
    key: "userDetail",
    label: "个人信息",
    path: "/userDetail",
    icon: "web",
    component: UserDetail
  }
];

export const appPaths = [
  {
    key: "general",
    label: "概览",
    path: `/app/:appId/detail`,
    icon: "file_copy",
    component: AppDetail
  },
  {
    key: "submission",
    label: "提交数据",
    path: `/app/:appId/detail/submission`,
    icon: "file_copy",
    component: mobileAdoptor.data(Submission)
  },
  {
    key: "menuContent",
    label: "菜单内容",
    path: `/app/:appId/detail/:menuId`,
    icon: "file_copy",
    component: AppDetail
  },
  {
    key: "setting",
    label: "应用设置",
    path: `/app/:appId/setting`,
    icon: "file_copy",
    component: AppSetting
  },
  {
    key: "form",
    label: "表单服务",
    path: `/app/:appId/setting/form/:formId/:serviceId`,
    icon: "file_copy",
    rough: true,
    component: AppServices
  },
  {
    key: "Dispose",
    label: "审批详情",
    path: `/app/:appId/:disposeId`,
    icon: "file_copy",
    component: Dispose
  }
];
