import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import { formItems } from "./formItemConfig";

export default connect()(
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
    activeKey
  }) {
    const { getFieldDecorator, validateFields, getFieldError } = form;
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
          if (!err && resetPasswordSubmit) return reSetPassword(newRest);
          if (!err) {
            func({
              token: params.token ? params.token : null,
              rest: newRest,
              history,
              loginType
            });
          }
        }
      );
    };
    return (
      <Form onSubmit={e => handleSubmit(e)}>
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
                  isFetchCoding,
                  fetchText,
                  allowSendCode,
                  resetAllowSendCodeState,
                  dispatch,
                  activeKey
                  
                });
          const helpText = getFieldError(formItem.itemName);
          return (
            <Form.Item
              key={formItem.itemName}
              style={{ marginBottom: marginBottom }}
              label={p.label ? p.label : null}
              colon={p.colon}
              hasFeedback={p.hasFeedback}
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
                      height: helpText ? "32px" : 0,
                      lineHeight: "32px"
                    }}
                  >
                    {helpText}
                  </span>
                )
              }
            >
              {getFieldDecorator(formItem.itemName, {
                ...formItem.options
              })(formItem.component)}
              {formItem.additionComponent}
            </Form.Item>
          );
        })}
      </Form>
    );
  })
);
