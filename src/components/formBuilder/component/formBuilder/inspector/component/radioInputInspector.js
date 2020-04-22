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
import BatchEditingModal from "../batchEditingModal/batchEditingModal"

class RadioInputInspector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowBatchEditingModal: false,
    };
    this.addChooseItem = this.addChooseItem.bind(this);
    this.addExtraChooseItem = this.addExtraChooseItem.bind(this);
    this.handleChangeAttr = this.handleChangeAttr.bind(this);
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
    let extraObj = null
    const newItem = {
      label: `选项`,
      value: `选项`,
      shortcut: ""
    };
    this.props.element.values.forEach((item)=>{
      if(item.isExtra){
        extraObj = item;
      }
    })
    const newFilterValues = this.props.element.values.filter((item)=> !item.isExtra );
    const newValuesList = extraObj === null ? [...newFilterValues, newItem]:[...newFilterValues, newItem, extraObj];
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

  addChooseItems = (tempOptions) => {
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

  changeModalVisible = (isVisible) =>{
    this.setState({
      isShowBatchEditingModal: isVisible,
    });
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
    const hasExtraOption = this.props.element.values.some(item => item.isExtra);
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
          <div className="chooseitems" key={"chooseRadioItem"}>
            {values.map((item, index) => {
              return (
                <div key={index}>
                  {item.isExtra ?
                 <div className="extraWrap">
                 <Input
                 key={`chooseItem${index}`}
                 type="text"
                 value="其它"
                 placeholder="其它"
                 autoComplete="off"
                 disabled={true}
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
                  :
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
                </div>}
                </div>
              );
            })}
            <span className="addOptionBtn" onClick={this.addChooseItem} name="chooseItems">
              增加选项
            </span>
            <span className="divider">|</span>
            <span class={hasExtraOption? "addOptionBtn hasExtraOption":"addOptionBtn"} onClick={this.addExtraChooseItem} name="chooseItems">
               添加“其他”选项
            </span>
            <span className="divider">|</span>
            <span className="addOptionBtn" onClick={()=>{this.changeModalVisible(true)}}>批量编辑</span>
            <BatchEditingModal 
              visible={this.state.isShowBatchEditingModal}
              changeModalVisible={this.changeModalVisible}
              addChooseItems={this.addChooseItems}
              options={this.props.element.values}
            />
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
