import React, { Component } from "react";
import { Modal, Form, Input } from "antd";
import classes from "./create.module.scss";
import classnames from "classnames";
import MyTextArea from "./MyTextArea";

// 图标数据
const iconDatas = [
  "icon1",
  "icon2",
  "icon3",
  "icon4",
  "icon5",
  "icon6",
  "icon7",
  "icon8",
  "icon9"
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
        label: "应用名称",
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
            rows={5}
            maxLength={30}
            className={classes.stretch}
            placeholder="简单描述一下你的应用吧"
          />
        )
      },
      {
        label: "选择应用图标",
        key: "icon",
        options: { rules: [{ required: true, message: "应用图标不能为空" }] },
        component: (
          <div className={classes.iconStyle}>
            {iconDatas.map(item => (
              <img
                key={item}
                src={`/image/appCreateIcons/${item}.svg`}
                alt=""
                onClick={() =>
                  setFields({ icon: { errors: null, value: item } })
                }
                className={classnames({
                  [classes.active]: getFieldValue("icon") === item
                })}
              />
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
        okText="确定"
        cancelText="取消"
        onOk={() => this.onOk(title)}
        onCancel={this.onCancel.bind(this)}
        maskClosable={false}
        className={classes.appModalStyles}
        closable={false}
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
