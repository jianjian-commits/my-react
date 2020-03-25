import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Tooltip } from "antd";
import { Route, Redirect, useParams, useHistory } from "react-router-dom";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import CommonHeader from "../components/header/CommonHeader";
import { APP_FORM_EDIT } from "../auth";
// import PlaceHolder from "./Placeholder";
import { getFormsByFormId } from "../components/formBuilder/component/homePage/redux/utils/operateFormUtils";
import CreateForm from "../components/formBuilder/component/formBuilder/formBuilder";
import Approval from "../components/ApprovalProcess";
import Process from "../components/ProcessAuto";
import classes from "../styles/apps.module.scss";
import { ApIcon, FbIcon, PbIcon } from "../assets/icons/apps";

const { Content, Sider } = Layout;

const services = [
  { key: "edit", name: "表单编辑", icon: FbIcon, component: CreateForm },
  {
    key: "process/list",
    name: "自动化",
    icon: PbIcon,
    auth: APP_FORM_EDIT,
    component: Process
  },
  { key: "approval/list", name: "审批流", icon: ApIcon, component: Approval }
];

const navigationList = (history, appId, appName, formName) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: `${appName}`,
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  {
    key: 1,
    label: "应用设置",
    onClick: () => history.push(`/app/${appId}/setting`)
  },
  { key: 1, label: `${formName}`, disabled: true }
];

const AppServices = props => {
  const history = useHistory();
  const { appId, formId, serviceId } = useParams();
  const [formName, setFormName] = useState("");

  // 通过formId获取表单的信息
  useEffect(() => {
    getFormsByFormId(formId).then(res => {
      setFormName(res.name);
    });
  }, [formId]);
  const currentApp =
    Object.assign([], props.appList).find(v => v.id === appId) || {};
  const appName = currentApp.name || "";
  const service = services.find(s => {
    return s.key.indexOf(serviceId) !== -1;
  });

  const clickHandle = e => {
    if (e.key === "edit")
      history.push(
        `/app/${appId}/setting/form/${formId}/${e.key}?formId=${formId}`
      );
    else history.push(`/app/${appId}/setting/form/${formId}/${e.key}`);
  };

  if (!service) {
    return <Route render={() => <Redirect to={`/app/${appId}/setting`} />} />;
  }

  return (
    <Layout>
      <CommonHeader
        navigationList={navigationList(history, appId, appName, formName)}
      />
      <Layout>
        <Sider className={classes.appSider} theme="light" width={80}>
          <Menu className={classes.menuBorderNone} selectedKeys={service.key}>
            {services
              .filter(w => w)
              .map(s => (
                <Menu.Item key={s.key} onClick={clickHandle}>
                  <Tooltip placement="right" title={s.name}>
                    <s.icon />
                  </Tooltip>
                </Menu.Item>
              ))}
          </Menu>
        </Sider>
        <Content>
        <DndProvider backend={HTML5Backend}>
          <service.component />
         </DndProvider> 
        </Content>
      </Layout>
    </Layout>
  );
};
export default connect(({ app, login, debug }) => ({
  appList: app.appList,
  permissions: (login.userDetail && login.userDetail.permissions) || [],
  teamId: login.currentTeam && login.currentTeam.id,
  debug: debug.isOpen
}))(AppServices);
