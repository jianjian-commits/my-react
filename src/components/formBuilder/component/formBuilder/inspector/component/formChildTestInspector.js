import React from "react";
import { connect } from "react-redux";
import { Input, Checkbox, Tooltip, Select, Button, Divider } from "antd";
import { updateOrder, setItemAttr, setFormChildItemAttr, setItemValues } from "../../redux/utils/operateFormComponent";
import ID from "../../../../utils/UUID";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import { basicComponentsArray, advancedComponentArray } from "../../toolbar/toolbar";
import locationUtils from "../../../../utils/locationUtils";
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
    let key = ID.uuid();
    newData.id = key;
    newData.key = key;
    newData.layout.i = key;
    newData.layout.y = 0;
    this.props.setItemAttr(element, "values", [...values, newData]);
  }
  render() {
    return (
      <div className="ComponentItem">
        <Input value={this.props.item.label} disabled />
        <Tooltip title="复制">
          <img src="/image/icons/复制@2x.png" alt=""
            onClick={this.handleCopyComponent}
          />
        </Tooltip>
        <Tooltip title="删除">
          <img
            src="/image/icons/delete.png" alt=""
            onClick={this.handleDeleteComponent}
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
      formId: locationUtils.getUrlParamObj().id,
      isShowDataLinkageModal: false
    };
  }
  handleChangeAttr = ev => {
    let { name, value, checked } = ev.target;
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
      case "isLimitLength": {
        validate.isLimitLength = checked;
        value = validate;
        break;
      }
      default: break;
    }
    this.props.setItemAttr(
      this.props.element,
      name,
      value !== undefined ? value : checked
    );
  };

  _getComponentItem = value => {
    const componentItem = advancedComponentArray.concat(basicComponentsArray).filter(item => {
      return item.label === value;
    });
    return componentItem[0];
  };

  handleSelectItem = value => {
    let { values } = this.props.element;
    let item = this._getComponentItem(value);
    let key = ID.uuid();

    let elementOptions = {
      ...item,
      id: key,
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
    switch (type) {
      // 自定义组件
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

  render() {
    const {
      id,
      label,
      tooltip,
      defaultValue,
      validate,
      unique = false,
      values
    } = this.props.element;
    const { optionType } = this.state;

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
                .filter(item => item.type !== 'FormChildTest'
                  && item.type !== "GetLocalPosition"
                  && item.type !== "HandWrittenSignature"
                  && item.type !== "ComponentTemplate")
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
