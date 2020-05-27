import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { Modal } from "../../../shared/customWidget"
import { saveForm } from "../formBuilder/redux/utils/operateForm";
import { push } from "connected-react-router";
import pinyin from "chinese-to-pinyin";
import textArea from "../submission/component/textArea";
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
  }



  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.saveForm(
          this.props.submissionAccess,
          values.formName,
          [],//创建表单的时候公式校验为空数组
          "",//创建表单的时候公式校验提示信息为空字符串
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

  _isApiNameExist(apiName) {
    return this.props.pathArray.filter(item => item.path == apiName).length > 0
      ? true
      : false;
  }

  apiUniqueCheck = (rule, value, callback) => {
    //检测apiName只能由字母数字及下划线构成
    if(value !== undefined && value !== "") {
      var reg = /^\w+$/
      if (this._isApiNameExist(value)) {
        callback("API Name已存在，请重新输入");
      } else if (!reg.test(value)) {
        callback("API Name只能由字母、数字及下划线构成");
      } else {
        callback();
      }
    }else{
      callback();
    }
  };

  handleFormName = e =>{
    let formPath = pinyin(`${e.target.value}`,{removeSpace: true, removeTone: true, keepRest: true});
    this.props.form.setFieldsValue({
      formPath
    });
    this.props.form.validateFields(["formPath"])
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    return (
      <Modal
        className={ "createForm" }
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
                  rules: [{ required: true, message: "请输入表单名字" }],
                  validateTrigger: "onBlur"
                })(<Input 
                    placeholder="请输入表单名字" 
                    maxLength={20}
                    onBlur={this.handleFormName} />)}
              </Form.Item>
              <Form.Item label={"API名称"}>
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
                  <TextArea className={"textArea"} row={5} style={{ height: 110 }} />
                )}
              </Form.Item>
              <Form.Item>
                <div className="buttonGroup">
                  <Button
                    onClick={this.props.handleCancel}
                    // type="primary"
                    className="login-form-button-cancel"
                  >
                    取消
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button-create"
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
