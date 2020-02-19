import React from "react";
import { Checkbox, Input,Select,Divider } from "antd";
import { connect } from "react-redux";
import { setItemAttr } from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild"
class SignatureInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChangeAttr = ev => {
    let { name = 'fileUnit', value, checked } = ev.target;
    let { validate } = this.props.element;
    validate = {...validate};
    switch (name) {
      case "customMessage": {
        validate.customMessage = value;
        value = validate;
        break;
      }
      case "required": {
        validate.required = checked;
        value = validate;
        break;
      }
      case "inputMask": {
        checked = checked ? "true" : "";
        break;
      }
    }
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        name,
        value !== undefined ? value : checked,
        this.props.element
      );
    } else {
      this.props.setItemAttr(
        this.props.element,
        name,
        value !== undefined ? value : checked
      );
    }
  };
  handleChangeSelect = value =>{
    this.props.setItemAttr(
      this.props.element,
      'fileUnit',
      value
    );
  }
  render() {
    const {
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,
      fileSize,
      fileUnit,
      inputMask
    } = this.props.element;
    const formatChecks = inputMask ? true : false;
    
    return (
      <div className="FileUploadInspector">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
            id="email-title"
            name="label"
            placeholder="文件"
            value={label}
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />
            {
              isInFormChild(this.props.elementParent)
               ? null 
               :<>
                    <p htmlFor="email-tip">提示信息</p>
                    <Input
                      name="tooltip"
                      placeholder="请输入提示信息"
                      value={tooltip}
                      onChange={this.handleChangeAttr}
                      autoComplete="off"
                    />
               </>
          }
          
        </div>
        <Divider />
        <div className="costom-info-card">
          <p htmlFor="email-tip">校验</p>
          <div className="checkbox-wrapper">
            <Checkbox
              name="required"
              checked={validate.required}
              onChange={this.handleChangeAttr}
            >
              必填
            </Checkbox>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data
  }),
  {
    setItemAttr
  }
)(SignatureInspector);
