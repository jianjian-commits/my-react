import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result, message } from "antd";
import request from "../../utils/request";
import PublicForm from "./publicForm";
import { registerParameter } from "./formItems";
import Styles from "./style/login.module.scss";

export default connect()(function Register({
  history,
  params,
  setActiveKey,
  query
}) {
  const { token } = params;
  const { inviter, invitedTeam } = history.location.query || query || {};
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const registerUser = async ({ actionType, rest }) => {
    try {
      const res = await request(token ? `/reg?token=${token}` : "/reg", {
        method: "post",
        data: { ...rest, password: rest.registerPassword }
      });
      if (res && res.status === "SUCCESS") {
        setStatus(true);
        setVisible(false);
      } else {
        setStatus(false);
        message.error(res.msg || "注册失败");
      }
    } catch (err) {
      setStatus(false);
      setVisible(false);
      message.error(
        (err.response && err.response.data && err.response.data.msg) ||
          "系统错误"
      );
    }
  };
  const confirm = () => {
    if (!status) return setVisible(true);
    history.push("/");
  };

  const BlueFont = props => {
    return <span style={{ color: "#1890ff" }}>{props.children}</span>;
  };

  const component = (
    <>
      <div className={Styles.title}>
        <div>
          <span>
            {token ? (
              <>
                <BlueFont>{inviter}</BlueFont>
                邀请您加入-<BlueFont>{invitedTeam}</BlueFont>
              </>
            ) : (
              "感谢您的选择,"
            )}
          </span>
        </div>
        <div>
          <span>完善个人信息立即开始试用吧</span>
        </div>
      </div>
      <div>
        <PublicForm
          marginBottom={24}
          parameter={registerParameter}
          func={registerUser}
          params={params}
          setActiveKey={setActiveKey}
          history={history}
        />
      </div>
    </>
  );
  const registerResult = (
    <div className={Styles.result}>
      <Result
        status={status ? "success" : "error"}
        title={status ? "注册成功" : "注册失败, 请重试"}
        extra={[
          <Button type="primary" key={"success"} onClick={confirm}>
            {status ? "OK" : "重新注册"}
          </Button>
        ]}
      />
    </div>
  );
  return <>{visible ? component : registerResult}</>;
});
