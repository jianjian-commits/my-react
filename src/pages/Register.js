import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Button, Result, Modal } from "antd";
import registerStyles from "../styles/login.module.scss";
import PublicForm from "../utils/publicForm";
import { registerFormItems } from "../utils/formItems";
//***********************************
import copy from "copy-to-clipboard";
import { message } from "antd";
//***********************************

export default connect(({ login }) => ({
  register_token: login.register_token
}))(function Register({ history, register_token }) {
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const [modal, setModal] = useState(false);
  // const _register_token = history.location.pathname.split("/")[2];
  const registerUser = ({ actionType, rest }) => {
    if (actionType === "register" && rest) {
      localStorage.setItem(
        "register",
        JSON.stringify([
          ...(JSON.parse(localStorage.getItem("register")) || []),
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
  //**************************************************************************
  const registerUrl = `${window.location.origin}/register/${register_token}`;
  //*************************************************************************
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
      <button
        onClick={() => {
          setModal(true);
        }}
      >
        邀请同事
      </button>
      {/****************************************************************/}
      <Modal
        title="邀请同事"
        visible={modal}
        footer={null}
        width="419px"
        onCancel={() => setModal(false)}
      >
        <p> 将链接发给同事，即可通过注册的方式加入企业。</p>
        <div style={{ display: "flex" }}>
          <Input value={registerUrl} />
          <Button
            onClick={() => {
              copy(registerUrl);
              message.success("复制成功!");
            }}
          >
            复制链接
          </Button>
        </div>
        <p> 链接14天有效</p>
      </Modal>
      {/****************************************************************/}
    </>
  );
});
