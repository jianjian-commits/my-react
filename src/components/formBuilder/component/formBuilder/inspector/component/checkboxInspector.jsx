import React from "react";
import { Input, Radio, Checkbox, Button, Tooltip, InputNumber ,Divider} from "antd";
import { connect } from "react-redux";
import isInFormChild from "../utils/isInFormChild"
import {
  setItemAttr,
  setFormChildItemAttr,
  setCalcLayout
} from "../../redux/utils/operateFormComponent";
class CheckboxInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addChooseItem = this.addChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
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
      case "isLimitLength": {
        validate.isLimitLength = checked;
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
  addChooseItem() {
    const newItem = {
      label: `选项`,
      value: `选项`,
      shortcut: ""
    };
    const newValuesList = [...this.props.element.values, newItem];
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        "values",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemAttr(this.props.element, "values", newValuesList);
    }
  }
  deleteChooseItem(item,index) {
    if(this.props.element.values.length == 1) return null;
    let newValuesList = this.props.element.values.filter((item,i) => i != index)
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        "values",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemAttr(this.props.element, "values", newValuesList);
    }
  }
  changeChooseItem(item, ev) {
    const { value } = ev.target;
    const newItem = {
      value: value,
      label: value,
      shortcut: ""
    };
    let newValuesList = [...this.props.element.values];
    let index = newValuesList.indexOf(item);
    newValuesList[index] = newItem;
    if (this.props.elementParent) {
      this.props.setFormChildItemAttr(
        this.props.elementParent,
        "values",
        newValuesList,
        this.props.element
      );
    } else {
      this.props.setItemAttr(this.props.element, "values", newValuesList);
    }
  }

  handleChangeAttrMinLength = value => {
    const { validate } = this.props.element;
    var newValidate = {
      ...validate,
      minOptionNumber: value == void 0 ? 0 : value
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
      maxOptionNumber: value == void 0 ? Number.MAX_SAFE_INTEGER : value
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

  render() {
    const { label, validate, values, inline, tooltip } = this.props.element;
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
                  <p htmlFor="radio-text-tip">提示信息</p>
                  <Input
                    id="radio-text-tip"
                    name="tooltip"
                    placeholder="请输入提示信息"
                    defaultValue={tooltip}
                    onChange={this.handleChangeAttr}
                    autoComplete="off"
                  />
               </>
            }
          <p>选项</p>
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
                      this.deleteChooseItem(item,index);
                    }}
                  />
                </Tooltip>
              </div>
            ))}
            <Button onClick={this.addChooseItem} name="chooseItems" icon="plus">
              增加选项
            </Button>
          </div>
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
            <Checkbox
              name="isLimitLength"
              checked={validate.isLimitLength}
              onChange={this.handleChangeAttr}
            >
              限定可选个数
            </Checkbox>
          </div>
          <div className='number-check-warper'>
              <InputNumber
                name='minOptionNumber'
                placeholder="不限"
                min={1}
                max = {values.length}
                precision={0}
                onChange={this.handleChangeAttrMinLength}
                value={validate.minOptionNumber==0 ? "" : validate.minOptionNumber}
                autoComplete="off"
              />
              ~
              <InputNumber
                name='maxOptionNumber'
                placeholder="不限"
                min={1}
                max = {values.length}
                precision={0}
                onChange={this.handleChangeAttrMaxLength}
                value={validate.maxOptionNumber==Number.MAX_SAFE_INTEGER ? "" : validate.maxOptionNumber}
                autoComplete="off"
              />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  store => ({
    data: store.formBuilder.data,
    isCalcLayout: store.formBuilder.isCalcLayout
  }),
  {
    setItemAttr,
    setFormChildItemAttr,
    setCalcLayout
  }
)(CheckboxInspector);
