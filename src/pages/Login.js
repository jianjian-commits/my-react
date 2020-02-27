import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import signinStyles from "../styles/login.module.scss";
import { loginUser } from "../store/loginReducer";
import PublicForm from "../utils/publicForm";
import Loading from "./loading";
import {
  loginPasswordParameter,
  loginPhoneParameter
} from "../utils/formItems";

export default connect(
  ({ login }) => ({
    isLoading: login.isLoading,
    isAuthenticated: login.isAuthenticated
  }),
  {
    loginUser
  }
)(function Login({ loginUser, isLoading, match, history, isAuthenticated }) {
  if (isAuthenticated) history.push("/")
  if (!history.location.query && history.location.pathname !== "/login")
    history.push("/login");

  return (
    <Loading spinning={isLoading}>
      <div className={signinStyles.signin}>
        <div className={signinStyles.form}>
          <Tabs defaultActiveKey="1" onChange={() => ""}>
            <Tabs.TabPane tab="用户名密码登录" key="1">
              <PublicForm
                parameter={loginPasswordParameter}
                func={loginUser}
                params={match.params}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手机验证码登录" key="2">
              <PublicForm
                parameter={loginPhoneParameter}
                func={loginUser}
                params={match.params}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Loading>
  );
});
