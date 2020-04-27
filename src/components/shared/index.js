import React from "react";
import { Route, Redirect } from "react-router-dom";
import Authenticate from "../shared/Authenticate";
import { BreadRight } from "../../assets/icons";
import { Breadcrumb, Layout, Card } from "antd";
import clx from "classnames";
import comClasses from "../../styles/common.module.scss";
import HomeHeader from "../header/HomeHeader";
import HomeSider from "../sidder/HomeSider";

const { Content } = Layout;

export const PrivateRoute = ({
  auth,
  authOptions = {},
  component,
  options,
  ...rest
}) => (
  <Authenticate
    {...authOptions}
    type={authOptions.type || "default"}
    auth={auth}
  >
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("id_token") ? (
          React.createElement(component, { ...props, ...options })
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  </Authenticate>
);

export const PublicRoute = ({ component, props, ...rest }) => (
  <Route {...rest} render={props => React.createElement(component, props)} />
);

export const Navigation = ({ navs = [] }) => {
  return (
    <>
      <Breadcrumb separator={<BreadRight />}>
        {navs.map(n => (
          <Breadcrumb.Item
            key={n.key}
            className={clx({
              [comClasses.breadcrumbItem]: true,
              [comClasses.disabled]: n.disabled,
              [comClasses.active]: !n.disabled
            })}
            onClick={n.onClick}
          >
            {n.label}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </>
  );
};

export const HomeLayout = props => <Layout>
    <HomeSider />
    <Content>
      <HomeHeader />
      <Content className={comClasses.commonContentWarpper}>
        {props.children}
      </Content>
    </Content>
  </Layout>;

export const HomeContentTitle = ({ title, navs, btns }) => {
  return <Card className={comClasses.homeContentTitle} bodyStyle={{ padding: "12px 24px" }}>
    {navs ? <Navigation navs={navs}/> : null }
    <div className={comClasses.main}>
      <div className={comClasses.title}>{typeof title === "string" ? <h3>{title}</h3> : title}</div>
      <div className={comClasses.btns}>{btns}</div>
    </div>
  </Card>
};