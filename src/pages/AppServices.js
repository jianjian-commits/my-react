import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Route, Redirect, useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import PlaceHolder from "./Placeholder";
import CreateForm from "../components/formBuilder/component/formBuilder/formBuilder";
import classes from "../styles/apps.module.scss";

const { Content, Sider } = Layout;

const services = [
  { key: "create", name: "表单创建", icon: "table", component: CreateForm },
  {
    key: "process",
    name: "自动化",
    icon: "cloud-sync",
    component: PlaceHolder
  },
  { key: "approval", name: "审批流", icon: "audit", component: PlaceHolder }
];

const navigationList = (history, appId) => [
  { key: 0, label: "我的应用", onClick: () => history.push("/app/list") },
  {
    key: 1,
    label: "13号Devinci应用",
    onClick: () => history.push(`/app/${appId}/detail`)
  },
  {
    key: 1,
    label: "应用设置",
    onClick: () => history.push(`/app/${appId}/setting`)
  },
  { key: 1, label: "用车申请", disabled: true }
];

const AppServices = () => {
  const history = useHistory();
  const { appId, formId } = useParams();
  console.log(formId);
  const service = services.find(s => s.key === formId);

  const clickHandle = e => {
    history.push(`/app/${appId}/setting/form/${e.key}`);
  };

  if (!service) {
    return <Route render={() => <Redirect to={`/app/${appId}/setting`} />} />;
  }
  return (
    <Layout>
      <CommonHeader navigationList={navigationList(history, appId)} />
      <Layout>
        <Sider className={classes.appSider} theme="light" width={64}>
          <Menu className={classes.menuBorderNone} selectedKeys={formId}>
            {services.map(s => (
              <Menu.Item key={s.key} onClick={clickHandle}>
                <Icon type={s.icon} style={{ fontSize: 22 }} />
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content>
          <service.component />
        </Content>
      </Layout>
    </Layout>
  );
};
export default AppServices;
