import React from "react";
import { connect } from "react-redux";
import { Input, Checkbox, Tooltip, Select, Button, Divider } from "antd";
import {
  updateOrder,
  setItemAttr,
  setFormChildItemAttr,
  setItemValues
} from "../../redux/utils/operateFormComponent";
import ID from "../../../../utils/UUID";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import {
  basicComponentsArray,
  advancedComponentArray
} from "../../toolbar/toolbar";
import locationUtils from "../../../../utils/locationUtils";
import { checkUniqueApi } from "../utils/checkUniqueApiName";
const { Option } = Select;

class ComponentItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteComponent = this.handleDeleteComponent.bind(this);
    this.handleCopyComponent = this.handleCopyComponent.bind(this);
  }
  handleDeleteComponent() {
    const { values, element } = this.props;
    const newValues = values.filter(
      (item, index) => index !== this.props.itemIndex
    );
    this.props.setItemAttr(element, "values", newValues);
  }
  handleCopyComponent() {
    const { values, element } = this.props;
    const beCopiedValue = values.filter(
      (item, index) => index === this.props.itemIndex
    )[0];
    let newData = JSON.parse(JSON.stringify(beCopiedValue));
    let key = ID.oldUuid();
    newData.id = key;
    newData.key = ID.uuid(newData.type, this.props.data);
    newData.layout.i = key;
    newData.layout.y = 0;
    this.props.setItemAttr(element, "values", [...values, newData]);
  }
  render() {
    return (
      <div className="ComponentItem">
        <Input value={this.props.item.label} disabled />
        <Tooltip title="复制">
          <img
            src="/image/icons/复制@2x.png"
            onClick={this.handleCopyComponent}
            alt=""
          />
        </Tooltip>
        <Tooltip title="删除">
          <img
            src="/image/icons/delete.png"
            onClick={this.handleDeleteComponent}
            alt=""
          />
        </Tooltip>
      </div>
    );
  }
}

class FormChildTestInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionType: this.props.element.data.type || "custom",
      formPath: locationUtils.getUrlParamObj().path,
      isShowDataLinkageModal: false
    };
  }
  componentDidMount() {
    const { element } = this.props;
    const { key } = element;
    const isUniqueApi = checkUniqueApi(key, this.props);
    this.setState({
      apiNameTemp: key,
      isUniqueApi: isUniqueApi
    });
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
    this.props.setItemAttr(
      this.props.element,
      name,
      value !== undefined ? value : checked
    );
  };

  _getComponentItem = value => {
    const componentItem = advancedComponentArray
      .concat(basicComponentsArray)
      .filter(item => {
        return item.label === value;
      });
    return componentItem[0];
  };

  handleSelectItem = value => {
    let { values } = this.props.element;
    let item = this._getComponentItem(value);
    let key = ID.uuid(this.props.element.type, this.props.data);

    let elementOptions = {
      ...item,
      id: ID.oldUuid(),
      key: key,
      isShow: true,
      layout: { i: key, x: 2, y: 0, w: 8, h: 3, minH: 2, minW: 2 },
      element: item.type
    };
    let newValues = [...values, elementOptions];

    this.props.setItemAttr(this.props.element, "values", newValues);
  };

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, formId } = this.state;
    const { forms, element } = this.props;
    let isLinkError = false;
    const { data, errorComponentIndex } = this.props;
    if (errorComponentIndex > -1) {
      let currentIndex = data.indexOf(element);
      currentIndex === errorComponentIndex && (isLinkError = true);
    }
    switch (type) {
      // 自定义组件
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
        this.props.setItemValues(this.props.element, "data", {});
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

  // API change
  handleChangeAPI = ev => {
    const { value } = ev.target;
    const isUnique = checkUniqueApi(value, this.props);
    let isUniqueApi = true;
    if (!isUnique) {
      isUniqueApi = false;
    }
    this.handleChangeAttr(ev);
    this.setState({
      apiNameTemp: value,
      isUniqueApi
    });
  };

  render() {
    const {
      id,
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,
      values,
      isSetAPIName
    } = this.props.element;
    const { optionType } = this.state;
    const { apiNameTemp, isUniqueApi = true } = this.state;

    return (
      <div className="FormChildTestInspector">
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
              name="key"
              placeholder="API Name"
              className={isUniqueApi ? "" : "err-input"}
              disabled={isSetAPIName ? true : false}
              value={apiNameTemp}
              onChange={this.handleChangeAPI}
              autoComplete="off"
            />

            <p htmlFor="single-text-tip">提示信息</p>
            <Input
              id="single-text-tip"
              name="tooltip"
              placeholder="请输入提示信息"
              value={tooltip}
              onChange={this.handleChangeAttr}
              autoComplete="off"
            />
            <p htmlFor="single-text-tip">字段</p>
            {values.map((item, index, values) => (
              <ComponentItem
                element={this.props.element}
                item={item}
                values={values}
                key={index}
                itemIndex={index}
                setItemAttr={this.props.setItemAttr}
              />
            ))}
            <Select
              key={Math.random()}
              placeholder="请选择添加组件"
              onChange={value => {
                this.handleSelectItem(value);
              }}
            >
              {[...basicComponentsArray, ...advancedComponentArray]
                .filter(
                  item =>
                    item.type !== "FormChildTest" &&
                    item.type !== "GetLocalPosition" &&
                    item.type !== "HandWrittenSignature" &&
                    item.type !== "ComponentTemplate"
                )
                .map((item, i) => (
                  <Select.Option key={`${item.type}${i}`} value={item.label}>
                    {item.label}
                  </Select.Option>
                ))}
            </Select>

            <p htmlFor="email-title">默认值</p>
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
    setFormChildItemAttr,
    updateOrder,
    setItemValues
  }
)(FormChildTestInspector);
