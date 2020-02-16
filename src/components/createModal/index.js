import React, { Component } from "react";
import { Modal, Form, Input, Icon } from "antd";
import classnames from "classnames";
import classes from "./index.module.scss";
const { TextArea } = Input;

// 图标数据
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

  // 渲染图标
  renderIcons() {
    return (
      <div className={classes.iconStyle}>
        {iconData.map(i => (
          <Icon
            key={i.icon}
            type={i.icon}
            onClick={() => {
              this.setState({ errText: "", icon: i.icon });
            }}
            className={classnames({
              [classes.active]: this.state.icon === i.icon
            })}
          ></Icon>
        ))}
      </div>
    );
  }

  // 完成新建
  onOk() {
    this.props.form.validateFields((err, values) => {
      let icon = this.state.icon;
      if (!icon) {
        return this.setState({ errText: "应用图标不能为空" });
      }
      if (err) return;
      let data = { ...values, code: icon };
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

  // 清空数据
  clearData() {
    this.props.form.resetFields();
    this.setState({
      icon: "",
      num: 0,
      errText: ""
    });
  }

  render() {
    const { visible, title, form } = this.props;
    const { num, errText } = this.state;
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
                    this.setState({ num: e.target.value.length });
                  }}
                ></TextArea>
              )}
            </Form.Item>
            <span className={classes.text}>
              <span>{num}</span> / 30
            </span>
            <Form.Item>
              <span className={classes.appIcon}>选择应用图标:</span>
              {this.renderIcons()}
            </Form.Item>
            {errText && <span className={classes.errText}>{errText}</span>}
          </Form>
        </Modal>
      </div>
    );
  }
}

export const CreateFormModal = Form.create()(CreateModal);
