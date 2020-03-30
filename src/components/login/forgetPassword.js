import React from "react";
import { connect } from "react-redux";
import signinStyles from "./style/login.module.scss";
import { loginUser } from "../../store/loginReducer";
import PublicForm from "./publicForm";
import { loginForgetPasswordParameter } from "./formItemConfig";

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
        />
      </div>
    </div>
  );
});
