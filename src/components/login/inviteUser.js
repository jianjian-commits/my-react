import React, { useState } from "react";
import { connect } from "react-redux";
import { message, Button } from "antd";
import request from "../../utils/request";
import Loading from "../../pages/Loading";
import registerStyles from "./style/login.module.scss";

export default connect()(function InviteUser({ match, history }) {
  const { userId, teamId, token } = match.params;
  const initialState = {
    userId,
    teamId,
    token,
    //邀请人信息
    inviter: null,
    invitedTeam: null,
    currentUserDetail: null,
    spinning: true,
    alreadyAddTeam: false,
    init: false
  };
  const [state, setState] = useState(initialState);
  if (!state.init) {
    request(`/team/invitedToken/${token}`).then(
      r => {
        if (r && r.status === "SUCCESS") {
          request(`/sysUser/current`).then(
            res => {
              if (res && res.status === "SUCCESS") {
                request(`/team/currentSysUser/all`).then(resu => {
                  if (resu && resu.status === "SUCCESS") {
                    setState({
                      ...state,
                      init: true,
                      inviter: r.data.userName,
                      invitedTeam: r.data.teamName,
                      currentUserDetail: res.data,
                      currentUserTeamDetail: resu.data,
                      spinning: false
                    });
                  } else {
                    setState({
                      ...state,
                      init: true,
                      inviter: r.data.userName,
                      invitedTeam: r.data.teamName,
                      currentUserDetail: res.data,
                      spinning: false
                    });
                  }
                });
              } else {
                setState({
                  ...state,
                  init: true,
                  inviter: r.data,
                  currentUserDetail: res.data,
                  spinning: false
                });
              }
            },
            () =>
              setState({
                ...state,
                init: true,
                inviter: r.data.userName,
                invitedTeam: r.data.teamName,
                spinning: false
              })
          );
        } else {
          setState({
            ...state,
            init: true,
            inviter: r.data.userName,
            invitedTeam: r.data.teamName,
            spinning: false
          });
        }
      },
      () => message.error("邀请信息获取失败")
    );
  }
  const {
    inviter,
    invitedTeam,
    currentUserDetail,
    spinning,
    alreadyAddTeam,
    init
  } = state;

  //点击当前按钮加入团队
  const handleCurrentUserAddTeam = () => {
    request(`/sysUser/${currentUserDetail.id}/team`, {
      method: "post",
      data: {
        newTeamId: teamId
      }
    }).then(
      res => {
        if (res && res.status === "SUCCESS") {
          message.success(`团队加入成功`);
          setTimeout(() => history.push("/"), 2000);
        } else {
          setState({ ...state, alreadyAddTeam: true });
        }
      },
      () => setState({ ...state, alreadyAddTeam: true })
    );
  };

  //点击注册账号加入
  const handleRegisterAddTeam = () => {
    history.push({
      pathname: `/login`,
      query: { ...state, active: "initRegister" }
    });
  };

  //点击其他账号加入
  const handleLoginAddTeam = () => {
    history.push({
      pathname: `/login`,
      query: { ...state, active: "initSignin" }
    });
  };

  const BlueFont = props => {
    return <span style={{ color: "#6eefff" }}>{props.children}</span>;
  };
  if (!init) return null;
  return (
    <>
      <Loading spinning={spinning}>
        <div className={registerStyles.inviteUser}>
          <div>
            {!alreadyAddTeam ? (
              <>
                <div className={registerStyles.normal}>
                  <div>
                    <span>
                      {inviter}邀请您加入-
                      <BlueFont>{invitedTeam}</BlueFont>
                    </span>
                  </div>
                  <div>
                    {currentUserDetail && (
                      <>
                        <div>
                          <Button onClick={handleCurrentUserAddTeam}>
                            当前账号:
                            <BlueFont>{currentUserDetail.name}</BlueFont>
                            加入
                          </Button>
                        </div>
                      </>
                    )}
                    <div>
                      <Button onClick={handleRegisterAddTeam}>
                        注册账号加入
                      </Button>
                    </div>
                    <div>
                      <Button onClick={handleLoginAddTeam}>其他账号加入</Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={registerStyles.result}>
                  <div>
                    <span>您的账号</span>
                  </div>
                  <div>
                    <BlueFont>{currentUserDetail.name}</BlueFont>
                  </div>
                  <div>已经加入团队{invitedTeam}</div>
                  <div>
                    <Button href="/">ok</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Loading>
    </>
  );
});
