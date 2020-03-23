import React, { useState } from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import Styles from "./style/login.module.scss";
import { loginUser } from "../../store/loginReducer";
import PublicForm from "./publicForm";
import Loading from "../../pages/Loading";
import { loginPasswordParameter, loginPhoneParameter } from "./formItems";
import clx from "classnames";
import signinImg from "./style/signin.png";
import registerImg from "./style/register.png";
import Register from "./register";
import { Redirect } from "react-router";

function Registe({ params, history, setActiveKey, query }) {
  return (
    <>
      <div>
        <img src={registerImg} alt="" />
      </div>
      <div>
        <Register
          params={params}
          history={history}
          setActiveKey={setActiveKey}
          query={query}
        />
      </div>
    </>
  );
}

function Signin({ setActiveKey, activeKey, params, loginUser, history }) {
  return (
    <>
      <div>
        <img src={signinImg} alt="" />
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{ borderBottom: "1px solid #FFFFFF" }}
          tabBarGutter={35}
        >
          <Tabs.TabPane
            tab={
              <span
                className={clx(Styles.normalTabName, {
                  [Styles.activeTabName]: activeKey === "1"
                })}
              >
                用户名密码登录
              </span>
            }
            key="1"
          >
            <PublicForm
              parameter={loginPasswordParameter}
              func={loginUser}
              params={params}
              marginBottom={20}
              setActiveKey={setActiveKey}
              history={history}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span
                className={clx(Styles.normalTabName, {
                  [Styles.activeTabName]: activeKey === "2"
                })}
              >
                手机验证码登录
              </span>
            }
            key="2"
          >
            <PublicForm
              parameter={loginPhoneParameter}
              func={loginUser}
              params={params}
              marginBottom={20}
              setActiveKey={setActiveKey}
              history={history}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default connect(
  ({ login }) => ({
    isLoading: login.isLoading,
    isAuthenticated: login.isAuthenticated
  }),
  {
    loginUser
  }
)(function Login({ loginUser, isLoading, history, isAuthenticated }) {
  const { userId, teamId, token, active, inviter, invitedTeam } =
    history.location.query || {};
  const params = userId && teamId && token ? { userId, teamId, token } : {};
  const query = inviter && invitedTeam ? { inviter, invitedTeam } : {};
  const [activeKey, setActiveKey] = useState(active || "initSignin");
  if (!history.location.query && isAuthenticated) return <Redirect to="/" />;

  return (
    <Loading spinning={isLoading}>
      <div className={Styles.background}>
        <div className={Styles.panel}>
          <div
            className={clx(
              Styles.room,
              { [Styles.activeRight]: activeKey === "signin" },
              { [Styles.activeLeft]: activeKey === "register" }
            )}
            style={{ left: activeKey === "initRegister" ? "-1240px" : "0px" }}
          >
            <div className={clx(Styles.signin)}>
              {
                // (activeKey === "signin" || activeKey === "initSignin") && (
                <Signin
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                  params={params}
                  loginUser={loginUser}
                  history={history}
                />
                // )
              }
            </div>
            <div className={Styles.registe}>
              {
                // (activeKey === "register" || activeKey === "initRegister") && (
                <Registe
                  history={history}
                  params={params}
                  setActiveKey={setActiveKey}
                  query={query}
                />
                // )
              }
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
});
