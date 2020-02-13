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
  const types = formItems.filter(
    f =>
      f.itemName === "username" ||
      f.itemName === "password" ||
      f.itemName === "phone"
  );
  const searchPhone = props => {
    const user = (JSON.parse(localStorage.getItem("register")) || []).filter(
      u => u.phone === props.phone
    )[0];
    if (user) return true;
    return false;
  };
  return (
    <Form onSubmit={e => handleSubmit(e)}>
      {formItems.map(item => {
        const { rules, ...options } = item.options;
        let newRules;
        if (types.length === 1 && item.itemName === "phone") {
          newRules = {
            validator: searchPhone,
            message: "该手机不存在,请先进行注册"
          };
        } else if (types.length === 3 && item.itemName === "phone")
          newRules = {
            validator: searchPhone,
            message: "该手机号已经注册,请直接登录或更换手机号注册"
          };
        return (
          <Form.Item key={item.itemName}>
            {getFieldDecorator(item.itemName, {
              rules: [...rules, newRules],
              ...options
            })(item.component)}
            {item.additionComponent}
          </Form.Item>
        );
      })}
    </Form>
  );
});
