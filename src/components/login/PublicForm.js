import React, { useRef } from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import { formItems } from "./formItemConfig";

export default connect(({ login }) => ({
  timeout: login.timeout
}))(
  Form.create({ name: "login-form" })(function PublicForm({
    form,
    parameter,
    func,
    params = {},
    marginBottom,
    setActiveKey,
    history,
    loginType,
    reSetPassword,
    sendCode,
    isFetchCoding,
    fetchText,
    allowSendCode,
    resetAllowSendCodeState,
    dispatch,
    activeKey,
    timeout
  }) {
    const {
      getFieldDecorator,
      validateFields,
      getFieldError,
      getFieldsValue
    } = form;
    const handleSubmit = e => {
      e.preventDefault();
      validateFields(
        (
          err,
          {
            loginPasswordSubmit,
            loginPhoneSubmit,
            resetPasswordSubmit,
            ...rest
          }
        ) => {
          const newRest = loginPhoneSubmit
            ? { username: rest.mobilePhone, code: rest.code }
            : resetPasswordSubmit
            ? {
                mobilePhone: rest.mobilePhone,
                newPassWord: rest.password,
                code: rest.code
              }
            : rest;
          if (!err && resetPasswordSubmit)
            return reSetPassword({ ...newRest, form });
          if (!err) {
            func({
              token: params.token ? params.token : null,
              rest: newRest,
              history,
              loginType,
              form
            });
          }
        }
      );
    };
    const formContent = useRef();
    return (
      <Form
        onSubmit={e => {
          e.preventDefault();
          JSON.stringify(formContent.current) !==
            JSON.stringify(getFieldsValue()) && handleSubmit(e);
          formContent.current = getFieldsValue();
        }}
      >
        {parameter.map(p => {
          const formItem =
            p.key === "submit" && params.token
              ? formItems[p.key]({
                  ...p,
                  form,
                  payload: "joinCompany",
                  itemName: p.itemName,
                  icon: p.icon,
                  setActiveKey,
                  unprefix: p.unprefix,
                  hasFeedback: p.hasFeedback,
                  sendCode: sendCode,
                  resetAllowSendCodeState,
                  isFetchCoding,
                  fetchText,
                  allowSendCode,
                  dispatch,
                  activeKey,
                  timeout,
                  ...params
                })
              : formItems[p.key]({
                  ...p,
                  form,
                  payload: p.value,
                  itemName: p.itemName,
                  icon: p.icon,
                  unprefix: p.unprefix,
                  hasFeedback: p.hasFeedback,
                  setActiveKey,
                  sendCode,
                  resetAllowSendCodeState,
                  isFetchCoding,
                  fetchText,
                  allowSendCode,
                  dispatch,
                  activeKey,
                  timeout
                });
          const helpText = getFieldError(formItem.itemName);
          return (
            <Form.Item
              key={formItem.itemName}
              style={{ marginBottom: marginBottom }}
              label={p.label ? p.label : null}
              colon={p.colon}
              hasFeedback={
                (p.help === "register" || p.help === "forgetPassword") &&
                helpText &&
                helpText.length > 0
                  ? true
                  : false
              }
              help={
                (p.help === "register" || p.help === "forgetPassword") &&
                helpText ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "340px",
                      width: "224px",
                      height: "42px",
                      lineHeight: "45px"
                    }}
                  >
                    {helpText}
                  </div>
                ) : (
                  <span
                    style={{
                      display: "block",
                      height: helpText ? "20px" : 0,
                      lineHeight: "20px"
                    }}
                  >
                    {helpText}
                  </span>
                )
              }
            >
              {getFieldDecorator(formItem.itemName, {
                ...formItem.options
                // validateFirst: true
              })(formItem.component)}
              {formItem.additionComponent}
            </Form.Item>
          );
        })}
      </Form>
    );
  })
);
