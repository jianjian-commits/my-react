import React from "react";
import { Input, Radio, Checkbox, Button, Tooltip, Divider } from "antd";
import { connect } from "react-redux";
import {
  setItemAttr,
  setCalcLayout,
  setFormChildItemAttr
} from "../../redux/utils/operateFormComponent";
import isInFormChild from "../utils/isInFormChild";
import { checkUniqueApi } from "../utils/checkUniqueApiName";
class RadioInputInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addChooseItem = this.addChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
  }

  componentDidMount() {
    const { apiName } = this.props.element;
    const isUniqueApi = checkUniqueApi(apiName, this.props);
    this.setState({
      apiNameTemp: apiName,
      isUniqueApi: isUniqueApi
    });
  }

  handleChangeAttr(ev) {
    let { name, value, checked } = ev.target;
    let { validate, inline } = this.props.element;
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

  deleteChooseItem(item, index) {
    if (this.props.element.values.length === 1) return null;
    let newValuesList = this.props.element.values.filter(
      (item, i) => i !== index
    );
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

  // componentDidUpdate() {
  //   if (this.props.isCalcLayout) {
  //     let domElement = document.getElementById(this.props.element.key);

  //     const newLayout = {
  //       ...this.props.element.layout,
  //       h: Math.floor((domElement.offsetHeight) / 30)
  //     }
  //     this.props.setItemAttr(this.props.element, "layout", newLayout);

  //     this.props.setCalcLayout(false);
  //   }

  // }

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
    const { label, validate, values, inline, tooltip } = this.props.element;
    const { apiNameTemp, isUniqueApi = true } = this.state;
    return (
      <div className="radio-input-inspactor">
        <div className="costom-info-card">
          <p htmlFor="checkbox-title">标题</p>
          <Input
            id="checkbox-title"
            name="label"
            placeholder="单选"
            value={label}
            onChange={this.handleChangeAttr}
            autoComplete="off"
          />

          <p htmlFor="url-name">API Name</p>
          <Input
            id="single-text-title"
            className={isUniqueApi ? "" : "err-input"}
            name="key"
            placeholder="API Name"
            value={apiNameTemp}
            onChange={this.handleChangeAPI}
            autoComplete="off"
          />

          {isInFormChild(this.props.elementParent) ? null : (
            <>
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
          )}
          <p>选项</p>
          <div className="chooseitems" key={"chooseRadioItem"}>
            {values.map((item, index) => {
              return (
                <div className="ChooseItemWarp" key={index}>
                  <img src="/image/dragIcon.png" />
                  <Input
                    key={`chooseItem${index}`}
                    type="text"
                    onChange={ev => {
                      this.changeChooseItem(item, ev);
                    }}
                    value={item.value}
                    placeholder="选项"
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
              );
            })}
            <Button onClick={this.addChooseItem} name="chooseItems" icon="plus">
              增加选项
            </Button>
          </div>
          {isInFormChild(this.props.elementParent) ? null : (
            <>
              <p>排序方式</p>
              <div className="RadioWapper">
                <Radio.Group
                  name="inline"
                  // 这里要改一下默认值
                  defaultValue={inline}
                  onChange={this.handleChangeAttr}
                >
                  <Radio value={true}>横向</Radio>
                  <Radio value={false}>纵向</Radio>
                </Radio.Group>
              </div>
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
    isCalcLayout: store.formBuilder.isCalcLayout
  }),
  {
    setItemAttr,
    setCalcLayout,
    setFormChildItemAttr
  }
)(RadioInputInspector);
