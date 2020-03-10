import React from "react";
import { Layout, Menu, Icon } from "antd";
import { Route, Redirect, useParams, useHistory } from "react-router-dom";
import CommonHeader from "../components/header/CommonHeader";
import PlaceHolder from "./Placeholder";
import CreateForm from "../components/formBuilder/component/formBuilder/formBuilder";
import classes from "../styles/apps.module.scss";

const { Content, Sider } = Layout;

const services = [
  { key: "edit", name: "表单编辑", icon: "table", component: CreateForm }
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
  { key: 1, label: "用车编辑", disabled: true }
];

const AppServices = () => {
  const history = useHistory();
  let { appId, serviceId } = useParams();
  let service = services.find(s => s.key === serviceId);

  console.log("fck", service);

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
          <Menu className={classes.menuBorderNone} selectedKeys={serviceId}>
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
