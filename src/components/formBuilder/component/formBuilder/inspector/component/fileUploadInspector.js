import React from "react";
import { Checkbox, Input, Select, InputNumber, Divider } from "antd";
import { connect } from "react-redux";
import { setItemAttr, setFormChildItemAttr } from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild"
class FileUploadInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChangeAttr = ev => {
    let { name = "fileUnit", value, checked } = ev.target;
    let { validate } = this.props.element;
    validate = { ...validate };
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
  handleChangeSelect = value => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      fileUnit: value
    };
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        "validate",
        newValidate,
        this.props.element
      );
    } else {
      this.props.setItemAttr(this.props.element, "validate", newValidate);
    }
  };

  handleChangeAttrMax = (value,type,min) =>{
    const { validate } = this.props.element;
    var newValidate = {
      ...validate
    };
    newValidate[type] = value || min;
    console.log("change.........",newValidate)
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        "validate",
        newValidate,
        this.props.element
      );
    } else {
      this.props.setItemAttr(this.props.element, "validate", newValidate);
    }
  }


  render() {
    const {
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,

      inputMask
    } = this.props.element;
    const {
      fileSize,
      fileUnit,
      fileCount,
    } = validate
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
              <p htmlFor="email-tip">错误提示</p>
              <Input
                name="customMessage"
                placeholder="请输入错误提示"
                value={validate.customMessage}
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

          <p htmlFor="email-tip">最多上传个数</p>
          <InputNumber
              value={fileCount}
              min={1}
              type="number"
              // name="fileSize"
              onChange={(value)=>{this.handleChangeAttrMax(value,"fileCount",1)}}
              autoComplete="off"
              precision={0}
              style={{width:'100%',marginBottom:16}}
            />
          <p htmlFor="email-tip">单个文件最大体积</p>
          <div className="fileSizeInput">
            <InputNumber
              value={fileSize}
              min={1}
              type="number"
              // name="fileSize"
              onChange={(value)=>{this.handleChangeAttrMax(value,"fileSize",2)}}
              autoComplete="off"
              precision={0}
            />
            <Select value={fileUnit} onChange={this.handleChangeSelect}>
              <Select.Option value="KB">KB</Select.Option>
              <Select.Option value="MB">MB</Select.Option>
              <Select.Option value="GB">GB</Select.Option>
            </Select>
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
)(FileUploadInspector);
