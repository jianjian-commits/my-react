import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spin, Menu, Input, Button } from "antd";
import { loginUser, resetError } from "../store/loginReducer";
import classes from "../styles/login.module.scss";

const Login = ({ ...props }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [nameValue, setNameValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const handleTabChange = e => {
    setActiveTab(e.key);
  };

  const handleInput = (e, input = "login") => {
    if (props.error) {
      props.resetError();
    }

    if (input === "login") {
      setLoginValue(e.target.value);
    } else if (input === "password") {
      setPasswordValue(e.target.value);
    } else if (input === "name") {
      setNameValue(e.target.value);
    }
  };

  const handleLoginButtonClick = () => {
    props.loginUser(loginValue, passwordValue);
  };
  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Menu
            selectedKeys={activeTab}
            onClick={handleTabChange}
            mode="horizontal"
          >
            <Menu.Item label="" key={"login"} classes={{ root: classes.tab }}>
              登录
            </Menu.Item>
            <Menu.Item label="" key={"signIn"} classes={{ root: classes.tab }}>
              创建用户
            </Menu.Item>
          </Menu>
          {activeTab === "login" && (
            <>
              <Input
                id="email"
                value={loginValue}
                onChange={e => handleInput(e, "login")}
                placeholder="电子邮箱"
                type="email"
              />
              <Input
                value={passwordValue}
                onChange={e => handleInput(e, "password")}
                placeholder="密码"
                type="password"
              />
              <div className={classes.formButtons}>
                {props.isLoading ? (
                  <Spin />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={handleLoginButtonClick}
                  >
                    登录
                  </Button>
                )}
              </div>
            </>
          )}
          {activeTab === "signIn" && (
            <>
              <Input
                id="name"
                value={nameValue}
                onChange={e => handleInput(e, "name")}
                placeholder="姓名"
                type="email"
              />
              <Input
                id="email"
                value={loginValue}
                onChange={e => handleInput(e, "login")}
                placeholder="电子邮箱"
                type="email"
              />
              <Input
                id="password"
                value={passwordValue}
                onChange={e => handleInput(e, "password")}
                placeholder="密码"
                type="password"
              />
              <div className={classes.formButtons}>
                {props.isLoading ? (
                  <Spin />
                ) : (
                  <Button
                    onClick={handleLoginButtonClick}
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                  >
                    创建
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ login }) => ({
    isLoading: login.isLoading,
    isAuthenticated: login.isAuthenticated,
    error: login.error
  }),
  { loginUser, resetError }
)(withRouter(Login));
