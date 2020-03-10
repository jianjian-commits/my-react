import React, { Component } from "react";
import { Modal, Form, Input, Icon } from "antd";
import classes from "./create.module.scss";
import classnames from "classnames";
import MyTextArea from "./MyTextArea";

// 图标数据
const iconData = [
  { icon: "edit" },
  { icon: "snippets" },
  { icon: "bar-chart" },
  { icon: "car" },
  { icon: "schedule" },
  { icon: "apartment" }
];

class ModalCreation extends Component {
  onOk() {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onOk(values);
      this.props.form.resetFields();
    });
  }

  onCancel() {
    this.props.onCancel();
    this.props.form.resetFields();
  }

  render() {
    const { visible, title, form } = this.props;
    const { getFieldDecorator, setFields, getFieldValue } = form;
    const appParams = [
      {
        label: "应用名",
        key: "name",
        options: { rules: [{ required: true, message: "应用名不能为空" }] },
        component: <Input />
      },
      {
        label: "应用描述",
        key: "description",
        options: { rules: [{ required: true, message: "描述不能为空" }] },
        component: (
          <MyTextArea
            required
            rows={3}
            maxLength={30}
            className={classes.stretch}
          />
        )
      },
      {
        label: "选择应用图标",
        key: "icon",
        options: { rules: [{ required: true, message: "应用图标不能为空" }] },
        component: (
          <div className={classes.iconStyle}>
            {iconData.map(i => (
              <Icon
                key={i.icon}
                type={i.icon}
                onClick={() =>
                  setFields({ icon: { errors: null, value: i.icon } })
                }
                className={classnames({
                  [classes.active]: getFieldValue("icon") === i.icon
                })}
              ></Icon>
            ))}
          </div>
        )
      }
    ];
    const roleParams = [
      {
        label: "分组名称",
        key: "roleName",
        options: { rules: [{ required: true, message: "分组名称不能为空" }] },
        component: <Input />
      }
    ];
    const params = title === "创建应用" ? appParams : roleParams;
    return (
      <Modal
        destroyOnClose={true}
        visible={visible}
        width="500px"
        title={title}
        okText="创建"
        cancelText="取消"
        onOk={() => this.onOk(title)}
        onCancel={this.onCancel.bind(this)}
        maskClosable={false}
      >
        <Form>
          {params.map(i => (
            <Form.Item label={i.label} key={i.key}>
              {getFieldDecorator(i.key, {
                ...i.options
              })(i.component)}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModalCreation);
