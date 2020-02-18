import React from "react";
import { Input, Checkbox, Button, Tooltip, Select, Divider } from "antd";
import { connect } from "react-redux";
import locationUtils from "../../../../utils/locationUtils";
import DataLinkageModal from "../dataLinkageModal/dataLinkageModel";
import OtherDataModal from "../dataLinkageModal/otherDataModal";
import {
  setItemAttr,
  setItemValues,
  setFormChildItemAttr,
  setFormChildItemValues
} from "../../redux/utils/operateFormComponent";
import { instanceAxios } from "../../../../utils/tokenUtils";
import { filterFormsForRelation } from "../utils/filterData";
import config from "../../../../config/config";
import { checkFormChildItemIsLinked } from "../utils/filterData";
import isInFormChild from "../utils/isInFormChild"
const { Option } = Select;

class DropdownInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionType:
        props.element.data.type ||
        (props.element.data.values && props.element.data.values.type) ||
        "custom",
      formId: locationUtils.getUrlParamObj().id,
      isShowDataLinkageModal: false,
      isShowOtherDataModal: false
    };
    this.addChooseItem = this.addChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
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

  handleChangeAttr(ev) {
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
  }
  addChooseItem = () => {
    const newItem = {
      label: `选项`,
      value: `选项`
    };
    const newValuesList = [...this.props.element.data.values, newItem];
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  };
  deleteChooseItem(item, index) {
    if(this.props.element.data.values.length == 1) return null;
    let newValuesList = this.props.element.data.values.filter(
      (item, i) => i != index
    );
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }
  changeChooseItem(item, ev) {
    const { value } = ev.target;
    const newItem = {
      value: value,
      label: value,
      shortcut: ""
    };
    let newValuesList = [...this.props.element.data.values];
    let index = newValuesList.indexOf(item);
    newValuesList[index] = newItem;
    if (this.props.elementParent) {
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemValues(this.props.element, "data", newValuesList);
    }
  }

  handleSelectChange = value => {
    switch (value) {
      case "custom": {
        if (this.props.elementParent) {
          this.props.setFormChildItemValues(
            this.props.elementParent,
            "data",
            [{ label: "选项", value: "选项" }],
            this.props.element
          );
        } else {
          this.props.setItemValues(this.props.element, "data", [
            { label: "选项", value: "选项" }
          ]);
        }
        this.setState({
          optionType: "custom"
        });
        break;
      }
      case "otherFormData": {
        this.setState({
          optionType: "otherFormData"
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

  handleOtherFormDataChange = data => {
    const { selectedFormId, selectedOptionId, optionLabel } = data;
    let values = {
      formId: selectedFormId,
      optionId: selectedOptionId,
      optionLabel
    };
    if (this.props.elementParent) {
      values.type = this.state.optionType;
      this.props.setFormChildItemValues(
        this.props.elementParent,
        "data",
        values,
        this.props.element
      );
    } else {
      this.props.setItemValues(
        this.props.element,
        "data",
        values,
        this.state.optionType
      );
    }
  };

  // 设置数据联动
  handleSetDataLinkage = isShow => {
    this.setState({
      isShowDataLinkageModal: isShow
    });
  };

  handleSetOtherDataModal = isShow => {
    this.setState({
      isShowOtherDataModal: isShow
    });
  };

  // 选择指定组件渲染
  renderOptionDataFrom = type => {
    const { isShowDataLinkageModal, isShowOtherDataModal, formId } = this.state;
    const { forms, element, elementParent } = this.props;
    switch (type) {
      // 自定义组件
      case "custom": {
        const { values } = element.data;
        return (
          <div className="chooseitems">
            {values.map((item, index) => (
              <div className="ChooseItemWarp" key={index}>
                <img src="/image/dragIcon.png" />
                <Input
                  type="text"
                  onChange={ev => {
                    this.changeChooseItem(item, ev);
                  }}
                  placeholder="选项"
                  value={item.value}
                  autoComplete="off"
                />
                <Tooltip title="删除">
                  <img
                    src="/image/deleteIcon.png"
                    onClick={() => {
                      this.deleteChooseItem(item, index);
                    }}
                  />
                </Tooltip>
              </div>
            ))}
            <Button onClick={this.addChooseItem} name="chooseItems" icon="plus">
              增加选项
            </Button>
          </div>
        );
      }
      // 关联数据组件
      case "otherFormData": {
        return (
          <>
            <Button
              className="data-link-set"
              onClick={() => {
                this.handleSetOtherDataModal(true);
              }}
            >
              {element.data.type == "otherFormData"
                ? "已设置表单数据关联"
                : "关联表单数据设置"}
            </Button>
            <OtherDataModal
              title="关联其他表单数据设置"
              visible={isShowOtherDataModal}
              showOrHideModal={this.handleSetOtherDataModal}
              onOk={this.handleOtherFormDataChange}
              data={{ ...element.data.values }}
              formId={formId}
              forms={forms}
              className="form-change-modal"
            />
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
        return "自定义";
      }
      case "otherFormData": {
        return "关联其他表单数据";
      }
      case "DataLinkage": {
        return "数据联动";
      }
      default:
        return "";
    }
  };

  render() {
    const { optionType, isLinked } = this.state;
    const { elementParent } = this.props;
    const { label, validate, tooltip } = this.props.element;
    
    return (
      <div className="multidropdown-inspector">
        <div className="costom-info-card">
        <p htmlFor="checkbox-title">标题</p>
        <Input
          id="checkbox-title"
          name="label"
          placeholder="多选框"
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
             </>
        }
        <p>选项</p>
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
              <Option value="otherFormData">关联其他表单数据</Option>
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
                必选
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
)(DropdownInspector);
