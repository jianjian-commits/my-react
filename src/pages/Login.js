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

export default connect(({ login }) => ({ isLoading: login.isLoading }), {
  loginUser
})(function Login({ loginUser, isLoading }) {
  return (
    <Loading spinning={isLoading}>
      <div className={signinStyles.signin}>
        <div className={signinStyles.form}>
          <Tabs defaultActiveKey="1" onChange={() => ""}>
            <Tabs.TabPane tab="用户名密码登录" key="1">
              <PublicForm parameter={loginPasswordParameter} func={loginUser} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="手机验证码登录" key="2">
              <PublicForm parameter={loginPhoneParameter} func={loginUser} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Loading>
  );
});
