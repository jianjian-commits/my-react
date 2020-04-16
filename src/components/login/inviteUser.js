import React, { useState } from "react";
import { connect } from "react-redux";
import { message, Button } from "antd";
import request from "../../utils/request";
import Loading from "../../pages/Loading";
import { catchError } from "../../utils";
import registerStyles from "./style/login.module.scss";

export default connect()(function InviteUser({ match, history }) {
  const { userId, companyId, token } = match.params;
  const initialState = {
    userId,
    companyId,
    token,
    //邀请人信息
    inviter: null,
    invitedCompany: null,
    currentUserDetail: null,
    spinning: true,
    alreadyAddCompany: false,
    init: false
  };
  const [state, setState] = useState(initialState);
  if (!state.init) {
    request(`/company/invitedToken/${token}`).then(
      r => {
        if (r && r.status === "SUCCESS") {
          request(`/sysUser/current`).then(
            res => {
              if (res && res.status === "SUCCESS") {
                request(`/company/currentSysUser/all`).then(resu => {
                  if (resu && resu.status === "SUCCESS") {
                    setState({
                      ...state,
                      init: true,
                      inviter: r.data.userName,
                      invitedCompany: r.data.companyName,
                      currentUserDetail: res.data,
                      currentUserCompanyDetail: resu.data,
                      spinning: false
                    });
                  } else {
                    setState({
                      ...state,
                      init: true,
                      inviter: r.data.userName,
                      invitedCompany: r.data.companyName,
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
                invitedCompany: r.data.companyName,
                spinning: false
              })
          );
        } else {
          setState({
            ...state,
            init: true,
            inviter: r.data.userName,
            invitedCompany: r.data.companyName,
            spinning: false
          });
        }
      },
      err => catchError(err)
    );
  }
  const {
    inviter,
    invitedCompany,
    currentUserDetail,
    spinning,
    alreadyAddCompany,
    init
  } = state;

  //点击当前按钮加入公司
  const handleCurrentUserAddCompany = () => {
    request(`/sysUser/${currentUserDetail.id}/company`, {
      method: "post",
      data: {
        newCompanyId: companyId
      }
    }).then(
      res => {
        if (res && res.status === "SUCCESS") {
          message.success(`加入成功`);
          history.push("/");
        } else {
          setState({ ...state, alreadyAddCompany: true });
        }
      },
      err => {
        if (err.response && err.response.data && err.response.data.msg)
          setState({ ...state, alreadyAddCompany: true });
      }
    );
  };

  //点击注册账号加入
  const handleRegisterAddCompany = () => {
    history.push({
      pathname: `/login`,
      query: { ...state, active: "initRegister" }
    });
  };

  //点击其他账号加入
  const handleLoginAddCompany = () => {
    history.push({
      pathname: `/login`,
      query: { ...state, active: "initSignin" }
    });
  };

  const BlueFont = props => {
    return <span style={{ color: "rgb(42, 127, 255)" }}>{props.children}</span>;
  };
  const BlackFont = props => {
    return <span style={{ color: "#333333" }}>{props.children}</span>;
  };
  if (!init) return null;
  return (
    <>
      <Loading spinning={spinning}>
        <div className={registerStyles.inviteUser}>
          <div>
            {!alreadyAddCompany ? (
              <>
                <div className={registerStyles.normal}>
                  <div>
                    <span>
                      {inviter}邀请您加入-
                      <BlueFont>{invitedCompany}</BlueFont>
                    </span>
                  </div>
                  <div>
                    {currentUserDetail && (
                      <>
                        <div>
                          <Button onClick={handleCurrentUserAddCompany}>
                            当前账号:
                            <span style={{ color: "#73F7FF" }}>
                              {currentUserDetail.name}
                            </span>
                            加入
                          </Button>
                        </div>
                      </>
                    )}
                    <div>
                      <Button onClick={handleRegisterAddCompany}>
                        注册账号加入
                      </Button>
                    </div>
                    <div>
                      <Button onClick={handleLoginAddCompany}>
                        其他账号加入
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={registerStyles.result}>
                  <div>
                    <span>
                      您的账号-<BlueFont>{currentUserDetail.name}</BlueFont>
                    </span>
                  </div>
                  <div>
                    <span>
                      已经加入公司：<BlackFont>{invitedCompany}</BlackFont>
                    </span>
                  </div>
                  <div>
                    <Button href="/">进入我的主页</Button>
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
