import React from "react";
import { Form } from "antd";
import { formItems } from "./formItems";

export default Form.create({ name: "login-form" })(function PublicForm({
  form,
  parameter,
  func,
  params
}) {
  const { getFieldDecorator, validateFields } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, { actionType, verificationCode, ...rest }) => {
      if (!err) {
        console.log("Received values of form: ", actionType, rest);
        func({
          token: params.token ? params.token : null,
          rest
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
                ...params
              })
            : formItems[p.key]({ form, payload: p.value });
        return (
          <Form.Item key={formItem.itemName}>
            {getFieldDecorator(formItem.itemName, { ...formItem.options })(
              formItem.component
            )}
            {formItem.additionComponent}
          </Form.Item>
        );
      })}
    </Form>
  );
});
