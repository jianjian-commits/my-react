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
const { Option } = Select;

class DateInputInspector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formId: locationUtils.getUrlParamObj().id,
      isShowDataLinkageModal: false,
      isLinked: false,
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

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, formId } = this.state;
    const { forms, element, elementParent } = this.props;
    switch (type) {
      // 自定义组件
      // 数据联动组件
      case "DataLinkage": {
        return (
          <>
            <Button
              onClick={() => {
                this.handleSetDataLinkage(true);
              }}
              className="data-link-set"
            >
              {element.data.type == "DataLinkage"
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
        return "无";
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
      defaultValue,
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
            placeholder="时间/日期"
            value={label}
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />

          <p htmlFor="email-title">默认值</p>
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
                  <Option value="custom">无</Option>
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
)(DateInputInspector);
