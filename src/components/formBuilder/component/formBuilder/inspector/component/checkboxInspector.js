import React from "react";
import {
  Input,
  Radio,
  Checkbox,
  Button,
  Tooltip,
  InputNumber,
  Divider,
  Modal
} from "antd";
import { connect } from "react-redux";
import isInFormChild from "../utils/isInFormChild";
import {
  setItemAttr,
  setFormChildItemAttr,
  setCalcLayout
} from "../../redux/utils/operateFormComponent";

import locationUtils from "../../../../utils/locationUtils";
import { checkUniqueApi } from "../utils/checkUniqueApiName";
const { TextArea } = Input;
class CheckboxInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formPath: locationUtils.getUrlParamObj().path,
      visible: false,
      tempOptions: props.element.values,
      tempContent: "",
    };
    this.addChooseItem = this.addChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
    this.addExtraChooseItem = this.addExtraChooseItem.bind(this);
  }

  componentDidMount() {
    const { key } = this.props.element;
    const {err, msg:APIMessage} = checkUniqueApi(key, this.props);
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
    let extraObj = null;
    const newItem = {
      label: `选项`,
      value: `选项`,
      shortcut: ""
    };
    this.props.element.values.forEach((item)=>{
      if(item.isExtra){
        extraObj = item
      }
    })
    const newFilterValues = this.props.element.values.filter((item)=> !item.isExtra );
    const newValuesList = extraObj===null? [...newFilterValues, newItem]:[...newFilterValues, newItem, extraObj];
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

  addExtraChooseItem() {
    if(this.props.element.values.some(item => item.isExtra)){
      
    }else{
      const newItem = {
        label: `其它`,
        value: `其它`,
        isExtra:true,
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
  }

  addChooseItems = () => {
    const tempOptions = this.state.tempOptions;
    const newItem = {
      label: `选项`,
      value: `选项`,
      shortcut: ""
    };
    let newValuesList;
    if(tempOptions.length > 0){
      newValuesList = [...tempOptions];
    } else {
      // 如果编辑框里的内容没有生成选项,那就只有一个选项
      newValuesList = [newItem];
    }
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

  showModal = () => {
    const tempContent = this.props.element.values.map(item => item.value).join("\n") + "\n";
    this.setState({
      visible: true,
      tempContent: tempContent
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.addChooseItems();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleContent = (e) =>{
    const newArray = this.handleArray(e.target.value.split("\n"));
    this.setState({
      tempOptions: newArray,
      tempContent: e.target.value
    })
  }

  handleArray(arr){
    // 处理掉额外的空格 和换行符
    return arr.map(item =>
      item.trim())
      .filter(item =>item !== "")
      .map(item=>({
        value: item,
        label: item,
        shortcut: ""
      }))
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
      maxOptionNumber: value
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

  // API change
   handleChangeAPI = ev => {
    const { value } = ev.target;
    const {err, msg:APIMessage} = checkUniqueApi(value, this.props);
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
      label,
      validate,
      values,
      inline,
      tooltip,
      isSetAPIName
    } = this.props.element;
    const { apiNameTemp, isUniqueApi = true, APIMessage, tempContent } = this.state;
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
          <div className="chooseitems">
            {values.map((item, index) => (
              <div key={index}>
                {item.isExtra ? 
                <Input
                key={`chooseItem${index}`}
                type="text"
                value="其它"
                placeholder="其它"
                autoComplete="off"
                disabled={true}
              />:
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
              }
              </div>
            ))}
            <Button onClick={this.addChooseItem} name="chooseItems" icon="plus">
              增加选项
            </Button>
            <Button onClick={this.addExtraChooseItem} name="chooseItems" icon="plus">
              增加其他选项
            </Button>
            <Button onClick={this.showModal}>批量编辑</Button>
            <Modal
              title="批量编辑"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <TextArea
                autoSize={{ minRows: 8, maxRows: 8 }}
                onChange={this.handleContent}
                value={tempContent}>
              </TextArea>
            </Modal>
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
            <Checkbox
              name="isLimitLength"
              checked={validate.isLimitLength}
              onChange={this.handleChangeAttr}
            >
              限定可选个数
            </Checkbox>
          </div>
          <div className="number-check-warper">
            <InputNumber
              disabled={!validate.isLimitLength}
              name="minOptionNumber"
              placeholder="不限"
              min={1}
              max={values.length}
              precision={0}
              onChange={this.handleChangeAttrMinLength}
              value={
                validate.minOptionNumber == 0 ? "" : validate.minOptionNumber
              }
              autoComplete="off"
            />
            ~
            <InputNumber
              disabled={!validate.isLimitLength}
              name="maxOptionNumber"
              placeholder="不限"
              min={1}
              max={values.length}
              precision={0}
              onChange={this.handleChangeAttrMaxLength}
              value={
                validate.maxOptionNumber == Number.MAX_SAFE_INTEGER
                  ? ""
                  : validate.maxOptionNumber
              }
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
