import React from "react";
import { connect } from "react-redux";
import signinStyles from "./style/login.module.scss";
import { sendCode, resetAllowSendCodeState } from "../../store/loginReducer";
import PublicForm from "./publicForm";
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
      message.success("密码重置成功");
    } else {
      message.error(res.msg || "密码重置失败");
    }
  } catch (err) {
    catchError(err);
  }
};

export default connect(
  ({ login }) => ({
    isFetchCoding: login.isFetchCoding,
    fetchText: login.fetchText,
    allowSendCode: login.allowSendCode
  }),
  {
    sendCode,
    resetAllowSendCodeState
  }
)(function ForgetPassword({
  sendCode,
  isFetchCoding,
  fetchText,
  allowSendCode,
  resetAllowSendCodeState
}) {
  return (
    <div className={signinStyles.forgetPassword}>
      <div>
        <PublicForm
          parameter={loginForgetPasswordParameter}
          marginBottom={24}
          reSetPassword={reSetPassword}
          sendCode={sendCode}
          isFetchCoding={isFetchCoding}
          fetchText={fetchText}
          allowSendCode={allowSendCode}
          resetAllowSendCodeState={resetAllowSendCodeState}
          activeKey={"signin"}
        />
      </div>
    </div>
  );
});
