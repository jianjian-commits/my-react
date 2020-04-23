import React, { useState } from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import Styles from "./style/login.module.scss";
import {
  loginUser,
  sendCode,
  resetAllowSendCodeState
} from "../../store/loginReducer";
import PublicForm from "./publicForm";
import Loading from "../../pages/Loading";
import { loginPasswordParameter, loginPhoneParameter } from "./formItemConfig";
import clx from "classnames";
import { SigninImage, RegisterImage } from "../../assets/icons/login";
import Register from "./register";
import { Redirect } from "react-router";

function Registe({
  params,
  history,
  activeKey,
  setActiveKey,
  query,
  sendCode,
  isFetchCoding,
  fetchText,
  allowSendCode,
  resetAllowSendCodeState
}) {
  return (
    <>
      <div>
        <RegisterImage />
      </div>
      <div>
        <Register
          params={params}
          history={history}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          query={query}
          sendCode={sendCode}
          isFetchCoding={isFetchCoding}
          fetchText={fetchText}
          allowSendCode={allowSendCode}
          resetAllowSendCodeState={resetAllowSendCodeState}
        />
      </div>
    </>
  );
}

function Signin({
  activeKey,
  setActiveKey,
  params,
  loginUser,
  history,
  sendCode,
  isFetchCoding,
  fetchText,
  allowSendCode,
  resetAllowSendCodeState
}) {
  const [activeTab, setActiveTab] = useState("1");
  return (
    <>
      <div>
        <SigninImage />
      </div>
      <div>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            borderBottom: "1px solid #FFFFFF",
            marginBottom: "50px"
          }}
          tabBarGutter={35}
          onChange={key => setActiveTab(key)}
        >
          <Tabs.TabPane
            tab={
              <span
                className={clx(Styles.normalTabName, {
                  [Styles.activeTabName]: activeTab === "1"
                })}
              >
                账号密码登录
              </span>
            }
            key="1"
          >
            <PublicForm
              parameter={loginPasswordParameter}
              func={loginUser}
              params={params}
              marginBottom={0}
              setActiveKey={setActiveKey}
              history={history}
              loginType={"PASSWORD"}
              activeKey={activeKey}
              resetAllowSendCodeState={resetAllowSendCodeState}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span
                className={clx(Styles.normalTabName, {
                  [Styles.activeTabName]: activeTab === "2"
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
              marginBottom={0}
              setActiveKey={setActiveKey}
              history={history}
              loginType={"CODE"}
              sendCode={sendCode}
              isFetchCoding={isFetchCoding}
              fetchText={fetchText}
              allowSendCode={allowSendCode}
              resetAllowSendCodeState={resetAllowSendCodeState}
              activeKey={activeKey}
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
    isAuthenticated: login.isAuthenticated,
    isFetchCoding: login.isFetchCoding,
    fetchText: login.fetchText,
    allowSendCode: login.allowSendCode
  }),
  {
    loginUser,
    sendCode,
    resetAllowSendCodeState
  }
)(function Login({
  loginUser,
  isLoading,
  history,
  isAuthenticated,
  sendCode,
  isFetchCoding,
  fetchText,
  allowSendCode,
  resetAllowSendCodeState
}) {
  const { userId, companyId, token, active, inviter, invitedCompany } =
    history.location.query || {};
  const params =
    userId && companyId && token ? { userId, companyId, token } : {};
  const query = inviter && invitedCompany ? { inviter, invitedCompany } : {};
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
            style={{ left: activeKey === "initRegister" ? "-1016px" : "0px" }}
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
                  sendCode={sendCode}
                  isFetchCoding={isFetchCoding}
                  fetchText={fetchText}
                  allowSendCode={allowSendCode}
                  resetAllowSendCodeState={resetAllowSendCodeState}
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
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                  query={query}
                  sendCode={sendCode}
                  isFetchCoding={isFetchCoding}
                  fetchText={fetchText}
                  allowSendCode={allowSendCode}
                  resetAllowSendCodeState={resetAllowSendCodeState}
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
