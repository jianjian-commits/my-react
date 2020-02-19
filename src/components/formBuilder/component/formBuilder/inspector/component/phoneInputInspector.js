import React from "react";
import { connect } from "react-redux";
import { Input, Checkbox, Select, Button, Divider } from "antd";
import {
  setItemAttr,
  setItemValues,
  setFormChildItemAttr,
  setFormChildItemValues
} from "../../redux/utils/operateFormComponent";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import locationUtils from "../../../../utils/locationUtils";
import { checkFormChildItemIsLinked } from "../utils/filterData";
import isInFormChild from "../utils/isInFormChild"
const { Option } = Select;

class PhoneInputInspector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formId: locationUtils.getUrlParamObj().id,
      isLinked: false,
      isShowDataLinkageModal: false
    };
  }

  componentDidMount() {
    const { elementParent, element } = this.props;
    // 检查是否已经在子表单关联该字段
    if (elementParent && checkFormChildItemIsLinked(elementParent, element)) {
      this.setState({
        isLinked: true
      });
    }
  }

  handleChangeAttr = ev => {
    let { name, value, checked } = ev.target;
    let { validate } = this.props.element;
    validate = { ...validate };
    switch (name) {
      case "customMessage": {
        name = "validate";
        validate.customMessage = value;
        value = validate;
        break;
      }
      case "required": {
        name = "validate";
        validate.required = checked;
        value = validate;
        break;
      }
      case "inputMask": {
        checked = checked ? "true" : "";
        break;
      }
      default: break;
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

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, formId } = this.state;
    const { forms, element, elementParent } = this.props;
    switch (type) {
      // 自定义组件
      case "custom": {
        return (
          <>
            {/* <Input
              name="defaultValue"
              placeholder="请输入默认值"
              value={defaultValue}
              onChange={this.handleChangeAttr}
              autoComplete="off"
            /> */}
          </>
        );
      }
      // 数据联动组件
      case "DataLinkage": {
        return (
          <>
            <Button
              className="data-link-set"
              onClick={() => {
                this.handleSetDataLinkage(true);
              }}
            >
              {element.data.type === "DataLinkage"
                ? "已设置数据联动"
                : "数据联动设置"}
            </Button>
            <DataLinkageModal
              visible={isShowDataLinkageModal}
              showOrHideModal={this.handleSetDataLinkage}
              forms={forms}
              element={element}
              elementParent={elementParent}
              formId={formId}
            />
          </>
        );
      }
      default: {
        return;
      }
    }
  };

  handleGetOptionStr = type => {
    switch (type) {
      case "custom": {
        return "自定义";
      }
      case "DataLinkage": {
        return "数据联动";
      }
      default:
        return "";
    }
  };
  // 设置数据联动
  handleSetDataLinkage = isShow => {
    this.setState({
      isShowDataLinkageModal: isShow
    });
  };

  handleSelectChange = value => {
    switch (value) {
      case "custom": {
        const { elementParent, element, setItemValues, setFormChildItemValues } = this.props;
        if(elementParent) {
          setFormChildItemValues(elementParent, "data", {}, element);
        } else {
          setItemValues(this.props.element, "data",{});
        }
        this.setState({
          optionType: "custom"
        });
        break;
      }
      case "DataLinkage": {
        this.setState({
          optionType: "DataLinkage"
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  render() {
    const {
      label,
      tooltip,
      validate,
      unique = false,
      inputMask
    } = this.props.element;
    const formatChecks = inputMask ? true : false;
    const { optionType, isLinked } = this.state;
    return (
      <div className="base-form-tool">
        <div className="costom-info-card">
          <p htmlFor="email-title">标题</p>
          <Input
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
                      name="tooltip"
                      placeholder="请输入提示信息"
                      value={tooltip}
                      onChange={this.handleChangeAttr}
                      autoComplete="off"
                    />
                    <p htmlFor="email-err-tip">错误提示</p>
                    <Input
                      name="customMessage"
                      placeholder="请输入错误提示"
                      value={validate.customMessage}
                      onChange={this.handleChangeAttr}
                      autoComplete="off"
                    />
               </>
          }


          <p htmlFor="email-default-value">默认值</p>
          {isLinked ? (
              <Input defaultValue="以子表单联动为准，不支持设置默认值" disabled />
            ) : (
              <>
                <Select
                  value={optionType}
                  style={{ width: "100%" }}
                  onChange={this.handleSelectChange}
                  className="data-source-select"
                >
                  <Option value="custom">自定义</Option>
                  <Option value="DataLinkage">数据联动</Option>
                </Select>
                {this.renderOptionDataFrom(optionType)}
              </>
            )}
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
                : <Checkbox
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
    data: store.formBuilder.data,
    forms: store.formBuilder.formArray
  }),
  {
    setItemAttr,
    setItemValues,
    setFormChildItemAttr,
    setFormChildItemValues
  }
)(PhoneInputInspector);
