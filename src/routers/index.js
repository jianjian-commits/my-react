import AppList from "../pages/Apps";
import Backlog from "../pages/Backlog";
import CompanyManagement from "../pages/CompanyManagement";

import AppDetail from "../pages/AppDetail";
// import Submission from "../components/formBuilder/component/submission/submission";
// import SubmitData from "../components/formBuilder/component/formData/formSubmitData";
import AppSetting from "../pages/AppSetting";
import AppServices from "../pages/AppServices";
// import AppServicesEdit from "../pages/AppServicesEdit";
import UserDetail from "../components/header/UserDetail";
import Dispose from "../pages/Dispose";
import BI from "../pages/BI";
import ElementEditor from "../pages/ElementEditor";
import { APP_SETTING_ABLED } from "../auth";

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
    key: "company",
    label: "公司管理",
    path: "/company",
    component: CompanyManagement
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
    label: "应用管理",
    path: `/app/:appId/setting`,
    auth: APP_SETTING_ABLED,
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
  {
    key: "element",
    label: "图表",
    path: `/app/:appId/setting/bi/:dashboardId/:elementId`,
    rough: true,
    component: ElementEditor
  },
  {
    key: "bi",
    label: "报表",
    path: `/app/:appId/setting/bi/:dashboardId`,
    rough: true,
    component: BI
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
