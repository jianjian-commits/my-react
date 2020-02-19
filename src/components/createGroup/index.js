import React, { Component } from "react";
import { Modal, Form, Input } from "antd";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onOk = this.onOk.bind(this);
  }

  // 完成新建
  onOk(title) {
    this.props.form.validateFields((err, values) => {
      if (err) return;
      this.props.onOk(values, title);
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
          okText="完成"
          cancelText="取消"
          onOk={() => this.onOk(title)}
          onCancel={this.onCancel.bind(this)}
          maskClosable={false}
        >
          <Form>
            <Form.Item label="分组名称">
              {getFieldDecorator("groupName", {
                rules: [{ required: true, message: "分组名称不能为空" }]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const CreateFormModal = Form.create()(CreateGroup);
export default CreateFormModal;
