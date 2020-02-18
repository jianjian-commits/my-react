import React from "react";
import { Checkbox, Input, Divider } from "antd";
import { connect } from "react-redux";
import { setItemAttr, setFormChildItemAttr} from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild"
class IdCardInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChangeAttr = ev => {
    let { name, value, checked } = ev.target;
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
        value != undefined ? value : checked,
        this.props.element
      );
    } else {
      this.props.setItemAttr(
        this.props.element,
        name,
        value != undefined ? value : checked
      );
    }
  };
  render() {
    const {
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,
      inputMask
    } = this.props.element;
    const formatChecks = inputMask ? true : false;
    return (
      <div className="IdCardInspector">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
            id="email-title"
            name="label"
            placeholder="手机号"
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
                    id="email-tip"
                    name="tooltip"
                    placeholder="请输入提示信息"
                    value={tooltip}
                    onChange={this.handleChangeAttr}
                    autoComplete="off"
                  />
                   <p htmlFor="email-err-tip">错误提示</p>
                  <Input
                    id="email-err-tip"
                    name="customMessage"
                    placeholder="请输入错误提示"
                    value={validate.customMessage}
                    onChange={this.handleChangeAttr}
                    autoComplete="off"
                  />
               </>
            }
          {/* <p htmlFor="email-default-value">默认值</p>
          <Input
            id="email-default-value"
            name="defaultValue"
            placeholder="请输入默认值"
            value={defaultValue}
            onChange={this.handleChangeAttr}
            autoComplete="off"
          /> */}
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
            {
              isInFormChild(this.props.elementParent)
              ? null
              :  <Checkbox
                  name="unique"
                  checked={unique}
                  onChange={this.handleChangeAttr}
                >
                  不允许重复
                </Checkbox>
            }
           
            <Checkbox
              name="inputMask"
              checked={formatChecks}
              onChange={this.handleChangeAttr}
            >
              格式校验
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
    setItemAttr,
    setFormChildItemAttr
  }
)(IdCardInspector);
