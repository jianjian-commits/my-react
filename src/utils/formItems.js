import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon } from "antd";
import request from "./request";
import itemsStyles from "../styles/login.module.scss";

// 发送验证码
async function sendVerificationCode() {
  try {
    const result = await request("http://www.baidu.com");
    if (result && result.status) return true;
  } catch (res) {
    return false;
  }
}

//  rules校验规则
const required = msg => ({ required: true, message: msg });
// const maxLength = ({ length, msg }) => ({ max: length, message: msg });

// formItems表单项
const username = {
  itemName: "username",
  options: {
    rules: [required("该用户不存在")]
  },
  component: (
    <Input
      prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="用户名"
    />
  ),
  additionComponent: null
};

const password = item => ({
  itemName: "password",
  options: {
    rules: [required("用户名密码信息不匹配，请重试")]
  },
  component: (
    <Input
      prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
      type="password"
      placeholder={item === "login" ? "密码" : "密码至少8位,必须包含数字和字母"}
      minLength={8}
    />
  ),
  additionComponent: (
    <>
      {item === "login" ? (
        <div style={{ position: "absolute", right: 0, top: "16px" }}>
          <Link to="/forgetPassword">忘记密码?</Link>
        </div>
      ) : null}
    </>
  )
});

const phone = item => {
  const verificationCodeSpanRef = React.createRef();
  const verificationCodeButtonRef = React.createRef();
  const buttonConfirm = () => {
    const setTime = ({ sended, initNum, timeTerval = 1000, timeOut }) => {
      verificationCodeButtonRef.current.buttonNode.disabled = true;
      verificationCodeSpanRef.current.innerHTML = sended
        ? `验证码已发送,如未收到请在${initNum}s后重试`
        : `验证码发送失败,请在${initNum}s后重试`;
      let num = initNum - 1;
      const int = setInterval(() => {
        verificationCodeSpanRef.current.innerHTML = sended
          ? `验证码已发送,如未收到请在${num}s后重试`
          : `验证码发送失败,请在${num}s后重试`;
        num = num - 1;
      }, timeTerval);
      setTimeout(() => {
        window.clearInterval(int);
        verificationCodeButtonRef.current.buttonNode.disabled = false;
        verificationCodeSpanRef.current.innerHTML = "";
        num = initNum - 1;
      }, timeOut);
    };
    sendVerificationCode().then(res => {
      if (res) {
        setTime({
          sended: true,
          initNum: 60,
          timeOut: 60000
        });
      } else {
        setTime({ sended: false, initNum: 6, timeOut: 6000 });
      }
    });
  };
  return [
    {
      itemName: "phone",
      options: {
        rules: [
          required("请输入手机号"),
          { length: 11, message: "请输入正确手机号位数" }
        ]
      },
      component: (
        <Input
          prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="手机号"
          addonBefore="+86"
          maxLength={11}
        />
      ),
      additionComponent: null
    },
    {
      itemName: "verificationCode",
      options: {
        rules: [required("请输入验证码")]
      },
      component: (
        <Input
          prefix={
            <Icon
              type="safety-certificate"
              style={{ color: "rgba(0,0,0,.25)" }}
            />
          }
          placeholder="验证码"
          addonAfter={
            <Button
              ref={verificationCodeButtonRef}
              disabled={null}
              onClick={buttonConfirm}
            >
              发送验证码
            </Button>
          }
          className={itemsStyles.loginPhoneCard}
        />
      ),
      additionComponent: (
        <span
          ref={verificationCodeSpanRef}
          style={{ position: "absolute", right: 0, top: "18px" }}
        ></span>
      )
    }
  ];
};

const company = {
  itemName: "company",
  options: {
    rules: [required("请输入公司名")]
  },
  component: (
    <Input
      prefix={<Icon type="company" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="公司名"
      maxLength={20}
    />
  ),
  additionComponent: null
};

const email = {
  itemName: "email",
  options: {
    rules: [required("请输入电子邮箱")]
  },
  component: (
    <Input
      prefix={<Icon type="email" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="email"
      type="email"
    />
  ),
  additionComponent: null
};

const submit = item => ({
  itemName: "actionType",
  options: {
    initialValue: item,
    rules: [required("")]
  },
  component: (
    <Button type="primary" htmlType="submit" className={itemsStyles.button}>
      {item === "login" && "登录"}
      {item === "register" && "注册"}
      {item === "resetPassword" && "重置密码"}
    </Button>
  ),
  additionComponent: (
    <>
      {item === "login" && (
        <div style={{ textAlign: "center" }}>
          没有账号?<Link to="/register">注册一个</Link>
        </div>
      )}
      {item === "register" && (
        <div style={{ textAlign: "center" }}>
          已有账号?直接<Link to="/login">登录</Link>
        </div>
      )}
      {item === "resetPassword" && (
        <div style={{ textAlign: "center" }}>
          返回<Link to="/login">登录</Link>
        </div>
      )}
    </>
  )
});

export const loginPasswordFormItems = [
  username,
  password("login"),
  submit("login")
];
export const loginPhoneFormItems = [...phone("login"), submit("login")];
export const loginForgetPassword = [
  ...phone(),
  password(),
  submit("resetPassword")
];
export const registerFormItems = [
  username,
  ...phone("register"),
  password("register"),
  company,
  email,
  submit("register")
];
