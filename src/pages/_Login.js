import React from "react";
import { connect } from "react-redux";
import { Tabs } from "antd";
import signinStyles from "../styles/login.module.scss";
import { loginUser } from "../store/_loginReducer";
import PublicForm from "../utils/publicForm";
import {
  loginPasswordFormItems
  // loginPhoneFormItems
} from "../utils/formItems";

export default connect(() => ({}), {
  loginUser
})(function Login({ loginUser }) {
  return (
    <div className={signinStyles.signin}>
      <div className={signinStyles.form}>
        <Tabs defaultActiveKey="1" onChange={() => ""}>
          <Tabs.TabPane tab="用户名密码登录" key="1">
            <PublicForm formItems={loginPasswordFormItems} func={loginUser} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane tab="手机验证码登录" key="2">
            <PublicForm formItems={loginPhoneFormItems} func={loginUser} />
          </Tabs.TabPane> */}
        </Tabs>
      </div>
    </div>
  );
});
