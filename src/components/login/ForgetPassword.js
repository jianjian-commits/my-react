import React from "react";
import { connect } from "react-redux";
import signinStyles from "./style/login.module.scss";
import { loginUser } from "../../store/loginReducer";
import PublicForm from "./PublicForm";
import request from "../../utils/request";
import { catchError } from "../../utils";
import { message } from "antd";
import { history } from "../../store";
import { loginForgetPasswordParameter } from "./formItemConfig";

const reSetPassword = async ({ code, ...rest }) => {
  try {
    const res = await request(`/sysUser/resetPassword/${code}`, {
      method: "put",
      data: rest
    });
    if (res && res.status === "SUCCESS") {
      history.push("/");
    } else {
      message.error(res.msg || "密码重置失败");
    }
  } catch (err) {
    catchError(err);
  }
};

export default connect(() => ({}), {
  loginUser
})(function ForgetPassword({ loginUser }) {
  return (
    <div className={signinStyles.forgetPassword}>
      <div>
        <PublicForm
          parameter={loginForgetPasswordParameter}
          func={loginUser}
          marginBottom={24}
          loginType={"RESET"}
          reSetPassword={reSetPassword}
        />
      </div>
    </div>
  );
});
