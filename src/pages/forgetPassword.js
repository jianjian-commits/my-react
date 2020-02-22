import React from "react";
import { connect } from "react-redux";
import signinStyles from "../styles/login.module.scss";
import { loginUser } from "../store/loginReducer";
import PublicForm from "../utils/publicForm";
import { loginForgetPasswordParameter } from "../utils/formItems";

export default connect(() => ({}), {
  loginUser
})(function ForgetPassword({ loginUser }) {
  return (
    <div className={signinStyles.signin}>
      <div className={signinStyles.form}>
        <PublicForm parameter={loginForgetPasswordParameter} func={loginUser} />
      </div>
    </div>
  );
});
