import React, { useState } from "react";
import { connect } from "react-redux";
import { message, Button } from "antd";
import request from "../../utils/request";
import Loading from "../../pages/Loading";
import registerStyles from "../../styles/login.module.scss";

export default connect()(function InviteUser({ match, history }) {
  const { userId, teamId, token } = match.params;
  const initialState = {
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
      method: "put",
      data: {
        newTeamId: teamId
      }
    }).then(
      async res => {
        if (res && res.status === "SUCCESS") {
          message.success(`团队加入成功`);
          setTimeout(() => history.push("/"), 2000);
        }
      },
      () => setState({ ...state, alreadyAddTeam: true })
    );
  };

  //点击注册账号加入
  const handleRegisterAddTeam = () => {
    history.push({
      pathname: `/register/${userId}/${teamId}/${token}`,
      query: state
    });
  };

  //点击其他账号加入
  const handleLoginAddTeam = () => {
    history.push({
      pathname: `/login/${userId}/${teamId}/${token}`,
      query: state
    });
  };

  const BlueFont = props => {
    return <span style={{ color: "#1890ff" }}>{props.children}</span>;
  };
  if (!init) return null;
  return (
    <>
      <Loading spinning={spinning}>
        <div className={registerStyles.signin}>
          <div className={registerStyles.form}>
            {!alreadyAddTeam ? (
              <>
                <div className={registerStyles.title}>
                  <span>
                    <BlueFont>{inviter}</BlueFont>邀请您加入团队
                    <BlueFont>{invitedTeam}</BlueFont>
                  </span>
                </div>
                <div className={registerStyles.authenticatedDiv}>
                  {currentUserDetail && (
                    <>
                      <div onClick={handleCurrentUserAddTeam}>
                        <Button>
                          当前账号<BlueFont>{currentUserDetail.name}</BlueFont>
                          加入
                        </Button>
                      </div>
                      <hr />
                    </>
                  )}
                  <div onClick={handleRegisterAddTeam}>
                    <Button>注册账号加入</Button>
                  </div>
                  <div onClick={handleLoginAddTeam}>
                    <Button>其他账号加入</Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center" }}>
                  <span>您的账号</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <BlueFont>{currentUserDetail.name}</BlueFont>
                </div>
                <div style={{ textAlign: "center" }}>
                  已经加入团队{invitedTeam}
                </div>
              </>
            )}
          </div>
        </div>
      </Loading>
    </>
  );
});
