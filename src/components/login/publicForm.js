import React from "react";
import { Form } from "antd";
import { formItems } from "./formItems";

export default Form.create({ name: "login-form" })(function PublicForm({
  form,
  parameter,
  func,
  params = {},
  marginBottom,
  setActiveKey,
  history
}) {
  const { getFieldDecorator, validateFields, getFieldError } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, { actionType, verificationCode, ...rest }) => {
      if (!err) {
        console.log("Received values of form: ", actionType, rest);
        func({
          token: params.token ? params.token : null,
          rest,
          history
        });
      }
    });
  };
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      {parameter.map(p => {
        const formItem =
          p.key === "submit" && params.token
            ? formItems[p.key]({
                form,
                payload: "addTeam",
                itemName: p.itemName,
                icon: p.icon,
                setActiveKey,
                unprefix: p.unprefix,
                hasFeedback: p.hasFeedback,
                ...params
              })
            : formItems[p.key]({
                form,
                payload: p.value,
                itemName: p.itemName,
                icon: p.icon,
                unprefix: p.unprefix,
                hasFeedback: p.hasFeedback,
                setActiveKey
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
                <span>{helpText}</span>
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
});
