import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result, message } from "antd";
import request from "../../utils/request";
import PublicForm from "./PublicForm";
import { registerParameter } from "./formItemConfig";
import Styles from "./style/login.module.scss";
import { catchError } from "../../utils";
import { RegisteSuccessIcon, RegisteErrorIcon } from "../../assets/icons/login";

export default connect()(function Register({
  history,
  params,
  activeKey,
  setActiveKey,
  query,
  sendCode,
  isFetchCoding,
  fetchText,
  allowSendCode,
  resetAllowSendCodeState
}) {
  const { token } = params;
  const { inviter, invitedCompany } = history.location.query || query || {};
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
      catchError(err);
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
      <div
        className={Styles.title}
        style={{
          // display: token ? "block" : "flex",
          paddingLeft: token ? "20px" : "80px"
        }}
      >
        <div>
          <span>
            {token ? (
              <>
                <BlueFont>{inviter}</BlueFont>
                邀请您加入-<BlueFont>{invitedCompany}</BlueFont>，
              </>
            ) : (
              "感谢您的选择，"
            )}
          </span>
        </div>
        <div>
          <span>完善个人信息立即开始试用吧</span>
        </div>
      </div>
      <div>
        <PublicForm
          marginBottom={15}
          parameter={registerParameter}
          func={registerUser}
          params={params}
          setActiveKey={setActiveKey}
          history={history}
          sendCode={sendCode}
          isFetchCoding={isFetchCoding}
          fetchText={fetchText}
          allowSendCode={allowSendCode}
          resetAllowSendCodeState={resetAllowSendCodeState}
          activeKey={activeKey}
        />
      </div>
    </>
  );
  const registerResult = (
    <div className={Styles.result}>
      <Result
        title={status ? "恭喜您注册成功" : "注册失败"}
        icon={
          status ? (
            <RegisteSuccessIcon />
          ) : (
            <RegisteErrorIcon style={{ marginTop: "7.86px" }} />
          )
        }
        extra={[
          <Button
            type="primary"
            key={"success"}
            onClick={confirm}
            style={{ marginLeft: status ? "31.82px" : "8.6px" }}
          >
            {status ? "立即登录" : "重新注册"}
          </Button>
        ]}
      />
    </div>
  );
  return <>{visible ? component : registerResult}</>;
});
