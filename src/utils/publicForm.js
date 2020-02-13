import React from "react";
import { Form } from "antd";

export default Form.create({ name: "login-form" })(function PublicForm({
  form,
  formItems,
  func
}) {
  const { getFieldDecorator, validateFields } = form;
  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, { actionType, ...rest }) => {
      if (!err) {
        console.log("Received values of form: ", rest);
        func({ actionType, rest });
      }
    });
  };
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      {formItems.map(item => {
        return (
          <Form.Item key={item.itemName}>
            {getFieldDecorator(item.itemName, { ...item.options })(
              item.component
            )}
            {item.additionComponent}
          </Form.Item>
        );
      })}
    </Form>
  );
});
