import React from "react";
import { connect } from "react-redux";
import { Modal, Form, Icon, Input, Button, Checkbox } from "antd";
import { saveForm } from "../formBuilder/redux/utils/operateForm";
import { push } from "connected-react-router";
class FormInforModalTitle extends React.Component {
  render() {
    const style = {
      fontWeight: 500,
      color: "rgba(49,69,132,1)",
      fontSize: 14
    };
    return <span style={style}>创建表单</span>;
  }
}

class FormInforModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.saveForm(
          this.props.submissionAccess,
          values.formName,
          this.props.verificationList,
          this.props.errMessage,
          //   this.props.submitBtnObj,
          values.formPath,
          values.formInfo,
          this.props.push,
          this.props.url,
          this.props.extraProp,
          this.props.appid
        );
      }
    });
  };
  apiUniqueCheck = (rule, value, callback) => {
    //检测api中是否包含汉字
    var regChinese = new RegExp("[\\u4E00-\\u9FFF]+", "g");
    if (regChinese.test(value)) {
      callback("api中不能包含汉字");
    } else {
      callback();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    return (
      <Modal
        title={<FormInforModalTitle />}
        visible={this.props.visible}
        onCancel={this.props.handleCancel}
        footer={null}
        centered
      >
        <div className="formInfoModalContainer">
          <div className="formContainer">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label={"表单名称"}>
                {getFieldDecorator("formName", {
                  rules: [{ required: true, message: "请输入表单名字" }]
                })(<Input placeholder="请输入表单名字" maxLength={20} />)}
              </Form.Item>
              <Form.Item label={"Api名称"}>
                {getFieldDecorator("formPath", {
                  rules: [
                    { required: true, message: "请输入表单api" },
                    {
                      validator: this.apiUniqueCheck
                    }
                  ]
                })(<Input placeholder="请输入表单api" />)}
              </Form.Item>
              <Form.Item label={"表单说明"}>
                {getFieldDecorator("formInfo")(
                  <TextArea row={5} style={{ height: 110 }} />
                )}
              </Form.Item>
              <Form.Item>
                <div className="buttonGroup">
                  <Button
                    onClick={this.props.handleCancel}
                    type="primary"
                    className="login-form-button"
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    创建
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    );
  }
}
const FormInfor = Form.create({ name: "FormInfor" })(FormInforModal);
export default connect(
  store => ({
    formData: store.formBuilder.data,
    submissionAccess: store.rootData.submissionAccess,
    verificationList: store.formBuilder.verificationList,
    name: store.formBuilder.name,
    formArray: store.forms.formArray,
    errMessage: store.formBuilder.errMessage,
    submitBtnObj: store.formBuilder.submitBtnObj
  }),
  {
    saveForm,
    push
  }
)(FormInfor);
