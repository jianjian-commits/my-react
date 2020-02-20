import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result, message } from "antd";
import request from "../utils/request";
import registerStyles from "../styles/login.module.scss";
import PublicForm from "../utils/publicForm";
import { registerParameter } from "../utils/formItems";

export default connect(({ login }) => ({
  isAuthenticated: login.isAuthenticated
}))(function Register({ history, isAuthenticated }) {
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const [name, setName] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const pathname = history.location.pathname.split("/");
  const userId = pathname[2];
  const invited_token = pathname[3];
  if (userId) {
    try {
      request(`/sysUser/${userId}`).then(res => {
        if (res && res.status === "SUCCESS") {
          setName(res.data.name);
          request(`/team/sysUser/${userId}`).then(resu => {
            if (resu && resu.status === "SUCCESS") {
              setTeamName(resu.data.name);
            } else {
              message.error("获取团队id失败");
            }
          });
        } else {
          message.error("获取邀请人信息失败");
        }
      });
    } catch (error) {
      message.error("获取信息失败");
    }
  }
  const registerUser = async ({ actionType, rest }) => {
    try {
      const res = await request(
        userId ? `/reg/token/${invited_token}` : "/reg",
        { method: "post", data: { ...rest } }
      );
      if (res && res.status === "SUCCESS") {
        setStatus(true);
        setVisible(false);
      } else {
        setStatus(false);
      }
    } catch (err) {
      setStatus(false);
      setVisible(false);
    }
  };
  const confirm = () => {
    if (!status) return setVisible(true);
    history.push("/login");
  };

  const authenticatedRegister = (
    <div className={registerStyles.authenticatedDiv}>
      {!isAuthenticated && (
        <>
          <div>
            <Button>当前帐号XXX加入</Button>
          </div>
          <hr />
        </>
      )}
      <div>
        <Button href="/register">注册账号加入</Button>
      </div>
      <div>
        <Button href="/login">其他账号加入加入</Button>
      </div>
    </div>
  );
  const component = (
    <div className={registerStyles.signin}>
      <div className={registerStyles.form}>
        <div className={registerStyles.title}>
          <div>
            <h2>
              {userId ? `${name}邀请您加入团队${teamName}` : "感谢您的选择,"}
            </h2>
          </div>
          {!isAuthenticated && (
            <div>
              <h2>完善个人信息立即开始试用吧!</h2>
            </div>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            authenticatedRegister
          ) : (
            <PublicForm parameter={registerParameter} func={registerUser} />
          )}
        </div>
      </div>
    </div>
  );
  const registerResult = (
    <Result
      status={status ? "success" : "error"}
      title={status ? "注册成功" : "注册失败, 请重试"}
      extra={[
        <Button type="primary" key={"success"} onClick={confirm}>
          {status ? "OK" : "重新注册"}
        </Button>
      ]}
    />
  );
  return <>{visible ? component : registerResult}</>;
});
