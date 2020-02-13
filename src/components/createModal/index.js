import React, { Component } from "react";
import { Modal, Form, Input, Icon } from "antd";
import classnames from "classnames";
import classes from "./index.module.scss";
const { TextArea } = Input;

let iconData = [
  { icon: "edit" },
  { icon: "snippets" },
  { icon: "bar-chart" },
  { icon: "car" },
  { icon: "schedule" },
  { icon: "apartment" }
];

class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = { icon: "", num: 0, errText: "" };
  }
  // 赋值state
  handleChange(key, value) {
    this.setState({
      [key]: value
    });
  }
  // 获取textarea已输入字数
  getAppDescriptNum(e) {
    this.handleChange("num", e.target.value.length);
  }
  // 渲染Icon图标
  renderIcons() {
    return (
      <div className={classes.iconStyle}>
        {iconData.map(i => (
          <Icon
            key={i.icon}
            type={i.icon}
            onClick={() => {
              this.selectIcon(i);
            }}
            className={classnames({
              [classes.active]: this.state.icon === i.icon
            })}
          ></Icon>
        ))}
      </div>
    );
  }

  selectIcon(i) {
    this.handleChange("errText", "");
    this.handleChange("icon", i.icon);
  }

  // 清空数据
  clearData() {
    this.props.form.resetFields();
    this.handleChange("icon", "");
    this.handleChange("num", 0);
    this.handleChange("errText", "");
  }

  // 完成新建
  onOk() {
    this.props.form.validateFields((err, values) => {
      if (!this.state.icon) {
        return this.handleChange("errText", "应用图标不能为空");
      }
      if (err) return;
      let data = { ...values, icon: this.state.icon };
      // 调用父组件给的onOk方法并传入Form的参数
      this.props.onOk(data);
      this.clearData();
    });
  }

  // 取消新建
  onCancel() {
    this.props.onCancel();
    this.clearData();
  }

  render() {
    const { visible, title, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Modal
          visible={visible}
          width="419px"
          title={title}
          okText="创建"
          cancelText="取消"
          onOk={this.onOk.bind(this)}
          onCancel={this.onCancel.bind(this)}
          maskClosable={false}
        >
          <Form>
            <Form.Item label="应用名">
              {getFieldDecorator("name", {
                rules: [{ required: true, message: "应用名不能为空" }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="应用描述">
              {getFieldDecorator("description", {
                rules: [{ required: true, message: "描述不能为空" }]
              })(
                <TextArea
                  required
                  rows={3}
                  maxLength={30}
                  className={classes.stretch}
                  onChange={e => {
                    this.getAppDescriptNum(e);
                  }}
                ></TextArea>
              )}
            </Form.Item>
            <span className={classes.text}>
              <span className={classes.num}>{this.state.num}</span> / 30
            </span>
            <Form.Item>
              <span className={classes.appIcon}>选择应用图标:</span>
              {this.renderIcons()}
            </Form.Item>
            {this.state.errText && (
              <span className={classes.errText}>{this.state.errText}</span>
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}

export const CreateFormModal = Form.create()(CreateModal);
