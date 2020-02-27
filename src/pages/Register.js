import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result } from "antd";
import request from "../utils/request";
import registerStyles from "../styles/login.module.scss";
import PublicForm from "../utils/publicForm";
import { registerParameter } from "../utils/formItems";
import Loading from "./loading";

export default connect()(function Register({ history, match }) {
  const { userId, token } = match.params;
  if (!history.location.query && history.location.pathname !== "/register")
    history.push("/register");
  const { inviter, invitedTeam } = history.location.query || {};
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const registerUser = async ({ actionType, rest }) => {
    setSpinning(true);
    try {
      const res = await request(userId ? `/reg?token=${token}` : "/reg", {
        method: "post",
        data: rest
      });
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
    setSpinning(false);
  };
  const confirm = () => {
    if (!status) return setVisible(true);
    history.push("/");
  };

  const BlueFont = props => {
    return <span style={{ color: "#1890ff" }}>{props.children}</span>;
  };

  const component = (
    <div className={registerStyles.signin}>
      <div className={registerStyles.form}>
        <div className={registerStyles.title}>
          <div>
            <h2>
              {userId ? (
                <>
                  <BlueFont>{inviter}</BlueFont>
                  邀请您加入团队<BlueFont>{invitedTeam}</BlueFont>
                </>
              ) : (
                "感谢您的选择,"
              )}
            </h2>
          </div>
          <div>
            <h2>完善个人信息立即开始试用吧!</h2>
          </div>
        </div>
        <div>
          <PublicForm
            parameter={registerParameter}
            func={registerUser}
            params={match.params}
          />
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
  return (
    <>
      <Loading spinning={spinning}>
        {visible ? component : registerResult}
      </Loading>
    </>
  );
});
