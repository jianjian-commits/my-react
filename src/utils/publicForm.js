import React from "react";
import { Form } from "antd";
import { formItems } from "../utils/formItems";

export default Form.create({ name: "login-form" })(function PublicForm({
  form,
  parameter,
  func
}) {
  const { getFieldDecorator, validateFields } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, { actionType, verificationCode, ...rest }) => {
      if (!err) {
        console.log("Received values of form: ", rest);
        func({ actionType, rest });
      }
    });
  };
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      {parameter.map(p => {
        const formItem = formItems[p.key]({ form, payload: p.value });
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
