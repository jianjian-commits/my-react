import React from "react";
import { connect } from "react-redux";
import { Input, Checkbox, InputNumber, Select, Button, Divider } from "antd";
import {
  setItemAttr,
  setItemValues,
  setFormChildItemAttr,
  setFormChildItemValues
} from "../../redux/utils/operateFormComponent";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import locationUtils from "../../../../utils/locationUtils";
import { checkFormChildItemIsLinked } from "../utils/filterData";
import isInFormChild from "../utils/isInFormChild";
import { checkUniqueApi } from "../utils/checkUniqueApiName";
import FormulaModal from "../formVerification/formulaModal";
import { handleFormulaSubmit } from "../utils/handleFormulaUtils";

const { Option } = Select;

class SingleTextInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formPath: locationUtils.getUrlParamObj().path,
      isShowDataLinkageModal: false,
      isLinked: false,
      apiNameTemp: undefined, //api name 临时值
      isShowEditFormulaModal: false,
      verificationStr: ""
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
    const { key } = element;
    const { err, msg: APIMessage } = checkUniqueApi(key, this.props);
    const isUnique = !err;
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.setState({
      apiNameTemp: key,
      isUniqueApi: isUniqueApi,
      APIMessage
    });

    if (element.data.type == "EditFormula") {
      this.setState({
        verificationStr: element.data.values.verificationStr
      })
    }
  }

  handleChangeAttr = ev => {
    let { name, value, checked } = ev.target;
    let { validate, unique } = this.props.element;
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
      case "isLimitLength": {
        validate.isLimitLength = checked;
        value = validate;
        break;
      }
      default:
        break;
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

  handleChangeAttrMinLength = value => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      minLength: value == void 0 ? 0 : value
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
  handleChangeAttrMaxLength = value => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      maxLength: value == void 0 ? Number.MAX_SAFE_INTEGER : value
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

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, isShowEditFormulaModal, formId } = this.state;
    const { forms, element, elementParent } = this.props;
    let isLinkError = false;
    const { data, errorComponentIndex } = this.props;
    if (errorComponentIndex > -1) {
      let currentIndex = data.indexOf(element);
      currentIndex === errorComponentIndex && (isLinkError = true);
    }
    switch (type) {
      // 自定义组件
      case "custom": {
        return (
          <Input
            id="number-input-title-default-value"
            name="defaultValue"
            placeholder="请输入默认值"
            value={element.defaultValue}
            type="text"
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />
        );
      }
      // 数据联动组件
      case "DataLinkage": {
        return (
          <>
            <Button
              className={
                isLinkError ? "data-link-set has-error" : "data-link-set"
              }
              onClick={() => {
                this.handleSetDataLinkage(true);
              }}
            >
              {element.data.type == "DataLinkage"
                ? isLinkError
                  ? "数据联动设置失效"
                  : "已设置数据联动"
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
      case "EditFormula": {
        return (
          <>
            <Button
              className="data-link-set"
              onClick={() => {
                this.setState({
                  isShowEditFormulaModal: true
                })
              }}
            >
              {element.data.type == "EditFormula" ? "已设置公式" : "编辑公式"}
            </Button>

            <FormulaModal
              visible={isShowEditFormulaModal}
              verificationStr={this.state.verificationStr}
              currentItem={element}
              currentItemParent={elementParent}
              index={this.state.index}
              handleOk={(selectComponent, str, value) => {
                handleFormulaSubmit(selectComponent, str, value, element, elementParent, {
                  setFormChildItemAttr: this.props.setFormChildItemAttr,
                  setItemValues: this.props.setItemValues,
                });

                this.setState({
                  index: -1,
                  isShowEditFormulaModal: false,
                  verificationStr: str
                })
              }}
              handleCancel={() => {
                this.setState({
                  index: -1,
                  isShowEditFormulaModal: false
                })
              }}
            />

          </>
        );
      }
      default: {
        return;
      }
    }
  };

  // 设置数据联动
  handleSetDataLinkage = isShow => {
    this.setState({ isShowDataLinkageModal: isShow });
  };

  handleSelectChange = value => {
    switch (value) {
      case "custom": {
        const { elementParent, element, setItemValues, setFormChildItemValues } = this.props;
        if (elementParent) {
          setFormChildItemValues(elementParent, "data", { type: "custom" }, element);
        } else {
          setItemValues(this.props.element, "data", {});
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
      case "EditFormula": {
        this.setState({
          optionType: "EditFormula"
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  // API change
  handleChangeAPI = ev => {
    const { value } = ev.target;
    const { err, msg: APIMessage } = checkUniqueApi(value, this.props);
    const isUnique = !err;
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.handleChangeAttr(ev);
    this.setState({
      apiNameTemp: value,
      isUniqueApi,
      APIMessage
    });
  };
  render() {
    const {
      id,
      label,
      tooltip,
      validate,
      unique = false,
      isSetAPIName
    } = this.props.element;
    const {
      optionType,
      isLinked,
      apiNameTemp,
      APIMessage,
      isUniqueApi = true
    } = this.state;

    return (
      <div className="textarea-text-input">
        <div className="base-form-tool">
          <div className="costom-info-card">
            <p htmlFor="email-title">标题</p>
            <Input
              id="single-text-title"
              name="label"
              placeholder="单行文本"
              value={label}
              onChange={this.handleChangeAttr}
              autoComplete="off"
            />

            <p htmlFor="url-name">API Name</p>
            <Input
              id="single-text-title"
              className={isUniqueApi ? "" : "err-input"}
              disabled={isSetAPIName ? true : false}
              name="key"
              placeholder="API Name"
              value={apiNameTemp}
              onChange={this.handleChangeAPI}
              autoComplete="off"
            />
            {isUniqueApi ? null : <p className="api-err">{APIMessage}</p>}

            {isInFormChild(this.props.elementParent) ? null : (
              <>
                <p htmlFor="single-text-tip">提示信息</p>
                <Input
                  id="single-text-tip"
                  name="tooltip"
                  placeholder="请输入提示信息"
                  value={tooltip}
                  onChange={this.handleChangeAttr}
                  autoComplete="off"
                />
                <p htmlFor="single-text-err-tip">错误提示</p>
                <Input
                  id="single-text-err-tip"
                  name="customMessage"
                  placeholder="请输入错误提示"
                  value={validate.customMessage}
                  onChange={this.handleChangeAttr}
                  autoComplete="off"
                />
              </>
            )}

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
                    <Option value="custom">自定义</Option>
                    <Option value="DataLinkage">数据联动</Option>
                    <Option value="EditFormula">公式编辑</Option>
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
              <Checkbox
                name="isLimitLength"
                checked={validate.isLimitLength}
                onChange={this.handleChangeAttr}
              >
                限定文本长度范围
            </Checkbox>
            </div>
            <div className="number-check-warper">
              <InputNumber
                disabled={!validate.isLimitLength}
                name="minLength"
                placeholder="不限"
                min={1}
                precision={0}
                onChange={this.handleChangeAttrMinLength}
                value={validate.minLength == 0 ? "" : validate.minLength}
                autoComplete="off"
              />
              ~
            <InputNumber
                disabled={!validate.isLimitLength}
                name="maxLength"
                placeholder="不限"
                min={1}
                precision={0}
                onChange={this.handleChangeAttrMaxLength}
                value={validate.maxLength === Number.MAX_SAFE_INTEGER ? "" : validate.maxLength}
                autoComplete="off"
              />
            </div>
            <div className="checkbox-wrapper">
              <Checkbox
                name="unique"
                checked={unique}
                onChange={this.handleChangeAttr}
              >
                不允许重复
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data,
    forms: store.formBuilder.formArray,
    errorComponentIndex: store.formBuilder.errorComponentIndex
  }),
  {
    setItemAttr,
    setFormChildItemAttr,
    setItemValues,
    setFormChildItemValues
  }
)(SingleTextInspector);
