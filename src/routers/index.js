import AppList from "../pages/Apps";
import Backlog from "../pages/Backlog";
import TeamManagement from "../pages/TeamManagement";

import AppDetail from "../pages/AppDetail";
// import Submission from "../components/formBuilder/component/submission/submission";
// import SubmitData from "../components/formBuilder/component/formData/formSubmitData";
import AppSetting from "../pages/AppSetting";
import AppServices from "../pages/AppServices";
// import AppServicesEdit from "../pages/AppServicesEdit";
import UserDetail from "../components/header/userDetail";
import Dispose from "../pages/Dispose";

export const main = [
  {
    key: "app",
    label: "应用",
    path: "/app/list",
    component: AppList
  },
  {
    key: "backlog",
    label: "待办事项",
    path: "/backlog",
    component: Backlog
  },
  {
    key: "team",
    label: "团队管理",
    path: "/team",
    component: TeamManagement
  },
  {
    key: "userDetail",
    label: "个人信息",
    path: "/userDetail",
    component: UserDetail
  }
];

export const appPaths = [
  {
    key: "general",
    label: "概览",
    path: `/app/:appId/detail`,
    component: AppDetail
  },
  {
    key: "menuContent",
    label: "菜单内容",
    path: `/app/:appId/detail/:menuId`,
    component: AppDetail
  },
  {
    key: "setting",
    label: "应用设置",
    path: `/app/:appId/setting`,
    component: AppSetting
  },
  // {
  //   key: "createForm",
  //   label: "表单服务",
  //   path: `/app/:appId/setting/form/create`,
  //   component: CreateForm
  // },
  {
    key: "form",
    label: "表单服务",
    path: `/app/:appId/setting/form/:formId/:serviceId`,
    rough: true,
    component: AppServices
  },
  // {
  //   key: "formEdit",
  //   label: "表单服务",
  //   path: `/app/:appId/setting/form/:formId/:serviceId`,
  //   component: AppServicesEdit
  // },
  {
    key: "Dispose",
    label: "审批详情",
    path: `/app/:appId/:disposeId`,
    component: Dispose
  }
];
