import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Icon, message } from "antd";
import request from "./request";
import itemsStyles from "../styles/login.module.scss";

// 发送验证码
async function sendVerificationCode(mobilePhone) {
  if (!mobilePhone) return false;
  try {
    const result = await request("http://www.baidu.com");
    if (result && result.status) return true;
  } catch (res) {
    return false;
  }
}

//  rules校验规则
const required = msg => ({ required: true, message: msg });
const whitespace = () => ({ whitespace: true, message: "不允许出现空格" });
const maxLength = (length, msg) => ({ max: length, message: msg });
// const minLength = (length, msg) => ({ min: length, message: msg });
const number = () => ({ pattern: "^[0-9]*$", message: "只能输入小写数字" });
const requireCharAndNum = () => ({
  pattern: "^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$",
  message: "密码为数字和字母组合,且为8-20位字符"
});
const requireChinese = () => ({
  pattern: "^[\u4e00-\u9fa5a-zA-Z0-9]*$",
  message: "只允许输入汉字字母和数字"
});
const email = () => ({
  pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
  message: "请输入正确邮箱格式"
});
// 自定义校验
const checkphone = actionType => {
  const bol = actionType === "login";
  const context = bol ? "该手机号未注册" : "该手机号已被注册";
  const phone = async (rule, value, callback) => {
    if (!value) return callback();
    try {
      const result = await request(`/sysUser/mobilePhone/${value}/check`);
      if (result && result.data === bol) return callback(context);
    } catch (err) {
      message.error("校验失败");
    }
    callback();
  };
  return phone;
};
const checkEmail = async (rule, value, callback) => {
  if (!value) return callback();
  try {
    const result = await request(`/sysUser/email/${value}/check`);
    if (result && result.data === false) return callback("该电子邮箱已被注册");
  } catch (err) {
    message.error("校验失败");
  }
  callback();
};
// const checkCompanyNamePresence = async (rule, value, callback) => {
//   if (!value) return callback();
//   try {
//     const result = await request(`/company/name/${value}/check`);
//     if (result && result.data === true) return callback("该公司未被创建");
//   } catch (err) {
//     message.error("校验失败");
//   }
//   callback();
// };

// {
//   pattern: "(?!.*_$)(?!.*__.*)^[a-zA-Z][a-zA-Z0-9_]*$",
//   message:
//     "名称必须以字母开首，仅使用字母数字字符和下划线。它不能包括空格，以下划线结尾或有两条连续的下划线。"
// }

// formItems表单项
const username = ({ form, payload }) => {
  return {
    itemName: "username",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("用户名不可为空"),
        whitespace()
        // maxLength(20, "用户名过长，最多20个字符")
      ]
    },
    component: (
      <Input
        prefix={<Icon type="solution" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder="请输入注册时绑定的邮箱/手机号"
        onChange={() => form.setFields({ username: { errors: null } })}
      />
    ),
    additionComponent: null
  };
};

const name = ({ form, payload }) => {
  return {
    itemName: "name",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("姓名不可为空"),
        whitespace(),
        maxLength(20, "姓名过长，最多20个字符")
      ]
    },
    component: (
      <Input
        prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder="用户昵称"
        onChange={() => form.setFields({ name: { errors: null } })}
      />
    ),
    additionComponent: null
  };
};

const password = ({ form, payload }) => ({
  itemName: "password",
  options: {
    validateTrigger: "onBlur",
    rules: [required("密码不可为空"), whitespace(), requireCharAndNum()]
  },
  component: (
    <Input
      prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
      type="password"
      onChange={() => form.setFields({ password: { errors: null } })}
      placeholder={
        payload === "reconfirm"
          ? ""
          : payload === "login" || payload === "old"
          ? "密码"
          : "密码为数字和字母组合,且为8-20位字符"
      }
    />
  ),
  additionComponent: (
    <>
      {payload === "login" ? (
        <div style={{ position: "absolute", right: 0, top: "16px" }}>
          <Link to="/forgetPassword">忘记密码?</Link>
        </div>
      ) : null}
    </>
  )
});
const oldPassWord = ({ form, payload }) => ({
  itemName: "oldPassWord",
  options: {
    validateTrigger: "onBlur",
    rules: [required("密码不可为空"), whitespace(), requireCharAndNum()]
  },
  component: (
    <Input
      prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
      type="password"
      onChange={() => form.setFields({ oldPassWord: { errors: null } })}
      placeholder={"当前密码"}
    />
  ),
  additionComponent: null
});
const newPassWord = ({ form, payload }) => ({
  itemName: "newPassWord",
  options: {
    validateTrigger: "onBlur",
    rules: [required("密码不可为空"), whitespace(), requireCharAndNum()]
  },
  component: (
    <Input
      prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
      type="password"
      onChange={() => form.setFields({ newPassWord: { errors: null } })}
      placeholder={"新密码"}
    />
  ),
  additionComponent: null
});
const confirmPassWord = ({ form, payload, newPassWord }) => {
  return {
    itemName: "confirmPassWord",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("密码不可为空"),
        whitespace(),
        requireCharAndNum(),
        {
          validator: (rule, value, callback) => {
            if (!value) return callback();
            if (value !== newPassWord) return callback("两次密码输入不一致");
            callback();
          }
        }
      ]
    },
    component: (
      <Input
        prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
        type="password"
        onChange={() => form.setFields({ confirmPassWord: { errors: null } })}
        placeholder={"确认密码"}
      />
    ),
    additionComponent: null
  };
};

const verificationCode = ({ form, payload }) => {
  return {
    itemName: "verificationCode",
    options: {
      validateTrigger: "onBlur",
      rules: [required("请输入验证码"), whitespace()]
    },
    component: (
      <Input
        onChange={() => form.setFields({ verificationCode: { errors: null } })}
        prefix={
          <Icon
            type="safety-certificate"
            style={{ color: "rgba(0,0,0,.25)" }}
          />
        }
        placeholder="验证码"
      />
    ),
    additionComponent: null
  };
};

const mobilePhone = ({ form, payload }) => {
  const { getFieldValue } = form;
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
    sendVerificationCode(getFieldValue("mobilePhone")).then(res => {
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
  return {
    itemName: "mobilePhone",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("请输入手机号"),
        whitespace(),
        number(),
        { validator: checkphone(payload) },
        { len: 11, message: "请输入正确手机号" }
      ]
    },
    component: (
      <Input
        className={itemsStyles.loginPhoneCard}
        prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder="手机号"
        addonBefore="+86"
        onChange={() => form.setFields({ mobilePhone: { errors: null } })}
        addonAfter={
          <Button
            ref={verificationCodeButtonRef}
            disabled={null}
            onClick={buttonConfirm}
          >
            发送验证码
          </Button>
        }
      />
    ),
    additionComponent: (
      <span
        ref={verificationCodeSpanRef}
        style={{ position: "absolute", right: 0, top: "18px" }}
      ></span>
    )
  };
};

const companyName = ({ form, payload }) => {
  return {
    itemName: "companyName",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("请输入公司名称"),
        whitespace(),
        requireChinese(),
        maxLength(30, "z公司名称过长，最多30个字符")
        // payload === "redit" && { validator: checkCompanyNamePresence }
      ]
    },
    component: (
      <Input
        prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />}
        onChange={() => form.setFields({ companyName: { errors: null } })}
        placeholder="公司名"
      />
    ),
    additionComponent: null
  };
};

const userEmail = ({ form, payload }) => {
  return {
    itemName: "userEmail",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("请输入电子邮箱"),
        whitespace(),
        email(),
        { validator: checkEmail }
      ]
    },
    component: (
      <Input
        prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder="电子邮箱"
        onChange={() => form.setFields({ userEmail: { errors: null } })}
      />
    ),
    additionComponent: null
  };
};

const submit = ({ form, payload, teamId, token }) => ({
  itemName: "actionType",
  options: {
    initialValue: payload
  },
  component: (
    <Button type="primary" htmlType="submit" className={itemsStyles.button}>
      {payload === "login" && "登录"}
      {payload === "register" && "注册"}
      {payload === "resetPassword" && "重置密码"}
      {payload === "submit" && "提交"}
      {payload === "addTeam" && "加入团队"}
    </Button>
  ),
  additionComponent: (
    <>
      {payload === "login" && (
        <div style={{ textAlign: "center" }}>
          没有账号?<Link to="/register">注册一个</Link>
        </div>
      )}
      {payload === "register" && (
        <div style={{ textAlign: "center" }}>
          已有账号?直接<Link to="/login">登录</Link>
        </div>
      )}
      {payload === "resetPassword" && (
        <div style={{ textAlign: "center" }}>
          返回<Link to="/login">登录</Link>
        </div>
      )}
      {payload === "addTeam" && (
        <div style={{ textAlign: "center" }}>
          <Link to={`/invite/${teamId}/${token}`}>返回</Link>
        </div>
      )}
    </>
  )
});

// 表单组件参数
export const loginPasswordParameter = [
  { key: "username", value: null, itemName: "username" },
  { key: "password", value: "login", itemName: "password" },
  { key: "submit", value: "login", itemName: "submit" }
];
export const loginPhoneParameter = [
  { key: "mobilePhone", value: "login" },
  { key: "verificationCode", value: null },
  { key: "submit", value: "login" }
];
export const loginForgetPasswordParameter = [
  { key: "mobilePhone", value: "forgrtPassword" },
  { key: "password", value: null },
  { key: "submit", value: "resetPassword" }
];
export const registerParameter = [
  { key: "name", value: null },
  { key: "userEmail", value: null },
  { key: "mobilePhone", value: "register" },
  { key: "verificationCode", value: null },
  { key: "password", value: "register" },
  { key: "companyName", value: null },
  { key: "submit", value: "register" }
];
export const userDetailParameter = {
  resetCompanyName: [
    { key: "companyName", value: "redit" },
    { key: "submit", value: "submit" }
  ],
  resetName: [
    { key: "name", value: null },
    { key: "submit", value: "submit" }
  ],
  resetMobilePhone: [
    { key: "mobilePhone", value: null },
    { key: "verificationCode", value: null },
    { key: "submit", value: "submit" }
  ],
  resetPassword: [
    { key: "oldPassWord", value: null },
    { key: "newPassWord", value: null },
    { key: "confirmPassWord", value: null },
    { key: "submit", value: "submit" }
  ]
};

//
export const formItems = {
  username,
  name,
  password,
  verificationCode,
  mobilePhone,
  companyName,
  userEmail,
  submit,
  oldPassWord,
  newPassWord,
  confirmPassWord
};
