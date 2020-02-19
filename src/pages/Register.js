import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result } from "antd";
import registerStyles from "../styles/login.module.scss";
import PublicForm from "../utils/publicForm";
import { registerFormItems } from "../utils/formItems";

export default connect()(function Register({ history }) {
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  // const _register_token = history.location.pathname.split("/")[2];
  const registerUser = ({ actionType, rest }) => {
    if (actionType === "register" && rest) {
      localStorage.setItem(
        "userData",
        JSON.stringify([
          ...(JSON.parse(localStorage.getItem("userData")) || []),
          rest
        ])
      );
      setStatus(true);
    } else {
      setStatus(false);
    }
    setVisible(false);
  };
  const confirm = () => {
    if (!status) return setVisible(true);
    history.push("/login");
  };
  return (
    <>
      {visible ? (
        <div className={registerStyles.signin}>
          <div className={registerStyles.form}>
            <h2>感谢您的选择,完善个人信息立即开始试用吧!</h2>
            <PublicForm formItems={registerFormItems} func={registerUser} />
          </div>
        </div>
      ) : (
        <Result
          status={status ? "success" : "error"}
          title={status ? "注册成功" : "注册失败"}
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          // icon=""
          extra={[
            <Button type="primary" key={"success"} onClick={confirm}>
              OK
            </Button>
          ]}
        />
      )}
    </>
  );
});
