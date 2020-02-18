import React from "react";
import { connect } from "react-redux";
import { Form, Input } from "antd";
import { setFormItem } from "../../redux/utils/operateFormComponent";

class SubmitBtn extends React.PureComponent {
  handleChangeBtnText = ev => {
    let { value } = ev.target;
    if(this.GetTextLength(value) > 9) {
      value = "提交"
    }
    // this.props.setFormItem({
    //   SubmitBtnObj: {
    //     name: value
    //   }
    // });
  };

  GetTextLength = value => {
    let reg = new RegExp("[\\u4E00-\\u9FFF]","g");
    let res = value.match(reg);
    let length = value.length;
    length += res ? res.length : 0;
    return length;
  }

  handleCheckButtonLength = (rule, value, callback) => {
    let length = this.GetTextLength(value);
    if(length > 9) {
      callback("字符串过长")
    } else {
      callback();
    }
  }

  render() {
    const { SubmitBtnObj = {}, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className="base-form-tool">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Form.Item>
            {getFieldDecorator("submitBtn", {
              initialValue: SubmitBtnObj.name,
              rules: [
                { required: true, message: "按钮不能为空" },
                {
                  validator: this.handleCheckButtonLength,
                }
              ]
            })(
              <Input
                name="formName"
                placeholder="请输入按钮显示内容"
                onChange={this.handleChangeBtnText}
                autoComplete="off"
              />
            )}
          </Form.Item>
        </div>
      </Form>
    );
  }
}

const WrappedSetSubmitBtn = Form.create({ name: 'SetSubmitBtn' })(SubmitBtn)

export default connect(
  store => ({
    SubmitBtnObj: store.formBuilder.SubmitBtnObj
  }),
  {
    setFormItem
  }
)(WrappedSetSubmitBtn);
