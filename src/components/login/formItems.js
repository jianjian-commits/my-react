import React from "react";
import { Link } from "react-router-dom";
import { Input as Inp, Button, Icon, message } from "antd";
import request from "../../utils/request";
import clx from "classnames";
import itemsStyles from "./style/login.module.scss";
import usernameImg from "./style/username.svg";
import passwordImg from "./style/password.svg";

const meteImg = {
  username: usernameImg,
  password: passwordImg
};

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { src, classes, icon, placeholder, ...rest } = this.props;
    return (
      <Inp
        {...rest}
        className={clx(itemsStyles.input, classes)}
        prefix={
          icon ? null : (
            <img
              style={{ marginLeft: "10px" }}
              src={meteImg[this.props.type]}
              alt=""
            />
          )
        }
        placeholder={icon ? null : placeholder}
      />
    );
  }
}

// 发送验证码
async function sendVerificationCode(mobilePhone) {
  if (!mobilePhone) return false;
  try {
    const res = await request(`/yanzhengma${mobilePhone}`);
    if (res && res.status === "SUCCESS") {
      return true;
    } else {
      message.error(res.msg || "验证码获取失败");
    }
  } catch (err) {
    message.error(
      (err.response && err.response.data && err.response.data.msg) || "系统错误"
    );
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
      const res = await request(`/sysUser/mobilePhone/${value}/check`);
      if (res && res.data === bol) return callback(context);
    } catch (err) {
      message.error(
        (err.response && err.response.data && err.response.data.msg) ||
          "系统错误"
      );
    }
    callback();
  };
  return phone;
};
const checkEmail = async (rule, value, callback) => {
  if (!value) return callback();
  try {
    const res = await request(`/sysUser/email/${value}/check`);
    if (res && res.data === false) return callback("该电子邮箱已被注册");
  } catch (err) {
    message.error(
      (err.response && err.response.data && err.response.data.msg) || "系统错误"
    );
  }
  callback();
};
// const checkCompanyNamePresence = async (rule, value, callback) => {
//   if (!value) return callback();
//   try {
//     const result = await request(`/company/name/${value}/check`);
//     if (result && result.data === true) return callback("该公司未被创建");
//   } catch (err) {
//     message.error((err.response && err.response.data && err.response.data.msg) || "系统错误");
//   }
//   callback();
// };

// {
//   pattern: "(?!.*_$)(?!.*__.*)^[a-zA-Z][a-zA-Z0-9_]*$",
//   message:
//     "名称必须以字母开首，仅使用字母数字字符和下划线。它不能包括空格，以下划线结尾或有两条连续的下划线。"
// }

// formItems表单项
const username = ({ form, payload, icon }) => {
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
        type={"username"}
        placeholder={"请输入注册时绑定的邮箱/手机号"}
        onChange={() => form.setFields({ username: { errors: null } })}
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const name = ({ form, payload, icon }) => {
  return {
    itemName: "name",
    options: {
      validateTrigger: "onBlur",
      rules: [
        required("昵称不可为空"),
        whitespace(),
        maxLength(20, "昵称过长，最多20个字符")
      ]
    },
    component: (
      <Input
        prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder={"请输入用户昵称"}
        onChange={() => form.setFields({ name: { errors: null } })}
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const password = ({ form, payload, itemName, icon }) => ({
  itemName: itemName,
  options: {
    validateTrigger: "onBlur",
    rules: [required("密码不可为空"), whitespace(), requireCharAndNum()]
  },
  component: (
    <Input
      type={"password"}
      onChange={() => form.setFields({ password: { errors: null } })}
      placeholder={
        payload === "reconfirm"
          ? ""
          : payload === "login" || payload === "old"
          ? "请输入密码"
          : "密码为数字和字母组合,且为8-20位字符"
      }
      icon={icon}
    />
  ),
  additionComponent: null
});
const oldPassWord = ({ form, payload, icon }) => ({
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
      icon={icon}
    />
  ),
  additionComponent: null
});
const newPassWord = ({ form, payload, icon }) => ({
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
      icon={icon}
    />
  ),
  additionComponent: null
});
const confirmPassWord = ({ form, payload, newPassWord, icon }) => {
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
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const verificationCode = ({ form, payload, icon }) => {
  const { getFieldValue } = form;
  const verificationCodeSpanRef = React.createRef();
  const verificationCodeButtonRef = React.createRef();
  const phone = getFieldValue("mobilePhone");
  const buttonConfirm = () => {
    const setTime = ({ sended, initNum, timeTerval = 1000, timeOut }) => {
      if (verificationCodeButtonRef.current)
        verificationCodeButtonRef.current.buttonNode.disabled = true;
      if (verificationCodeSpanRef.current)
        verificationCodeSpanRef.current.innerHTML = sended
          ? `验证码已发送,如未收到请在${initNum}s后重试`
          : `验证码发送失败,请在${initNum}s后重试`;
      let num = initNum - 1;
      const int = setInterval(() => {
        if (verificationCodeSpanRef.current)
          verificationCodeSpanRef.current.innerHTML = sended
            ? `验证码已发送,如未收到请在${num}s后重试`
            : `验证码发送失败,请在${num}s后重试`;
        num = num - 1;
      }, timeTerval);
      setTimeout(() => {
        window.clearInterval(int);
        if (verificationCodeButtonRef.current)
          verificationCodeButtonRef.current.buttonNode.disabled = false;
        if (verificationCodeSpanRef.current)
          verificationCodeSpanRef.current.innerHTML = "";
        num = initNum - 1;
      }, timeOut);
    };
    sendVerificationCode(phone).then(res => {
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
    itemName: "verificationCode",
    options: {
      validateTrigger: "onBlur",
      rules: [required("请输入验证码"), whitespace()]
    },
    component: (
      <Input
        classes={itemsStyles.loginPhoneCard}
        onChange={() => form.setFields({ verificationCode: { errors: null } })}
        prefix={
          <Icon
            type="safety-certificate"
            style={{ color: "rgba(0,0,0,.25)" }}
          />
        }
        placeholder={"请输入验证码"}
        icon={icon}
        addonAfter={
          <Button
            ref={verificationCodeButtonRef}
            disabled={null}
            onClick={phone ? buttonConfirm : null}
            style={{
              height: "42px",
              background: "#2A7FFF",
              color: "#ffffff",
              opacity: phone ? 1 : 0.5
            }}
          >
            发送验证码
          </Button>
        }
      />
    ),
    additionComponent: (
      <span
        ref={verificationCodeSpanRef}
        style={{ position: "absolute", right: 0, top: "30px" }}
      ></span>
    )
  };
};

const mobilePhone = ({ form, payload, icon }) => {
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
        placeholder={"请输入绑定的手机号"}
        addonBefore={<span>+86</span>}
        prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,0.25)" }} />}
        onChange={() => form.setFields({ mobilePhone: { errors: null } })}
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const companyName = ({ form, payload, icon }) => {
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
        placeholder={"请输入公司名"}
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const userEmail = ({ form, payload, icon }) => {
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
        placeholder={"请输入绑定的电子邮箱"}
        onChange={() => form.setFields({ userEmail: { errors: null } })}
        icon={icon}
      />
    ),
    additionComponent: null
  };
};

const submit = ({
  form,
  payload,
  teamId,
  userId,
  token,
  itemName,
  setActiveKey
}) => {
  const { getFieldsValue, isFieldsTouched } = form;
  const touched = isFieldsTouched();
  const values = Object.values(getFieldsValue());
  const filled = values.filter(f => f);
  const allowClickButton =
    values.length === filled.length && touched ? true : false;
  return {
    itemName: itemName,
    options: {
      initialValue: payload
    },
    component: (
      <Button
        type="primary"
        htmlType="submit"
        className={itemsStyles.button}
        style={{ opacity: allowClickButton ? 1 : 0.5 }}
      >
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
          <div
            className={itemsStyles.buttonSuffix}
            style={{ width: "100%", marginLeft: "0px" }}
          >
            <Link to="/forgetPassword">忘记密码</Link>&nbsp;&nbsp;|&nbsp;&nbsp;
            <span onClick={() => setActiveKey("register")}>注册</span>
          </div>
        )}
        {payload === "register" && (
          <div className={itemsStyles.buttonSuffix}>
            已有账号?直接
            <span
              style={{ color: "#096dd9", cursor: "pointer" }}
              onClick={() => setActiveKey("signin")}
            >
              登录
            </span>
          </div>
        )}
        {payload === "resetPassword" && (
          <div className={itemsStyles.buttonSuffix}>
            <Link to="/login">返回登录</Link>
          </div>
        )}
        {payload === "addTeam" && (
          <div className={itemsStyles.buttonSuffix}>
            <Link to={`/invite/${userId}/${teamId}/${token}`}>返回</Link>
            <span></span>
          </div>
        )}
      </>
    )
  };
};
const userDetailModalSubmit = ({
  form,
  payload,
  modalMeter,
  setModalMeter
}) => {
  const { getFieldsValue, isFieldsTouched } = form;
  const touched = isFieldsTouched();
  const values = Object.values(getFieldsValue());
  const filled = values.filter(f => f);
  const allowClickButton =
    values.length === filled.length && touched ? true : false;
  return {
    itemName: "userDetailModalSubmit",
    options: {
      initialValue: "userDetailModalSubmit"
    },
    component: (
      <div className={itemsStyles.userDetailModalButton}>
        <Button
          type="primary"
          onClick={() => setModalMeter({ ...modalMeter, meter: false })}
          style={{ opacity: allowClickButton ? 1 : 0.5 }}
        >
          取消
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          style={{ opacity: allowClickButton ? 1 : 0.5 }}
        >
          完成
        </Button>
      </div>
    ),
    additionComponent: null
  };
};

// 表单组件参数
export const loginPasswordParameter = [
  { key: "username", value: null, itemName: "username" },
  { key: "password", value: "login", itemName: "password" },
  { key: "submit", value: "login", itemName: "loginPasswordSubmit" }
];
export const loginPhoneParameter = [
  { key: "mobilePhone", value: "login" },
  { key: "verificationCode", value: null },
  { key: "submit", value: "login", itemName: "loginPhoneSubmit" }
];
export const loginForgetPasswordParameter = [
  {
    help: "forgetPassword",
    key: "username",
    value: null,
    itemName: "username",
    label: "用户名",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  // { key: "mobilePhone", value: "forgrtPassword" },
  {
    help: "forgetPassword",
    key: "verificationCode",
    value: null,
    label: "验证码",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  {
    help: "forgetPassword",
    key: "password",
    value: null,
    label: "密码",
    hasFeedback: true,
    colon: false,
    itemName: "password",
    icon: true
  },
  { key: "submit", value: "resetPassword", itemName: "resetPasswordSubmit" }
];
export const registerParameter = [
  {
    help: "register",
    key: "name",
    value: null,
    label: "用户昵称",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  {
    help: "register",
    key: "userEmail",
    value: null,
    label: "邮箱",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  {
    help: "register",
    key: "mobilePhone",
    value: "register",
    label: "手机号",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  {
    help: "register",
    key: "verificationCode",
    value: null,
    label: "验证码",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  {
    help: "register",
    key: "password",
    value: "register",
    label: "密码",
    hasFeedback: true,
    colon: false,
    itemName: "registerPassword",
    icon: true
  },
  {
    help: "register",
    key: "companyName",
    value: null,
    label: "公司名",
    hasFeedback: true,
    colon: false,
    icon: true
  },
  { key: "submit", value: "register", itemName: "registerSubmit" }
];
export const userDetailParameter = {
  resetCompanyName: [
    { key: "companyName", value: "redit", icon: true },
    { key: "userDetailModalSubmit", value: "submit", itemName: "resetSubmit" }
  ],
  resetName: [
    { key: "name", value: null, icon: true },
    { key: "userDetailModalSubmit", value: "submit", itemName: "resetSubmit" }
  ],
  resetMobilePhone: [
    { key: "mobilePhone", value: null, icon: true },
    { key: "verificationCode", value: null, icon: true },
    { key: "userDetailModalSubmit", value: "submit", itemName: "resetSubmit" }
  ],
  resetPassword: [
    {
      key: "oldPassWord",
      value: null,
      label: "当前密码",
      icon: true,
      corn: false
    },
    { key: "newPassWord", value: null, label: "新密码", icon: true },
    { key: "confirmPassWord", value: null, label: "确认密码", icon: true },
    { key: "userDetailModalSubmit", value: "submit", itemName: "resetSubmit" }
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
  confirmPassWord,
  userDetailModalSubmit
};
