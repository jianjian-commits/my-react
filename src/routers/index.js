import AppList from "../pages/Apps";
import Backlog from "../pages/Backlog";
import CompanyManagement from "../pages/CompanyManagement";
import AppDetail from "../pages/AppDetail";
import TeamInfo from "../components/userManagement/team/TeamInfo";
import TeamMember from "../components/userManagement/team/TeamMember";
import ProfileManagement from "../components/profileManagement";
import PositionTree from "../components/userManagement/position/PositionTree"
import { PROFILE_MANAGEMENT_LIST, TEAM_MANAGEMENT_LIST, POSITION_MANAGEMENT_LIST } from "../auth";
import { InfoIcon, MemberIcon, ProfileIcon,PositionIcon } from "../assets/icons/company";
import AppSetting from "../pages/AppSetting";
import AppServices from "../pages/AppServices";
import UserDetail from "../components/header/UserDetail";
import Dispose from "../pages/Dispose";
import BI from "../pages/BI";
import ElementEditor from "../pages/ElementEditor";
import { APP_SETTING_ABLED, TEAM_MANAGEMENT_ABLE } from "../auth";
// import { CompanyManageIcon } from "../assets/icons/company";

export const companyWebs = [
  {
    key: "company/info",
    path: "/company/info",
    label: "公司信息",
    icon: InfoIcon,
    component: TeamInfo
  },
  {
    key: "company/member",
    path: "/company/member",
    label: "公司成员",
    auth: TEAM_MANAGEMENT_LIST,
    icon: MemberIcon,
    component: TeamMember
  },
  {
    key: "company/profile",
    path: "/company/profile",
    label: "分组",
    auth: PROFILE_MANAGEMENT_LIST,
    icon: ProfileIcon,
    exact: true,
    component: ProfileManagement
  },
  {
    key: "company/position",
    path: "/company/position",
    label: "职位",
    icon: PositionIcon,
    auth: POSITION_MANAGEMENT_LIST,
    component: PositionTree,
  },
];

export const main = [
  {
    key: "app",
    label: "应用概览",
    path: "/app/list",
    authOptions: {
      type: "ignore"
    },
    component: AppList
  },
  {
    key: "backlog",
    label: "待办事项",
    path: "/backlog",
    component: Backlog,
    authOptions: {
      type: "ignore"
    },
  },
  {
    key: "company",
    label: "公司管理",
    path: "/company",
    icon: MemberIcon,
    auth: TEAM_MANAGEMENT_ABLE,
    component: CompanyManagement,
    children: companyWebs
  },
  {
    key: "userDetail",
    label: "个人信息",
    path: "/userDetail",
    component: UserDetail,
    authOptions: {
      type: "ignore"
    },
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
