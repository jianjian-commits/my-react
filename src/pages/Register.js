import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Result, message } from "antd";
import request from "../utils/request";
import registerStyles from "../styles/login.module.scss";
import PublicForm from "../utils/publicForm";
import { registerParameter } from "../utils/formItems";
import Loading from "./loading";

export default connect(({ login }) => ({
  isAuthenticated: login.isAuthenticated
}))(function Register({ history, isAuthenticated }) {
  const [status, setStatus] = useState(null);
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState({ spinning: false });
  const [isAuthenticateded, setIsAuthenticateded] = useState(isAuthenticated);
  //
  const [alreadyAddTeam, setAlreadyAddTeam] = useState(true);
  const pathname = history.location.pathname.split("/");
  const userId = pathname[2];
  const invited_token = pathname[3];
  if (!userId && isAuthenticated) history.push("/app");
  if (userId && !data.team && !data.inviteUserDetail) {
    // setData({ ...data, spinning: true });
    try {
      request(`/sysUser/${userId}`).then(res => {
        if (res && res.status === "SUCCESS" && !data.userDetail) {
          request(`/team/sysUser/${userId}`).then(resu => {
            if (
              resu &&
              resu.status === "SUCCESS" &&
              !data.team &&
              !!isAuthenticated
            ) {
              request(`/sysUser/${isAuthenticated}`).then(result => {
                if (result && result.status === "SUCCESS")
                  setData({
                    ...data,
                    inviteUserDetail: res.data,
                    team: resu.data,
                    currentUserDetail: result.data,
                    spinning: false
                  });
              });
            } else {
              setData({
                ...data,
                inviteUserDetail: res.data,
                team: resu.data,
                spinning: false
              });
            }
          });
        } else {
          setData({ ...data, inviteUserDetail: res.data, spinning: false });
        }
      });
    } catch (error) {
      message.error("获取信息失败");
    }
    // setData({ ...data, spinning: false });
  }
  if (userId && !data.team && !data.inviteUserDetail) return null;
  const registerUser = async ({ actionType, rest }) => {
    setData({ ...data, spinning: true });
    try {
      const res = await request(
        userId ? `/reg/token/${invited_token}` : "/reg",
        { method: "post", data: rest }
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
    setData({ ...data, spinning: false });
  };
  const confirm = () => {
    if (!status) return setVisible(true);
    history.push("/login");
  };

  const currentUserAddTeam = () => {
    try {
      request(`/team/${data.team.id}`, {
        method: "post",
        data: isAuthenticated
      }).then(res => {
        if (res && res.status === "SUCCESS") {
          history.push("/app");
        } else {
          setAlreadyAddTeam(true);
        }
      });
    } catch (error) {
      message.error("加入团队失败");
    }
  };

  const anotherUserAddTeam = () => {
    history.push(`/login/${userId}/${invited_token}`);
  };

  const BlueFont = props => {
    return <span style={{ color: "#1890ff" }}>{props.children}</span>;
  };
  const authenticatedRegister = (
    <div className={registerStyles.authenticatedDiv}>
      {alreadyAddTeam ? (
        <>
          {isAuthenticated && (
            <>
              <div>
                <Button onClick={currentUserAddTeam}>
                  当前帐号
                  {data.currentUserDetail && (
                    <BlueFont>{data.currentUserDetail.name}</BlueFont>
                  )}
                  加入
                </Button>
              </div>
              <hr />
            </>
          )}
          <div>
            <Button onClick={() => setIsAuthenticateded(false)}>
              注册账号加入
            </Button>
          </div>
          <div>
            <Button onClick={anotherUserAddTeam}>其他账号加入</Button>
          </div>
        </>
      ) : (
        <>
          <div>
            <span>您的账号</span>
          </div>
          <div style={{ textAlign: "center" }}>
            {data.currentUserDetail.name}
          </div>
          <div>已经加入团队{data.team.name}</div>
        </>
      )}
    </div>
  );
  const component = (
    <div className={registerStyles.signin}>
      <div className={registerStyles.form}>
        <div className={registerStyles.title}>
          <div>
            <h2>
              {userId && data.inviteUserDetail && data.team ? (
                <>
                  <BlueFont>{data.inviteUserDetail.name}</BlueFont>
                  邀请您加入团队<BlueFont>{data.team.name}</BlueFont>
                </>
              ) : (
                "感谢您的选择,"
              )}
            </h2>
          </div>
          {!isAuthenticateded && (
            <div>
              <h2>完善个人信息立即开始试用吧!</h2>
            </div>
          )}
        </div>
        <div>
          {isAuthenticateded ? (
            authenticatedRegister
          ) : (
            <PublicForm
              parameter={registerParameter}
              func={registerUser}
              userId={userId}
              invited_token={invited_token}
            />
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
  return (
    <>
      <Loading spinning={data.spinning}>
        {visible ? component : registerResult}
      </Loading>
    </>
  );
});
