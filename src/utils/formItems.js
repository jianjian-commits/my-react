import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon } from "antd";
// import request from "./request";
import itemsStyles from "../styles/login.module.scss";

// 发送验证码
// async function sendVerificationCode() {
//   try {
//     const result = await request("http://www.baidu.com");
//     if (result && result.status) return true;
//   } catch (res) {
//     return false;
//   }
// }

//  rules校验规则
const required = msg => ({ required: true, message: msg });
const whitespace = () => ({ whitespace: true, message: "不允许出现空格" });
const maxLength = (length, msg) => ({ max: length, message: msg });
const minLength = (length, msg) => ({ min: length, message: msg });
const number = () => ({ pattern: "^[0-9]*$", message: "只能输入小写数字" });
const requireCharAndNum = () => ({
  pattern: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$",
  message: "密码为数字和字母组合,且为8-20位字符"
});
const requireChinese = () => ({
  pattern: "^[\u4e00-\u9fa5]*$",
  message: "只允许输入汉字"
});
const Email = () => ({
  pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
  message: "请输入正确邮箱格式"
});

// {
//   pattern: "(?!.*_$)(?!.*__.*)^[a-zA-Z][a-zA-Z0-9_]*$",
//   message:
//     "名称必须以字母开首，仅使用字母数字字符和下划线。它不能包括空格，以下划线结尾或有两条连续的下划线。"
// }

// formItems表单项
export const username = {
  itemName: "username",
  options: {
    rules: [
      required("用户名不可为空"),
      whitespace(),
      maxLength(20, "用户名过长，最多20个字符"),
      minLength(5, "用户名过短,最少5个字符")
    ]
  },
  component: (
    <Input
      prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="用户名"
    />
  ),
  additionComponent: null
};

export const nickname = {
  itemName: "nickname",
  options: {
    rules: [
      required("姓名不可为空"),
      whitespace(),
      maxLength(20, "姓名过长，最多20个字符")
    ]
  },
  component: (
    <Input
      prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="姓名"
    />
  ),
  additionComponent: null
};

export const password = item => ({
  itemName: "password",
  options: {
    rules: [required("密码不可为空"), whitespace(), requireCharAndNum()]
  },
  component: (
    <Input
      prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
      type="password"
      placeholder={
        item === "login" ? "密码" : "密码为数字和字母组合,且为8-20位字符"
      }
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

export const phone = {
  // const verificationCodeSpanRef = React.createRef();
  // const verificationCodeButtonRef = React.createRef();
  // const buttonConfirm = () => {
  //   const setTime = ({ sended, initNum, timeTerval = 1000, timeOut }) => {
  //     verificationCodeButtonRef.current.buttonNode.disabled = true;
  //     verificationCodeSpanRef.current.innerHTML = sended
  //       ? `验证码已发送,如未收到请在${initNum}s后重试`
  //       : `验证码发送失败,请在${initNum}s后重试`;
  //     let num = initNum - 1;
  //     const int = setInterval(() => {
  //       verificationCodeSpanRef.current.innerHTML = sended
  //         ? `验证码已发送,如未收到请在${num}s后重试`
  //         : `验证码发送失败,请在${num}s后重试`;
  //       num = num - 1;
  //     }, timeTerval);
  //     setTimeout(() => {
  //       window.clearInterval(int);
  //       verificationCodeButtonRef.current.buttonNode.disabled = false;
  //       verificationCodeSpanRef.current.innerHTML = "";
  //       num = initNum - 1;
  //     }, timeOut);
  //   };
  //   sendVerificationCode().then(res => {
  //     if (res) {
  //       setTime({
  //         sended: true,
  //         initNum: 60,
  //         timeOut: 60000
  //       });
  //     } else {
  //       setTime({ sended: false, initNum: 6, timeOut: 6000 });
  //     }
  //   });
  // };

  itemName: "phone",
  options: {
    rules: [
      required("请输入手机号"),
      whitespace(),
      number(),
      { len: 11, message: "请输入正确手机号" }
    ]
  },
  component: (
    <Input
      prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="手机号"
      addonBefore="+86"
    />
  ),
  additionComponent: null

  // {
  //   itemName: "verificationCode",
  //   options: {
  //     rules: [required("请输入验证码"), whitespace(),requireCharAndNum()]
  //   },
  //   component: (
  //     <Input
  //       prefix={
  //         <Icon
  //           type="safety-certificate"
  //           style={{ color: "rgba(0,0,0,.25)" }}
  //         />
  //       }
  //       placeholder="验证码"
  //       addonAfter={
  //         <Button
  //           ref={verificationCodeButtonRef}
  //           disabled={null}
  //           onClick={buttonConfirm}
  //         >
  //           发送验证码
  //         </Button>
  //       }
  //       className={itemsStyles.loginPhoneCard}
  //     />
  //   ),
  //   additionComponent: (
  //     <span
  //       ref={verificationCodeSpanRef}
  //       style={{ position: "absolute", right: 0, top: "18px" }}
  //     ></span>
  //   )
  // }
};

export const company = {
  itemName: "company",
  options: {
    rules: [
      required("请输入公司名称"),
      whitespace(),
      requireChinese(),
      maxLength(30, "z公司名称过长，最多30个字符")
    ]
  },
  component: (
    <Input
      prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="公司名"
    />
  ),
  additionComponent: null
};

export const email = {
  itemName: "email",
  options: {
    rules: [required("请输入电子邮箱"), whitespace(), Email()]
  },
  component: (
    <Input
      prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
      placeholder="电子邮箱"
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
export const loginPhoneFormItems = [phone, submit("login")];
export const loginForgetPassword = [phone, password(), submit("resetPassword")];
export const registerFormItems = [
  username,
  nickname,
  phone,
  password("register"),
  company,
  email,
  submit("register")
];
